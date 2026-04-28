export const validarCedula = (cedula: string): boolean => {
  cedula = cedula.replace(/\s|-/g, '');
  if (!/^\d{10}$/.test(cedula)) {
    return false;
  }

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return false;
  }

  const tercerDigito = parseInt(cedula.charAt(2), 10);
  if (tercerDigito > 5) {
    return false;
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const digitoVerificador = parseInt(cedula.charAt(9), 10);
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula.charAt(i), 10) * coeficientes[i];
    if (valor >= 10) {
      valor -= 9;
    }
    suma += valor;
  }

  const resultado = suma % 10;
  const verificador = resultado === 0 ? 0 : 10 - resultado;

  return verificador === digitoVerificador;
};

export const validarRuc = (ruc: string): boolean => {
  ruc = ruc.replace(/\s|-/g, '');

  if (!/^\d{13}$/.test(ruc)) {
    return false;
  }

  const provincia = parseInt(ruc.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) {
    return false;
  }

  const tercerDigito = parseInt(ruc.charAt(2), 10);

  if (tercerDigito < 6) {
    const cedula = ruc.substring(0, 10);
    if (!validarCedula(cedula)) {
      return false;
    }

    return ruc.substring(10) === '001';
  }

  if (tercerDigito === 9) {
    const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    const digitoVerificador = parseInt(ruc.charAt(9), 10);
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      suma += parseInt(ruc.charAt(i), 10) * coeficientes[i];
    }

    const resultado = suma % 11;
    const verificador = resultado === 0 ? 0 : 11 - resultado;

    if (verificador !== digitoVerificador) {
      return false;
    }

    return ruc.substring(10) === '001';
  }

  if (tercerDigito === 6) {
    const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
    const digitoVerificador = parseInt(ruc.charAt(8), 10);
    let suma = 0;

    for (let i = 0; i < 8; i++) {
      suma += parseInt(ruc.charAt(i), 10) * coeficientes[i];
    }

    const resultado = suma % 11;
    const verificador = resultado === 0 ? 0 : 11 - resultado;

    if (verificador !== digitoVerificador) {
      return false;
    }

    return ruc.substring(9) === '0001';
  }

  return false;
};

export const validarCedulaORUC = (
  valor: string
): { tipo: 'cedula' | 'ruc' | 'invalido'; valido: boolean; mensaje: string } => {
  const valorLimpio = valor.replace(/\s|-/g, '');

  if (valorLimpio.length === 10) {
    const esValida = validarCedula(valorLimpio);
    return {
      tipo: 'cedula',
      valido: esValida,
      mensaje: esValida ? 'Cédula válida' : 'Cédula inválida',
    };
  }

  if (valorLimpio.length === 13) {
    const esValido = validarRuc(valorLimpio);
    return {
      tipo: 'ruc',
      valido: esValido,
      mensaje: esValido ? 'RUC válido' : 'RUC inválido',
    };
  }

  return {
    tipo: 'invalido',
    valido: false,
    mensaje: 'Debe ingresar una cédula (10 dígitos) o RUC (13 dígitos)',
  };
};