// =============================================================================
// DECIMAL - Tipo seguro para cálculos monetarios
// =============================================================================
// Evita problemas de precisión de punto flotante
// Usa aritmética de enteros internamente (centavos)
// =============================================================================

/**
 * Decimal seguro para cálculos monetarios
 * Almacena el valor como entero (centavos) para evitar errores de punto flotante
 *
 * Ejemplo: $100.50 se almacena como 10050 centavos
 */
export class Decimal {
  private readonly cents: number; // Valor en centavos (entero)
  private static readonly PRECISION = 2;
  private static readonly MULTIPLIER = 100; // 10^PRECISION

  private constructor(cents: number) {
    // Asegurar que sea un entero
    this.cents = Math.round(cents);
  }

  /**
   * Crea un Decimal desde un número
   */
  static fromNumber(value: number): Decimal {
    // Multiplicar por 100 y redondear para obtener centavos
    const cents = Math.round(value * Decimal.MULTIPLIER);
    return new Decimal(cents);
  }

  /**
   * Crea un Decimal desde un string
   */
  static fromString(value: string): Decimal {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new Error(`Invalid decimal string: ${value}`);
    }
    return Decimal.fromNumber(num);
  }

  /**
   * Crea un Decimal con valor cero
   */
  static zero(): Decimal {
    return new Decimal(0);
  }

  /**
   * Convierte a número (para comparaciones y display)
   */
  toNumber(): number {
    return this.cents / Decimal.MULTIPLIER;
  }

  /**
   * Convierte a string con 2 decimales
   */
  toString(): string {
    return this.toNumber().toFixed(Decimal.PRECISION);
  }

  /**
   * Suma dos Decimals
   */
  add(other: Decimal): Decimal {
    return new Decimal(this.cents + other.cents);
  }

  /**
   * Resta dos Decimals
   */
  subtract(other: Decimal): Decimal {
    return new Decimal(this.cents - other.cents);
  }

  /**
   * Multiplica por un Decimal (para cantidades)
   */
  multiply(other: Decimal): Decimal {
    // (a * b) / 100 para mantener la escala correcta
    const result = (this.cents * other.cents) / Decimal.MULTIPLIER;
    return new Decimal(Math.round(result));
  }

  /**
   * Multiplica por un número (para porcentajes como 0.21)
   */
  multiplyByNumber(factor: number): Decimal {
    const result = this.cents * factor;
    return new Decimal(Math.round(result));
  }

  /**
   * Divide por un Decimal
   */
  divide(other: Decimal): Decimal {
    if (other.cents === 0) {
      throw new Error('Division by zero');
    }
    // (a / b) * 100 para mantener la escala correcta
    const result = (this.cents * Decimal.MULTIPLIER) / other.cents;
    return new Decimal(Math.round(result));
  }

  /**
   * Calcula porcentaje: this * (percentage / 100)
   * Fuente: frmremito.frm:618 - total * (bonif / 100)
   *
   * Ejemplo: $1000.percentage(21) = $210
   * En centavos: 100000 * 2100 / 10000 = 21000
   */
  percentage(percent: Decimal): Decimal {
    // this representa el valor base (ej: $1000 = 100000 cents)
    // percent representa el porcentaje (ej: 21% = 2100 cents, que es 21.00)
    // Fórmula: base * (percent / 100)
    // En cents: (base_cents * percent_cents) / (100 * 100)
    const result = (this.cents * percent.cents) / (Decimal.MULTIPLIER * Decimal.MULTIPLIER);
    return new Decimal(Math.round(result));
  }

  /**
   * Compara si es igual a otro Decimal
   */
  equals(other: Decimal): boolean {
    return this.cents === other.cents;
  }

  /**
   * Compara si es mayor que otro Decimal
   */
  greaterThan(other: Decimal): boolean {
    return this.cents > other.cents;
  }

  /**
   * Compara si es menor que otro Decimal
   */
  lessThan(other: Decimal): boolean {
    return this.cents < other.cents;
  }

  /**
   * Verifica si es cero
   */
  isZero(): boolean {
    return this.cents === 0;
  }

  /**
   * Verifica si es negativo
   */
  isNegative(): boolean {
    return this.cents < 0;
  }

  /**
   * Retorna el valor absoluto
   */
  abs(): Decimal {
    return new Decimal(Math.abs(this.cents));
  }

  /**
   * Negativo del valor
   */
  negate(): Decimal {
    return new Decimal(-this.cents);
  }
}
