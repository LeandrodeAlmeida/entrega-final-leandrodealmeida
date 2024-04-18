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
const btnCargarTareas = document.getElementById('btnCargarTareas');

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
    cargarLista('pendientes', listaPendientes);
    cargarLista('realizadas', listaRealizadas);
}

function cargarLista(tipo, lista) {
    const tareas = JSON.parse(localStorage.getItem(tipo)) || [];
    tareas.forEach(tarea => {
        const nuevaTarea = document.createElement('li');
        nuevaTarea.textContent = tarea;
        lista.appendChild(nuevaTarea);
    });
}

btnComenzar.addEventListener('click', function () {
    const nombre = inputNombre.value.trim();
    if (nombre === '') {
        swal('Error', 'Por favor, ingrese su nombre antes de comenzar.', 'error');
        return;
    }
    h1Titulo.innerText = `Lista de Tareas de ${nombre}`;
    inputNombre.style.display = 'none';
    btnComenzar.style.display = 'none';
    cargarTareas();
    localStorage.setItem('nombreUsuario', nombre);
});

btnAgregarTarea.addEventListener('click', function () {
    const tarea = inputTarea.value.trim();
    if (tarea === '') {
        swal('Error', 'Por favor, ingrese una tarea antes de agregar.', 'error');
        return;
    }
    const nuevaTarea = document.createElement('li');
    nuevaTarea.textContent = tarea;
    listaPendientes.appendChild(nuevaTarea);
    actualizarLocalStorage('pendientes', tarea);
    inputTarea.value = '';
});

function actualizarLocalStorage(tipo, tarea) {
    const tareas = JSON.parse(localStorage.getItem(tipo)) || [];
    tareas.push(tarea);
    localStorage.setItem(tipo, JSON.stringify(tareas));
}

btnSalir.addEventListener('click', function () {
    location.reload();
});

listaPendientes.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        moverTarea(event.target, listaPendientes, listaRealizadas, 'pendientes', 'realizadas');
    }
});

listaRealizadas.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        moverTarea(event.target, listaRealizadas, listaPendientes, 'realizadas', 'pendientes');
    }
});

function moverTarea(tarea, listaOrigen, listaDestino, tipoOrigen, tipoDestino) {
    listaDestino.appendChild(tarea);
    const textoTarea = tarea.textContent;
    actualizarLocalStorage(tipoDestino, textoTarea);
    eliminarTareaLocalStorage(tipoOrigen, textoTarea);
}

function eliminarTareaLocalStorage(tipo, tarea) {
    const tareas = JSON.parse(localStorage.getItem(tipo)) || [];
    const index = tareas.indexOf(tarea);
    if (index !== -1) {
        tareas.splice(index, 1);
        localStorage.setItem(tipo, JSON.stringify(tareas));
    }
}

btnVaciarRealizadas.addEventListener('click', function () {
    listaRealizadas.innerHTML = '';
    localStorage.removeItem('realizadas');
    swal('Listo', 'Realizadas han sido vaciadas.', 'success');
});

btnCargarTareas.addEventListener('click', function () {
    fetch('tareas.json')
        .then(response => response.json())
        .then(data => {
            listaPendientes.innerHTML = '';
            listaRealizadas.innerHTML = '';
            data.forEach(tarea => {
                const nuevaTarea = document.createElement('li');
                nuevaTarea.textContent = tarea.nombre;
                if (tarea.estado === 'pendiente') {
                    listaPendientes.appendChild(nuevaTarea);
                } else if (tarea.estado === 'realizada') {
                    listaRealizadas.appendChild(nuevaTarea);
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar las tareas:', error);
            swal('Error', 'Ocurrió un error al cargar las tareas.', 'error');
        });
});

class Tarea {
    constructor(nombre, estado) {
        this.nombre = nombre;
        this.estado = estado;
    }
}

cargarTareas();