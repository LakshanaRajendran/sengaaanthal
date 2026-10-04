import React, { forwardRef } from 'react';
import BookPage from '../Book/BookPage';
import BookmarkButton from '../Bookmark/BookmarkButton';

const HaikuPage = forwardRef(
  ({ haiku, isBookmarked, onToggleBookmark, pageNumber }, ref) => {
    const isTamil = haiku.language === 'tamil';

    return (
      <BookPage ref={ref} pageNumber={pageNumber}>
        <BookmarkButton
          poemId={haiku.id}
          isBookmarked={isBookmarked}
          onToggle={onToggleBookmark}
        />

        <div className="page-container poem-page-container">
          <div className="poem-fitting-box">
            {/* Title */}
            <h2 className={`poem-title ${isTamil ? 'tamil-font' : ''}`}>
              {haiku.title}
            </h2>

            <div className="cover-title-divider" style={{ width: '32px', margin: '6px auto 14px auto' }} />

            {/* Haiku Box */}
            <div className="haiku-box">
              {haiku.content.map((line, idx) => (
                <p
                  key={idx}
                  className={`haiku-line ${isTamil ? 'tamil-font' : ''}`}
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

HaikuPage.displayName = 'HaikuPage';

export default HaikuPage;
