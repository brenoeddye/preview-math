/* ==========================================================
   HERO VIDEO — Play, pause e fullscreen
   ========================================================== */

(function () {
  'use strict';

  const wrappers = document.querySelectorAll('[data-hero-video]');
  if (!wrappers.length) return;

  const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  const ICON_PLAY  = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

  wrappers.forEach(wrapper => {
    const video = wrapper.querySelector('video');
    if (!video) return;

    let isFullscreen = false;
    let controlsTimer = null;

    /* ---------- cria botões play/pause ---------- */
    const btnPause = document.createElement('button');
    btnPause.className = 'hero-video-control';
    btnPause.setAttribute('aria-label', 'Pausar vídeo');
    btnPause.setAttribute('data-pause', '');
    btnPause.innerHTML = ICON_PAUSE;
    wrapper.appendChild(btnPause);

    const btnPlay = document.createElement('button');
    btnPlay.className = 'hero-video-control';
    btnPlay.setAttribute('aria-label', 'Reproduzir vídeo');
    btnPlay.setAttribute('data-play', '');
    btnPlay.innerHTML = ICON_PLAY;
    btnPlay.style.display = 'none';
    wrapper.appendChild(btnPlay);

    /* ---------- autoplay ---------- */
    video.muted = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('preload', 'metadata');
    video.play().catch(() => {});

    /* ---------- play / pause ---------- */
    function updateButtons() {
      if (video.paused) {
        btnPause.style.display = 'none';
        btnPlay.style.display  = 'flex';
      } else {
        btnPause.style.display = 'flex';
        btnPlay.style.display  = 'none';
      }
    }

    function togglePlay(e) {
      if (e) e.stopPropagation();
      if (video.paused) video.play();
      else video.pause();
      updateButtons();
    }

    btnPause.addEventListener('click', togglePlay);
    btnPlay.addEventListener('click', togglePlay);
    video.addEventListener('play',  updateButtons);
    video.addEventListener('pause', updateButtons);

    /* ---------- fullscreen ---------- */
    function enterFullscreen() {
      if (isFullscreen) return;
      isFullscreen = true;
      wrapper.classList.add('is-fullscreen');

      const req = wrapper.requestFullscreen || wrapper.webkitRequestFullscreen || wrapper.msRequestFullscreen;
      if (req) req.call(wrapper).catch(() => {});

      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
      showControlsTemporarily();
      video.play().catch(() => {});
    }

    function exitFullscreen() {
      if (!isFullscreen) return;
      isFullscreen = false;
      wrapper.classList.remove('is-fullscreen');
      wrapper.classList.remove('show-controls');
      clearTimeout(controlsTimer);

      const ex = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (ex && document.fullscreenElement) ex.call(document).catch(() => {});

      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }

    function showControlsTemporarily() {
      wrapper.classList.add('show-controls');
      clearTimeout(controlsTimer);
      controlsTimer = setTimeout(() => wrapper.classList.remove('show-controls'), 2500);
    }

    wrapper.addEventListener('click', e => {
      if (e.target.closest('.hero-video-control')) return;
      if (isFullscreen) {
        showControlsTemporarily();
      } else {
        enterFullscreen();
      }
    });

    const onFsChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        isFullscreen = false;
        wrapper.classList.remove('is-fullscreen');
        wrapper.classList.remove('show-controls');
        if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock();
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('msfullscreenchange', onFsChange);

    document.addEventListener('keydown', e => {
      if (!isFullscreen) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'Escape') exitFullscreen();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause();
      else if (!isFullscreen) video.play().catch(() => {});
    });

    updateButtons();
  });
})();
