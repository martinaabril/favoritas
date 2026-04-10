const peliculasContainer = document.getElementById('peliculas');
const favoritosContainer = document.getElementById('favoritos');
const textoBusqueda = document.getElementById('textoBusqueda');
const botonBuscar = document.getElementById('botonBuscar');

const urlGhibli = 'https://ghibliapi.vercel.app/films';
let peliculas = []; // Guardamos todas las películas
let favoritos = []; // Guardamos favoritas

// Recuperar favoritas guardadas al cargar la página
const favoritosGuardados = localStorage.getItem('favoritos');
if (favoritosGuardados) {
    favoritos = JSON.parse(favoritosGuardados);
}

// Función para crear tarjeta de película
function crearCardPelicula(pelicula, esFavorita = false) {
    return `
    <div class="col">
        <div class="card h-100">
            <img src="${pelicula.image}" class="card-img-top" alt="${pelicula.title}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${pelicula.title}</h5>
                <p class="card-text">
                    <strong>Director:</strong> ${pelicula.director} <br>
                    <strong>Año:</strong> ${pelicula.release_date} <br>
                    <strong>Puntuación:</strong> ${pelicula.rt_score}
                </p>
                <div class="mt-auto">
                    ${
                        esFavorita
                        ? `<button class="btn btn-secondary w-100" onclick="eliminarFavorita('${pelicula.id}')">Quitar</button>`
                        : `<button class="btn btn-success w-100" onclick="guardarFavorita('${pelicula.id}')">Favorita</button>`
                    }
                </div>
            </div>
        </div>
    </div>
    `;
}

// Mostrar todas las películas
function mostrarPeliculas(lista) {
    peliculasContainer.innerHTML = "";
    if (lista.length === 0) {
        peliculasContainer.innerHTML = "<p>No se encontraron películas.</p>";
        return;
    }
    lista.forEach(pelicula => {
        peliculasContainer.innerHTML += crearCardPelicula(pelicula);
    });
}

// Mostrar favoritas en su sección
function mostrarFavoritos() {
    favoritosContainer.innerHTML = "";
    if (favoritos.length === 0) {
        favoritosContainer.innerHTML = "<p>No hay películas favoritas guardadas.</p>";
        return;
    }
    favoritos.forEach(pelicula => {
        favoritosContainer.innerHTML += crearCardPelicula(pelicula, true);
    });
}

// Cargar todas las películas desde la API
function cargarPeliculas() {
    fetch(urlGhibli)
        .then(res => res.json())
        .then(datos => {
            peliculas = datos;
            mostrarPeliculas(peliculas);
        })
        .catch(error => {
            peliculasContainer.innerHTML = "<p>Error al cargar las películas.</p>";
            console.error(error);
        });
}

// Buscar películas por título
function buscarPeliculas(termino) {
    const filtradas = peliculas.filter(p => 
        p.title.toLowerCase().includes(termino.toLowerCase())
    );
    mostrarPeliculas(filtradas);
}

// Guardar película como favorita
function guardarFavorita(id) {
    const pelicula = peliculas.find(p => p.id === id);
    if (!pelicula) return;

    // Evitar duplicados
    const yaExiste = favoritos.some(p => p.id === id);
    if (!yaExiste) {
        favoritos.push(pelicula);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        mostrarFavoritos();
    }
}

// Eliminar película de favoritas
function eliminarFavorita(id) {
    favoritos = favoritos.filter(p => p.id !== id);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
}

// Eventos
botonBuscar.addEventListener('click', () => {
    const termino = textoBusqueda.value.trim();
    buscarPeliculas(termino);
});

// Inicio: cargar películas y mostrar favoritas
cargarPeliculas();
mostrarFavoritos();