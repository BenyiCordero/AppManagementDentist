//js/agendarCita.js
const BASE_API_URL = 'http://127.0.0.1:8081';

const userNameElement = document.querySelector(".toolbar .center");
const token = localStorage.getItem('authToken');
const select = document.getElementById('empleados-select');
const selectCliente = document.getElementById('clientes-select');
const citaForm = document.getElementById('cita-form');
const agregarClienteBtn = document.getElementById('agregar-btn');

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

async function getClientes() {
    const CLIENTES_API_URL = `${BASE_API_URL}/client`;

    try {
        const responseData = await fetch(CLIENTES_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responseData.ok){
            throw new Error ("No se pudieron obtener los clientes");
        }

        const clientes = await responseData.json();

        selectCliente.length = 1;

        clientes.forEach(cli => {
            const option = document.createElement("option");
            option.value = cli.idCliente;
            option.textContent = `${cli.persona.nombre} ${cli.persona.primerApe}`;
            selectCliente.appendChild(option);
        });

    } catch (error){
    }
}

if (citaForm){
    citaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const CITA_API_URL = `${BASE_API_URL}/appointment/addAppointment`;

        const idEmpleado = Number(select.value);
        const idCliente = Number(selectCliente.value);
        const descripcion = citaForm.descripcion.value;
        const horaInicio = citaForm.horai.value + ":00";
        const horaFin = citaForm.horaf.value + ":00";
        const fecha = citaForm.fecha.value;
        const monto = Number(citaForm.monto.value);

        if (idEmpleado === 0 ){
            alert("Selecciona un empleado valido");
            return;
        }

        if (idCliente === 0 ){
            alert("Selecciona un cliente valido");
            return;
        }

        try {
            const response = await fetch(CITA_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ descripcion, monto, horaInicio, horaFin, fecha, idEmpleado, idCliente}),
            });

            if (!response.ok){
                throw new Error("Failed to POST cita");
            }

            alert("Cita agendada con exito");
            window.location.href = "citas.html";
        } catch (error){
            console.warn("Error: " + error);
        }
    })
}

agregarClienteBtn.onclick = ()=> {
    window.location.href = "agregarCliente.html";
};

document.addEventListener("DOMContentLoaded", () => {
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    getEmpleados();
    getClientes();
});