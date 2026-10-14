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
    // Nutrition
    HealthDataType["DietaryEnergyConsumed"] = "dietaryEnergyConsumed";
    HealthDataType["DietaryCarbohydrates"] = "dietaryCarbohydrates";
    HealthDataType["DietaryProtein"] = "dietaryProtein";
    HealthDataType["DietaryFatTotal"] = "dietaryFatTotal";
    HealthDataType["DietaryWater"] = "dietaryWater";
    HealthDataType["DietaryFiber"] = "dietaryFiber";
    HealthDataType["DietarySugar"] = "dietarySugar";
    HealthDataType["DietaryCaffeine"] = "dietaryCaffeine";
    // Workout
    HealthDataType["Workout"] = "workout";
    // Aliases
    HealthDataType["RestingEnergy"] = "restingEnergy";
    HealthDataType["BloodOxygen"] = "bloodOxygen";
})(HealthDataType || (exports.HealthDataType = HealthDataType = {}));
