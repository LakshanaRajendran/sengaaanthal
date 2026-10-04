import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import Cover from './Cover';
import BookPage from './BookPage';
import LanguageSelection from '../Selection/LanguageSelection';
import TypeSelection from '../Selection/TypeSelection';
import Preface from '../Reading/Preface';
import TableOfContents from '../Reading/TableOfContents';
import PoemPage from '../Reading/PoemPage';
import HaikuPage from '../Reading/HaikuPage';
import BookmarkCollection from '../Bookmark/BookmarkCollection';
import AshesPage from '../Reading/AshesPage';
import BookNavigation from './BookNavigation';
import BookMenu from '../Menu/BookMenu';
import PageFlipSound from '../Audio/PageFlipSound';
import { useBookmarks } from '../../hooks/useBookmarks';
import { poemService } from '../../services/poemService';
import { poems as fallbackPoems } from '../../data/poems';
import '../../styles/admin.css';

export default function Book() {
  const [language, setLanguage] = useState('english');
  const [type, setType] = useState('poem');
  const [currentPage, setCurrentPage] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Exact 896:1200 (0.7467) aspect ratio lock to guarantee cover frame pixel alignment
  const calculateDimensions = useCallback(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 360;
    const h = typeof window !== 'undefined' ? window.innerHeight : 640;
    const ratio = 896 / 1200; // 0.74667

    if (w < 600) {
      const maxW = Math.min(Math.floor(w * 0.94), 380);
      const maxH = Math.floor(h * 0.77);

      let width = maxW;
      let height = Math.round(width / ratio);

      if (height > maxH) {
        height = maxH;
        width = Math.round(height * ratio);
      }
      return { width, height };
    } else {
      const maxH = Math.min(Math.floor(h * 0.82), 680);
      const height = maxH;
      const width = Math.round(height * ratio);
      return { width, height };
    }
  }, []);

  const [dimensions, setDimensions] = useState(calculateDimensions);

  const flipBookRef = useRef(null);
  const soundRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const pendingPageRef = useRef(null);

  const { bookmarks, toggleBookmark, removeBookmark, isBookmarked } = useBookmarks();

  // Dynamic backend poem state cached by category (e.g. 'tamil_poem', 'english_haiku')
  const [poemsCache, setPoemsCache] = useState({});
  const [allPublishedPoems, setAllPublishedPoems] = useState([]);
  const [isLoadingPoems, setIsLoadingPoems] = useState(true);
  const activeRequestIdRef = useRef(0);

  // Fetch published poems from backend API with cold-start resilience & race condition prevention
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPoems(true);

    const requestId = ++activeRequestIdRef.current;
    const targetKey = `${language}_${type}`;

    poemService.getPublishedPoems({ language, type })
      .then((data) => {
        // Prevent race condition: ignore if component unmounted or newer request was initiated
        if (!isMounted || requestId !== activeRequestIdRef.current) return;

        // Never treat empty or invalid responses as collection erasure
        if (Array.isArray(data) && data.length > 0) {
          setPoemsCache((prev) => ({
            ...prev,
            [targetKey]: data
          }));
        }
      })
      .catch((err) => {
        console.warn('[Reader] Backend API notice:', err.message);
        // Preserves existing poemsCache[targetKey] automatically
      })
      .finally(() => {
        if (isMounted && requestId === activeRequestIdRef.current) {
          setIsLoadingPoems(false);
        }
      });

    // Also fetch all published poems for cross-language bookmark resolution
    poemService.getPublishedPoems()
      .then((fullList) => {
        if (isMounted && Array.isArray(fullList) && fullList.length > 0) {
          setAllPublishedPoems(fullList);
        }
      })
      .catch((err) => {
        console.warn('[Reader] Full poem index notice:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, [language, type]);

  // Use API poems if available; seamlessly fall back to local seed data if network offline or server waking up
  const activeCollection = useMemo(() => {
    const targetKey = `${language}_${type}`;
    const cachedCategory = poemsCache[targetKey];

    if (Array.isArray(cachedCategory) && cachedCategory.length > 0) {
      return cachedCategory;
    }

    return fallbackPoems.filter((p) => p.language === language && p.type === type);
  }, [poemsCache, language, type]);

  const crossReferencePoems = useMemo(() => {
    if (allPublishedPoems && allPublishedPoems.length > 0) {
      return allPublishedPoems;
    }
    return fallbackPoems;
  }, [allPublishedPoems]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateDimensions]);

  // Page index structure:
  // 0: Cover
  // 1: Language selection
  // 2: Type selection
  // 3: Preface
  // 4: Table of Contents (Index)
  // 5 ..: Poem/Haiku pages (or 1 empty placeholder page if collection is empty)
  // (5 + activeCollectionCount): Bookmarks
  // (5 + activeCollectionCount + 1): Ashes of Sengaanthal
  const collectionLength = Math.max(1, activeCollection.length);
  const totalPages = 5 + collectionLength + 2;
  const collectionKey = useMemo(() => {
    return activeCollection.map((p) => p.id).join('_');
  }, [activeCollection]);

  // Sound triggering on flip
  const handlePageFlip = useCallback(
    (e) => {
      const newPage = e.data;
      setCurrentPage(newPage);
      if (soundRef.current) {
        soundRef.current.play();
      }
    },
    []
  );

  // Reliable, flexible page flipping
  const flipNext = useCallback(() => {
    try {
      if (flipBookRef.current) {
        const pf = flipBookRef.current.pageFlip();
        if (pf) {
          pf.flipNext();
        }
      }
    } catch (err) {
      console.warn('FlipNext notice', err);
    }
  }, []);

  const flipPrev = useCallback(() => {
    try {
      if (flipBookRef.current) {
        const pf = flipBookRef.current.pageFlip();
        if (pf) {
          pf.flipPrev();
        }
      }
    } catch (err) {
      console.warn('FlipPrev notice', err);
    }
  }, []);

  // Jump directly to any page reliably
  const flipToPage = useCallback((pageNum) => {
    try {
      if (flipBookRef.current) {
        const pf = flipBookRef.current.pageFlip();
        if (pf) {
          if (typeof pf.turnToPage === 'function') {
            pf.turnToPage(pageNum);
          } else if (typeof pf.flip === 'function') {
            pf.flip(pageNum);
          }
          setCurrentPage(pageNum);
          if (soundRef.current) {
            soundRef.current.play();
          }
        }
      }
    } catch (err) {
      console.warn('FlipToPage notice', err);
    }
  }, []);

  // Handle queued page flip across language/type switches
  useEffect(() => {
    if (pendingPageRef.current !== null) {
      const pageToFlip = pendingPageRef.current;
      pendingPageRef.current = null;
      const timer = setTimeout(() => {
        flipToPage(pageToFlip);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [language, type, flipToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipNext, flipPrev]);

  // Mobile swipe handlers
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || !e.changedTouches || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        flipNext();
      } else {
        flipPrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Selections
  const handleSelectLanguage = (newLang) => {
    setLanguage(newLang);
    setTimeout(() => {
      flipToPage(2);
    }, 120);
  };

  const handleSelectType = (newType) => {
    setType(newType);
    setTimeout(() => {
      flipToPage(3);
    }, 120);
  };

  // Read poem from bookmark - supports both Tamil and English seamlessly
  const handleReadFromBookmark = (targetPoem) => {
    const targetCollection = crossReferencePoems.filter(
      (p) => p.language === targetPoem.language && p.type === targetPoem.type
    );
    const itemIndex = targetCollection.findIndex((p) => String(p.id) === String(targetPoem.id));
    const targetPage = 5 + (itemIndex >= 0 ? itemIndex : 0);

    if (targetPoem.language !== language || targetPoem.type !== type) {
      pendingPageRef.current = targetPage;
      setCurrentPage(targetPage);
      setLanguage(targetPoem.language);
      setType(targetPoem.type);
    } else {
      flipToPage(targetPage);
    }
  };

  return (
    <main className="book-viewport">
      {/* Background audio player */}
      <PageFlipSound
        ref={soundRef}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Header Toolbar */}
      <header className="book-header-toolbar">
        <div className="book-brand-badge">
          <span>Sengaanthal</span>
        </div>

        <div className="book-toolbar-actions">
          <button
            type="button"
            className={`vintage-icon-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
            title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
          >
            {soundEnabled ? 'Sound: On' : 'Sound: Off'}
          </button>

          <button
            type="button"
            className="vintage-icon-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open Book Index"
            title="Book Index"
          >
            Index ☰
          </button>
        </div>
      </header>

      {/* Main Book Flipping Area */}
      <section
        className="book-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Interactive Book Reader"
      >
        <div
          className="book-frame-container"
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        >
          <HTMLFlipBook
            key={`${language}-${type}-${dimensions.width}-${collectionKey}`}
            width={dimensions.width}
            height={dimensions.height}
            size="fixed"
            minWidth={280}
            maxWidth={600}
            minHeight={400}
            maxHeight={800}
            maxShadowOpacity={0.35}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={handlePageFlip}
            ref={flipBookRef}
            className="sengaanthal-flipbook"
            startPage={pendingPageRef.current !== null ? pendingPageRef.current : currentPage}
            drawShadow={true}
            flippingTime={500}
            usePortrait={true}
            startZIndex={1}
            autoSize={true}
          >
            {/* Page 0: Cover */}
            <Cover onOpen={flipNext} />

            {/* Page 1: Language Selection */}
            <LanguageSelection
              currentLanguage={language}
              onSelectLanguage={handleSelectLanguage}
              pageNumber={1}
            />

            {/* Page 2: Type Selection */}
            <TypeSelection
              language={language}
              currentType={type}
              onSelectType={handleSelectType}
              pageNumber={2}
            />

            {/* Page 3: Preface */}
            <Preface language={language} pageNumber={3} />

            {/* Page 4: Table of Contents */}
            <TableOfContents
              language={language}
              type={type}
              poems={activeCollection}
              onNavigatePoem={flipToPage}
              pageNumber={4}
            />

            {/* Pages 5 ..: The Filtered Poetry Collection */}
            {activeCollection.length === 0 ? (
              <BookPage pageNumber={5}>
                <div className="page-container poem-page-container">
                  <div className="poem-fitting-box" style={{ textAlign: 'center', marginTop: '60px' }}>
                    <p
                      className={`empty-state-verse ${language === 'tamil' ? 'tamil-font' : ''}`}
                      style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}
                    >
                      {isLoadingPoems
                        ? (language === 'tamil' ? 'கவிதைத் தொகுப்பு திறக்கப்படுகிறது...' : 'Opening the poetry collection...')
                        : (language === 'tamil' ? 'இந்தத் தொகுப்பில் இன்னும் கவிதைகள் வெளியிடப்படவில்லை.' : 'No poems have been published in this collection yet.')}
                    </p>
                  </div>
                </div>
              </BookPage>
            ) : (
              activeCollection.map((poem, index) => {
                const pageNum = 5 + index;
                const bookmarked = isBookmarked(poem.id);

                if (poem.type === 'haiku') {
                  return (
                    <HaikuPage
                      key={poem.id}
                      haiku={poem}
                      isBookmarked={bookmarked}
                      onToggleBookmark={toggleBookmark}
                      pageNumber={pageNum}
                    />
                  );
                }

                return (
                  <PoemPage
                    key={poem.id}
                    poem={poem}
                    isBookmarked={bookmarked}
                    onToggleBookmark={toggleBookmark}
                    pageNumber={pageNum}
                  />
                );
              })
            )}

            {/* Bookmarks Page */}
            <BookmarkCollection
              bookmarkIds={bookmarks}
              allPoems={crossReferencePoems}
              onReadPoem={handleReadFromBookmark}
              onRemoveBookmark={removeBookmark}
              pageNumber={5 + collectionLength}
              currentLanguage={language}
            />

            {/* Final Blank Page: ASHES OF SENGAANTHAL */}
            <AshesPage
              language={language}
              pageNumber={5 + collectionLength + 1}
            />
          </HTMLFlipBook>
        </div>
      </section>

      {/* Footer Navigation Bar */}
      <footer style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <BookNavigation
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={flipPrev}
          onNext={flipNext}
          canPrev={currentPage > 0}
          canNext={currentPage < totalPages - 1}
        />
        <div className="swipe-hint-pill" aria-hidden="true">
          Swipe or tap to turn leaves
        </div>

        {/* Subtle Admin Link at the very bottom */}
        <div className="admin-portal-link-container">
          <Link to="/admin/login" className="subtle-admin-text-link" aria-label="Administrator Login">
            Admin
          </Link>
        </div>
      </footer>

      {/* Antique Menu Modal */}
      <BookMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateCover={() => flipToPage(0)}
        onNavigateLanguage={() => flipToPage(1)}
        onNavigateType={() => flipToPage(2)}
        onNavigatePreface={() => flipToPage(3)}
        onNavigateContents={() => flipToPage(4)}
        onNavigateBookmarks={() => flipToPage(5 + collectionLength)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        language={language}
        type={type}
        bookmarkCount={bookmarks.length}
      />
    </main>
  );
}
