//js/configuracion.js
const BASE_API_URL = 'http://127.0.0.1:8081';

const userNameElement = document.querySelector(".toolbar .center");
const rolElement = document.getElementById('rol');
const calleElement = document.getElementById('calle');
const numeroIntElement = document.getElementById('numero-int');
const telefonoElement = document.getElementById('telefono');
const coloniaElement = document.getElementById('colonia');
const numeroExtElement = document.getElementById('numero-ext');
const correoElement = document.getElementById('correo');
const codigoPostalElement = document.getElementById('codigo-postal');

async function loadConfigurationData() {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');

    const CONFIGURACION_API_URL = `${BASE_API_URL}/employee/getConfiguration/${email}`;

    try {
        const responseData = await fetch(CONFIGURACION_API_URL, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responseData.ok){
            throw new Error ("No se pudo obtener el empleado");
        }

        const configurationData = await responseData.json();

        const nombreCompleto = configurationData.nombre +  " " + configurationData.primerApe + " " + configurationData.segundoApe;

        if (userNameElement) userNameElement.textContent = nombreCompleto;
        if (rolElement) rolElement.textContent = configurationData.rol;
        if (calleElement) calleElement.textContent = configurationData.calle;
        if (numeroIntElement) numeroIntElement.textContent = configurationData.numeroInterior;
        if (telefonoElement) telefonoElement.textContent = configurationData.telefono;
        if (coloniaElement) coloniaElement.textContent = configurationData.colonia;
        if (numeroExtElement) numeroExtElement.textContent = configurationData.numeroExterior;
        if (correoElement) correoElement.textContent = configurationData.email;
        if (codigoPostalElement) codigoPostalElement.textContent = configurationData.codigoPostal;

    } catch (error){
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", loadConfigurationData);