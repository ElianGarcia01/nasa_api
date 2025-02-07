
// Seleccion de elementos del DOM para trabajar con ellos a traves de javascript
let contenedorTarjetas = document.getElementById("contenedorTarjetas") // Seleccion del contendor de tarjetas en el DOM
let buscarTexto = document.getElementById("buscarTexto") // Seleccion del elemento en el DOM con el id=buscarTexto
let filtroFecha = document.getElementById("filtroFecha")
let filtroMedia = document.getElementById("filtroMedia")
const apiKey = 'pSDNoJHIUc7nmlEu3qpE1jTg2mCHOt75KBdRzafy' // Reemplázar con la clave de la API de la NASA
const gallery = document.getElementById('gallery')
const favoritesModal = document.getElementById('myModal')
const favoritesGallery = document.getElementById('favoritesGallery')
const openFavoritesBtn = document.getElementById('myBtn')
const closeModalBtn = document.querySelector('.close')

// Variables Universales
let eventos = []


// Función para obtener datos de la API de la NASA
async function cargarDatos() {
    
    // Clave de acceso a la API de la NASA (necesaria para hacer solicitudes)
    const apiKey = "pSDNoJHIUc7nmlEu3qpE1jTg2mCHOt75KBdRzafy"

    // URL de la API con la clave incluida y la cantidad de imágenes a obtener (9 en este caso)
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=9`

    // Hacer la solicitud a la API con la funcion fetch y esperar la respuesta
    const response = await fetch(url)

    // Convertir la respuesta a formato JSON (un formato de datos que se puede usar con JavaScript)
    eventos = await response.json()

    // Guardar los datos obtenidos en el almacenamiento local del navegador (localStorage)
    // Esto permite que los datos se guarden temporalmente en la computadora del usuario
    localStorage.setItem('eventosNASA', JSON.stringify(eventos))

    // Llamar a la función que muestra graficamente los datos obtenidos de la API (en este caso en forma de tarjetas)
    mostrarTarjetas(eventos, contenedorTarjetas);
}

// Funcion para mostrar los datos obtenidos de la API en formato de tarjetas
function mostrarTarjetas(arreglo, contenedor) {
    contenedor.innerHTML = ''

    if (arreglo.length === 0) {
        const mensaje = document.createElement('div')
        mensaje.className = 'text-center text-light fs-5'
        mensaje.innerText = 'No se encontraron coincidencias. Prueba con otra busqueda'
        contenedor.appendChild(mensaje)
    }

    arreglo.forEach(item => {
        contenedor.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card p-2">
                    <img src="${item.url}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p>Date: ${item.date}</p>
                        <p class="media-type">Media type: ${item.media_type}</p>
                        <button class="btn btn-fav" onclick="addToFavorites('${item.url}', '${item.title}')">❤</button>
                        <a href="./details.html?id=${item.date}" class="btn btn-info">Details</a>                    
                    </div>
                </div>
            </div>
        `
    })
}

// Funcion para filtrar los eventos según los criterios ingresados
function filtrarEventos() {

    // Declarar las variables con lo valores ingresados por el usuario en el html
    let texto = buscarTexto.value.toLowerCase()
    let fecha = filtroFecha.value
    let tipoMedia = filtroMedia.value

    let eventosFiltrados = eventos.filter(evento => {
        let coincideTexto = evento.title.toLowerCase().includes(texto)
        let coincideFecha = fecha === "" || evento.date === fecha
        let coincideMedia = tipoMedia === "" || evento.media_type === tipoMedia

        return coincideTexto && coincideFecha && coincideMedia
    })
    mostrarTarjetas(eventosFiltrados, contenedorTarjetas)
}

//Agregar tarjetas a a la seccion de favoritos, y esta seccion se guardara temporalmente en el localStorage
function addToFavorites(url, title) {
    if (!favorites.some(fav => fav.url === url)) {
        favorites.push({ url, title })
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}

// Recuperar las tarjetas de favoritos que se guardaron en el localStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || []

// Funcion para mostrar el contenido del Modal de Favoritos
function showFavorites() {
    favoritesGallery.innerHTML = '' // Limpia la galería de favoritos

    if (favorites.length === 0) {
        // Si no hay favoritos, mostrar un mensaje
        favoritesGallery.innerHTML = `<p class="text-center text-black fs-5">No hay elementos agregados en favoritos.</p>`;
    } else {
        favorites.forEach(fav => {
            const card = document.createElement('div')
            card.classList.add('card')
            card.innerHTML = `
                <img src="${fav.url}" alt="${fav.title}">
                <p>${fav.title}</p>
                <button onclick="removeFromFavorites('${fav.url}')">Eliminar</button>
            `
            favoritesGallery.appendChild(card)
        })
    }

    favoritesModal.style.display = 'block' // Muestra el Modal
}


//Funcion para eliminar tarjetas de favoritos
function removeFromFavorites(url) {
    favorites = favorites.filter(fav => fav.url !== url) // Filtra la lista, eliminando la imagen seleccionada
    localStorage.setItem('favorites', JSON.stringify(favorites)) // Actualiza el localStorage
    showFavorites() // Vuelve a mostrar los favoritos actualizados
}

// Eventos para los filtros y evento para mostrar la informacion al cargar la pagina
window.addEventListener('load', cargarDatos) // Al cargar el evento load en window (cargar pagina), se hace el llamado a la funcion cargarDatos
buscarTexto.addEventListener('input', filtrarEventos)
filtroFecha.addEventListener('input', filtrarEventos)
filtroMedia.addEventListener('change', filtrarEventos)

// Eventos para mostrar y ocultar el Modal
openFavoritesBtn.addEventListener('click', showFavorites)
closeModalBtn.addEventListener('click', () => favoritesModal.style.display = 'none')
window.addEventListener('click', (e) => {
    if (e.target === favoritesModal) {
        favoritesModal.style.display = 'none'
    }
})