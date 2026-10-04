import React, { forwardRef } from 'react';
import BookPage from '../Book/BookPage';
import { PREFACE_CONTENT, PREFACE_CONTENT_TAMIL } from '../../data/poems';

const Preface = forwardRef(({ language, pageNumber }, ref) => {
  const isTamil = language === 'tamil';
  const content = isTamil ? PREFACE_CONTENT_TAMIL : PREFACE_CONTENT;

  return (
    <BookPage ref={ref} pageNumber={pageNumber}>
      <div className="page-container preface-content-wrap">
        <div style={{ margin: 'auto 0', width: '100%' }}>
          <h2 className={`preface-title ${isTamil ? 'tamil-font' : ''}`}>{content.title}</h2>
          <div className="cover-title-divider" style={{ width: '45px', margin: '8px auto 18px auto' }} />

          <div className="preface-body">
            {content.lines.map((line, idx) => (
              <p
                key={idx}
                className={`preface-line ${isTamil ? 'tamil-font' : ''}`}
                style={line === '' ? { minHeight: '14px' } : undefined}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="preface-author">{content.author}</div>
        </div>
      </div>
    </BookPage>
  );
});

Preface.displayName = 'Preface';

export default Preface;
