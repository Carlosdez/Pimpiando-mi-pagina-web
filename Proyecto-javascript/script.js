// === CONTADOR ANIMADO ===
function animarContador(elemento, inicio, fin, duracion) {
  let inicioTiempo = null;
  function animacion(timestamp) {
    if (!inicioTiempo) inicioTiempo = timestamp;
    let progreso = timestamp - inicioTiempo;
    let porcentaje = Math.min(progreso / duracion, 1);
    let valorActual = Math.floor(inicio + (fin - inicio) * porcentaje);
    elemento.textContent = valorActual.toLocaleString("es-ES");
    if (porcentaje < 1) requestAnimationFrame(animacion);
  }
  requestAnimationFrame(animacion);
}
animarContador(document.getElementById("contador"), 0, 165, 2000);

// === SWITCH + IF-ELSE + ARRAYS ===
const tiposGlobos = ["Metálico", "Helio", "Personalizado", "Decorativo"];
const precios = [200, 250, 300, 180];

function obtenerPrecio(tipo) {
  let precio;
  switch (tipo) {
    case "metalico": precio = precios[0]; break;
    case "helio": precio = precios[1]; break;
    case "personalizado": precio = precios[2]; break;
    case "decorativo": precio = precios[3]; break;
    default: precio = 0;
  }
  return precio;
}

// === FORMULARIO Y LOCALSTORAGE ===
const form = document.getElementById('pedidoForm');
const listaPedidos = document.getElementById('pedidos');
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

function mostrarPedidos() {
  listaPedidos.innerHTML = "";
  pedidos.forEach(p => {
    let li = document.createElement('li');
    li.textContent = `👤 ${p.nombre} | ${p.tipo} | 💲${p.precio} | 📝 ${p.mensaje}`;
    listaPedidos.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const tipoSeleccionado = document.getElementById('tipo').value;
  const precioSeleccionado = obtenerPrecio(tipoSeleccionado);

  if (precioSeleccionado > 0) {
    let pedido = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      mensaje: document.getElementById('mensaje').value,
      tipo: tiposGlobos[["metalico","helio","personalizado","decorativo"].indexOf(tipoSeleccionado)],
      precio: precioSeleccionado
    };
    pedidos.push(pedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    form.reset();
    mostrarPedidos();
    alert(`🎈 Pedido agregado: Globo ${pedido.tipo} - Precio: $${pedido.precio}`);
  } else {
    alert("Por favor selecciona un tipo de globo válido.");
  }
});

mostrarPedidos();

// === MAPA CON LEAFLET ===
var mapa = L.map('mapa').setView([18.4791, -69.8923], 17);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(mapa);

L.marker([18.4791, -69.8923]).addTo(mapa)
  .bindPopup('<b>Globos La Fiesta 🎈</b><br>📍 Av. Duarte, Barrio Chino, Santo Domingo')
  .openPopup();
