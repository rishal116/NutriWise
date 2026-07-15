export class HealthCalculatorHelper {
  static calculateBMI(heightCm: number, weightKg: number): number {
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }
}