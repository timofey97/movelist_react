import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { movieService } from '../services/movie.service'

export const usePopularMovies = (page: number) => {
  return useQuery({
    queryKey: ['movies', 'popular', page],
    queryFn: () => movieService.getPopularMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useMoviesByGenres = (genres: Array<number>, page: number) => {
  return useQuery({
    queryKey: ['movies', 'genres', genres, page],
    queryFn: () => movieService.searchMoviesByGenres(genres, page),
    enabled: genres.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useInfiniteMovies = (genres: Array<number> = []) => {
  return useInfiniteQuery({
    queryKey: ['movies', 'infinite', genres],
    queryFn: ({ pageParam = 1 }) =>
      genres.length > 0
        ? movieService.searchMoviesByGenres(genres, pageParam)
        : movieService.getPopularMovies(pageParam),
    getNextPageParam: (lastPage, pages) => {
      // Return next page number if we have results, otherwise undefined to stop
      return lastPage.length === 20 ? pages.length + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
