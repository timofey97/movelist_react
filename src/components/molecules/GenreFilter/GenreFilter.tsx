import React from 'react'
import type { Genre } from '../../../types/genre'

interface GenreFilterProps {
  genres: Array<Genre>
  selectedGenres: Array<number>
  onGenreChange: (genres: Array<number>) => void
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenres,
  onGenreChange,
}) => {
  const isSelected = (genreId: number): boolean => {
    return selectedGenres.includes(genreId)
  }

  const toggleGenre = (genreId: number): void => {
    const newSelectedGenres = isSelected(genreId)
      ? selectedGenres.filter((id) => id !== genreId) // Remove genre
      : [...selectedGenres, genreId] // Add genre

    onGenreChange(newSelectedGenres)
  }

  return (
    <div className="filter w-full border-t border-gray-200 p-4">
      <h3 className="text-base font-normal mb-2.5">Genres</h3>
      <ul className="flex flex-wrap -mt-2">
        {genres.map((genre) => (
          <li
            key={genre.id}
            className={`inline-flex border rounded-[14px] px-3 py-1 text-sm mr-1.5 mt-2 cursor-pointer transition-colors duration-200 ease-in-out ${
              isSelected(genre.id)
                ? 'bg-[rgb(1,180,228)] border-[rgb(1,180,228)] text-white'
                : 'border-gray-500 text-black hover:bg-[rgb(1,180,228)] hover:border-[rgb(1,180,228)] hover:text-white'
            }`}
            onClick={() => toggleGenre(genre.id)}
          >
            <span className="no_click pointer-events-none">{genre.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
