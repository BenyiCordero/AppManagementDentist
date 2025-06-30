// js/feed.js

// Define la URL base de tu API. Asegúrate de que coincida con la de tu backend.
// Si tu backend está en 'http://127.0.0.1:8081', esta es la correcta.
const BASE_API_URL = 'http://127.0.0.1:8081';

// Define la URL para obtener los datos del empleado por email.
// Esto se alinea con tu endpoint de Spring Boot: /employee/getEmployee/{email}
const NOMBRE_URL = `${BASE_API_URL}/employee/getEmployee/`;

/**
 * Establece el nombre y el rol del usuario en la barra de herramientas
 * y en los elementos correspondientes del feed, obteniendo los datos
 * del empleado desde la API.
 */
async function setName() {
    const nombreToolbar = document.getElementById('nombre-toolbar');
    const rolUsuarioElement = document.getElementById('rol-usuario');
    const authToken = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');

    // Si no hay token o email, muestra "Usuario Invitado" y "N/A"
    if (!authToken || !userEmail) {
        console.warn('setName: No hay token de autenticación o email de usuario disponibles.');
        if (nombreToolbar) {
            nombreToolbar.textContent = 'Usuario Invitado';
        }
        if (rolUsuarioElement) {
            rolUsuarioElement.textContent = 'N/A';
        }
        return; // Sale de la función si no hay datos de autenticación
    }

    try {
        // Realiza la llamada a la API para obtener los datos del empleado
        // La URL final será algo como: http://127.0.0.1:8081/employee/getEmployee/usuario@example.com
        const response = await fetch(`${NOMBRE_URL}${userEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'ngrok-skip-browser-warning': 'true' // Encabezado para evitar advertencias de ngrok si lo usas
            },
        });

        // Verifica si la respuesta de la API fue exitosa (status 200-299)
        if (!response.ok) {
            const errorBody = await response.text(); // Intenta leer el cuerpo del error
            console.error('setName: Error en la respuesta de la API:', response.status, response.statusText, errorBody);
            throw new Error(`Error al obtener los datos del empleado: ${response.status} ${response.statusText}`);
        }

        // Parsea la respuesta JSON
        const employeeData = await response.json();
        console.log('Datos del empleado recibidos:', employeeData);

        // Actualiza el nombre en la barra de herramientas
        if (nombreToolbar && employeeData && employeeData.persona) {
            const { nombre, primerApe, segundoApe } = employeeData.persona;
            // Concatena las partes del nombre, filtrando las que puedan ser nulas/vacías
            const fullName = [nombre, primerApe, segundoApe].filter(Boolean).join(' ');
            if (fullName) {
                nombreToolbar.textContent = fullName;
            } else {
                nombreToolbar.textContent = 'Nombre no disponible';
            }
        } else {
            console.warn('setName: No se encontraron datos de persona válidos en la respuesta.');
            if (nombreToolbar) {
                nombreToolbar.textContent = 'Nombre no disponible';
            }
        }

        // Actualiza el rol del usuario
        if (rolUsuarioElement && employeeData && employeeData.rol) {
            rolUsuarioElement.textContent = employeeData.rol;
        } else {
            console.warn('setName: No se encontró el rol en la respuesta.');
            if (rolUsuarioElement) {
                rolUsuarioElement.textContent = 'Rol no disponible';
            }
        }

    } catch (error) {
        // Manejo de errores durante la llamada a la API o el procesamiento
        console.error('setName: Error general al obtener los datos del empleado:', error);
        if (nombreToolbar) {
            nombreToolbar.textContent = 'Error al cargar nombre';
        }
        if (rolUsuarioElement) {
            rolUsuarioElement.textContent = 'Error al cargar rol';
        }
    }
}

// Llama a la función setName cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', setName);
