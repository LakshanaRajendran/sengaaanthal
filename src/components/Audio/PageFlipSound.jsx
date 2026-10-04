import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import flipSoundUrl from '../../assets/sounds/page-flip.wav';

/**
 * PageFlipSound component
 * Uses HTML5 Audio with fallback and soft volume so it feels subtle,
 * gentle, and never loud or intrusive.
 */
const PageFlipSound = forwardRef(({ soundEnabled = false }, ref) => {
  const audioRef = useRef(null);

  // Play page flip sound
  const playFlip = () => {
    if (!soundEnabled) return;

    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.12; // Whisper soft antique paper rustle
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // Autoplay policy or user interaction needed
          });
        }
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  };

  // Expose play method via ref
  useImperativeHandle(ref, () => ({
    play: playFlip,
  }));

  return (
    <div className="audio-controller-root" style={{ display: 'none' }} aria-hidden="true">
      <audio
        ref={audioRef}
        src={flipSoundUrl}
        preload="auto"
      />
    </div>
  );
});

PageFlipSound.displayName = 'PageFlipSound';

export default PageFlipSound;
