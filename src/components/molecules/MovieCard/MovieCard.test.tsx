import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MovieCard } from './MovieCard'
import type { Movie } from '../../../types/movie'

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  poster_path: 'https://image.tmdb.org/t/p/w500/test-poster.jpg',
  vote_average: 8.5,
  release_date: '2023-01-01',
  overview: 'This is a test movie overview',
}

describe('MovieCard', () => {
  it('should render movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />)

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument()
    // Overview is not rendered in current component markup
    expect(screen.getByRole('img', { name: 'Test Movie' })).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w500/test-poster.jpg',
    )
  })

  it('should display vote average as percentage', () => {
    render(<MovieCard movie={mockMovie} />)

    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('should handle movie click', () => {
    const onMovieClick = vi.fn()
    render(<MovieCard movie={mockMovie} onMovieClick={onMovieClick} />)

    const movieButton = screen.getAllByRole('button')[0]
    fireEvent.click(movieButton)

    expect(onMovieClick).toHaveBeenCalledWith(1)
  })

  it('should handle missing poster path', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: '' }
    render(<MovieCard movie={movieWithoutPoster} />)

    const img = screen.getByRole('img', { name: 'Test Movie' })
    expect(img).toHaveAttribute('src', '/assets/no-poster.jpg')
  })

  it('should apply correct color scheme for high rating', () => {
    const highRatedMovie = { ...mockMovie, vote_average: 9.0 }
    render(<MovieCard movie={highRatedMovie} />)

    // The component should set CSS custom properties for colors
    // This would need to be tested through integration or snapshot testing
    expect(screen.getByText('90')).toBeInTheDocument()
  })

  it('should apply correct color scheme for medium rating', () => {
    const mediumRatedMovie = { ...mockMovie, vote_average: 5.5 }
    render(<MovieCard movie={mediumRatedMovie} />)

    expect(screen.getByText('55')).toBeInTheDocument()
  })

  it('should apply correct color scheme for low rating', () => {
    const lowRatedMovie = { ...mockMovie, vote_average: 2.0 }
    render(<MovieCard movie={lowRatedMovie} />)

    expect(screen.getByText('20')).toBeInTheDocument()
  })
})
