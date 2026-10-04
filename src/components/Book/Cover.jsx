import React, { forwardRef } from 'react';

/**
 * Cover page component
 * Deep burgundy antique leather/cloth binding with:
 * - "SENGAANTHAL" aligned right inside the antique gold cartouche
 * - Unobstructed central Gloriosa Lily botanical illustration
 * - "by Lakshana" and "Tap to open" in the lower area
 */
const Cover = forwardRef(({ onOpen }, ref) => {
  return (
    <div
      ref={ref}
      className="book-page-wrap book-cover"
      data-density="hard"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label="Book Cover: SENGAANTHAL by Lakshana. Tap to open book."
    >
      {/* Plaque container: Aligns SENGAANTHAL directly inside the gold cartouche frame */}
      <div className="cover-plaque-zone">
        <h1 className="cover-title">SENGAANTHAL</h1>
      </div>

      {/* Lower area below the flower */}
      <div className="cover-lower-zone">
        <div className="cover-author">by Lakshana</div>
        <div className="cover-tap-prompt">
          <span>Tap to open</span>
        </div>
      </div>
    </div>
  );
});

Cover.displayName = 'Cover';

export default Cover;
