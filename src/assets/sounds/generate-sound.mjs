import fs from 'fs';

function generateSoftPageFlipWav(outputPath) {
  const sampleRate = 44100;
  const duration = 0.20; // 200ms - brief, subtle whisper
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Soft low-pass filter states
  let lp = 0;
  let lp2 = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Smooth Hann-like bell envelope - gentle rise and smooth gentle fade
    let env = 0;
    if (t < 0.05) {
      env = 0.5 * (1 - Math.cos((t / 0.05) * Math.PI));
    } else {
      env = Math.exp(-(t - 0.05) * 16);
    }

    // Gentle noise
    const white = (Math.random() * 2 - 1);

    // Warm, muted low-pass filtering for soft paper rustle (no harsh treble)
    lp = lp + 0.18 * (white - lp);
    lp2 = lp2 + 0.18 * (lp - lp2);

    // Whisper quiet amplitude (0.045 peak)
    let sample = lp2 * 0.045 * env;

    // Soft low body
    sample += 0.012 * Math.sin(2 * Math.PI * 110 * t) * Math.exp(-t * 22);

    sample = Math.max(-1, Math.min(1, sample));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated soft WAV at ${outputPath}`);
}

generateSoftPageFlipWav('./src/assets/sounds/page-flip.wav');
