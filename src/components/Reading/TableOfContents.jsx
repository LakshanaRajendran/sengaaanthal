import React, { forwardRef } from 'react';
import BookPage from '../Book/BookPage';

/**
 * TableOfContents component
 * Appears right after Preface, listing all poems/haikus in the current selection
 * with direct navigation to each piece. Clean and free of emojis/fleurons.
 */
const TableOfContents = forwardRef(({ language, type, poems, startPageMap, onNavigatePoem, pageNumber }, ref) => {
  const isTamil = language === 'tamil';
  const isHaiku = type === 'haiku';

  const title = isTamil
    ? (isHaiku ? 'ஹைக்கூ பொருளடக்கம்' : 'கவிதைப் பொருளடக்கம்')
    : (isHaiku ? 'Table of Haiku' : 'Table of Contents');

  return (
    <BookPage ref={ref} pageNumber={pageNumber}>
      <div className="page-container toc-page-wrap">
        <div className="toc-inner-box">
          <h2 className={`toc-title ${isTamil ? 'tamil-font' : ''}`}>{title}</h2>
          <div className="cover-title-divider" style={{ width: '45px', margin: '8px auto 16px auto' }} />

          <nav className="toc-list" aria-label="Poetry index">
            {poems.map((poem, index) => {
              const targetPage = (startPageMap && startPageMap.get(String(poem.id))) || (5 + index);

              return (
                <button
                  key={poem.id}
                  type="button"
                  className="toc-item-link"
                  onClick={() => onNavigatePoem(targetPage)}
                  aria-label={`Go to ${poem.title}, page ${targetPage}`}
                >
                  <span className="toc-item-num">{index + 1}.</span>
                  <span className={`toc-item-title ${isTamil ? 'tamil-font' : ''}`}>
                    {poem.title}
                  </span>
                  <span className="toc-item-dots" aria-hidden="true" />
                  <span className="toc-item-page">p. {targetPage}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </BookPage>
  );
});

TableOfContents.displayName = 'TableOfContents';

export default TableOfContents;
