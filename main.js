const btnComenzar = document.getElementById('btnComenzar');
const inputNombre = document.getElementById('nombrePersona');
const h1Titulo = document.querySelector('h1');
const inputTarea = document.getElementById('tarea');
const btnAgregarTarea = document.getElementById('btnAgregar');
const listaPendientes = document.getElementById('pendientes-lista');
const listaRealizadas = document.getElementById('realizadas-lista');
const fechaActualElemento = document.getElementById('fecha-actual');
const btnSalir = document.getElementById('btnSalir');
const btnVaciarRealizadas = document.getElementById('btnVaciarRealizadas');

function mostrarFechaActual() {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();
    const fechaFormateada = `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${año}`;
    fechaActualElemento.textContent = `Fecha actual: ${fechaFormateada}`;
}

mostrarFechaActual();

function cargarTareas() {
    const pendientes = JSON.parse(localStorage.getItem('pendientes')) || [];
    const realizadas = JSON.parse(localStorage.getItem('realizadas')) || [];

    pendientes.forEach(tarea => {
        const nuevaTarea = document.createElement('li');
        nuevaTarea.textContent = tarea;
        listaPendientes.appendChild(nuevaTarea);
    });

    realizadas.forEach(tarea => {
        const nuevaTarea = document.createElement('li');
        nuevaTarea.textContent = tarea;
        listaRealizadas.appendChild(nuevaTarea);
    });
}

btnComenzar.addEventListener('click', function() {
    const nombre = inputNombre.value;
    if (nombre.trim() === '') {
        alert('Por favor, ingrese su nombre antes de comenzar.');
    } else {
        h1Titulo.innerText = `Lista de Tareas de ${nombre}`;
        inputNombre.style.display = 'none';
        btnComenzar.style.display = 'none';
        cargarTareas();
        localStorage.setItem('nombreUsuario', nombre);
    }
});

btnAgregarTarea.addEventListener('click', function() {
    const tarea = inputTarea.value;
    if (tarea.trim() === '') {
        alert('Por favor, ingrese una tarea antes de agregar.');
    } else {
        const nuevaTarea = document.createElement('li');
        nuevaTarea.textContent = tarea;
        listaPendientes.appendChild(nuevaTarea);
        const pendientes = JSON.parse(localStorage.getItem('pendientes')) || [];
        pendientes.push(tarea);
        localStorage.setItem('pendientes', JSON.stringify(pendientes));
    }
    inputTarea.value = '';
});

listaPendientes.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        listaRealizadas.appendChild(event.target);
        const realizadas = JSON.parse(localStorage.getItem('realizadas')) || [];
        realizadas.push(event.target.textContent);
        localStorage.setItem('realizadas', JSON.stringify(realizadas));
        const pendientes = JSON.parse(localStorage.getItem('pendientes')) || [];
        const index = pendientes.indexOf(event.target.textContent);
        if (index !== -1) {
            pendientes.splice(index, 1);
            localStorage.setItem('pendientes', JSON.stringify(pendientes));
        }
    }
});

btnSalir.addEventListener('click', function() {
    location.reload();
});

listaRealizadas.addEventListener('click', function(event) {
    if (event.target.tagName === 'LI') {
        listaPendientes.appendChild(event.target);
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        if (!nombreUsuario) {
            alert('Por favor, ingrese su nombre antes de marcar tareas como realizadas.');
            return;
        }
        const tareasRealizadas = JSON.parse(localStorage.getItem(nombreUsuario + '-realizadas')) || [];
        tareasRealizadas.push(event.target.textContent);
        localStorage.setItem(nombreUsuario + '-realizadas', JSON.stringify(tareasRealizadas));
        const tareasPendientes = JSON.parse(localStorage.getItem(nombreUsuario)) || [];
        const index = tareasPendientes.indexOf(event.target.textContent);
        if (index !== -1) {
            tareasPendientes.splice(index, 1);
            localStorage.setItem(nombreUsuario, JSON.stringify(tareasPendientes));
        }
    }
});

btnVaciarRealizadas.addEventListener('click', function() {
    listaRealizadas.innerHTML = '';
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    if (nombreUsuario) {
        localStorage.removeItem(nombreUsuario + '-realizadas');
    }
});