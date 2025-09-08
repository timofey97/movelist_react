export interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  overview: string
}

export interface MovieResponse {
  page: number
  results: Array<Movie>
  total_pages: number
  total_results: number
}

export interface MoviePage {
  page: number
  results: Array<Movie>
}
