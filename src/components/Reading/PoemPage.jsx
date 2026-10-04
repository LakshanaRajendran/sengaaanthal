import React, { forwardRef } from 'react';
import BookPage from '../Book/BookPage';
import BookmarkButton from '../Bookmark/BookmarkButton';

const PoemPage = forwardRef(
  ({ poem, isBookmarked, onToggleBookmark, pageNumber }, ref) => {
    const isTamil = poem.language === 'tamil';

    return (
      <BookPage ref={ref} pageNumber={pageNumber}>
        {/* Small feather button on top-right, and big long feather tucked between pages when active */}
        <BookmarkButton
          poemId={poem.id}
          isBookmarked={isBookmarked}
          onToggle={onToggleBookmark}
        />

        <div className="page-container poem-page-container">
          <div className="poem-fitting-box">
            {/* Clean title */}
            <h2 className={`poem-title ${isTamil ? 'tamil-font' : ''}`}>
              {poem.title}
            </h2>

            <div className="cover-title-divider" style={{ width: '36px', margin: '4px auto 10px auto' }} />

            {/* Poem Stanzas */}
            <div className="poem-strophes">
              {poem.content.map((line, idx) => (
                <p
                  key={idx}
                  className={`poem-line ${isTamil ? 'tamil-font' : ''}`}
                  style={line === '' ? { minHeight: '6px' } : undefined}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </BookPage>
    );
  }
);

PoemPage.displayName = 'PoemPage';

export default PoemPage;
