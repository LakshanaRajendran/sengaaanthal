import React, { forwardRef } from 'react';
import BookPage from '../Book/BookPage';

const LanguageSelection = forwardRef(({ currentLanguage, onSelectLanguage, pageNumber }, ref) => {
  return (
    <BookPage ref={ref} pageNumber={pageNumber}>
      <div className="page-container selection-page-content">
        <div style={{ margin: 'auto 0', width: '100%' }}>
          <h2 className="selection-question">Choose Your Tongue</h2>
          <div className="cover-title-divider" style={{ width: '40px', margin: '8px auto 24px auto' }} />

          <div className="selection-options-group">
            <button
              type="button"
              className={`vintage-choice-card ${currentLanguage === 'tamil' ? 'selected' : ''}`}
              onClick={() => onSelectLanguage('tamil')}
              aria-label="தமிழ்"
            >
              <span className="choice-label-primary tamil-font">தமிழ்</span>
            </button>

            <button
              type="button"
              className={`vintage-choice-card ${currentLanguage === 'english' ? 'selected' : ''}`}
              onClick={() => onSelectLanguage('english')}
              aria-label="English"
            >
              <span className="choice-label-primary">English</span>
            </button>
          </div>
        </div>
      </div>
    </BookPage>
  );
});

LanguageSelection.displayName = 'LanguageSelection';

export default LanguageSelection;
