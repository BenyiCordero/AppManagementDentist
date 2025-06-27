// js/scriptMenu.js

// Función para abrir el menú lateral
function openNav(){
    // Ajusta este ancho al valor que desees para el menú abierto
    document.getElementById("sidebar").style.width = "300px";
}

// Función para cerrar el menú lateral
function closeNav(){
    document.getElementById("sidebar").style.width = "0";
}

// Función para resaltar el enlace de la página actual
function highlightCurrentPage(){
    const currentPagePath = window.location.pathname;
    // Extrae solo el nombre del archivo de la URL actual (ej. "feed.html", "citas.html")
    const currentFileName = currentPagePath.split('/').pop();

    // Asegúrate de que el sidebar exista antes de intentar manipular sus enlaces
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) {
        // console.log('Sidebar no encontrado todavía, esperando a que loadMenu.js lo cargue.');
        return; // Salir si el sidebar no está en el DOM. loadMenu.js llamará a esta función de nuevo.
    }

    // Selecciona todos los enlaces dentro del sidebar
    const sidebarLinks = sidebar.querySelectorAll('a');

    sidebarLinks.forEach(link => {
        // Ignorar el botón de cerrar al aplicar la clase 'active'
        if (link.id === 'closebtn-btn') {
            return; // Salta esta iteración (no aplica la clase 'active' al botón de cerrar)
        }

        // Extrae solo el nombre del archivo del atributo href del enlace
        const linkFileName = link.getAttribute('href').split('/').pop();

        // Compara el nombre del archivo actual con el nombre del archivo del enlace
        if (currentFileName === linkFileName) {
            link.classList.add('active'); // Añade la clase 'active'
        } else {
            link.classList.remove('active'); // Remueve la clase 'active' si no es la página actual
        }
    });
}

// Llama a la función highlightCurrentPage cuando el DOM esté completamente cargado.
// Aunque loadMenu.js también la llama, mantener esto aquí actúa como un respaldo
// y asegura que la función esté lista para ser llamada por loadMenu.js.
document.addEventListener('DOMContentLoaded', highlightCurrentPage);