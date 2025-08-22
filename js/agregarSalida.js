//js/agendarCita.js
const BASE_API_URL = 'http://127.0.0.1:8081';

const userNameElement = document.querySelector(".toolbar .center");
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

select.addEventListener("change", (e) => {
    const empleadoId = e.target.value;
    if (empleadoId !== "0"){
        getCitas(empleadoId);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    getEmpleados();
});