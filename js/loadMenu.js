//js/loadMenu.js
document.addEventListener('DOMContentLoaded', function(){
    fetch('menu-sidebar.html')
        .then(response => {
            if(!response.ok){
                throw new Error('Error al cargar el menu ' +response.statusText + ' (' + response.status + ')');
            }
            return response.text();
        })
        .then(html => {
            const menuContainer = document.getElementById('menu-placeholder');
            if (menuContainer) {
                menuContainer.innerHTML = html;
                if (typeof highlightCurrentPage === 'function'){
                    highlightCurrentPage();
                } else {
                    console.warn('Error en la funcion high');
                }
            } else {
                console.error('No se encontro el place-holder');
            }
        })
        .catch(error => console.error('Error en el fetch'));
});