import React from 'react';

/**
 * BookNavigation bar
 * Subtle antique navigation controls for previous/next and current page counter.
 */
export default function BookNavigation({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  canPrev,
  canNext,
}) {
  return (
    <nav className="book-navigation-bar" aria-label="Book page navigation">
      <button
        type="button"
        className="book-nav-arrow"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Turn to previous page"
      >
        <span aria-hidden="true">←</span>
        <span>Previous</span>
      </button>

      <div className="book-page-indicator" aria-live="polite">
        <span>{currentPage === 0 ? 'Cover' : currentPage}</span>
        {currentPage > 0 && ` / ${totalPages - 1}`}
      </div>

      <button
        type="button"
        className="book-nav-arrow"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Turn to next page"
      >
        <span>Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
