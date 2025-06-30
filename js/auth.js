// js/auth.js
import { displayError, clearError, displayMessage, clearMessage } from "./utils.js";

const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const loginError = document.getElementById('login-error');
const authMessage = document.getElementById('auth-message');

const BASE_API_URL = 'http://127.0.0.1:8081';
const LOGIN_API_URL = `${BASE_API_URL}/auth/login`;

function checkAuthStatus(){
    const authToken = localStorage.getItem('authToken');
    const isOnLoginPage = window.location.pathname.includes('index.html');

    if (authToken){
        console.log('User Authenticated');
        if (isOnLoginPage){
            window.location.href = 'feed.html';
        } else {
            console.log('On login with token');
        }
    } else {
        console.log('User NOT Authenticated');
        if (!isOnLoginPage){
            window.location.href = 'index.html';
        } else {
            console.log('LoginPage');
        }
    }
    console.log('End CheckStatus');
}

if (loginForm){
    loginForm.addEventListener('submit', async(event) => {
        event.preventDefault();

        const username = loginForm.username.value; // Este es el valor del email/usuario
        const password = loginForm.password.value;

        if (loginError) clearError(loginError);
        if (authMessage) clearMessage(authMessage);

        try {
            console.log('Intentando iniciar sesion con: ', {username, password});
            const response = await fetch (LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({email: username, password}), // Aquí usas 'username' como 'email' en el cuerpo
            });

            let responseData;

            const clonedResponse = response.clone();

            try {
                responseData = await clonedResponse.json();
            } catch (jsonError){
                console.warn('FAILED TO PARSE RESPONSE AS JSON');
                if (!response.ok){
                    try {
                        const textError = await response.text();
                        console.warn('Error response body: ', textError);
                    } catch (textReadError){
                        console.warn('ALSO FAILED TO READ RESPONSE BODY AS TEXT');
                    }
                }
                responseData = {};
            }
            console.log('Respuesta de la api de login: ', responseData);

            if (!response.ok){
                if (response.status === 401){
                    throw new Error('Credenciales Invalidas');
                } else if (response.status === 400){
                    throw new Error('Solicitud incorrecta. Verifica los datos');
                } else {
                    throw new Error('Credenciales invalidas');
                }
            }
            if (responseData.access_token){
                localStorage.setItem('authToken', responseData.access_token);
                // CORRECCIÓN: Usar 'username' que contiene el valor del email
                localStorage.setItem('userEmail', username);
                if (authMessage) displayMessage(authMessage, 'Inicio de sesion exitoso');
                window.location.href = 'feed.html';
            } else {
                if (loginError) displayError(loginError, 'Respuesta inesperadad de API, No se recibio access_token');
            }
        } catch (error) {
            console.error('ERROR EN INICIO DE SESION' , error);
            if (loginError) displayError(loginError, error.message);
        }
    });
}

if (logoutButton){
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail'); // También es buena práctica remover el email al cerrar sesión
        window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);
