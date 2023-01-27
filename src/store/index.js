import {
    configureStore, createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit"
import { TMBD_BASE_URL, API_KEY } from "../utils/constants"
import axios from "axios"

const initialState = {
    movies: [],
    genresLoaded: false,
    genres: [],
}

const createArrayFromRawData = (array, moviesArray, genres) => {
    array.forEach((movie) => {
        const movieGenres = []
        movie.genre_ids.forEach((genre) => {
            const name = genres.find(({ id }) => id === genre)
            if (name) movieGenres.push(name.name)
        })
        if (movie.backdrop_path) {
            moviesArray.push({
                id: movie.id,
                name: movie?.original_name ? movie.original_name : movie.original_title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),
            })
        }
    })
}

export const getGenres = createAsyncThunk("netflix/genres", async () => {
    const {
        data:
        { genres },
    } = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=f52e962ed7eca48de25c5b97164b7c48"

        //`${TMBD_BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    )
    return genres
})
const getRawData = async (api, genres, paging) => {
    const moviesArray = []
    for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
        const {
            data: { results },
        } = await axios.get(`${api}${paging ? `&page=${i}` : ""}`)
        createArrayFromRawData(results, moviesArray, genres)
    }
    return moviesArray
}

export const fetchDataByGenre = createAsyncThunk(
    "netflix/genre",
    async ({ genre, type }, thunkAPI) => {
        const {
            netflix: { genres },
        } = thunkAPI.getState();
        return getRawData(
            //`${TMBD_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
            `https://api.themoviedb.org/3/discover/${type}?api_key=f52e962ed7eca48de25c5b97164b7c48&with_genres=${genre}`,
            genres
        );
    }
);

export const fetchMovies = createAsyncThunk(
    "netflix/trending",
    async ({ type }, thunkApi) => {
        const {
            netflix: { genres },
        } = thunkApi.getState()
        return getRawData(
            `${TMBD_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
            genres,
            true
        )

    }
)

export const getUserLikedMovies = createAsyncThunk(
    "netflix/getLiked", async (email) => {
        const { data:
            { movies }
        } =
            await axios.get(`http://localhost:5000/api/user/liked${email}`)
        return movies
    })

const NetflixSlice = createSlice({
    name: "Netflix",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getGenres.fulfilled, (state, action) => {
            state.genres = action.payload
            state.genresLoaded = true
        })
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.movies = action.payload
        })
        builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
            state.movies = action.payload;
        })
        builder.addCase(getUserLikedMovies.fulfilled, (state, action) => {
            state.movies = action.payload;
        })
    },
})

export const store = configureStore({
    reducer: {
        netflix: NetflixSlice.reducer,
    },
})