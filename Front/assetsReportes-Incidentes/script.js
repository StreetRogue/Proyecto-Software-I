const btnAgregar = document.getElementById('btn-agregar');
const btnCerrar = document.getElementById('btn-cerrar');
const btnAgregarAlerta = document.getElementById('btn-agregar-alerta');

const tituloTextArea = document.getElementById('titulo');
const descripcionTextArea = document.getElementById('descripcion');

const alertaAgregar = document.getElementById('alerta-agregar');
const fondo = document.getElementById('overlay');

let datos = [];

async function obtenerReportes() {
    const res = await fetch(`http://localhost:3000/obtenerReportes`);
    const resJson = await res.json();
    if (resJson.error) {
        agregarFilas();
        alert(resJson.message);
        return false;
    }
    datos = [];

    resJson.forEach(function(datosElemento, index) {
        let id = datosElemento[0] !== null ? datosElemento[0] : "-";
        let titulo = datosElemento[1] !== null ? datosElemento[1] : "-";
        let descripcion = datosElemento[2] !== null ? datosElemento[2] : "-";
        let fecha = datosElemento[3] !== null ? datosElemento[3] : "-"; 
        let hora = datosElemento[4] !== null ? datosElemento[4] : "-";

        const nuevaFila = {
            id: id,
            titulo: titulo,
            descripcion: descripcion,
            fecha: fecha,
            hora: hora
        };
        datos.push(nuevaFila);
    });
    agregarFilas();
}

async function agregarReporte(titulo, descripcion) {
    const res = await fetch(`http://localhost:3000/agregarReporte?titulo=${encodeURIComponent(titulo)}&descripcion=${encodeURIComponent(descripcion)}`);
    const resJson = await res.json();
    if (resJson.status !== "error") {
        alertaAgregar.classList.remove('alerta-activa');
        fondo.classList.remove('overlay-activo');
    } else {
        alert(resJson.error);
    }
}

function agregarFilas() {
    const tbody = document.querySelector(".table-container table tbody"); 

    // Limpiar la tabla antes de agregar nuevas filas
    tbody.innerHTML = "";

    if (datos.length > 0) {
        // Iteramos sobre los datos y creamos filas
        datos.forEach((dato) => {
            const fila = document.createElement("tr");

            // Creamos celdas para cada dato
            fila.innerHTML = `
                <td>${dato.id}</td>
                <td>${dato.titulo}</td>
                <td>${dato.descripcion}</td>
                <td>${dato.fecha}</td>
                <td>${dato.hora}</td>
            `;

            // Agregamos la fila al cuerpo de la tabla
            tbody.appendChild(fila);
        });
    } else {
        const fila = document.createElement("tr"); // Creamos una nueva fila
            // Creamos celdas para cada dato
            fila.innerHTML = `
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `;
            // Agregamos la fila al cuerpo de la tabla
            tbody.appendChild(fila);
    }
}

// Llamamos a la función al cargar la página
document.addEventListener("DOMContentLoaded", obtenerReportes());

btnAgregar.addEventListener("click", function() {
    alertaAgregar.classList.add('alerta-activa');
    fondo.classList.add('overlay-activo');
});

btnCerrar.addEventListener("click", function() {
    tituloTextArea.value = "";
    descripcionTextArea.value = "";
    alertaAgregar.classList.remove('alerta-activa');
    fondo.classList.remove('overlay-activo');
});

btnAgregarAlerta.addEventListener("click", async function() {
    let titulo = tituloTextArea.value.trim();
    let descripcion = descripcionTextArea.value.trim();
    await agregarReporte(titulo, descripcion);
    obtenerReportes();
    tituloTextArea.value = "";
    descripcionTextArea.value = "";
});