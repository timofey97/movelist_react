import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MovieCard } from '../../molecules/MovieCard/MovieCard'
import { FilterSidebar } from '../../organisms/FilterSidebar/FilterSidebar'
import { LoadingSpinner } from '../../atoms/LoadingSpinner/LoadingSpinner'
import { Button } from '../../atoms/Button/Button'
import { useGenres } from '../../../hooks/useGenres'
import { useMoviesByGenres, usePopularMovies } from '../../../hooks/useMovies'
import type { Movie, MoviePage } from '../../../types/movie'
import './Home.css'

export const Home: React.FC = () => {
  const [pages, setPages] = useState<Array<MoviePage>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isLastPage, setIsLastPage] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<Array<number>>([])
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data: genres = [] } = useGenres()

  const popularMoviesQuery = usePopularMovies(currentPage)
  const genreMoviesQuery = useMoviesByGenres(selectedGenres, currentPage)

  // Determine which query to use based on selected genres
  const activeQuery =
    selectedGenres.length > 0 ? genreMoviesQuery : popularMoviesQuery

  // Initial data load
  useEffect(() => {
    if (!hasInitialLoad && popularMoviesQuery.data) {
      setPages([{ page: 1, results: popularMoviesQuery.data }])
      setHasInitialLoad(true)
      setIsLastPage(popularMoviesQuery.data.length === 0)
    }
  }, [popularMoviesQuery.data, hasInitialLoad])

  // Handle loading states
  useEffect(() => {
    setIsLoading(activeQuery.isLoading)
    setIsSearchLoading(activeQuery.isLoading && selectedGenres.length > 0)
  }, [activeQuery.isLoading, selectedGenres.length])

  // Handle data updates when genres change or new pages load
  useEffect(() => {
    if (activeQuery.data) {
      if (currentPage === 1) {
        // New search or genre filter - replace all pages
        setPages([{ page: 1, results: activeQuery.data }])
      } else {
        // Load more - add new page
        setPages((prevPages) => [
          ...prevPages,
          { page: currentPage, results: activeQuery.data },
        ])
      }
      setIsLastPage(activeQuery.data.length === 0)
    }
  }, [activeQuery.data, currentPage, selectedGenres])

  // Set up intersection observer for infinite scroll
  const setupInfiniteScroll = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (
          target.isIntersecting &&
          currentPage > 1 &&
          !isLoading &&
          !isLastPage
        ) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (loadMoreRef.current && currentPage > 1) {
      observerRef.current.observe(loadMoreRef.current)
    }
  }, [currentPage, isLoading, isLastPage])

  useEffect(() => {
    setupInfiniteScroll()
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [setupInfiniteScroll])

  const loadMore = () => {
    if (!isLoading && !isLastPage) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handleGenreChange = (genreList: Array<number>) => {
    // Жанры изменились, но НЕ начинаем поиск сразу
    // Поиск начинается только при нажатии кнопки Search
  }

  const handleSearch = (genreList: Array<number>) => {
    if (genreList.length === 0) return

    // Если жанры не изменились, просто перезагружаем данные
    if (JSON.stringify(genreList) === JSON.stringify(selectedGenres)) {
      activeQuery.refetch()
      return
    }

    // Если жанры изменились, устанавливаем новые жанры и сбрасываем пагинацию
    setSelectedGenres(genreList)
    setCurrentPage(1)
    setIsLastPage(false)
    setPages([])
  }

  const handleMovieClick = (id: number) => {
    alert(`Navigate to movie details ${id}`)
  }

  const renderFillerCards = () => {
    return (
      <>
        <div className="card style_1 filler"></div>
        <div className="card style_1 filler"></div>
        <div className="card style_1 filler"></div>
      </>
    )
  }

  return (
    <div className="media discover min-h-screen">
      <div className="column_wrapper flex items-start min-w-full justify-center">
        <div className="content_wrapper px-5 py-2.5 md:px-10 md:py-7 w-full flex flex-wrap flex-1 max-w-[1400px]">
          <div className="title w-full mb-4">
            <h2 className="text-[1.6em] font-semibold">Popular Movies</h2>
          </div>

          <div className="content flex w-full flex-col md:flex-row gap-6 md:gap-0">
            <FilterSidebar
              genres={genres}
              selectedGenres={selectedGenres}
              onGenreChange={handleGenreChange}
              onSearch={handleSearch}
              isLoading={isSearchLoading}
            />

            <div className="w-full">
              <div className="white_column md:pl-7 pr-0 flex flex-wrap">
                <section id="media_results" className="panel results w-full">
                  <div className="media_items results md:mt-[-30px]">
                    {pages.map((page) => (
                      <div
                        key={page.page}
                        id={`page_${page.page}`}
                        className="page_wrapper w-full flex justify-between flex-wrap gap-4 md:gap-0"
                      >
                        {page.results.map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie}
                            onMovieClick={handleMovieClick}
                            className="card style_1"
                          />
                        ))}

                        {renderFillerCards()}

                        {page.page === currentPage && !isLastPage && (
                          <div
                            ref={loadMoreRef}
                            id={`pagination_page_${page.page}`}
                            className="pagination infinite background_color light_blue w-full mt-7 h-12 flex items-center justify-center rounded-lg"
                          >
                            <Button
                              className="no_click load_more cursor-pointer w-full flex items-center justify-center gap-2 text-white font-bold text-2xl hover:text-black bg-transparent border-none"
                              onClick={loadMore}
                              disabled={isLoading}
                              isLoading={isLoading}
                            >
                              {isLoading ? 'Loading...' : 'Load More'}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {(pages.length === 0 ||
                  (pages.length === 1 && pages[0].results.length === 0)) &&
                  !isLoading && (
                    <div className="text-center py-8 w-full">
                      <p className="text-gray-500">No movies found</p>
                    </div>
                  )}

                {isLoading && pages.length === 0 && (
                  <div className="w-full flex justify-center py-8">
                    <LoadingSpinner size="large" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
