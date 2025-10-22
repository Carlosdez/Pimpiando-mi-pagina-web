/**
 * GLOBOS LA FIESTA 2.0 - APLICACIÓN DE PÁGINA ÚNICA (SPA)
 * Implementa Map, Array, switch, if, for, while, y estética mejorada.
 * Se ha separado la lógica de Contacto y Ubicación.
 */

// **********************************************
// 1. ESTRUCTURAS DE DATOS Y CONFIGURACIÓN
// **********************************************

// Referencias del DOM
const APP_CONTENT = document.getElementById('contenido'); // Coincide con <main id="contenido">
const MAIN_NAV = document.querySelector('nav'); // Coincide con <nav>

// ARRAY: Lista de productos/imágenes (Datos para el bucle FOR)
const PRODUCTOS_IMAGENES = [
    { src: "Tienda-London.jpg", alt: "Foto de la tienda con globos decorativos" },
    { src: "Globos-Arreglos.jpg", alt: "Arreglos de globos de colores" },
    { src: "Globos-Cumpleaños.jpg", alt: "Decoración con globos para cumpleaños" },
    { src: "diseñosdeglobos.jpg", alt: "Diseños de globos caricaturescos" },
    { src: "Cumpleaños.jpg", alt: "Arreglos de globos para fiestas de cumpleaños" }
];

// ARRAYS: Tipos de globos y precios para el formulario
const tiposGlobos = ["Metálico", "Helio", "Personalizado", "Decorativo"];
const precios = [200, 250, 300, 180];
const tipoKeys = ["metalico", "helio", "personalizado", "decorativo"];

// MAP: Almacena el HTML de las secciones (Clave de la SPA)
const SECCIONES_PLANTILLAS = new Map();

// **********************************************
// 2. FUNCIONES DE GENERACIÓN DE CONTENIDO
// **********************************************

/**
 * Genera dinámicamente el HTML para la sección de productos (USA FOR y WHILE).
 * @returns {string} HTML de la sección de productos.
 */
function generarProductosHTML() {
    let html = '<section><h2>Nuestros Productos</h2>';
    html += '<div class="productos">';
    
    // BUCLE FOR: Itera sobre el ARRAY de imágenes para generar las tarjetas estéticas
    for (let i = 0; i < PRODUCTOS_IMAGENES.length; i++) {
        html += `<div class="producto-card">`;
        html += `<img src="${PRODUCTOS_IMAGENES[i].src}" alt="${PRODUCTOS_IMAGENES[i].alt}">`;
        html += `<p>${PRODUCTOS_IMAGENES[i].alt}</p>`;
        html += `</div>`;
    }
    
    html += '</div>';
    
    // Contenido dinámico para el contador
    html += `<div class="contador">
               Hemos decorado a <span id="contador">0</span> fiestas este mes 🎉
             </div>`;
             
    // BUCLE WHILE: Se usa para añadir un aviso de promoción
    let avisoCount = 0;
    while (avisoCount < 1) {
        html += '<p style="text-align:center; font-style:italic; margin-top: 1rem;">✨ ¡Personaliza tu fiesta con nuestros diseños exclusivos!</p>';
        avisoCount++;
    }
    
    html += '</section>';
    return html;
}

// Llenar el MAP con las plantillas
SECCIONES_PLANTILLAS.set('inicio', generarProductosHTML());

SECCIONES_PLANTILLAS.set('pedidos', `
    <section>
    <h2>Haz tu pedido</h2>
    <form id="pedidoForm">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" required>
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" required>
        <label for="mensaje">Escribe tu pedido o consulta:</label>
        <textarea id="mensaje" rows="5" required></textarea>

        <label for="tipo">Selecciona un tipo de globo:</label>
        <select id="tipo">
            <option value="metalico">Metálico</option>
            <option value="helio">Helio</option>
            <option value="personalizado">Personalizado</option>
            <option value="decorativo">Decorativo</option>
        </select>

        <button type="submit">Enviar Pedido</button>
    </form>
    <div id="lista-pedidos">
        <h3>📋 Pedidos guardados:</h3>
        <ul id="pedidos"></ul>
    </div>
    </section>
`);

// SECCIÓN CONTACTO: Solo redes sociales (sin mapa)
SECCIONES_PLANTILLAS.set('contacto', `
    <section>
        <h2>Contáctanos</h2>
        <p>Síguenos en nuestras redes o escríbenos por WhatsApp:</p>
        <div class="redes">
            <a href="https://www.facebook.com/DobleRComercial/?locale=es_LA" target="_blank" aria-label="Facebook">
              <i class="fab fa-facebook fa-2x"></i>
            </a>
            <a href="https://www.instagram.com/doblercomercialrd/?hl=es" target="_blank" aria-label="Instagram">
              <i class="fab fa-instagram fa-2x"></i>
            </a>
            <a href="https://wa.me/18096823049" target="_blank" aria-label="WhatsApp">
              <i class="fab fa-whatsapp fa-2x"></i>
            </a>
        </div>
    </section>
`);

