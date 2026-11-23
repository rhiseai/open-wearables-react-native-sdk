"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDataType = exports.OWLogLevel = void 0;
var OWLogLevel;
(function (OWLogLevel) {
    OWLogLevel[OWLogLevel["None"] = 0] = "None";
    OWLogLevel[OWLogLevel["Always"] = 1] = "Always";
    OWLogLevel[OWLogLevel["Debug"] = 2] = "Debug";
})(OWLogLevel || (exports.OWLogLevel = OWLogLevel = {}));
var HealthDataType;
(function (HealthDataType) {
    // Activity & Mobility
    HealthDataType["Steps"] = "steps";
    HealthDataType["DistanceWalkingRunning"] = "distanceWalkingRunning";
    HealthDataType["DistanceCycling"] = "distanceCycling";
    HealthDataType["FlightsClimbed"] = "flightsClimbed";
    HealthDataType["WalkingSpeed"] = "walkingSpeed";
    HealthDataType["WalkingStepLength"] = "walkingStepLength";
    HealthDataType["WalkingAsymmetryPercentage"] = "walkingAsymmetryPercentage";
    HealthDataType["WalkingDoubleSupportPercentage"] = "walkingDoubleSupportPercentage";
    HealthDataType["SixMinuteWalkTestDistance"] = "sixMinuteWalkTestDistance";
    HealthDataType["ActiveEnergy"] = "activeEnergy";
    HealthDataType["BasalEnergy"] = "basalEnergy";
    // Heart & Cardiovascular
    HealthDataType["HeartRate"] = "heartRate";
    HealthDataType["RestingHeartRate"] = "restingHeartRate";
    HealthDataType["HeartRateVariabilitySDNN"] = "heartRateVariabilitySDNN";
    /** iOS 27 and later; skipped on older devices and in builds made before Xcode 27. */
    HealthDataType["HeartRateVariabilityRMSSD"] = "heartRateVariabilityRMSSD";
    /** iOS 16 and later. */
    HealthDataType["HeartRateRecoveryOneMinute"] = "heartRateRecoveryOneMinute";
    HealthDataType["Vo2Max"] = "vo2Max";
    HealthDataType["OxygenSaturation"] = "oxygenSaturation";
    HealthDataType["RespiratoryRate"] = "respiratoryRate";
    // Body Measurements
    HealthDataType["BodyMass"] = "bodyMass";
    HealthDataType["Height"] = "height";
    HealthDataType["Bmi"] = "bmi";
    HealthDataType["BodyFatPercentage"] = "bodyFatPercentage";
    HealthDataType["LeanBodyMass"] = "leanBodyMass";
    HealthDataType["WaistCircumference"] = "waistCircumference";
    HealthDataType["BodyTemperature"] = "bodyTemperature";
    HealthDataType["BasalBodyTemperature"] = "basalBodyTemperature";
    // Blood & Metabolic
    HealthDataType["BloodGlucose"] = "bloodGlucose";
    HealthDataType["InsulinDelivery"] = "insulinDelivery";
    HealthDataType["BloodPressureSystolic"] = "bloodPressureSystolic";
    HealthDataType["BloodPressureDiastolic"] = "bloodPressureDiastolic";
    HealthDataType["BloodPressure"] = "bloodPressure";
    // Sleep & Mindfulness
    HealthDataType["Sleep"] = "sleep";
    HealthDataType["MindfulSession"] = "mindfulSession";
    // Reproductive Health
    HealthDataType["MenstrualFlow"] = "menstrualFlow";
    HealthDataType["CervicalMucusQuality"] = "cervicalMucusQuality";
    HealthDataType["OvulationTestResult"] = "ovulationTestResult";
    HealthDataType["SexualActivity"] = "sexualActivity";
    // Nutrition (iOS: every HealthKit dietary quantity type)
    HealthDataType["DietaryEnergyConsumed"] = "dietaryEnergyConsumed";
    HealthDataType["DietaryCarbohydrates"] = "dietaryCarbohydrates";
    HealthDataType["DietaryProtein"] = "dietaryProtein";
    HealthDataType["DietaryFatTotal"] = "dietaryFatTotal";
    HealthDataType["DietaryWater"] = "dietaryWater";
    HealthDataType["DietaryFiber"] = "dietaryFiber";
    HealthDataType["DietarySugar"] = "dietarySugar";
    HealthDataType["DietaryCaffeine"] = "dietaryCaffeine";
    HealthDataType["DietaryFatSaturated"] = "dietaryFatSaturated";
    HealthDataType["DietaryFatMonounsaturated"] = "dietaryFatMonounsaturated";
    HealthDataType["DietaryFatPolyunsaturated"] = "dietaryFatPolyunsaturated";
    HealthDataType["DietaryCholesterol"] = "dietaryCholesterol";
    HealthDataType["DietarySodium"] = "dietarySodium";
    HealthDataType["DietaryPotassium"] = "dietaryPotassium";
    HealthDataType["DietaryChloride"] = "dietaryChloride";
    HealthDataType["DietaryCalcium"] = "dietaryCalcium";
    HealthDataType["DietaryIron"] = "dietaryIron";
    HealthDataType["DietaryMagnesium"] = "dietaryMagnesium";
    HealthDataType["DietaryPhosphorus"] = "dietaryPhosphorus";
    HealthDataType["DietaryVitaminA"] = "dietaryVitaminA";
    HealthDataType["DietaryVitaminB6"] = "dietaryVitaminB6";
    HealthDataType["DietaryVitaminB12"] = "dietaryVitaminB12";
    HealthDataType["DietaryVitaminC"] = "dietaryVitaminC";
    HealthDataType["DietaryVitaminD"] = "dietaryVitaminD";
    HealthDataType["DietaryVitaminE"] = "dietaryVitaminE";
    HealthDataType["DietaryVitaminK"] = "dietaryVitaminK";
    HealthDataType["DietaryThiamin"] = "dietaryThiamin";
    HealthDataType["DietaryRiboflavin"] = "dietaryRiboflavin";
    HealthDataType["DietaryNiacin"] = "dietaryNiacin";
    HealthDataType["DietaryFolate"] = "dietaryFolate";
    HealthDataType["DietaryBiotin"] = "dietaryBiotin";
    HealthDataType["DietaryPantothenicAcid"] = "dietaryPantothenicAcid";
    HealthDataType["DietaryZinc"] = "dietaryZinc";
    HealthDataType["DietaryCopper"] = "dietaryCopper";
    HealthDataType["DietaryManganese"] = "dietaryManganese";
    HealthDataType["DietarySelenium"] = "dietarySelenium";
    HealthDataType["DietaryChromium"] = "dietaryChromium";
    HealthDataType["DietaryMolybdenum"] = "dietaryMolybdenum";
    HealthDataType["DietaryIodine"] = "dietaryIodine";
    /**
     * The HealthKit food correlation (a meal and its nutrients). iOS reads it
     * whenever any dietary type is requested, so it never needs to be passed;
     * HealthKit grants it through the dietary types, and it shows no permission row.
     */
    HealthDataType["Food"] = "food";
    // Workout
    HealthDataType["Workout"] = "workout";
    // Aliases
    HealthDataType["RestingEnergy"] = "restingEnergy";
    HealthDataType["BloodOxygen"] = "bloodOxygen";
})(HealthDataType || (exports.HealthDataType = HealthDataType = {}));
