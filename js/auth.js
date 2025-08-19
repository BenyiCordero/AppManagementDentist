//js/auth.js

import { displayError, clearError, displayMessage, clearMessage} from './utils.js';

const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const authMessage = document.getElementById('auth-message');
const logoutButton = document.getElementById('logout-button');

const BASE_API_URL = 'http://127.0.0.1:8081';
const LOGIN_API_URL = `${BASE_API_URL}/auth/login`;

function checkAuthStatus(){
    const authToken = localStorage.getItem('authToken');
    const isOnLoginPage = window.location.pathname.includes('index.html');

    if (authToken){
        if(isOnLoginPage){
            window.location.href = 'feed.html';
        }
    }
    else {
        if (!isOnLoginPage){
            window.location.href = 'index.html';
        }
    }
}

if (loginForm){
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        if (loginError) clearError(loginError);
        if (authMessage) clearMessage(authMessage);

        try {
            console.log('Intentando iniciar sesión con:', { username, password });
            const response = await fetch (LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'ngrok-skip-browser-warning' : 'true'
                },
                body: JSON.stringify({ email: username, password}),
            });

            let responseData;

            const clonedResponse = response.clone();

            try {
                responseData = await clonedResponse.json();
            } catch (jsonError){
                console.warn('Failed to parse response as JSON. Status: ', response.status, 'Error: ', jsonError);
                if (!response.ok){
                    try {
                        const textError = await response.text();
                    } catch (textReadError){
                        console.warn('Failed to read response as text');
                    }
                }
                responseData = {};
            }

            if (!response.ok) {
                if (response.status === 401){
                    throw new Error('Credenciales invalidas, Por favor verifica tu correo y contraseña.');
                } else if (response.status === 400){
                    throw new Error(responseData.message);
                } else {
                    throw new Error('Credenciales invalidas');
                }
            }

            if(responseData.access_token){
                localStorage.setItem('authToken', responseData.access_token);
                if (authMessage) displayMessage(authMessage, '¡Inicio de sesion exitoso!');
                window.location.href = 'feed.html';
            } else {
                if (loginError) displayError(loginError, 'Respuesta de la API inesperada');
            }
        } catch (error){
            if (loginError) displayError(loginError, error.message);
        }
    });
}

if (logoutButton){
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = "index.html";
    });
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);