import React, { forwardRef } from 'react';
import BookPage from '../Book/BookPage';

/**
 * AshesPage component
 * Quiet, blank closing leaf showing only "ASHES OF SENGAANTHAL".
 */
const AshesPage = forwardRef(({ language, pageNumber }, ref) => {
  const isTamil = language === 'tamil';

  return (
    <BookPage ref={ref} pageNumber={pageNumber}>
      <div className="page-container ashes-page-wrap">
        <div className="ashes-center-text">
          <h2 className={`ashes-title ${isTamil ? 'tamil-font' : ''}`}>
            {isTamil ? 'செங்காந்தளின் சாம்பல்' : 'ASHES OF SENGAANTHAL'}
          </h2>
          <div className="ashes-line" aria-hidden="true" />
        </div>
      </div>
    </BookPage>
  );
});

AshesPage.displayName = 'AshesPage';

export default AshesPage;
