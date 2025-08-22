//js/agregarCliente.js
const BASE_API_URL = 'http://127.0.0.1:8081';
const CLIENTE_API_URL = `${BASE_API_URL}/client`;

const userNameElement = document.querySelector(".toolbar .center");
const token = localStorage.getItem('authToken');
const clienteForm = document.getElementById('client-form');

userNameElement.textContent = localStorage.getItem('nombreLogeado');

if (clienteForm){
    clienteForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const nombre = clienteForm.nombre.value;
        const primerApe = clienteForm.primer.value;
        const segundoApe = clienteForm.segundo.value;
        const telefono = clienteForm.telefono.value;
        const calle = clienteForm.calle.value; 
        const colonia = clienteForm.colonia.value;
        const numeroExterior = clienteForm.numero.value;
        const numeroInterior = clienteForm.numeroi.value;
        const codigoPostal = clienteForm.codigo.value;

        try {
            const response = await fetch (CLIENTE_API_URL, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, primerApe, segundoApe, telefono, calle, colonia, numeroExterior, numeroInterior, codigoPostal}),
            });

            if (!response.ok){
                throw new Error("Filed to POST Client");
            }

            window.location.href = "agendarCita.html";

        } catch (error){
            console.warn("Error: " + error);
        }
    });
}
