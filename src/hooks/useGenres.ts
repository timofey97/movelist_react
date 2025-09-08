import { useQuery } from '@tanstack/react-query'
import { genreService } from '../services/genre.service'

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => genreService.getGenres(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useGenreById = (id: number) => {
  return useQuery({
    queryKey: ['genre', id],
    queryFn: () => genreService.getGenreById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useGenresByIds = (ids: Array<number>) => {
  return useQuery({
    queryKey: ['genres', 'byIds', ids],
    queryFn: () => genreService.getGenresByIds(ids),
    enabled: ids.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
