import React from 'react';

/**
 * BookMenu component
 * Clean antique paper modal providing index and page navigation.
 * Pure typography without emojis or fleuron icons.
 */
export default function BookMenu({
  isOpen,
  onClose,
  onNavigateCover,
  onNavigateLanguage,
  onNavigateType,
  onNavigatePreface,
  onNavigateContents,
  onNavigateBookmarks,
  soundEnabled,
  onToggleSound,
  language,
  type,
  bookmarkCount = 0,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="antique-menu-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Book Index"
    >
      <div
        className="antique-menu-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="antique-menu-border-inner" aria-hidden="true" />

        <h3 className="antique-menu-title">Index</h3>
        <div className="cover-title-divider" style={{ width: '40px', margin: '6px auto 16px auto' }} />

        <div className="antique-menu-list">
          <button
            type="button"
            className="antique-menu-item"
            onClick={() => {
              onNavigateCover();
              onClose();
            }}
          >
            <span className="menu-item-label">Front Cover</span>
            <span className="menu-item-badge">Binding</span>
          </button>

          <button
            type="button"
            className="antique-menu-item"
            onClick={() => {
              onNavigateLanguage();
              onClose();
            }}
          >
            <span className="menu-item-label">Language</span>
            <span className="menu-item-badge">
              {language === 'tamil' ? 'தமிழ்' : 'English'}
            </span>
          </button>

          <button
            type="button"
            className="antique-menu-item"
            onClick={() => {
              onNavigateType();
              onClose();
            }}
          >
            <span className="menu-item-label">Form</span>
            <span className="menu-item-badge">
              {type === 'haiku' ? 'Haiku' : 'Poems'}
            </span>
          </button>

          <button
            type="button"
            className="antique-menu-item"
            onClick={() => {
              onNavigatePreface();
              onClose();
            }}
          >
            <span className="menu-item-label">Preface</span>
            <span className="menu-item-badge">Leaf 3</span>
          </button>

          <button
            type="button"
            className="antique-menu-item"
            onClick={() => {
              onNavigateContents();
              onClose();
            }}
          >
            <span className="menu-item-label">Table of Contents</span>
            <span className="menu-item-badge">Leaf 4</span>
          </button>

          <button
            type="button"
            className="antique-menu-item"
            onClick={() => {
              onNavigateBookmarks();
              onClose();
            }}
          >
            <span className={`menu-item-label ${language === 'tamil' ? 'tamil-font' : ''}`}>
              {language === 'tamil' ? 'நினைவுக் குறிகள்' : 'My Bookmarks'}
            </span>
            <span className="menu-item-badge">
              {bookmarkCount} {bookmarkCount === 1 ? 'feather' : 'feathers'}
            </span>
          </button>

          <button
            type="button"
            className="antique-menu-item"
            onClick={onToggleSound}
          >
            <span className="menu-item-label">Paper Sound</span>
            <span className="menu-item-badge">
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        <button
          type="button"
          className="antique-menu-close-btn"
          onClick={onClose}
        >
          Close Index
        </button>
      </div>
    </div>
  );
}
