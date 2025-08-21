//js/feed.js
const BASE_API_URL = 'http://127.0.0.1:8081';
const CITA_DETAILS_API_URL = `${BASE_API_URL}/appointment/citaDetails`;
const TOTA_CITA_API_URL = `${BASE_API_URL}/appointment/calcularTotal`;

const userNameElement = document.querySelector(".toolbar .center");
const rolElement = document.getElementById('rol-usuario');
const ventasHoyElement = document.getElementById('total-ventas-hoy');
const totalVendidoElement = document.getElementById('total-vendido-hoy');
const fechaElement = document.getElementById('fecha');

async function loadFeedData() {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    const EMPLEADO_API_URL = `${BASE_API_URL}/employee/getEmployee/${email}`;

    try {
        const responseEmployee = await fetch(EMPLEADO_API_URL, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responseEmployee.ok){
            throw new Error ("No se pudo obtener el empleado");
        }

        const employeeData = await responseEmployee.json();

        const responseCitaDetails = await fetch (CITA_DETAILS_API_URL, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responseCitaDetails.ok){
            throw new Error("No se pudieron cargar las citas details");
        }

        const citaDetailsData = await responseCitaDetails.json();

        const responseTotalCita = await fetch (TOTA_CITA_API_URL, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responseTotalCita.ok){
            throw new Error ("No se pudieron cargar el total de las citas");
        }

        const totalCitaData = await responseTotalCita.json();
        const nombreCompleto = employeeData.persona.nombre +  " " + employeeData.persona.primerApe + " " + employeeData.persona.segundoApe;
        localStorage.setItem('nombreLogeado', nombreCompleto);
        if (userNameElement) userNameElement.textContent = nombreCompleto;
        if (rolElement) rolElement.textContent = employeeData.rol;
        if (ventasHoyElement) ventasHoyElement.textContent = citaDetailsData.totalCitas;
        if (fechaElement) fechaElement.textContent = citaDetailsData.fechaHoy;
        if (totalVendidoElement) totalVendidoElement.textContent = `$${totalCitaData.toLocaleString()}`;


    } catch (error){
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", loadFeedData);