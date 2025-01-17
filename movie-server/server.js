import express, { json } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5002;


app.use(cors());
app.use(json());


const TMDB_API_KEY = '01a62047674fade0ecd7a6e2158cc945';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

app.get('/movies/popular', async (req, res) => {
    try{
        const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        if(!response.ok) {
            throw new Error(data.status_message || 'Failed to fetch');
        }

        res.json(data); //send the api response back to the frontend
    } catch(error) {
        console.error('ERROR:',error.message);
        res.status(500).json({ error: 'failed to fetch movies.'});
    }
});

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});