// SECCIÓN UBICACIÓN: Solo mapa (con su propio título)
SECCIONES_PLANTILLAS.set('ubicacion', `
    <section>
        <h2>Encuéntranos / Ubicación</h2>
        <p>Visítanos en nuestra ubicación principal:</p>
        <div id="mapa"></div> 
    </section>
`);


// **********************************************
// 3. FUNCIONES AUXILIARES (Refactorizadas para la SPA)
// **********************************************

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

// === LÓGICA DE PRECIOS (SWITCH) ===
function obtenerPrecio(tipo) {
  let precio;
  // ESTRUCTURA SWITCH: Determina el precio según el tipo de globo
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
function mostrarPedidos(listaPedidos, pedidos) {
  listaPedidos.innerHTML = "";
  // USO IMPLÍCITO DE BUCLE (forEach) para generar contenido
  pedidos.forEach(p => { 
    let li = document.createElement('li');
    li.textContent = `👤 ${p.nombre} | ${p.tipo} | 💲${p.precio} | 📝 ${p.mensaje}`;
    listaPedidos.appendChild(li);
  });
}

function inicializarFormulario() {
    const form = document.getElementById('pedidoForm');
    const listaPedidos = document.getElementById('pedidos');
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    form.addEventListener('submit', e => {
      e.preventDefault();
      const tipoSeleccionado = document.getElementById('tipo').value;
      const precioSeleccionado = obtenerPrecio(tipoSeleccionado);

      // ESTRUCTURA IF-ELSE: Validación del formulario
      if (precioSeleccionado > 0) {
        let pedido = {
          nombre: document.getElementById('nombre').value,
          email: document.getElementById('email').value,
          mensaje: document.getElementById('mensaje').value,
          // Busca el nombre del tipo de globo usando el índice
          tipo: tiposGlobos[tipoKeys.indexOf(tipoSeleccionado)], 
          precio: precioSeleccionado
        };
        pedidos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        form.reset();
        mostrarPedidos(listaPedidos, pedidos);
        alert(`🎈 Pedido agregado: Globo ${pedido.tipo} - Precio: $${pedido.precio}`);
      } else {
        alert("Por favor selecciona un tipo de globo válido.");
      }
    });

    mostrarPedidos(listaPedidos, pedidos); // Mostrar pedidos al cargar la sección
}

// === MAPA CON LEAFLET ===
function inicializarMapa() {
    // Se inicializa el mapa solo cuando el elemento #mapa ha sido inyectado en el DOM
    var mapa = L.map('mapa').setView([18.4791, -69.8923], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapa);

    L.marker([18.4791, -69.8923]).addTo(mapa)
      .bindPopup('<b>Globos La Fiesta 🎈</b><br>📍 Av. Duarte, Barrio Chino, Santo Domingo')
      .openPopup();
}

// **********************************************
// 4. LÓGICA DE NAVEGACIÓN PRINCIPAL (SPA)
// **********************************************

/**
 * Carga el contenido de la sección seleccionada y ejecuta funciones específicas.
 * @param {string} section - La clave de la sección a cargar.
 */
function navigateTo(section) {
    // ESTRUCTURA IF: Manejo de errores (Sección no encontrada)
    if (!SECCIONES_PLANTILLAS.has(section)) {
        APP_CONTENT.innerHTML = '<h2>404 - Página no encontrada</h2><p>La sección solicitada no existe.</p>';
        return;
    }

    // 1. Inyectar el HTML de la sección activa
    APP_CONTENT.innerHTML = SECCIONES_PLANTILLAS.get(section);
    
    // 2. Marcar el botón de navegación como activo
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`nav button[data-seccion="${section}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // 3. ESTRUCTURA SWITCH: Inicializar funcionalidades específicas
    switch (section) {
        case 'inicio':
            // Inicializar el contador animado
            const contadorElement = document.getElementById("contador");
            if(contadorElement) {
                animarContador(contadorElement, 0, 165, 2000);
            }
            break;
            
        case 'pedidos':
            // Reinicializar el formulario y sus listeners/LocalStorage
            inicializarFormulario(); 
            break;
            
        case 'ubicacion':
            // ¡AHORA EL MAPA SE INICIALIZA SOLO EN UBICACIÓN!
            inicializarMapa();
            break;
            
        case 'contacto':
            // No hay lógica JS adicional para el HTML de redes sociales
            break;
    }
}


// **********************************************
// 5. INICIALIZACIÓN DE LA APLICACIÓN
// **********************************************

// Event Listener en la barra de navegación para cambiar secciones
MAIN_NAV.addEventListener('click', (e) => {
    // Solo procesa clics en botones con el atributo data-seccion
    if (e.target.tagName === 'BUTTON' && e.target.dataset.seccion) {
        e.preventDefault(); 
        const section = e.target.dataset.seccion;
        navigateTo(section);
    }
});


// Cargar la sección 'inicio' por defecto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('inicio'); 
});
