import { genreService } from '../genre.service'

describe('GenreService', () => {
  describe('getGenres', () => {
    it('should return all available genres', async () => {
      const result = await genreService.getGenres()

      expect(result).toHaveLength(19)
      expect(result[0]).toEqual({ id: 28, name: 'Action' })
      expect(result[1]).toEqual({ id: 12, name: 'Adventure' })
    })
  })

  describe('getGenreById', () => {
    it('should return genre by id', async () => {
      const result = await genreService.getGenreById(28)

      expect(result).toEqual({ id: 28, name: 'Action' })
    })

    it('should return undefined for non-existent genre', async () => {
      const result = await genreService.getGenreById(999)

      expect(result).toBeUndefined()
    })
  })

  describe('getGenresByIds', () => {
    it('should return genres by array of ids', async () => {
      const result = await genreService.getGenresByIds([28, 35])

      expect(result).toEqual([
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
      ])
    })

    it('should return empty array for empty ids array', async () => {
      const result = await genreService.getGenresByIds([])

      expect(result).toEqual([])
    })
  })
})
