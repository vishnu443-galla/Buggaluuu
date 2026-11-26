/**
 * ROMANTIC LOVE APPLICATION - CORE INTERACTION CONTROLLER
 * Full pink, red and white romantic theme with interactive particles,
 * 4 locked stages, flying kisses, video player, and grand surprise finale.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentPage: 1,
    pin: '',
    targetPin: '1128',
    targetNickname: 'buggalu',
    isTransitioning: false,
    surpriseActive: false,
    audioInitialized: false
  };

  // DOM Elements Cache
  const elements = {
    // Music Controls
    musicPill: document.getElementById('musicPill'),
    musicToggleBtn: document.getElementById('musicToggleBtn'),
    
    // Transitions & Overlays
    heartWipe: document.getElementById('heartWipe'),
    kissOverlay: document.getElementById('kissOverlay'),
    kissHeartsCluster: document.getElementById('kissHeartsCluster'),
    loveCanvas: document.getElementById('loveCanvas'),

    // Page 1 Elements
    page1: document.getElementById('page1'),
    pinDisplay: document.getElementById('pinDisplay'),
    pinSlots: document.querySelectorAll('.pin-slot'),
    pinKeypad: document.getElementById('pinKeypad'),
    pinClearBtn: document.getElementById('pinClearBtn'),
    pinDeleteBtn: document.getElementById('pinDeleteBtn'),
    pinErrorMsg: document.getElementById('pinErrorMsg'),
    pinHintBtn: document.getElementById('pinHintBtn'),
    pinHintText: document.getElementById('pinHintText'),

    // Page 2 Elements
    page2: document.getElementById('page2'),
    nicknameForm: document.getElementById('nicknameForm'),
    nicknameInput: document.getElementById('nicknameInput'),
    clearNicknameBtn: document.getElementById('clearNicknameBtn'),
    nicknameErrorMsg: document.getElementById('nicknameErrorMsg'),
    nicknameHintBtn: document.getElementById('nicknameHintBtn'),
    nicknameHintText: document.getElementById('nicknameHintText'),

    // Page 3 Elements
    page3: document.getElementById('page3'),
    loveLetterCard: document.getElementById('loveLetterCard'),
    letterSalutation: document.getElementById('letterSalutation'),
    letterBody: document.getElementById('letterBody'),
    letterSignature: document.getElementById('letterSignature'),
    editLetterBtn: document.getElementById('editLetterBtn'),
    toMemoriesBtn: document.getElementById('toMemoriesBtn'),
    
    // Letter Edit Modal
    letterEditModal: document.getElementById('letterEditModal'),
    closeLetterEditBtn: document.getElementById('closeLetterEditBtn'),
    editSalutationInput: document.getElementById('editSalutationInput'),
    editBodyInput: document.getElementById('editBodyInput'),
    editSignatureInput: document.getElementById('editSignatureInput'),
    saveCustomLetterBtn: document.getElementById('saveCustomLetterBtn'),
    resetDefaultLetterBtn: document.getElementById('resetDefaultLetterBtn'),

    // Page 4 Elements
    page4: document.getElementById('page4'),
    videoFrameContainer: document.getElementById('videoFrameContainer'),
    memoryVideo: document.getElementById('memoryVideo'),
    videoPlayOverlay: document.getElementById('videoPlayOverlay'),
    loveYouSurpriseBtn: document.getElementById('loveYouSurpriseBtn'),

    // Grand Surprise Elements
    surpriseModal: document.getElementById('surpriseModal'),
    surpriseHeartsLayer: document.getElementById('surpriseHeartsLayer'),
    closeSurpriseIconBtn: document.getElementById('closeSurpriseIconBtn'),
    burstMoreLoveBtn: document.getElementById('burstMoreLoveBtn'),
    closeSurpriseBtn: document.getElementById('closeSurpriseBtn')
  };

  /* ==========================================================================
     CANVAS PARTICLE ENGINE (Floating hearts, roses, sparkles & kiss emojis)
     ========================================================================== */
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.trailParticles = [];
      this.symbols = ['❤️', '💖', '💕', '💗', '🌹', '✨', '🌸', '💋'];
      this.width = 0;
      this.height = 0;
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.initParticles(35);
      this.bindTouchTrail();
      this.animate();
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    initParticles(count) {
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push(this.createParticle(true));
      }
    }

    createParticle(randomY = false) {
      return {
        x: Math.random() * this.width,
        y: randomY ? Math.random() * this.height : this.height + 30 + Math.random() * 50,
        symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
        size: 14 + Math.random() * 22,
        speedY: 0.6 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.9,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        opacity: 0.25 + Math.random() * 0.65,
        swayOffset: Math.random() * 100,
        swaySpeed: 0.015 + Math.random() * 0.02
      };
    }

    bindTouchTrail() {
      const addTrail = (x, y) => {
        if (Math.random() > 0.4) {
          this.trailParticles.push({
            x: x,
            y: y,
            symbol: ['💖', '✨', '❤️', '🌸'][Math.floor(Math.random() * 4)],
            size: 16 + Math.random() * 14,
            speedY: -1.2 - Math.random() * 2,
            speedX: (Math.random() - 0.5) * 2,
            opacity: 1,
            decay: 0.03 + Math.random() * 0.02
          });
        }
      };

      window.addEventListener('mousemove', (e) => addTrail(e.clientX, e.clientY));
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          addTrail(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render floating background elements
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y -= p.speedY;
        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * 0.8 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y < -50 || p.x < -50 || p.x > this.width + 50) {
          this.particles[i] = this.createParticle(false);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.globalAlpha = p.opacity;
        this.ctx.font = `${p.size}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(p.symbol, 0, 0);
        this.ctx.restore();
      }

      // Render interactive touch/mouse trails
      for (let j = this.trailParticles.length - 1; j >= 0; j--) {
        const tp = this.trailParticles[j];
        tp.x += tp.speedX;
        tp.y += tp.speedY;
        tp.opacity -= tp.decay;

        if (tp.opacity <= 0) {
          this.trailParticles.splice(j, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = tp.opacity;
        this.ctx.font = `${tp.size}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(tp.symbol, tp.x, tp.y);
        this.ctx.restore();
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize Canvas
  if (elements.loveCanvas) {
    new ParticleEngine(elements.loveCanvas);
  }

  /* ==========================================================================
     PAGE NAVIGATION WITH HEART-WIPE TRANSITION
     ========================================================================== */
  function goToPage(targetPageNum) {
    if (state.isTransitioning || targetPageNum === state.currentPage) return;
    state.isTransitioning = true;

    // Trigger giant heart wipe animation
    elements.heartWipe.classList.add('animating');

    // Midway through wipe, switch active page views
    setTimeout(() => {
      // Hide all pages
      document.querySelectorAll('.page-view').forEach(p => {
        p.classList.remove('active');
      });

      // Show target page
      const targetEl = document.getElementById(`page${targetPageNum}`);
      if (targetEl) {
        targetEl.classList.add('active');
        state.currentPage = targetPageNum;
      }

      // Special action per page
      if (targetPageNum === 2) {
        setTimeout(() => {
          elements.nicknameInput?.focus();
        }, 300);
      } else if (targetPageNum === 4) {
        // Prepare video
        if (elements.memoryVideo) {
          elements.memoryVideo.currentTime = 0;
        }
      }

      // Scroll to top of viewport
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);

    // End wipe
    setTimeout(() => {
      elements.heartWipe.classList.remove('animating');
      state.isTransitioning = false;
    }, 1100);
  }

  /* ==========================================================================
     MUSIC CONTROLLER INITIALIZATION
     ========================================================================== */
  function setupMusic() {
    const handleMusicToggle = (e) => {
      e?.stopPropagation();
      window.romanticAudio.toggleMusic();
    };

    elements.musicPill?.addEventListener('click', handleMusicToggle);
    elements.musicToggleBtn?.addEventListener('click', handleMusicToggle);

    // Start background music on user's first touch/click
    const firstInteraction = () => {
      if (!state.audioInitialized) {
        state.audioInitialized = true;
        window.romanticAudio.initContext();
      }
      window.removeEventListener('click', firstInteraction);
      window.removeEventListener('touchstart', firstInteraction);
    };
    window.addEventListener('click', firstInteraction, { once: true });
    window.addEventListener('touchstart', firstInteraction, { once: true });
  }

  /* ==========================================================================
     PAGE 1: FIRST LOVE LOCK (PIN 1128)
     ========================================================================== */
  function setupPage1() {
    function updatePinSlots() {
      elements.pinSlots.forEach((slot, index) => {
        if (index < state.pin.length) {
          slot.classList.add('filled');
        } else {
          slot.classList.remove('filled');
        }
      });
    }

    function addPinDigit(digit) {
      if (state.pin.length < 4) {
        state.pin += digit;
        window.romanticAudio.playTapSound();
        updatePinSlots();
        elements.pinErrorMsg.textContent = '';
        elements.pinErrorMsg.classList.remove('shake');

        if (state.pin.length === 4) {
          validatePin();
        }
      }
    }

    function deletePinDigit() {
      if (state.pin.length > 0) {
        state.pin = state.pin.slice(0, -1);
        window.romanticAudio.playTapSound();
        updatePinSlots();
        elements.pinErrorMsg.textContent = '';
      }
    }

    function clearPin() {
      state.pin = '';
      window.romanticAudio.playTapSound();
      updatePinSlots();
      elements.pinErrorMsg.textContent = '';
    }

    function validatePin() {
      if (state.pin === state.targetPin) {
        // SUCCESS: Correct PIN entered!
        window.romanticAudio.playKissSound();
        triggerFlyingKissCelebration();
      } else {
        // INCORRECT PIN
        window.romanticAudio.playErrorBuzz();
        elements.pinDisplay.classList.add('shake');
        elements.pinErrorMsg.textContent = "Oops, that's not our secret code, sweetheart! 💕 Try again";
        elements.pinErrorMsg.classList.add('shake');

        setTimeout(() => {
          elements.pinDisplay.classList.remove('shake');
          clearPin();
        }, 700);
      }
    }

    // Keypad Click Events
    elements.pinKeypad?.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      if (target.dataset.num !== undefined) {
        addPinDigit(target.dataset.num);
      } else if (target.id === 'pinDeleteBtn') {
        deletePinDigit();
      } else if (target.id === 'pinClearBtn') {
        clearPin();
      }
    });

    // Physical Keyboard Input
    window.addEventListener('keydown', (e) => {
      if (state.currentPage !== 1) return;
      if (e.key >= '0' && e.key <= '9') {
        addPinDigit(e.key);
      } else if (e.key === 'Backspace') {
        deletePinDigit();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearPin();
      }
    });

    // Hint toggle
    elements.pinHintBtn?.addEventListener('click', () => {
      if (elements.pinHintText) {
        elements.pinHintText.style.display = elements.pinHintText.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  // Flying Kiss Celebration when PIN is correct
  function triggerFlyingKissCelebration() {
    // Show overlay
    elements.kissOverlay.classList.add('active');

    // Confetti burst
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#ff0054', '#ff4d6d', '#ff758f', '#ffffff']
      });
    }

    // Cluster mini hearts
    if (elements.kissHeartsCluster) {
      elements.kissHeartsCluster.innerHTML = '';
      const symbols = ['💋', '💖', '❤️', '💕', '🥰'];
      for (let i = 0; i < 16; i++) {
        const span = document.createElement('span');
        span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        span.style.position = 'absolute';
        span.style.fontSize = `${20 + Math.random() * 26}px`;
        span.style.left = `${50 + (Math.random() - 0.5) * 160}px`;
        span.style.top = `${50 + (Math.random() - 0.5) * 160}px`;
        span.style.animation = `flyingKissBurst ${0.8 + Math.random() * 0.6}s ease-out forwards`;
        elements.kissHeartsCluster.appendChild(span);
      }
    }

    // After celebration, transition to Page 2
    setTimeout(() => {
      elements.kissOverlay.classList.remove('active');
      goToPage(2);
    }, 1800);
  }

  /* ==========================================================================
     PAGE 2: SECOND LOVE LOCK (NICKNAME: BUGGALU)
     ========================================================================== */
  function setupPage2() {
    const checkNickname = () => {
      const rawVal = elements.nicknameInput.value.trim().toLowerCase();
      
      // Check for Buggalu (also accepts slight typos or sweet variants like buggaluu, buggulu)
      const isMatch = rawVal === 'buggalu' || 
                      rawVal === 'buggaluu' || 
                      rawVal === 'buggulu' ||
                      rawVal.includes('buggalu');

      if (isMatch) {
        // Success
        elements.nicknameErrorMsg.textContent = '';
        window.romanticAudio.playSuccessChime();

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#ff4d6d', '#ff758f', '#ffd1dc', '#ffffff']
          });
        }

        // Heart transition to Page 3
        setTimeout(() => {
          goToPage(3);
        }, 600);
      } else {
        // Incorrect
        window.romanticAudio.playErrorBuzz();
        elements.nicknameInput.classList.add('shake');
        elements.nicknameErrorMsg.textContent = "Almost there, my love! Try that super cute name I always call you... 🙈";
        elements.nicknameErrorMsg.classList.add('shake');

        setTimeout(() => {
          elements.nicknameInput.classList.remove('shake');
          elements.nicknameErrorMsg.classList.remove('shake');
        }, 600);
      }
    };

    elements.nicknameForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      checkNickname();
    });

    // Clear input button
    elements.nicknameInput?.addEventListener('input', () => {
      if (elements.nicknameInput.value.length > 0) {
        elements.clearNicknameBtn?.classList.add('visible');
      } else {
        elements.clearNicknameBtn?.classList.remove('visible');
      }
    });

    elements.clearNicknameBtn?.addEventListener('click', () => {
      elements.nicknameInput.value = '';
      elements.clearNicknameBtn.classList.remove('visible');
      elements.nicknameInput.focus();
    });

    // Hint toggle
    elements.nicknameHintBtn?.addEventListener('click', () => {
      if (elements.nicknameHintText) {
        elements.nicknameHintText.style.display = elements.nicknameHintText.style.display === 'none' ? 'block' : 'none';
      }
    });
  }

  /* ==========================================================================
     PAGE 3: LOVE LETTER & PERSONALIZATION
     ========================================================================== */
  function setupPage3() {
    // Check if user has explicitly saved a customized letter version 2
    const savedLetter = localStorage.getItem('varsha_love_letter_v2');
    if (savedLetter) {
      try {
        const parsed = JSON.parse(savedLetter);
        if (parsed.salutation) elements.letterSalutation.textContent = parsed.salutation;
        if (parsed.body) {
          elements.letterBody.innerHTML = parsed.body.split('\n\n').map(p => `<p>${p}</p>`).join('');
        }
        if (parsed.signature) elements.letterSignature.textContent = parsed.signature;
      } catch (e) {}
    }

    // MANDATORY REQUIREMENT:
    // "Below the letter, display one beautiful button: 'Pure love with lot of memories 💗'. When clicked, open Page 4."
    elements.toMemoriesBtn?.addEventListener('click', () => {
      window.romanticAudio.playSuccessChime();
      goToPage(4);
    });

    // Edit Letter Modal Triggers
    elements.editLetterBtn?.addEventListener('click', () => {
      // Pre-fill inputs
      elements.editSalutationInput.value = elements.letterSalutation.textContent.trim();
      const paras = Array.from(elements.letterBody.querySelectorAll('p')).map(p => p.textContent.trim());
      elements.editBodyInput.value = paras.join('\n\n');
      elements.editSignatureInput.value = elements.letterSignature.textContent.trim();
      elements.letterEditModal.style.display = 'flex';
    });

    elements.closeLetterEditBtn?.addEventListener('click', () => {
      elements.letterEditModal.style.display = 'none';
    });

    elements.saveCustomLetterBtn?.addEventListener('click', () => {
      const salutation = elements.editSalutationInput.value.trim() || 'My dear ammayai garu 🥹😻';
      const bodyText = elements.editBodyInput.value.trim();
      const signature = elements.editSignatureInput.value.trim() || 'misssss youuuuuuuuu buggaluuuuu🫂🪢💗🫠😘';

      if (bodyText) {
        elements.letterSalutation.textContent = salutation;
        elements.letterBody.innerHTML = bodyText.split('\n\n').map(p => `<p>${p}</p>`).join('');
        elements.letterSignature.textContent = signature;

        // Save locally
        localStorage.setItem('varsha_love_letter_v2', JSON.stringify({
          salutation,
          body: bodyText,
          signature
        }));
      }

      elements.letterEditModal.style.display = 'none';
      window.romanticAudio.playSuccessChime();
    });

    elements.resetDefaultLetterBtn?.addEventListener('click', () => {
      localStorage.removeItem('varsha_love_letter_v2');
      localStorage.removeItem('varsha_love_letter_custom');
      location.reload();
    });
  }

  /* ==========================================================================
     PAGE 4: OUR MEMORIES & CLEAN, PROPER ROMANTIC SURPRISE
     ========================================================================== */
  function setupPage4() {
    const video = elements.memoryVideo;
    const overlay = elements.videoPlayOverlay;

    // Dynamically match container aspect-ratio to exact video dimensions
    const updateVideoRatio = () => {
      if (video && video.videoWidth && video.videoHeight && elements.videoFrameContainer) {
        elements.videoFrameContainer.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
      }
    };
    video?.addEventListener('loadedmetadata', updateVideoRatio);
    if (video && video.videoWidth) {
      updateVideoRatio();
    }

    // Overlay play tap
    overlay?.addEventListener('click', () => {
      if (video) {
        video.play().then(() => {
          overlay.classList.add('hidden');
        }).catch(() => {
          overlay.classList.add('hidden');
        });
      }
    });

    video?.addEventListener('play', () => {
      overlay?.classList.add('hidden');
      if (window.romanticAudio.bgAudioEl) {
        window.romanticAudio.bgAudioEl.volume = 0.2;
      }
    });

    video?.addEventListener('pause', () => {
      if (window.romanticAudio.bgAudioEl) {
        window.romanticAudio.bgAudioEl.volume = 1.0;
      }
    });

    // MANDATORY REQUIREMENT:
    // Under the video, display a beautiful button saying "Love You 💋".
    // When clicked:
    // - Show the beautiful, clear, emotional surprise pop-up
    // - Floating romantic hearts in background
    // - Confetti burst and fanfare
    elements.loveYouSurpriseBtn?.addEventListener('click', () => {
      triggerGrandLoveSurprise();
    });

    // Surprise Modal Actions
    elements.burstMoreLoveBtn?.addEventListener('click', () => {
      burstLoveConfettiShower();
      spawnSurpriseHearts(14);
      window.romanticAudio.playKissSound();
    });

    const closeSurprise = () => {
      elements.surpriseModal.classList.remove('active');
      state.surpriseActive = false;
    };

    elements.closeSurpriseBtn?.addEventListener('click', closeSurprise);
    elements.closeSurpriseIconBtn?.addEventListener('click', closeSurprise);
    elements.surpriseModal?.addEventListener('click', (e) => {
      if (e.target === elements.surpriseModal) {
        closeSurprise();
      }
    });
  }

  // The Grand Finale Surprise Activation
  function triggerGrandLoveSurprise() {
    state.surpriseActive = true;
    elements.surpriseModal.classList.add('active');

    // Play grand fanfare chimes
    window.romanticAudio.playGrandSurpriseChimes();

    // Spawn gentle floating romantic hearts
    spawnSurpriseHearts(20);

    // Multi-stage fireworks of confetti
    burstLoveConfettiShower();
  }

  function spawnSurpriseHearts(count) {
    if (!elements.surpriseHeartsLayer) return;
    elements.surpriseHeartsLayer.innerHTML = '';
    const hearts = ['❤️', '💖', '💕', '💗', '🌹', '💋'];

    for (let i = 0; i < count; i++) {
      const heartEl = document.createElement('div');
      heartEl.className = 'floating-love-heart-item';
      heartEl.textContent = hearts[Math.floor(Math.random() * hearts.length)];

      const left = Math.random() * 92;
      const scale = 0.8 + Math.random() * 1.5;
      const duration = 5 + Math.random() * 5;
      const delay = Math.random() * 3;

      heartEl.style.left = `${left}%`;
      heartEl.style.fontSize = `${24 + Math.random() * 26}px`;
      heartEl.style.setProperty('--scl', scale);
      heartEl.style.animationDuration = `${duration}s`;
      heartEl.style.animationDelay = `${delay}s`;

      elements.surpriseHeartsLayer.appendChild(heartEl);
    }
  }

  function burstLoveConfettiShower() {
    if (typeof confetti !== 'function') return;

    // Multi-shot romantic fireworks
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ff0054', '#ff4d6d', '#ff758f', '#ffffff', '#ffd166'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    })();
  }

  /* ==========================================================================
     APPLICATION BOOTSTRAP
     ========================================================================== */
  function init() {
    setupMusic();
    setupPage1();
    setupPage2();
    setupPage3();
    setupPage4();
    console.log('💖 Romantic Love App Initialized for Buggalu!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
