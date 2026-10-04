import React, { forwardRef } from 'react';
import BookPage from '../Book/BookPage';

const TypeSelection = forwardRef(({ language, currentType, onSelectType, pageNumber }, ref) => {
  const isTamil = language === 'tamil';

  return (
    <BookPage ref={ref} pageNumber={pageNumber}>
      <div className="page-container selection-page-content">
        <div style={{ margin: 'auto 0', width: '100%' }}>
          <h2 className="selection-question">
            {isTamil ? 'என்ன வாசிக்க விரும்புகிறீர்கள்?' : 'What Shall You Read?'}
          </h2>
          <div className="cover-title-divider" style={{ width: '40px', margin: '8px auto 24px auto' }} />

          <div className="selection-options-group">
            <button
              type="button"
              className={`vintage-choice-card ${currentType === 'poem' ? 'selected' : ''}`}
              onClick={() => onSelectType('poem')}
              aria-label={isTamil ? 'கவிதைகள்' : 'Poems'}
            >
              <span className={`choice-label-primary ${isTamil ? 'tamil-font' : ''}`}>
                {isTamil ? 'கவிதைகள்' : 'Poems'}
              </span>
            </button>

            <button
              type="button"
              className={`vintage-choice-card ${currentType === 'haiku' ? 'selected' : ''}`}
              onClick={() => onSelectType('haiku')}
              aria-label={isTamil ? 'ஹைக்கூ' : 'Haiku'}
            >
              <span className={`choice-label-primary ${isTamil ? 'tamil-font' : ''}`}>
                {isTamil ? 'ஹைக்கூ' : 'Haiku'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </BookPage>
  );
});

TypeSelection.displayName = 'TypeSelection';

export default TypeSelection;
