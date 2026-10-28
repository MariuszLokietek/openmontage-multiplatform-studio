import { ProjectFile } from '../types';

export const sampleOpenMontageStudio: ProjectFile[] = [
  {
    id: 'f-index',
    name: 'index.html',
    path: 'index.html',
    size: 4210,
    content: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>OpenMontage Studio Mobile</title>
  <link rel="stylesheet" href="montage.css">
</head>
<body>
  <div class="montage-container">
    <!-- Header -->
    <header class="montage-header">
      <div class="brand">
        <span class="logo-dot"></span>
        <span class="logo-title">OpenMontage</span>
      </div>
      <div class="controls-top">
        <button id="btn-export" class="btn-action">Renderuj Wideo</button>
      </div>
    </header>

    <!-- Main Preview Canvas -->
    <main class="preview-stage">
      <div class="canvas-wrapper">
        <canvas id="montage-canvas" width="640" height="360"></canvas>
        <div id="play-overlay" class="play-overlay">
          <button id="btn-play-hero" class="btn-hero-play" aria-label="Odtwórz">▶</button>
        </div>
      </div>
      <div class="playback-bar">
        <span id="time-current" class="timecode">00:00.00</span>
        <input type="range" id="seek-bar" min="0" max="100" value="0" step="0.1">
        <span id="time-total" class="timecode">00:15.00</span>
      </div>
    </main>

    <!-- Filter & Effect Strip -->
    <section class="fx-strip">
      <span class="strip-label">Filtry Kinowe:</span>
      <div class="fx-scroll">
        <button class="fx-chip active" data-filter="normal">Naturalny</button>
        <button class="fx-chip" data-filter="cinematic">Cinematic 35mm</button>
        <button class="fx-chip" data-filter="cyber">Neon Cyber</button>
        <button class="fx-chip" data-filter="sepia">Vintage Sepia</button>
        <button class="fx-chip" data-filter="mono">Monochrom Noir</button>
      </div>
    </section>

    <!-- Multi-track Timeline -->
    <section class="timeline-panel">
      <div class="timeline-tracks">
        <!-- Track 1: Video -->
        <div class="track-row">
          <div class="track-header">🎬 Wideo</div>
          <div class="track-content">
            <div class="clip clip-video-1" style="width: 45%;">Klip 01 · Intro</div>
            <div class="clip clip-video-2" style="width: 50%;">Klip 02 · Dynamiczny Montaż</div>
          </div>
        </div>
        <!-- Track 2: Audio -->
        <div class="track-row">
          <div class="track-header">🎵 Dźwięk</div>
          <div class="track-content">
            <div class="clip clip-audio" style="width: 95%;">Ścieżka dźwiękowa · Beat Synth (120 BPM)</div>
          </div>
        </div>
      </div>

      <!-- Timeline Transport Controls -->
      <div class="transport-controls">
        <button id="btn-play" class="btn-ctrl">▶ Odtwórz</button>
        <button id="btn-split" class="btn-ctrl">✂ Podziel</button>
        <button id="btn-add-media" class="btn-ctrl">➕ Dodaj Plik</button>
        <input type="file" id="file-input" accept="video/*,image/*" style="display:none">
      </div>
    </section>
  </div>

  <script src="app.js"></script>
</body>
</html>`
  },
  {
    id: 'f-app-js',
    name: 'app.js',
    path: 'app.js',
    size: 3820,
    content: `// OpenMontage Mobile Core Runtime
(function() {
  const canvas = document.getElementById('montage-canvas');
  const ctx = canvas.getContext('2d');
  const playBtn = document.getElementById('btn-play');
  const heroPlayBtn = document.getElementById('btn-play-hero');
  const playOverlay = document.getElementById('play-overlay');
  const seekBar = document.getElementById('seek-bar');
  const timeCurrent = document.getElementById('time-current');
  const exportBtn = document.getElementById('btn-export');
  const addMediaBtn = document.getElementById('btn-add-media');
  const fileInput = document.getElementById('file-input');
  const filterChips = document.querySelectorAll('.fx-chip');

  let isPlaying = false;
  let currentTime = 0;
  const duration = 15.0; // 15 seconds
  let currentFilter = 'normal';
  let animationId = null;

  // Initialize Canvas scene
  function renderFrame(time) {
    const w = canvas.width;
    const h = canvas.height;

    // Background gradient simulation of video stream
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (currentFilter === 'cinematic') {
      grad.addColorStop(0, '#0f2027');
      grad.addColorStop(0.5, '#203a43');
      grad.addColorStop(1, '#2c5364');
    } else if (currentFilter === 'cyber') {
      grad.addColorStop(0, '#1a002c');
      grad.addColorStop(0.5, '#5c0067');
      grad.addColorStop(1, '#00d2ff');
    } else if (currentFilter === 'sepia') {
      grad.addColorStop(0, '#4a3b32');
      grad.addColorStop(0.5, '#8c7051');
      grad.addColorStop(1, '#d4b28c');
    } else if (currentFilter === 'mono') {
      grad.addColorStop(0, '#111111');
      grad.addColorStop(0.5, '#444444');
      grad.addColorStop(1, '#888888');
    } else {
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#312e81');
      grad.addColorStop(1, '#4338ca');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dynamic montage animation elements
    const progress = time / duration;
    const pulse = Math.sin(time * 3) * 20;

    // Render animated montage geometry
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(progress * Math.PI * 0.5);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-80 - pulse/2, -50 - pulse/2, 160 + pulse, 100 + pulse);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OpenMontage 4K', 0, 8);
    ctx.restore();

    // Waveform simulation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    const bars = 40;
    const barWidth = w / bars;
    for (let i = 0; i < bars; i++) {
      const barHeight = Math.abs(Math.sin(i * 0.3 + time * 4)) * 40 + 5;
      ctx.fillRect(i * barWidth, h - barHeight - 10, barWidth - 2, barHeight);
    }

    // Timecode badge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(15, 15, 120, 30);
    ctx.fillStyle = '#00ffcc';
    ctx.font = '14px monospace';
    ctx.fillText('TC ' + formatTime(time), 25, 36);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(ms).padStart(2, '0');
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸ Pauza' : '▶ Odtwórz';
    playOverlay.style.display = isPlaying ? 'none' : 'flex';

    if (isPlaying) {
      let lastTimestamp = performance.now();
      function loop(now) {
        if (!isPlaying) return;
        const delta = (now - lastTimestamp) / 1000;
        lastTimestamp = now;
        currentTime += delta;
        if (currentTime >= duration) {
          currentTime = 0;
        }
        seekBar.value = (currentTime / duration) * 100;
        timeCurrent.textContent = formatTime(currentTime);
        renderFrame(currentTime);
        animationId = requestAnimationFrame(loop);
      }
      animationId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(animationId);
    }
  }

  playBtn.addEventListener('click', togglePlay);
  heroPlayBtn.addEventListener('click', togglePlay);

  seekBar.addEventListener('input', (e) => {
    currentTime = (e.target.value / 100) * duration;
    timeCurrent.textContent = formatTime(currentTime);
    renderFrame(currentTime);
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderFrame(currentTime);
    });
  });

  addMediaBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      alert('Zaimportowano pomyślnie plik: ' + e.target.files[0].name);
    }
  });

  exportBtn.addEventListener('click', () => {
    alert('Symulacja renderowania: Twój projekt OpenMontage zostanie wyeksportowany z jakością 1080p 60fps!');
  });

  // Initial draw
  renderFrame(0);
})();`
  },
  {
    id: 'f-montage-css',
    name: 'montage.css',
    path: 'montage.css',
    size: 2750,
    content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  user-select: none;
  -webkit-user-select: none;
}

body {
  background-color: #090d16;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  height: 100vh;
}

.montage-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
}

.montage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6366f1;
}

.logo-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.btn-action {
  background: #4f46e5;
  color: #ffffff;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.preview-stage {
  padding: 10px;
  background: #020617;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  background: #000;
}

#montage-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-hero-play {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playback-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 480px;
  margin-top: 8px;
}

.timecode {
  font-family: monospace;
  font-size: 11px;
  color: #94a3b8;
}

#seek-bar {
  flex: 1;
  accent-color: #6366f1;
}

.fx-strip {
  padding: 8px 12px;
  background: #0f172a;
  border-top: 1px solid #1e293b;
  border-bottom: 1px solid #1e293b;
}

.strip-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}

.fx-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.fx-chip {
  padding: 5px 12px;
  border-radius: 20px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}

.fx-chip.active {
  background: #4f46e5;
  color: #ffffff;
  border-color: #6366f1;
}

.timeline-panel {
  flex: 1;
  background: #0b1120;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.track-header {
  width: 75px;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.track-content {
  flex: 1;
  display: flex;
  gap: 4px;
  background: #1e293b;
  height: 36px;
  border-radius: 6px;
  padding: 3px;
  overflow: hidden;
}

.clip {
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clip-video-1 {
  background: #3b82f6;
  color: #ffffff;
}

.clip-video-2 {
  background: #8b5cf6;
  color: #ffffff;
}

.clip-audio {
  background: #10b981;
  color: #ffffff;
}

.transport-controls {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn-ctrl {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.btn-ctrl:active {
  background: #334155;
}`
  },
  {
    id: 'f-project-json',
    name: 'project.json',
    path: 'project.json',
    size: 580,
    content: `{
  "generator": "OpenMontage",
  "version": "2.4.0",
  "project": {
    "title": "Moja Aplikacja Montażowa",
    "fps": 60,
    "resolution": {
      "width": 1920,
      "height": 1080
    },
    "duration": 15.0,
    "tracks": [
      {
        "type": "video",
        "name": "Główna Ścieżka Wideo",
        "clips": 2
      },
      {
        "type": "audio",
        "name": "Muzyka Tła",
        "volume": 0.8
      }
    ]
  }
}`
  }
];

export const sampleSlideReel: ProjectFile[] = [
  {
    id: 'f-reel-index',
    name: 'index.html',
    path: 'index.html',
    size: 2100,
    content: `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>OpenMontage CineSlide Reel</title>
  <style>
    body { margin: 0; background: #000; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; height: 100vh; justify-content: center; align-items: center; text-align: center; }
    .slide-card { width: 90%; max-width: 380px; aspect-ratio: 9/16; background: linear-gradient(135deg, #1e1b4b, #4338ca); border-radius: 16px; padding: 24px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
    h1 { font-size: 22px; margin: 0; }
    p { font-size: 14px; opacity: 0.8; line-height: 1.5; }
    .btn { background: #fff; color: #000; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <div class="slide-card">
    <div>
      <span style="font-size: 12px; opacity: 0.6;">CINESLIDE REEL · OPENMONTAGE</span>
      <h1 style="margin-top: 10px;">Interaktywny Montaż Wideo</h1>
    </div>
    <p>Projekt wygenerowany w OpenMontage przygotowany do bezpośredniego uruchomienia w aplikacji Android (APK).</p>
    <button class="btn" onclick="alert('Działa na Androidzie!')">Dotknij, aby sprawdzić</button>
  </div>
</body>
</html>`
  }
];
