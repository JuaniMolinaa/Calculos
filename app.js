const calcular = () => {
    // 1. Obtención y limpieza del monto
    const inputMonto = document.querySelector("#monto");
    const montoLimpio = inputMonto.value.replace(/\./g, ''); 
    var monto = parseFloat(montoLimpio);

    // 2. Obtención de la tasa activa y tipo de moneda desde los botones
    const tasaContenedor = document.getElementById('tipoPrestamoContainer');
    var aumentoMensualPorcentaje = parseFloat(tasaContenedor?.dataset.tasaActiva || 9); 
    
    const botonActivo = document.querySelector('.btn-prestamo.active');
    const tipoMoneda = botonActivo ? botonActivo.dataset.tipo : 'PESOS';

    // 3. Lógica del LÍMITE DE CUOTAS
    let limiteCuotas = 24;
    if (tipoMoneda === 'DOLARES') {
        limiteCuotas = 48; // DÓLARES = límite de 48 cuotas.
    }
    
    // Formato de números (puntos)
    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const resultadosDiv = document.querySelector("#tablaResultados");

    // validación del monto 
    if (isNaN(monto) || inputMonto.value.trim() === '' || monto === 0) {
        resultadosDiv.innerHTML = '<p>Ingrese un monto válido.</p>';
        return;
    }

    // muestra el monto con el formato de números (puntos)
    inputMonto.value = formatter.format(monto);
    
    // 4. encabezado de la tabla
    let htmlTabla = `
        <table>
            <thead>
                <tr>
                    <th>CUOTAS</th>
                    <th>MONTO POR CUOTA EN ${tipoMoneda}</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // 5. Itera de 12 hasta el límite de cuotas (24 o 48)
    for (let cuotas = 12; cuotas <= limiteCuotas; cuotas++) {
        // Cálculo del aumento total: (número de cuotas * TASA_ACTIVA) / 100
        let aumentoCuotas = (cuotas * aumentoMensualPorcentaje) / 100;

        // CÁLCULO DEL PRÉSTAMO
        // monto final = monto original + interés total
        let montoFinal = monto * (1 + aumentoCuotas); 
        
        let montoPorCuota = montoFinal / cuotas;

        // redondea al siguiente número entero
        const montoPorCuotaEntero = Math.ceil(montoPorCuota);

        // 6. Añade  fila con el formato de números (puntos)
        htmlTabla += `
            <tr>
                <td>${cuotas}</td>
                <td class="monto-final">$ ${formatter.format(montoPorCuotaEntero)}</td>
            </tr>
        `;
    }

    // 7. cierra tabla e insertar
    htmlTabla += `
            </tbody>
        </table>
    `;

    resultadosDiv.innerHTML = htmlTabla;
}
