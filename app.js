const calcular = () => {
    // 1. Obtención y limpieza del monto
    const inputMonto = document.querySelector("#monto");
    const montoLimpio = inputMonto.value.replace(/\./g, ''); 
    var monto = parseFloat(montoLimpio);

    // 2. Obtención de la tasa y moneda
    const tasaContenedor = document.getElementById('tipoPrestamoContainer');
    var aumentoMensualPorcentaje = parseFloat(tasaContenedor?.dataset.tasaActiva || 9); 
    
    const botonActivo = document.querySelector('.btn-prestamo.active');
    const tipoMoneda = botonActivo ? (botonActivo.dataset.tipo || 'PESOS') : 'PESOS';

    // 3. Límite de cuotas
    let limiteCuotas = 36;
    if (tipoMoneda === 'DOLARES') {
        limiteCuotas = 48;
    }
    
    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const resultadosDiv = document.querySelector("#tablaResultados");
    const destacadosDiv = document.querySelector("#cuotasDestacadas");

    // Validación
    if (isNaN(monto) || inputMonto.value.trim() === '' || monto === 0) {
        resultadosDiv.innerHTML = '<p style="color:red; background:#ffe0e0; border:1px solid red; padding:10px; text-align:center;">Ingrese un monto válido.</p>';
        destacadosDiv.innerHTML = '';
        return;
    }

    inputMonto.value = formatter.format(monto);
    
    let htmlTabla = `
        <table>
            <thead>
                <tr>
                    <th>CUOTAS</th>
                    <th>VALOR EN ${tipoMoneda}</th>
                </tr>
            </thead>
            <tbody>
    `;

    let htmlDestacados = '';

    // 4. Bucle único para tabla y destacados
    for (let cuotas = 12; cuotas <= limiteCuotas; cuotas++) {
        let aumentoCuotas = (cuotas * aumentoMensualPorcentaje) / 100;
        let montoFinal = monto * (1 + aumentoCuotas); 
        let montoPorCuota = montoFinal / cuotas;
        const montoPorCuotaEntero = Math.ceil(montoPorCuota);
        const valorFormateado = formatter.format(montoPorCuotaEntero);

        // Si es una cuota clave, la agregamos a destacados
        if (cuotas === 12 || cuotas === 18 || cuotas === 24) {
            htmlDestacados += `
                <div class="card-destacada">
                    <span class="titulo-card">${cuotas} CUOTAS</span>
                    <span class="monto-card">$ ${valorFormateado}</span>
                </div>
            `;
        }

        // Fila de la tabla normal
        htmlTabla += `
            <tr>
                <td>${cuotas}</td>
                <td class="monto-final">$ ${valorFormateado}</td>
            </tr>
        `;
    }

    htmlTabla += `</tbody></table>`;

    // 5. Renderizar
    resultadosDiv.innerHTML = htmlTabla;
    destacadosDiv.innerHTML = htmlDestacados;
}
