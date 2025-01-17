const movieList = document.getElementById('movie-list');
const genreSelect = document.getElementById('genre-select');
const yearSelect = document.getElementById('year-select');
const ratingSelect = document.getElementById('rating-select');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

const apiUrl = 'https://api.themoviedb.org/3/movie/popular';
const genresApiUrl = 'https://api.themoviedb.org/3/genre/movie/list'
const TMDB_API_KEY = '01a62047674fade0ecd7a6e2158cc945';
const baseUrl = 'https://image.tmdb.org/t/p/w500';

let movies = []; //stores the movies
let genres = []; //stores genres

const fetchGenres = async () => {
    try{
        const response = await fetch(`${genresApiUrl}?api_key=${TMDB_API_KEY}`);

        if(!response.ok) {
            throw new Error('ERROR:',error);
        }

        const data = await response.json();
        genres = data.genres;
        console.log(genres);
        populateGenreSelect(genres);
    } catch(error) {
        console.error('err',error);
    }
};

function populateGenreSelect(genres) {
    genres.forEach((genre) => {
        const option = document.createElement('option');
        option.id = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    })
};



const fetchMovies = async ()  => {
    try{
        const response = await fetch(`${apiUrl}?api_key=${TMDB_API_KEY}`);

        if(!response.ok) {
            throw new Error('Failed to fetch movies.');
        }

        const data = await response.json();
        movies = data.results;
        console.log(movies);
        console.log(data);
        displayMovies(movies);
    } catch(error) {
        console.error('error',error);
    }
};

function displayMovies(moviesToDisplay) {
    movieList.innerHTML = '';

    moviesToDisplay.forEach((movie) => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
         <div class="movie-card">
            <img src="${baseUrl}${movie.poster_path}" alt="${movie.title}" style="width: 100px; height: auto;">
            <h3>${movie.title}</h3>
            <p>Rating: ${movie.vote_average}</p>
            <p>Release Year: ${movie.release_date.slice(0,4)}</p>
         </div>
        `;
        movieList.appendChild(movieDiv);
    })
};

const filterMovies = () => {
    const selectedGenreId = parseInt(genreSelect.value);
    const selectedYear = yearSelect.value;
    const selectedRating = ratingSelect.value;

    const filteredMovies = movies.filter((movie) => {
        const matchesGenre = selectedGenreId ? movie.genre_ids.includes(selectedGenreId) : true;
        const matchesYear = selectedYear ? parseInt(movie.release_date.slice(0,4)) >= parseInt(selectedYear) : true;
        const matchesRating = selectedRating ? movie.vote_average >= parseFloat(selectedRating) : true;

        return matchesGenre && matchesYear && matchesRating
    });
    displayMovies(filteredMovies);
};

const searchMovies = async () => {
    const query = searchInput.value.trim();

    try{
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`;
        const response = await fetch(searchUrl);
        if(!response.ok) {
            throw new Error('ERROR:',error);
        }

        const data = await response.json();
        displayMovies(data.results);
    } catch(error) {
        console.error('error',error);
    }
}

genreSelect.addEventListener('change',filterMovies);
yearSelect.addEventListener('change',filterMovies);
ratingSelect.addEventListener('change',filterMovies);
searchBtn.addEventListener('click',searchMovies);


fetchGenres();
fetchMovies();