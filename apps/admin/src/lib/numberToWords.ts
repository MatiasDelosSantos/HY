/**
 * Converts a number to Spanish words.
 * Ported from VB6 LETRAS function in Module1.bas
 * Range: 0 to 999,999,999,999,999.99
 */
export function numberToWords(numero: number): string {
  if (numero === 0) {
    return 'CERO con 00 centavos';
  }

  // Split into integer and decimal parts
  const numStr = numero.toFixed(2);
  const [integerPart, decimalPart] = numStr.split('.');

  // Pad integer part to 15 digits (5 groups of 3)
  const paddedInt = integerPart.padStart(15, '0');

  // Split into groups of 3 digits
  const groups: string[] = [];
  for (let i = 0; i < 5; i++) {
    groups.push(paddedInt.substring(i * 3, (i + 1) * 3));
  }

  let result = '';

  for (let groupIndex = 0; groupIndex < 5; groupIndex++) {
    const group = groups[groupIndex];
    const groupNum = parseInt(group, 10);

    if (groupNum === 0) continue;

    const centena = group[0];
    const decena = group[1];
    const unidad = group[2];

    let cenlet = '';
    let declet = '';
    let unilet = '';
    let conect = '';

    // Centenas
    switch (centena) {
      case '1':
        cenlet = decena === '0' && unidad === '0' ? 'CIEN ' : 'CIENTO ';
        break;
      case '2': cenlet = 'DOSCIENTOS '; break;
      case '3': cenlet = 'TRESCIENTOS '; break;
      case '4': cenlet = 'CUATROCIENTOS '; break;
      case '5': cenlet = 'QUINIENTOS '; break;
      case '6': cenlet = 'SEISCIENTOS '; break;
      case '7': cenlet = 'SETECIENTOS '; break;
      case '8': cenlet = 'OCHOCIENTOS '; break;
      case '9': cenlet = 'NOVECIENTOS '; break;
    }

    // Decenas
    switch (decena) {
      case '1':
        declet = unidad === '0' ? 'DIEZ ' : '';
        break;
      case '2':
        declet = unidad === '0' ? 'VEINTE ' : 'VEINTI';
        break;
      case '3':
        declet = unidad === '0' ? 'TREINTA ' : 'TREINTA Y ';
        break;
      case '4':
        declet = unidad === '0' ? 'CUARENTA ' : 'CUARENTA Y ';
        break;
      case '5':
        declet = unidad === '0' ? 'CINCUENTA ' : 'CINCUENTA Y ';
        break;
      case '6':
        declet = unidad === '0' ? 'SESENTA ' : 'SESENTA Y ';
        break;
      case '7':
        declet = unidad === '0' ? 'SETENTA ' : 'SETENTA Y ';
        break;
      case '8':
        declet = unidad === '0' ? 'OCHENTA ' : 'OCHENTA Y ';
        break;
      case '9':
        declet = unidad === '0' ? 'NOVENTA ' : 'NOVENTA Y ';
        break;
    }

    // Unidades
    // Group indices: 0=billones, 1=miles de millón, 2=millones, 3=miles, 4=unidades
    const isMilesOrMillones = groupIndex === 1 || groupIndex === 3;

    switch (unidad) {
      case '1':
        if (decena === '1') {
          unilet = 'ONCE ';
        } else if (group === '001' && isMilesOrMillones) {
          unilet = '';
        } else if (groupIndex < 4) {
          unilet = 'UN ';
        } else {
          unilet = 'UNO ';
        }
        break;
      case '2':
        unilet = decena === '1' ? 'DOCE ' : 'DOS ';
        break;
      case '3':
        unilet = decena === '1' ? 'TRECE ' : 'TRES ';
        break;
      case '4':
        unilet = decena === '1' ? 'CATORCE ' : 'CUATRO ';
        break;
      case '5':
        unilet = decena === '1' ? 'QUINCE ' : 'CINCO ';
        break;
      case '6':
        unilet = decena === '1' ? 'DIECISEIS ' : 'SEIS ';
        break;
      case '7':
        unilet = decena === '1' ? 'DIECISIETE ' : 'SIETE ';
        break;
      case '8':
        unilet = decena === '1' ? 'DIECIOCHO ' : 'OCHO ';
        break;
      case '9':
        unilet = decena === '1' ? 'DIECINUEVE ' : 'NUEVE ';
        break;
    }

    // Conectores
    switch (groupIndex) {
      case 0: // Billones
        if (groupNum > 0) {
          conect = groupNum === 1 ? 'BILLON ' : 'BILLONES ';
        }
        break;
      case 1: // Miles de millón
        if (groupNum > 0) {
          conect = 'MIL ';
        }
        break;
      case 2: // Millones
        if (groupNum > 0 || parseInt(groups[1], 10) > 0) {
          conect = groupNum === 1 && parseInt(groups[1], 10) === 0 ? 'MILLON ' : 'MILLONES ';
        }
        break;
      case 3: // Miles
        if (groupNum > 0) {
          conect = 'MIL ';
        }
        break;
      case 4: // Unidades
        conect = '';
        break;
    }

    result += cenlet + declet + unilet + conect;
  }

  // Handle edge case where result might be empty (shouldn't happen)
  if (result.trim() === '') {
    result = 'CERO ';
  }

  return result.trim() + ' con ' + decimalPart + ' centavos';
}

/**
 * Formats a number as Argentine pesos in words.
 * Example: 19360 -> "PESOS DIECINUEVE MIL TRESCIENTOS SESENTA con 00 centavos"
 */
export function pesosEnLetras(numero: number): string {
  return 'PESOS ' + numberToWords(numero);
}
