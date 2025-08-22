//js/citas.js
const BASE_API_URL = 'http://127.0.0.1:8081';

const userNameElement = document.querySelector(".toolbar .center");
const token = localStorage.getItem('authToken');
const select = document.getElementById('empleados-select');
const contenedor = document.getElementById('contenedor-c');
const agendarCitaBtn = document.getElementById('citas-btn');

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

function crearBotonCita(cita, index){
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('btn-cita');
    tarjeta.innerHTML = `
        <h3>Cita No.${index + 1}</h3>
        <h3>Descripción</h3>
        <label class="descripcion">${cita.descripcion}</label>
        <h3>Monto</h3>
        <label class="monto">$${cita.monto.toFixed(2)}</label>
        <h3>Hora inicio</h3>
        <label class="hora">${cita.horaInicio}</label>
        <h3>Hora fin</h3>
        <label class="hora">${cita.horaFin}</label>
        <h3>Cliente</h3>
        <label class="cliente">${cita.nombre + "" +cita.primerApe}</label>
    `;

    return tarjeta;
}

async function getCitas(empleadoId) {

    const CITAS_API_URL = `${BASE_API_URL}/appointment/citaDetails/${empleadoId}`;

    try {
        const response = await fetch(CITAS_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok){
            throw new Error ("No se pudieron obtener las citas");
        }

        const citas = await response.json();

        contenedor.innerHTML = "";

        citas.forEach((cita, index) => {
            const boton = crearBotonCita(cita, index);
            contenedor.appendChild(boton);
        });
    } catch (error){
        console.error("Error cargando citas:", error);
    }
}

select.addEventListener("change", (e) => {
    const empleadoId = e.target.value;
    if (empleadoId !== "0"){
        getCitas(empleadoId);
    }
});

agendarCitaBtn.onclick = ()=> {
    window.location.href = "agendarCita.html";
};

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    getEmpleados();
});