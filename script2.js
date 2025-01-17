//Get the elements
const movieList = document.getElementById('movie-list');
const genreSelect = document.getElementById('genre-select');
const yearSelect = document.getElementById('year-select');
const ratingSelect = document.getElementById('rating-select');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');


const apiUrl = 'https://api.themoviedb.org/3/movie/popular'; // Movies API
const genresApiUrl = 'https://api.themoviedb.org/3/genre/movie/list'; // Genres API
const baseUrl = 'https://image.tmdb.org/t/p/w500';
const TMDB_API_KEY = '01a62047674fade0ecd7a6e2158cc945';


let movies = []; // Store all movies for filtering
let genres = []; // Store genres

// Fetch genres and populate the genre dropdown
const fetchGenres = async () => {
    try {
        const response = await fetch(`${genresApiUrl}?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch genres');
        }

        const data = await response.json();
        genres = data.genres;
        console.log(genres); // Log genres to check the structure
        populateGenreSelect(genres);
    } catch (error) {
        console.error('ERROR:', error);
    }
};

const populateGenreSelect = (genres) => {
    genres.forEach((genre) => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
};

// Fetch movies and store in the `movies` array
const fetchMovies = async () => {
    try {
        const responsePage1 = await fetch(`${apiUrl}?api_key=${TMDB_API_KEY}&page=1&limit=20`);
        const responsePage2 = await fetch(`${apiUrl}?api_key=${TMDB_API_KEY}&page=2&limit=20`);


        //const response = await fetch(apiUrl);
        if (!responsePage1.ok || !responsePage2.ok) {
            throw new Error('Failed to fetch movies');
        }

        const dataPage1 = await responsePage1.json();
        const dataPage2 = await responsePage2.json();

        movies = [...dataPage1.results,...dataPage2.results];
        console.log(movies);
        displayMovies(movies); //display initially fetched movies
        //movies = data.results;
        //console.log(movies);
        //console.log(data);
        //displayMovies(movies);
    } catch (error) {
        console.error('ERROR:', error);
        movieList.innerHTML = '<p>Failed to fetch movies.</p>';
    }
};

// Display movies on the page
const displayMovies = (moviesToDisplay) => {
    movieList.innerHTML = '';
    moviesToDisplay.forEach((movie) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie');
        movieCard.innerHTML = `
            <div class="movie-card">
                <img src="${baseUrl}${movie.poster_path}" alt="${movie.title}" style="width: 150px; height: auto;">
                <h3>${movie.title}</h3>
                <p>Rating: ${movie.vote_average}</p>
                <p>Release Year: ${movie.release_date.slice(0, 4)}</p>
            </div>
        `;
        movieList.appendChild(movieCard);
    });
};

// Filter movies based on the selected criteria
const filterMovies = () => {
    const selectedGenreId = parseInt(genreSelect.value);
    const selectedYear = yearSelect.value;
    const selectedRating = ratingSelect.value;

    const filteredMovies = movies.filter((movie) => {
        const matchesGenre = selectedGenreId
            ? movie.genre_ids.includes(selectedGenreId)
            : true;
        const matchesYear = selectedYear
            ? parseInt(movie.release_date.slice(0, 4)) >= parseInt(selectedYear)
            : true;
        const matchesRating = selectedRating
            ? movie.vote_average >= parseFloat(selectedRating)
            : true;

        return matchesGenre && matchesYear && matchesRating;
    });

    displayMovies(filteredMovies);
};

const searchMovies = async () => {
    const query = searchInput.value.trim();
    if(query === '') {
        displayMovies(movies);
        return;
    }

    try{
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`;
        const response = await fetch(searchUrl);

        if(!response.ok) {
            throw new Error('failed to search movie');
        }

        const data = await response.json();
        displayMovies(data.results);
    } catch(error) {
        console.error('ERROR:', error);
        movieList.innerHTML = '<p>Failed to search movies.</p>';
    }

}

// Event listeners for filters
genreSelect.addEventListener('change', filterMovies);
yearSelect.addEventListener('change', filterMovies);
ratingSelect.addEventListener('change', filterMovies);
searchBtn.addEventListener('click', searchMovies);

// Initialize
fetchGenres();
fetchMovies();
