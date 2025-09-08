import React, { useEffect, useRef } from 'react'
import type { Movie } from '../../../types/movie'
import './MovieCard.css'

interface MovieCardProps {
  movie: Movie
  onMovieClick?: (id: number) => void
  className?: string
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onMovieClick,
  className = '',
}) => {
  const consensusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (consensusRef.current) {
      setChartColors()
    }
  }, [movie.vote_average])

  const setChartColors = () => {
    const percent = Math.round(movie.vote_average * 10)
    const colors = getColorByRating(percent)
    const element = consensusRef.current

    if (element) {
      element.setAttribute('data-percent', percent.toString())
      element.setAttribute('data-bar-color', colors.barColor)
      element.setAttribute('data-track-color', colors.trackColor)

      element.style.setProperty('--percent', percent.toString())
      element.style.setProperty('--bar-color', colors.barColor)
      element.style.setProperty('--track-color', colors.trackColor)
    }
  }

  const getColorByRating = (
    percent: number,
  ): { barColor: string; trackColor: string } => {
    if (percent >= 70) {
      return {
        barColor: '#21d07a',
        trackColor: '#204529',
      }
    } else if (percent >= 40) {
      return {
        barColor: '#d2d531',
        trackColor: '#423d0f',
      }
    } else {
      return {
        barColor: '#db2360',
        trackColor: '#571435',
      }
    }
  }

  const handleMovieClick = () => {
    if (onMovieClick) {
      onMovieClick(movie.id)
    }
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={`movie-card block h-full ${className}`}>
      <div className="image">
        <div className="wrapper cursor-pointer relative w-full h-full">
          <button
            className="image block w-full h-full cursor-pointer"
            onClick={handleMovieClick}
            aria-label={`View details for ${movie.title}`}
          >
            <img
              src={movie.poster_path || '/assets/no-poster.jpg'}
              alt={movie.title}
              loading="lazy"
              className="w-full h-full object-cover rounded md:rounded-none"
            />
          </button>
        </div>
      </div>

      <div className="content">
        <div
          ref={consensusRef}
          className="consensus hidden md:inline-block w-[38px] h-[38px] transform scale-100 transition-transform duration-200 bg-black rounded-full absolute -top-[19px] left-[10px]"
        >
          <div className="outer_ring w-full h-full rounded-full p-[2px] relative">
            <div className="user_score_chart relative w-full h-full rounded-full flex items-center justify-center">
              <div className="percent relative w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full bg-[#081c22] flex items-center justify-center">
                <span className="icon text-white text-[0.9em] font-semibold">
                  {Math.round(movie.vote_average * 10)}
                  <sup className="text-[7px]">%</sup>
                </span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="cursor-pointer text-base m-0 w-full break-words">
          <button
            title={movie.title}
            onClick={handleMovieClick}
            className="font-bold text-black inline-block leading-tight hover:text-blue-600 text-left"
          >
            {movie.title}
          </button>
        </h2>

        <p className="date text-base m-0 p-0 text-black text-opacity-60 leading-tight mt-1">
          {formatDate(movie.release_date)}
        </p>

        {/* <p className="overview md:hidden text-[0.9em] m-0 p-0 text-black text-opacity-60 leading-tight mt-2 line-clamp-2 overflow-hidden text-ellipsis">
          {movie.overview ? `${movie.overview.slice(0, 138)}...` : ''}
        </p> */}
      </div>
    </div>
  )
}
