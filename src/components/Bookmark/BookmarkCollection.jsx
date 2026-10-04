import React, { forwardRef, useState, useMemo } from 'react';
import BookPage from '../Book/BookPage';
import { poems as allPoems } from '../../data/poems';


const BookmarkCollection = forwardRef(
  ({ bookmarkIds, allPoems: propAllPoems, onReadPoem, onRemoveBookmark, pageNumber, currentLanguage = 'english' }, ref) => {
    const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'tamil' | 'english'

    const availablePoems = propAllPoems && propAllPoems.length > 0 ? propAllPoems : allPoems;

    // Helper to calculate the page number of a poem in the flip book
    const getPoemPageNumber = (item) => {
      const collection = availablePoems.filter(
        (p) => p.language === item.language && p.type === item.type
      );
      const idx = collection.findIndex((p) => String(p.id) === String(item.id));
      return 5 + (idx >= 0 ? idx : 0);
    };

    // Resolve all bookmarked poems across both languages
    const bookmarkedPoems = useMemo(() => {
      return bookmarkIds
        .map((id) => availablePoems.find((p) => String(p.id) === String(id)))
        .filter(Boolean);
    }, [bookmarkIds, availablePoems]);

    const tamilBookmarks = useMemo(() => {
      return bookmarkedPoems.filter((p) => p.language === 'tamil');
    }, [bookmarkedPoems]);

    const englishBookmarks = useMemo(() => {
      return bookmarkedPoems.filter((p) => p.language === 'english');
    }, [bookmarkedPoems]);

    const displayedPoems = useMemo(() => {
      if (selectedFilter === 'tamil') return tamilBookmarks;
      if (selectedFilter === 'english') return englishBookmarks;
      return bookmarkedPoems;
    }, [selectedFilter, bookmarkedPoems, tamilBookmarks, englishBookmarks]);

    const isCurrentTamil = currentLanguage === 'tamil';

    // Renders an individual bookmark card with page number and direct navigation
    const renderBookmarkCard = (item) => {
      const isItemTamil = item.language === 'tamil';
      const pageNum = getPoemPageNumber(item);
      const typeLabel =
        item.type === 'haiku'
          ? isItemTamil ? 'ஹைக்கூ' : 'Haiku'
          : isItemTamil ? 'கவிதை' : 'Poem';
      const langLabel = isItemTamil ? 'தமிழ்' : 'English';
      const pageLabel = isItemTamil ? `பக். ${pageNum}` : `p. ${pageNum}`;

      return (
        <div key={item.id} className="bookmark-record-card">
          <div className="bookmark-record-info">
            <div className={`bookmark-record-title ${isItemTamil ? 'tamil-font' : ''}`}>
              <span>“{item.title}”</span>
            </div>
            <div className="bookmark-record-meta">
              <span className={`bookmark-lang-pill ${isItemTamil ? 'tamil' : 'english'}`}>
                {langLabel}
              </span>
              <span>·</span>
              <span>{typeLabel}</span>
              <span>·</span>
              <span className="bookmark-page-ref">{pageLabel}</span>
            </div>
          </div>

          <div className="bookmark-record-actions">
            <button
              type="button"
              className="bookmark-read-btn"
              onClick={(e) => {
                e.stopPropagation();
                onReadPoem(item);
              }}
              aria-label={`Read ${item.title}`}
            >
              {isCurrentTamil ? 'வாசி' : 'Read'}
            </button>
            <button
              type="button"
              className="bookmark-remove-icon-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveBookmark(item.id);
              }}
              aria-label={`Remove bookmark for ${item.title}`}
              title="Remove feather"
            >
              ✕
            </button>
          </div>
        </div>
      );
    };

    return (
      <BookPage ref={ref} pageNumber={pageNumber}>
        <div className="page-container bookmarks-page-wrap">
          <h2 className={`bookmarks-page-title ${isCurrentTamil ? 'tamil-font' : ''}`}>
            {isCurrentTamil ? 'நினைவுக் குறிகள்' : 'My Bookmarks'}
          </h2>
          <div className="cover-title-divider" style={{ width: '45px', margin: '4px auto 8px auto' }} />

          {/* Language filter tabs to inspect All, Tamil or English */}
          {bookmarkedPoems.length > 0 && (
            <div className="bookmark-lang-tabs" role="tablist" aria-label="Filter bookmarks by language">
              <button
                type="button"
                className={`bookmark-tab-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                {isCurrentTamil ? 'அனைத்தும்' : 'All'} ({bookmarkedPoems.length})
              </button>
              <button
                type="button"
                className={`bookmark-tab-btn ${selectedFilter === 'tamil' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('tamil')}
              >
                தமிழ் ({tamilBookmarks.length})
              </button>
              <button
                type="button"
                className={`bookmark-tab-btn ${selectedFilter === 'english' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('english')}
              >
                English ({englishBookmarks.length})
              </button>
            </div>
          )}

          {bookmarkedPoems.length === 0 ? (
            <div className="bookmark-empty-state">
              <span className={`empty-state-verse ${isCurrentTamil ? 'tamil-font' : ''}`}>
                {isCurrentTamil
                  ? '“எந்த ஏடும் இன்னும் குறிக்கப்படவில்லை.”'
                  : '“You haven’t bookmarked any poems yet.”'}
              </span>
              <div
                className="cover-title-divider"
                style={{ width: '40px', margin: '12px auto' }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '0.80rem',
                  color: 'var(--color-text-faint)',
                  marginTop: '4px'
                }}
              >
                Touch the feather on any leaf in Tamil or English to hold its memory.
              </p>
            </div>
          ) : (
            <div className="bookmarks-list-container">
              {/* When 'All' is selected: Explicitly present BOTH Tamil and English sections */}
              {selectedFilter === 'all' ? (
                <>
                  {/* TAMIL BOOKMARKED SECTION */}
                  {tamilBookmarks.length > 0 && (
                    <div className="bookmark-group-section">
                      <div className="bookmark-group-header">
                        <span className="bookmark-group-line" aria-hidden="true" />
                        <h3 className="bookmark-group-heading tamil-font">
                          தமிழ் ({tamilBookmarks.length})
                        </h3>
                        <span className="bookmark-group-line" aria-hidden="true" />
                      </div>
                      <div className="bookmark-group-items">
                        {tamilBookmarks.map((item) => renderBookmarkCard(item))}
                      </div>
                    </div>
                  )}

                  {/* ENGLISH BOOKMARKED SECTION */}
                  {englishBookmarks.length > 0 && (
                    <div className="bookmark-group-section">
                      <div className="bookmark-group-header">
                        <span className="bookmark-group-line" aria-hidden="true" />
                        <h3 className="bookmark-group-heading">
                          English ({englishBookmarks.length})
                        </h3>
                        <span className="bookmark-group-line" aria-hidden="true" />
                      </div>
                      <div className="bookmark-group-items">
                        {englishBookmarks.map((item) => renderBookmarkCard(item))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* When filtered to a single language */
                <div className="bookmark-group-items">
                  {displayedPoems.length === 0 ? (
                    <div className="bookmark-empty-state">
                      <span className="empty-state-verse" style={{ fontSize: '0.90rem' }}>
                        No bookmarks in this language yet.
                      </span>
                    </div>
                  ) : (
                    displayedPoems.map((item) => renderBookmarkCard(item))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </BookPage>
    );
  }
);

BookmarkCollection.displayName = 'BookmarkCollection';

export default BookmarkCollection;
