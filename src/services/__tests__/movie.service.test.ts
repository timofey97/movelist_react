import { vi } from 'vitest'

import { movieService } from '../movie.service'

// Mock fetch
global.fetch = vi.fn() as unknown as typeof fetch

describe('MovieService', () => {
  beforeEach(() => {
    ;(fetch as unknown as ReturnType<typeof vi.fn>).mockClear()
  })

  describe('getPopularMovies', () => {
    it('should fetch popular movies and transform poster paths', async () => {
      const mockResponse = {
        results: [
          {
            id: 1,
            title: 'Test Movie',
            poster_path: '/test-poster.jpg',
            vote_average: 8.5,
            release_date: '2023-01-01',
            overview: 'Test overview',
          },
        ],
      }

      ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await movieService.getPopularMovies(1)

      expect(fetch).toHaveBeenCalledTimes(1)
      const calledUrl = (fetch as unknown as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as string
      expect(calledUrl).toMatch(
        /^https:\/\/api\.themoviedb\.org\/3\/movie\/popular\?api_key=.*&page=1$/,
      )
      expect(result).toEqual([
        {
          id: 1,
          title: 'Test Movie',
          poster_path: 'https://image.tmdb.org/t/p/w500/test-poster.jpg',
          vote_average: 8.5,
          release_date: '2023-01-01',
          overview: 'Test overview',
        },
      ])
    })

    it('should handle movies without poster paths', async () => {
      const mockResponse = {
        results: [
          {
            id: 1,
            title: 'Test Movie',
            poster_path: null,
            vote_average: 8.5,
            release_date: '2023-01-01',
            overview: 'Test overview',
          },
        ],
      }

      ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await movieService.getPopularMovies(1)

      expect(result[0].poster_path).toBe('')
    })

    it('should throw error on failed request', async () => {
      ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(movieService.getPopularMovies(1)).rejects.toThrow(
        'HTTP error! status: 404',
      )
    })
  })

  describe('searchMoviesByGenres', () => {
    it('should search movies by genres with correct parameters', async () => {
      const mockResponse = {
        results: [
          {
            id: 1,
            title: 'Action Movie',
            poster_path: '/action-poster.jpg',
            vote_average: 7.5,
            release_date: '2023-01-01',
            overview: 'Action overview',
          },
        ],
      }

      ;(fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await movieService.searchMoviesByGenres([28, 35], 1)

      expect(fetch).toHaveBeenCalledTimes(1)
      const calledUrl2 = (fetch as unknown as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as string
      expect(calledUrl2).toMatch(
        /^https:\/\/api\.themoviedb\.org\/3\/discover\/movie\?api_key=.*&with_genres=28,35&sort_by=popularity\.desc&page=1$/,
      )
      expect(result).toEqual([
        {
          id: 1,
          title: 'Action Movie',
          poster_path: 'https://image.tmdb.org/t/p/w500/action-poster.jpg',
          vote_average: 7.5,
          release_date: '2023-01-01',
          overview: 'Action overview',
        },
      ])
    })
  })
})
