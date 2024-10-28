// Función para configurar el botón de registrar salida y su funcionalidad
function setupRegistrarSalidaBtn() {
    const registrarSalidaBtn = document.getElementById('boton-registrar-salida');
    if (registrarSalidaBtn) {
        registrarSalidaBtn.addEventListener('click', async function(e) {
            e.preventDefault(); // Evitar comportamiento por defecto del botón
            
            // Obtenemos los valores de los campos
            const cedulaSalida = document.getElementById('salida-cedula').value;
            const placaSalida = document.getElementById('salida-placa').value;
            const msjErrorSalida = document.getElementById('error-campos-salida');
            msjErrorSalida.innerHTML = ""; // Limpiar mensajes de error anteriores
            
            // Validación de campos
            let validacion = validarForm(cedulaSalida, placaSalida);
            
            // Comprobación de los campos
            if (validacion) {
                // Llamado al BackEnd para validar el registro de salida del visitante y vehículo
                const res = await fetch("http://localhost:3000/validarSalida", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        cedula: cedulaSalida,
                        placa: placaSalida
                    })
                });
                
                const resJson = await res.json();
                if (!res.ok) {
                    msjErrorSalida.style.display = 'block';
                    msjErrorSalida.innerHTML = resJson.message;
                } else if (resJson.redirect) {
                    window.location.href = resJson.redirect;
                }
            }
        });
    }
}

// Función de validación de formulario de salida
function validarForm(cedula, placa) {
    const expresiones = {
        expCedula: /^[1-9][0-9]{1,9}$/,
        expPlaca: /^[A-Z]{3}[0-9]{2}[0-9A-Z]{1}$/
    };
    const msjErrorCamp = document.getElementById('error-campos-salida');
    const msjErrorC = document.getElementById('error-cedula-salida');
    const msjErrorP = document.getElementById('error-placa-salida');
    let alertaActiva = false;

    if (!(cedula && placa)) {
        msjErrorCamp.innerHTML = 'Todos los campos son obligatorios';
        msjErrorCamp.style.display = 'block';
        return false;
    } else {
        msjErrorCamp.style.display = 'none';
        if (!expresiones.expCedula.test(cedula)) {
            msjErrorC.style.display = 'block';
            alertaActiva = true;
        } else {
            msjErrorC.style.display = 'none';
        }
        if (!expresiones.expPlaca.test(placa)) {
            msjErrorP.style.display = 'block';
            alertaActiva = true;
        } else {
            msjErrorP.style.display = 'none';
        }
    }
    
    return !alertaActiva;
}

// Llamada automática en producción
if (typeof module === 'undefined' || !module.exports) {
    setupRegistrarSalidaBtn();
}

// Exportamos las funciones para poder usarlas en pruebas unitarias
module.exports = { validarForm, setupRegistrarSalidaBtn };
