import React from 'react';

/**
 * BookmarkButton component
 * 1. Before bookmarking: A small, elegant bird's feather icon at the top right.
 * 2. While & after bookmarking: A big, long antique quill feather is placed
 *    between the pages along the upper-right leaf margin without altering
 *    or disturbing the poem text in any way.
 */
export default function BookmarkButton({ poemId, isBookmarked, onToggle }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Avoid triggering page turn
    onToggle(poemId);
  };

  return (
    <>
      {/* 1. Small Feather Icon Button on the Top Right */}
      <button
        type="button"
        className={`small-feather-corner-btn ${isBookmarked ? 'active-bookmark' : ''}`}
        onClick={handleClick}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}
        title={isBookmarked ? 'Bookmarked (Tap to remove feather)' : 'Bookmark with feather'}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="small-feather-svg"
        >
          {/* Shaft */}
          <path
            d="M19 4L4 19"
            stroke={isBookmarked ? '#d4af37' : '#8c6a23'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Feather Plume */}
          <path
            d="M19 4C14 6 10 11 11 16C12 17 14 18 16 16C18 13 20 8 19 4Z"
            fill={isBookmarked ? '#961e31' : 'rgba(184, 144, 71, 0.25)'}
            stroke={isBookmarked ? '#d4af37' : '#8c6a23'}
            strokeWidth="1.2"
          />
          <path
            d="M13 10L17 9"
            stroke={isBookmarked ? '#f5e2b0' : '#8c6a23'}
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M12 13L15 13"
            stroke={isBookmarked ? '#f5e2b0' : '#8c6a23'}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 2. Big Long Feather placed between the pages when bookmarked */}
      {isBookmarked && (
        <div
          className="big-long-feather-bookmark"
          onClick={handleClick}
          title="Tucked feather bookmark (tap to remove)"
          role="button"
          tabIndex={0}
          aria-label="Tucked bird feather bookmark"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(e);
            }
          }}
        >
          <svg
            className="long-feather-svg"
            viewBox="0 0 44 220"
            width="38"
            height="190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="longQuillGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff2cc" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#7a5518" />
              </linearGradient>

              <linearGradient id="longFeatherPlume" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b3263f" />
                <stop offset="35%" stopColor="#801528" />
                <stop offset="70%" stopColor="#540e1b" />
                <stop offset="100%" stopColor="#2c070f" />
              </linearGradient>
            </defs>

            {/* Antique brass ribbon holder clip at the very top */}
            <rect x="18" y="0" width="8" height="6" rx="1.5" fill="url(#longQuillGold)" />

            {/* Left Vane / Barbs of the big feather */}
            <path
              d="M 22 8 C 11 20 2 48 3 95 C 4 125 10 155 22 185 C 20 145 19 105 21 55 Z"
              fill="url(#longFeatherPlume)"
              stroke="#b89047"
              strokeWidth="0.8"
            />

            {/* Right Vane / Barbs of the big feather */}
            <path
              d="M 22 8 C 33 20 42 48 41 95 C 40 125 34 155 22 185 C 24 145 25 105 23 55 Z"
              fill="url(#longFeatherPlume)"
              stroke="#b89047"
              strokeWidth="0.8"
            />

            {/* Delicate Barb Slits */}
            <path
              d="M 8 70 L 22 80 M 7 90 L 22 100 M 9 115 L 22 122 M 12 140 L 22 145 M 36 70 L 22 80 M 37 90 L 22 100 M 35 115 L 22 122 M 32 140 L 22 145"
              stroke="#d4af37"
              strokeWidth="0.65"
              strokeOpacity="0.75"
              strokeLinecap="round"
            />

            {/* Central Quill Shaft (Rachis) running the entire length */}
            <path
              d="M 22 4 Q 21.5 100 22 214"
              stroke="url(#longQuillGold)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Quill Nib Tip at Bottom */}
            <path
              d="M 20.8 206 L 22 218 L 23.2 206 Z"
              fill="url(#longQuillGold)"
            />
          </svg>
        </div>
      )}
    </>
  );
}
