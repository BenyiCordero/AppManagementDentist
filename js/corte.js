//js/corte.js
const BASE_API_URL = 'http://127.0.0.1:8081';

const userNameElement = document.querySelector(".toolbar .center");
const fechaElement = document.getElementById('fecha');
const empleadoElement = document.getElementById('empleado');
const salidasElement = document.getElementById('salidas');
const clientesElement = document.getElementById('clientes');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const totalTarjetaElement = document.getElementById('total-tarjeta');
const totalEfectivoElement = document.getElementById('total-efectivo');
const totalTransferenciaElement = document.getElementById('total-transferencia');
const token = localStorage.getItem('authToken');
const select = document.getElementById('empleados-select');

async function getEmpleados() {
    const EMPLEADOS_API_URL = `${BASE_API_URL}/employee`;
    const nombreLogeado = localStorage.getItem('nombreLogeado');
    if (userNameElement) userNameElement.textContent = nombreLogeado;

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

    } catch (error){
    }
}


async function loadCorteData(empleadoId) {
    const email = localStorage.getItem('userEmail');

    const CORTE_API_URL = `${BASE_API_URL}/corte/${empleadoId}`;

    try {
        const responseData = await fetch(CORTE_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responseData.ok){
            throw new Error ("No se pudo obtener el empleado");
        }

        const corteData = await responseData.json();

        const nombreLogeado = localStorage.getItem('nombreLogeado');
        const nombreCompleto = corteData.nombre +  " " + corteData.primerApe + " " + corteData.segundoApe;
        const subtotal = corteData.totalEfectivo;
        const salidas = corteData.totalSalidas;
        const total = subtotal - salidas;
        const totalTarjeta = corteData.totalTarjeta;
        const totalTransferencia = corteData.totalTransferencia;
        const totalEfectivo = total - totalTarjeta - totalTransferencia;

        if (fechaElement) fechaElement.textContent = corteData.fecha;
        if (empleadoElement) empleadoElement.textContent = nombreCompleto;
        if (salidasElement) salidasElement.textContent = "$" + salidas.toFixed(2);
        if (clientesElement) clientesElement.textContent = corteData.totalCitas;
        if (subtotalElement) subtotalElement.textContent = "$" + subtotal.toFixed(2);
        if (totalElement) totalElement.textContent = "$" + total.toFixed(2);
        if (totalTarjetaElement) totalTarjetaElement.textContent = "$" + totalTarjeta.toFixed(2);
        if (totalEfectivoElement) totalEfectivoElement.textContent = "$" + totalEfectivo.toFixed(2);
        if (totalTransferenciaElement) totalTransferenciaElement.textContent = "$" + totalTransferencia.toFixed(2);

    } catch (error){
    }
}

select.addEventListener("change", (e) => {
    const empleadoId = e.target.value;
    if (empleadoId !== "0"){
        loadCorteData(empleadoId);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    getEmpleados();
});