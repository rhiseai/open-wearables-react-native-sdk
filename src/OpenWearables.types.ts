export type OpenWearablesModuleEvents = {
  onLog: (params: LogEventPayload) => void;
  onAuthError: (params: AuthErrorEventPayload) => void;
};

export type LogEventPayload = {
  message: string;
};

export type AuthErrorEventPayload = {
  statusCode: number;
  message: string;
};

export enum OWLogLevel {
  None = 0,
  Always = 1,
  Debug = 2,
}

export enum HealthDataType {
  // Activity & Mobility
  Steps = "steps",
  DistanceWalkingRunning = "distanceWalkingRunning",
  DistanceCycling = "distanceCycling",
  FlightsClimbed = "flightsClimbed",
  WalkingSpeed = "walkingSpeed",
  WalkingStepLength = "walkingStepLength",
  WalkingAsymmetryPercentage = "walkingAsymmetryPercentage",
  WalkingDoubleSupportPercentage = "walkingDoubleSupportPercentage",
  SixMinuteWalkTestDistance = "sixMinuteWalkTestDistance",
  ActiveEnergy = "activeEnergy",
  BasalEnergy = "basalEnergy",

  // Heart & Cardiovascular
  HeartRate = "heartRate",
  RestingHeartRate = "restingHeartRate",
  HeartRateVariabilitySDNN = "heartRateVariabilitySDNN",
  Vo2Max = "vo2Max",
  OxygenSaturation = "oxygenSaturation",
  RespiratoryRate = "respiratoryRate",

  // Body Measurements
  BodyMass = "bodyMass",
  Height = "height",
  Bmi = "bmi",
  BodyFatPercentage = "bodyFatPercentage",
  LeanBodyMass = "leanBodyMass",
  WaistCircumference = "waistCircumference",
  BodyTemperature = "bodyTemperature",
  BasalBodyTemperature = "basalBodyTemperature",

  // Blood & Metabolic
  BloodGlucose = "bloodGlucose",
  InsulinDelivery = "insulinDelivery",
  BloodPressureSystolic = "bloodPressureSystolic",
  BloodPressureDiastolic = "bloodPressureDiastolic",
  BloodPressure = "bloodPressure",

  // Sleep & Mindfulness
  Sleep = "sleep",
  MindfulSession = "mindfulSession",

  // Reproductive Health
  MenstrualFlow = "menstrualFlow",
  CervicalMucusQuality = "cervicalMucusQuality",
  OvulationTestResult = "ovulationTestResult",
  SexualActivity = "sexualActivity",

  // Nutrition
  DietaryEnergyConsumed = "dietaryEnergyConsumed",
  DietaryCarbohydrates = "dietaryCarbohydrates",
  DietaryProtein = "dietaryProtein",
  DietaryFatTotal = "dietaryFatTotal",
  DietaryWater = "dietaryWater",
  DietaryFiber = "dietaryFiber",
  DietarySugar = "dietarySugar",
  DietaryCaffeine = "dietaryCaffeine",

  // Workout
  Workout = "workout",

  // Aliases
  RestingEnergy = "restingEnergy",
  BloodOxygen = "bloodOxygen",
}

/**
 * Whether HealthKit still needs to present the authorization sheet.
 *
 * - `"shouldRequest"`: at least one requested type has never been presented.
 * - `"unnecessary"`: every requested type was already presented. This means the
 *   user *answered* the sheet — it does **not** mean access was granted.
 * - `"unknown"`: HealthKit could not determine the status, or health data is
 *   unavailable on this device.
 */
export type HealthAuthorizationRequestStatus =
  | "unknown"
  | "shouldRequest"
  | "unnecessary";

/**
 * Number of samples each probed type returned, keyed by `HealthDataType` raw
 * value. A `0` means the type is denied **or** has no data on the device.
 */
export type ReadableSampleCounts = Record<string, number>;

/** HealthKit workout activity types that `saveWorkout` can write. */
export type HealthWorkoutActivityType =
  | "traditionalStrengthTraining"
  | "functionalStrengthTraining"
  | "highIntensityIntervalTraining"
  | "crossTraining"
  | "coreTraining"
  | "mixedCardio"
  | "running"
  | "walking"
  | "cycling"
  | "swimming"
  | "rowing"
  | "elliptical"
  | "stairClimbing"
  | "yoga"
  | "pilates"
  | "flexibility"
  /** iOS 16 and later; `saveWorkout` fails with `failed` below that. */
  | "swimBikeRun"
  | "other";

/**
 * Whether this app may write workouts to HealthKit. Write access, unlike read
 * access, is reported truthfully. `"unavailable"` on Android and on devices
 * without HealthKit.
 */
export type WorkoutWriteStatus =
  | "unavailable"
  | "notDetermined"
  | "denied"
  | "authorized";

/** A workout already in HealthKit whose time range overlaps the query window. */
export type HealthWorkoutSummary = {
  uuid: string;
  activityType: HealthWorkoutActivityType;
  startMillis: number;
  endMillis: number;
  sourceBundleId: string;
  sourceName: string;
  /** True when this app wrote it. */
  isOwnSource: boolean;
  /** `HKMetadataKeyExternalUUID`, when the writer set one. */
  externalId: string | null;
};

export type SaveWorkoutInput = {
  activityType: HealthWorkoutActivityType;
  startMillis: number;
  endMillis: number;
  /** Stable host-app id; makes the write idempotent. */
  externalId: string;
  activeEnergyKcal?: number | null;
  totalVolumeKg?: number | null;
  title?: string | null;
};

export type SaveWorkoutResult =
  | { status: "saved" | "duplicate"; uuid: string }
  | { status: "unavailable" | "notDetermined" | "denied" }
  | { status: "failed"; error: string };

export type HealthDataProvider = {
  id: string;
  displayName: string;
  isAvailable: boolean;
};

export type StoredCredentials = {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  apiKey: string | null;
  host: string | null;
  /** Always null on iOS — the native SDK exposes no accessor for it yet. */
  customSyncUrl: string | null;
  isSyncActive: boolean;
  /** `"apple"` on iOS; `"google"` or `"samsung"` on Android; null when none is selected. */
  provider: string | null;
};

export type SyncStatus = {
  hasResumableSession: boolean;
  sentCount: number;
  completedTypes: number;
  isFullExport: boolean;
  /** False while the initial full historical export is still pending or in progress. */
  initialExportDone: boolean;
  /** True while a sync round is currently in flight. */
  isSyncing: boolean;
  /** ISO8601 timestamp of the current sync session, or null when there is none. */
  createdAt: string | null;
  /** Successful native iOS upload chunks in the current resumable sync session. */
  uploadedChunks?: number;
  /** Serialized payload entries successfully uploaded by the native iOS SDK. */
  uploadedRecords?: number;
  /** Encoded JSON bytes successfully uploaded by the native iOS SDK. */
  uploadedBytes?: number;
  /** Native iOS chunks currently persisted in the upload outbox. */
  queuedChunks?: number;
  /** Serialized payload entries currently persisted in the native iOS outbox. */
  queuedRecords?: number;
  /** Encoded JSON bytes currently persisted in the native iOS outbox. */
  queuedBytes?: number;
  /** True when the native iOS SDK stopped after a non-retryable upload response. */
  hasPermanentFailure?: boolean;
  /** Terminal HTTP status on iOS, null when no permanent failure exists. */
  permanentFailureStatusCode?: number | null;
};
