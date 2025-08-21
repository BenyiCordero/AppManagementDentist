//js/salidas.js
const BASE_API_URL = "http://127.0.0.1:8081";

const token = localStorage.getItem('authToken');
const select = document.getElementById('empleados-select');
const contenedor = document.getElementById('contenedor-s')
const userNameElement = document.querySelector(".toolbar .center");
const nombreLogeado = localStorage.getItem('nombreLogeado');

async function getEmpleados() {
    const EMPLEADOS_API_URL = `${BASE_API_URL}/employee`;

    try {
        const responseData = await fetch(EMPLEADOS_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responseData.ok){
            throw new Error ("No se pudieron obtener los empleados");
        }

        const empleados = await responseData.json();

        select.length = 1;

        empleados.forEach(emp => {
            const option = document.createElement("option");
            option.value = emp.id;
            option.textContent = `${emp.persona.nombre} ${emp.persona.primerApe}`;
            select.appendChild(option);
        });
        if (userNameElement) userNameElement.textContent = nombreLogeado;
    } catch (error){
        console.warn("Error: " + error);
    }
}

function crearTarjetaSalida(salida, index){
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjet-container');
    console.log("fn crear tarjeta, salidas: " + salida);
    console.log("salida monto: " + salida.monto.toFixed(2) + "descripcion: " + salida.descripcion);
    tarjeta.innerHTML = `
        <h3>Salida No.${index + 1}</h3>
        <h3>Descripción</h3>
        <label class="descripcion">${salida.descripcion}</label>
        <h3>Monto</h3>
        <label class="monto">$${salida.monto.toFixed(2)}</label>
    `;

    return tarjeta;
}

async function getSalidas(empleadoId) {

    const SALIDAS_API_URL = `${BASE_API_URL}/salida/${empleadoId}`;

    try {
        const response = await fetch(SALIDAS_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok){
            throw new Error ("No se pudieron obtener las salidas");
        }

        const salidas = await response.json();

        contenedor.innerHTML = "";
        console.log("Respuesta de API:", salidas);
        console.log("Es array?:", Array.isArray(salidas), "Tamaño:", salidas.length);
        salidas.forEach((salida, index) => {
            const tarjeta = crearTarjetaSalida(salida, index);
            contenedor.appendChild(tarjeta);
        });
    } catch (error){
        console.error("Error cargando salidas:", error);
    }
}

select.addEventListener("change", (e) => {
    const empleadoId = e.target.value;
    if (empleadoId !== "0"){
        getSalidas(empleadoId);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    getEmpleados();
});