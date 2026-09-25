import ExpoModulesCore
import Foundation
import HealthKit

/// Input for `saveWorkout`. Times are Unix epoch milliseconds.
internal struct WorkoutWriteInput: Record {
    /// A `HealthWorkoutActivityType` raw value, e.g. `traditionalStrengthTraining`.
    @Field var activityType: String = "other"
    @Field var startMillis: Double = 0
    @Field var endMillis: Double = 0
    /// Stable id of the session in the host app. Stored as `HKMetadataKeyExternalUUID`
    /// and used to make the write idempotent.
    @Field var externalId: String = ""
    @Field var activeEnergyKcal: Double? = nil
    @Field var totalVolumeKg: Double? = nil
    @Field var title: String? = nil
}

/// Writes finished workouts to HealthKit and reports overlapping workouts that
/// other sources (a watch, another app) already recorded.
///
/// Write-only helpers live in the bridge, next to `OpenWearablesHealthProbe`, so
/// the vendored sources stay at the revision recorded in
/// `Vendor/OpenWearablesHealthSDK/REVISION`. They reuse the SDK's `HKHealthStore`.
internal enum OpenWearablesWorkoutWriter {

    /// Mirror of `HKAuthorizationStatus` for the workout type, plus `unavailable`.
    internal enum WriteStatus: String {
        case unavailable
        case notDetermined
        case denied
        case authorized
    }

    /// Custom metadata keys. HealthKit rejects custom keys that start with `HK`.
    internal static let totalVolumeKey = "OpenWearablesTotalVolumeKg"
    internal static let titleKey = "OpenWearablesWorkoutTitle"

