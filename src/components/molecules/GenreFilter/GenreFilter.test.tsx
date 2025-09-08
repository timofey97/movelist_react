import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { GenreFilter } from './GenreFilter'
import type { Genre } from '../../../types/genre'
import { vi } from 'vitest'

const mockGenres: Array<Genre> = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
]

describe('GenreFilter', () => {
  const mockOnGenreChange = vi.fn()

  beforeEach(() => {
    mockOnGenreChange.mockClear()
  })

  it('should render all genres', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[]}
        onGenreChange={mockOnGenreChange}
      />,
    )

    expect(screen.getByText('Genres')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Comedy')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('should highlight selected genres', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[28, 35]}
        onGenreChange={mockOnGenreChange}
      />,
    )

    const actionGenre = screen.getByText('Action').parentElement
    const comedyGenre = screen.getByText('Comedy').parentElement
    const dramaGenre = screen.getByText('Drama').parentElement

    expect(actionGenre).toHaveClass('bg-[rgb(1,180,228)]')
    expect(comedyGenre).toHaveClass('bg-[rgb(1,180,228)]')
    expect(dramaGenre).not.toHaveClass('bg-[rgb(1,180,228)]')
  })

  it('should toggle genre selection', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[28]}
        onGenreChange={mockOnGenreChange}
      />,
    )

    const comedyGenre = screen.getByText('Comedy').parentElement
    fireEvent.click(comedyGenre!)

    expect(mockOnGenreChange).toHaveBeenCalledWith([28, 35])
  })

  it('should remove genre when clicking selected genre', () => {
    render(
      <GenreFilter
        genres={mockGenres}
        selectedGenres={[28, 35]}
        onGenreChange={mockOnGenreChange}
      />,
    )

    const actionGenre = screen.getByText('Action').parentElement
    fireEvent.click(actionGenre!)

    expect(mockOnGenreChange).toHaveBeenCalledWith([35])
  })

  it('should handle empty genres list', () => {
    render(
      <GenreFilter
        genres={[]}
        selectedGenres={[]}
        onGenreChange={mockOnGenreChange}
      />,
    )

    expect(screen.getByText('Genres')).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})
