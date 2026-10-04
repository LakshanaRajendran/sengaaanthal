import React, { forwardRef } from 'react';

/**
 * BookPage wrapper
 * MUST be forwardRef for react-pageflip to attach DOM nodes.
 */
const BookPage = forwardRef(({ children, className = '', isCover = false, pageNumber = null }, ref) => {
  return (
    <div
      ref={ref}
      className={`book-page-wrap ${!isCover ? 'book-page-parchment' : ''} ${className}`}
      data-density={isCover ? 'hard' : 'soft'}
    >
      <div className="page-inner-content">
        {!isCover && (
          <div className="page-border-frame" aria-hidden="true">
            <span className="page-corner-flourish flourish-tl" />
            <span className="page-corner-flourish flourish-tr" />
            <span className="page-corner-flourish flourish-bl" />
            <span className="page-corner-flourish flourish-br" />
          </div>
        )}
        {children}
        {!isCover && pageNumber !== null && (
          <div className="page-footer-num" aria-label={`Page ${pageNumber}`}>
            {pageNumber}
          </div>
        )}
      </div>
    </div>
  );
});

BookPage.displayName = 'BookPage';

export default BookPage;
