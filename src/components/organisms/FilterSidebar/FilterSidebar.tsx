import React, { useState } from 'react'
import { GenreFilter } from '../../molecules/GenreFilter/GenreFilter'
import { Button } from '../../atoms/Button/Button'
import type { Genre } from '../../../types/genre'

interface FilterSidebarProps {
  genres: Array<Genre>
  selectedGenres: Array<number>
  onGenreChange: (genres: Array<number>) => void
  onSearch: (genres: Array<number>) => void
  isLoading?: boolean
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  genres,
  selectedGenres,
  onGenreChange,
  onSearch,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const [localSelectedGenres, setLocalSelectedGenres] =
    useState<Array<number>>(selectedGenres)

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  const handleGenreChange = (genreList: Array<number>) => {
    setLocalSelectedGenres(genreList)
    // НЕ вызываем onGenreChange сразу - только когда нажимают Search
  }

  const handleSearch = () => {
    if (localSelectedGenres.length === 0) return
    onSearch(localSelectedGenres)
  }

  const ChevronIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <div className="sidebar md:min-w-[260px] md:w-[260px] w-full">
      <div
        className={`filter_panel card border border-gray-300 rounded-lg overflow-hidden ${
          !isOpen ? 'closed' : ''
        }`}
      >
        <div
          className="name w-full flex justify-between items-center p-3.5 cursor-pointer"
          onClick={togglePanel}
        >
          <h2 className="text-[1.1em] font-semibold">Filters</h2>
          <span
            className={`chevron-right transition-transform duration-200 ${
              isOpen ? 'rotate-90' : 'rotate-0'
            }`}
          >
            <ChevronIcon />
          </span>
        </div>

        <div className={`filters ${!isOpen ? 'hidden' : ''}`}>
          <GenreFilter
            genres={genres}
            selectedGenres={localSelectedGenres}
            onGenreChange={handleGenreChange}
          />
        </div>
      </div>

      <div className="apply mt-3 w-full">
        <Button
          className={`w-full  text-white font-semibold py-3 rounded-[20px] transition-colors duration-200 ease-in-out ${
            localSelectedGenres.length === 0
              ? 'disabled'
              : 'bg-[rgb(1,180,228)] hover:bg-[rgb(1,160,208)]'
          }`}
          onClick={handleSearch}
          disabled={localSelectedGenres.length === 0}
          isLoading={isLoading}
        >
          <span
            className={
              localSelectedGenres.length === 0
                ? 'text-[rgba(0,0,0,0.5)]'
                : 'text-white'
            }
          >
            Search
          </span>
        </Button>
      </div>
    </div>
  )
}
