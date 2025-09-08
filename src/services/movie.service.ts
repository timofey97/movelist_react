import { environment } from '../config/environment'
import { apiRoutes } from '../config/routes'
import type { Movie, MovieResponse } from '../types/movie'

export class MovieService {
  private apiKey = import.meta.env.VITE_TMDB_API_KEY || ''
  private baseUrl = environment.apiUrl
  private imageBaseUrl = environment.imageUrl

  async getPopularMovies(page: number = 1): Promise<Array<Movie>> {
    const response = await fetch(
      `${this.baseUrl}${apiRoutes.movies}?api_key=${this.apiKey}&page=${page}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: MovieResponse = await response.json()

    return data.results.map((movie) => ({
      ...movie,
      poster_path: movie.poster_path
        ? `${this.imageBaseUrl}${movie.poster_path}`
        : '',
    }))
  }

  async searchMoviesByGenres(
    genres: Array<number>,
    page: number = 1,
  ): Promise<Array<Movie>> {
    const genreString = genres.join(',')
    const response = await fetch(
      `${this.baseUrl}${apiRoutes.discover}?api_key=${this.apiKey}&with_genres=${genreString}&sort_by=popularity.desc&page=${page}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: MovieResponse = await response.json()

    return data.results.map((movie) => ({
      ...movie,
      poster_path: movie.poster_path
        ? `${this.imageBaseUrl}${movie.poster_path}`
        : '',
    }))
  }
}

export const movieService = new MovieService()
