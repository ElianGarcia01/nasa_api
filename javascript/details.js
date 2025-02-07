function cargarDetalles() {
    const urlParams = new URLSearchParams(window.location.search)
    const eventoID = urlParams.get('id')
    const eventos = JSON.parse(localStorage.getItem('eventosNASA')) || []
    const item = eventos.find(a => a.date === eventoID)

    if (!item) {
        document.getElementById('details-contenedor').innerHTML = `
            <div class="text-center">
                <p>No se encontraron detalles para este evento.</p>
                <a href="index.html" class="btn-back">Back to Events</a>
            </div>
        `
        return
    }

    document.getElementById('details-contenedor').innerHTML = `
        <div class="card p-3">
            <img src="${item.url}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Media type:</strong> ${item.media_type}</p>
                <button class="btn btn-fav" onclick="addToFavorites('${item.url}', '${item.title}')">❤</button>
                <a href="index.html" class="btn-back">Back to Events</a>
            </div>
        </div>
    `;
}

// Recuperar favoritos del LocalStorage
let favorites = JSON.parse(localStorage.getItem('favorites')) || []

//Agregar imagenes a favoritos
function addToFavorites(url, title) {
    if (!favorites.some(fav => fav.url === url)) {
        favorites.push({ url, title })
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}

document.addEventListener('DOMContentLoaded', cargarDetalles)