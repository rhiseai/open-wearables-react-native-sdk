import Foundation
import HealthKit

/// Read-only HealthKit introspection behind `getHealthAuthorizationRequestStatus`
/// and `probeReadableSamples`.
///
/// `HKHealthStore.requestAuthorization` calls back with `success == true` whenever
/// the permission sheet is dismissed, so its completion value cannot tell
/// "granted" from "denied everything". These helpers answer the two questions an
/// app actually needs: whether the sheet has already been answered, and whether
/// samples can be read right now.
///
/// This lives in the bridge rather than in `Vendor/OpenWearablesHealthSDK` so the
/// vendored sources stay at the revision recorded in
/// `Vendor/OpenWearablesHealthSDK/REVISION`. Both helpers reuse the vendored
/// `HealthDataType` mapping and the SDK's `HKHealthStore`.
internal enum OpenWearablesHealthProbe {

    /// Mirror of `HKAuthorizationRequestStatus`.
    internal enum RequestStatus: String {
        /// HealthKit could not determine the status — inconclusive.
        case unknown
        /// At least one type has never been presented to the user.
        case shouldRequest
        /// Every type was already presented. This says nothing about what the
        /// user granted, only that asking again would show nothing.
        case unnecessary
    }

    internal static let defaultProbeLimit = 1
    internal static let maximumProbeLimit = 100

    /// Same exclusion the native SDK applies in `getQueryableTypes()`. The blood
    /// pressure correlation is never part of the requested read set, so asking
    /// HealthKit about it would report `shouldRequest` forever.
    private static let disallowedIdentifiers: Set<String> = [
        HKCorrelationTypeIdentifier.bloodPressure.rawValue
    ]

    internal static var isHealthDataAvailable: Bool {
        return HKHealthStore.isHealthDataAvailable()
    }

    /// Asks HealthKit whether the authorization sheet still needs to be shown for
    /// the given `HealthDataType` raw values.
    internal static func requestStatus(
        rawTypes: [String],
        completion: @escaping (RequestStatus) -> Void
    ) {
        guard HKHealthStore.isHealthDataAvailable() else {
            log("getHealthAuthorizationRequestStatus: HealthKit not available")
            resolve(completion, with: .unknown)
            return
        }

        let readTypes = self.readTypes(for: rawTypes)
        guard !readTypes.isEmpty else {
            log("getHealthAuthorizationRequestStatus: none of the \(rawTypes.count) requested type(s) map to a HealthKit type")
            resolve(completion, with: .unknown)
            return
        }

        OpenWearablesHealthSDK.shared.healthStore.getRequestStatusForAuthorization(
            toShare: [],
            read: readTypes
        ) { status, error in
            if let error = error {
                log("getHealthAuthorizationRequestStatus: \(error.localizedDescription)")
                resolve(completion, with: .unknown)
                return
            }

            let mapped: RequestStatus
            switch status {
            case .shouldRequest:
                mapped = .shouldRequest
            case .unnecessary:
                mapped = .unnecessary
            default:
                mapped = .unknown
            }
            resolve(completion, with: mapped)
        }
    }

    /// Counts how many samples each type returns since `sinceMillis`, capped at
    /// `limit`. A zero means the type is either denied or genuinely empty on this
    /// device — HealthKit does not let a reader distinguish the two.
    internal static func probeReadableSamples(
        rawTypes: [String],
        sinceMillis: Double,
        limit: Int?,
        completion: @escaping ([String: Int]) -> Void
    ) {
        var counts: [String: Int] = [:]
        for rawType in rawTypes {
            counts[rawType] = 0
        }

        guard HKHealthStore.isHealthDataAvailable() else {
            log("probeReadableSamples: HealthKit not available")
            DispatchQueue.main.async { completion(counts) }
            return
        }

        let queryLimit = min(max(limit ?? defaultProbeLimit, 1), maximumProbeLimit)
        let since = Date(timeIntervalSince1970: max(sinceMillis, 0) / 1000.0)
        let predicate = HKQuery.predicateForSamples(withStart: since, end: nil, options: [])
        let healthStore = OpenWearablesHealthSDK.shared.healthStore
        let lock = NSLock()
        let group = DispatchGroup()
        var scheduled = Set<String>()
        var queryCount = 0

        for rawType in rawTypes {
            guard scheduled.insert(rawType).inserted else { continue }
            guard let healthType = HealthDataType(rawValue: rawType) else {
                log("probeReadableSamples: \(rawType) is not a known health data type")
                continue
            }
            guard let sampleType = healthType.toHKSampleType() else {
                log("probeReadableSamples: \(rawType) is not available on this OS version")
                continue
            }

            group.enter()
            queryCount += 1
            let query = HKSampleQuery(
                sampleType: sampleType,
                predicate: predicate,
                limit: queryLimit,
                sortDescriptors: nil
            ) { _, samples, error in
                // One unreadable type must never fail the whole probe: a denial
                // surfaces here as an error and is counted as zero, exactly like
                // a readable type with no samples in the window.
                if let error = error {
                    log("probeReadableSamples: \(rawType) error: \(error.localizedDescription)")
                }
                lock.lock()
                counts[rawType] = samples?.count ?? 0
                lock.unlock()
                group.leave()
            }
            healthStore.execute(query)
        }

        log("probeReadableSamples: querying \(queryCount) type(s) since \(since) (limit \(queryLimit))")

        group.notify(queue: .main) { completion(counts) }
    }

    private static func readTypes(for rawTypes: [String]) -> Set<HKObjectType> {
        var types = Set<HKObjectType>()
        for rawType in rawTypes {
            guard let sampleType = HealthDataType(rawValue: rawType)?.toHKSampleType(),
                  !disallowedIdentifiers.contains(sampleType.identifier) else { continue }
            types.insert(sampleType)
        }
        return types
    }

    private static func resolve(
        _ completion: @escaping (RequestStatus) -> Void,
        with status: RequestStatus
    ) {
        DispatchQueue.main.async { completion(status) }
    }

    private static func log(_ message: String) {
        OpenWearablesHealthSDK.shared.logMessage(message)
    }
}