    private static let activityTypes: [String: HKWorkoutActivityType] = {
        var types: [String: HKWorkoutActivityType] = [
            "traditionalStrengthTraining": .traditionalStrengthTraining,
            "functionalStrengthTraining": .functionalStrengthTraining,
            "highIntensityIntervalTraining": .highIntensityIntervalTraining,
            "crossTraining": .crossTraining,
            "coreTraining": .coreTraining,
            "mixedCardio": .mixedCardio,
            "running": .running,
            "walking": .walking,
            "cycling": .cycling,
            "swimming": .swimming,
            "rowing": .rowing,
            "elliptical": .elliptical,
            "stairClimbing": .stairClimbing,
            "yoga": .yoga,
            "pilates": .pilates,
            "flexibility": .flexibility,
            "other": .other,
        ]
        if #available(iOS 16.0, *) {
            types["swimBikeRun"] = .swimBikeRun
        }
        return types
    }()

    private static var healthStore: HKHealthStore {
        OpenWearablesHealthSDK.shared.healthStore
    }

    private static var energyType: HKQuantityType {
        HKQuantityType(.activeEnergyBurned)
    }

    // MARK: - Authorization

    /// The share (write) status of the workout type. Unlike read access, HealthKit
    /// reports write access truthfully.
    internal static func writeStatus() -> WriteStatus {
        guard HKHealthStore.isHealthDataAvailable() else { return .unavailable }
        switch healthStore.authorizationStatus(for: HKObjectType.workoutType()) {
        case .sharingAuthorized:
            return .authorized
        case .sharingDenied:
            return .denied
        default:
            return .notDetermined
        }
    }

    /// Asks to write workouts and active energy, and to read workouts so overlap
    /// checks can see other sources. Resolves the resulting write status.
    internal static func requestWriteAuthorization(completion: @escaping (WriteStatus) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else {
            DispatchQueue.main.async { completion(.unavailable) }
            return
        }
        let workoutType = HKObjectType.workoutType()
        healthStore.requestAuthorization(
            toShare: [workoutType, energyType],
            read: [workoutType]
        ) { _, error in
            if let error = error {
                log("requestWorkoutWriteAuthorization: \(error.localizedDescription)")
            }
            let status = writeStatus()
            DispatchQueue.main.async { completion(status) }
        }
    }

    // MARK: - Overlap

    /// Workouts whose time range overlaps `[startMillis, endMillis]`, from every
    /// readable source. Denied read access returns only this app's own workouts,
    /// which HealthKit does not let the caller tell apart from "none".
    internal static func findOverlappingWorkouts(
        startMillis: Double,
        endMillis: Double,
        completion: @escaping ([[String: Any]]) -> Void
    ) {
        guard HKHealthStore.isHealthDataAvailable(), endMillis > startMillis else {
            DispatchQueue.main.async { completion([]) }
            return
        }
        let start = Date(timeIntervalSince1970: startMillis / 1000.0)
        let end = Date(timeIntervalSince1970: endMillis / 1000.0)
        // No strict options: any workout that intersects the window matches.
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: [])
        let ownBundleId = Bundle.main.bundleIdentifier
        let query = HKSampleQuery(
            sampleType: HKObjectType.workoutType(),
            predicate: predicate,
            limit: 50,
            sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]
        ) { _, samples, error in
            if let error = error {
                log("findOverlappingWorkouts: \(error.localizedDescription)")
            }
            let workouts = (samples as? [HKWorkout] ?? []).map { workout -> [String: Any] in
                let bundleId = workout.sourceRevision.source.bundleIdentifier
                return [
                    "uuid": workout.uuid.uuidString,
                    "activityType": activityTypeName(workout.workoutActivityType),
                    "startMillis": workout.startDate.timeIntervalSince1970 * 1000.0,
                    "endMillis": workout.endDate.timeIntervalSince1970 * 1000.0,
                    "sourceBundleId": bundleId,
                    "sourceName": workout.sourceRevision.source.name,
                    "isOwnSource": bundleId == ownBundleId,
                    "externalId": (workout.metadata?[HKMetadataKeyExternalUUID] as? String) ?? NSNull(),
                ]
            }
            DispatchQueue.main.async { completion(workouts) }
        }
        healthStore.execute(query)
    }

    // MARK: - Save

    /// Saves one workout. Idempotent per `externalId`: a second call for the same
    /// id resolves `duplicate` with the existing workout's uuid.
    internal static func saveWorkout(
        input: WorkoutWriteInput,
        completion: @escaping ([String: Any]) -> Void
    ) {
        func finish(_ result: [String: Any]) {
            DispatchQueue.main.async { completion(result) }
        }

        switch writeStatus() {
        case .unavailable:
            finish(["status": "unavailable"])
            return
        case .denied:
            finish(["status": "denied"])
            return
        case .notDetermined:
            finish(["status": "notDetermined"])
            return
        case .authorized:
            break
        }

        guard let activityType = activityTypes[input.activityType] else {
            finish(["status": "failed", "error": "Unknown activity type \(input.activityType)"])
            return
        }
        guard !input.externalId.isEmpty, input.endMillis > input.startMillis else {
            finish(["status": "failed", "error": "A workout needs an externalId and an end after its start"])
            return
        }

        findOwnWorkout(externalId: input.externalId) { existing in
            if let existing = existing {
                finish(["status": "duplicate", "uuid": existing.uuid.uuidString])
                return
            }
            build(input: input, activityType: activityType, completion: finish)
        }
    }

    private static func findOwnWorkout(externalId: String, completion: @escaping (HKWorkout?) -> Void) {
        let predicate = NSCompoundPredicate(andPredicateWithSubpredicates: [
            HKQuery.predicateForObjects(from: HKSource.default()),
            HKQuery.predicateForObjects(withMetadataKey: HKMetadataKeyExternalUUID, allowedValues: [externalId]),
        ])
        let query = HKSampleQuery(
            sampleType: HKObjectType.workoutType(),
            predicate: predicate,
            limit: 1,
            sortDescriptors: nil
        ) { _, samples, error in
            if let error = error {
                log("saveWorkout: duplicate check failed: \(error.localizedDescription)")
            }
            completion(samples?.first as? HKWorkout)
        }
        healthStore.execute(query)
    }

    private static func build(
        input: WorkoutWriteInput,
        activityType: HKWorkoutActivityType,
        completion: @escaping ([String: Any]) -> Void
    ) {
        let start = Date(timeIntervalSince1970: input.startMillis / 1000.0)
        let end = Date(timeIntervalSince1970: input.endMillis / 1000.0)
        let configuration = HKWorkoutConfiguration()
        configuration.activityType = activityType
        let builder = HKWorkoutBuilder(healthStore: healthStore, configuration: configuration, device: .local())

        var metadata: [String: Any] = [
            HKMetadataKeyExternalUUID: input.externalId,
            HKMetadataKeyWorkoutBrandName: Bundle.main.object(forInfoDictionaryKey: "CFBundleDisplayName") as? String
                ?? Bundle.main.object(forInfoDictionaryKey: "CFBundleName") as? String
                ?? "Workout",
        ]
        if let volume = input.totalVolumeKg, volume > 0 {
            metadata[totalVolumeKey] = NSNumber(value: volume)
        }
        if let title = input.title, !title.isEmpty {
            metadata[titleKey] = title
        }

        func fail(_ step: String, _ error: Error?) {
            let message = "\(step): \(error?.localizedDescription ?? "unknown error")"
            log("saveWorkout: \(message)")
            builder.discardWorkout()
            completion(["status": "failed", "error": message])
        }

        builder.beginCollection(withStart: start) { began, error in
            guard began else { return fail("beginCollection", error) }

            let addEnergy: (@escaping () -> Void) -> Void = { next in
                guard let kcal = input.activeEnergyKcal, kcal > 0 else { return next() }
                let sample = HKQuantitySample(
                    type: energyType,
                    quantity: HKQuantity(unit: .kilocalorie(), doubleValue: kcal),
                    start: start,
                    end: end
                )
                builder.add([sample]) { added, error in
                    // Energy is optional: a failure here must not lose the workout.
                    if !added { log("saveWorkout: energy sample skipped: \(error?.localizedDescription ?? "")") }
                    next()
                }
            }

            addEnergy {
                builder.addMetadata(metadata) { added, error in
                    guard added else { return fail("addMetadata", error) }
                    builder.endCollection(withEnd: end) { ended, error in
                        guard ended else { return fail("endCollection", error) }
                        builder.finishWorkout { workout, error in
                            guard let workout = workout else { return fail("finishWorkout", error) }
                            log("saveWorkout: saved \(input.activityType) \(workout.uuid.uuidString)")
                            completion(["status": "saved", "uuid": workout.uuid.uuidString])
                        }
                    }
                }
            }
        }
    }

    // MARK: - Helpers

    private static func activityTypeName(_ type: HKWorkoutActivityType) -> String {
        return activityTypes.first(where: { $0.value == type })?.key ?? "other"
    }

    private static func log(_ message: String) {
        OpenWearablesHealthSDK.shared.logMessage(message)
    }
}
