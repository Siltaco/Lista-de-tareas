function cargarTareas() {
  const tareasGuardadas = localStorage.getItem('tareas');
  if (!tareasGuardadas) {
    return [];
  }
  return JSON.parse(tareasGuardadas);
}

function mostrarTareas(tareas) {
  const contenedor = document.getElementById('lista-tareas');
  contenedor.innerHTML = '';

  tareas.forEach(tarea => {
    const tareaDiv = document.createElement('div');
    tareaDiv.classList.add('tarea');

    tareaDiv.innerHTML = `
      <div class="fila">
        <div>${tarea.titulo}</div>
        <div>${tarea.fecha}</div>
      </div>
      <div class="descripcion-tarea">${tarea.descripcion}</div>
      <div>${tarea.nombre}</div>
      <div class="fila-boton">
        <button class="editar-boton">Editar</button>
        <button class="borrar-boton">Borrar</button>
      </div>
    `;

    contenedor.appendChild(tareaDiv);
  });
}
