import { useEffect, useRef, useCallback } from 'react';

/**
 * useWakeDetection
 * Listens to the microphone and detects voice wake words:
 * "JARVIS", "Hey Jarvis", "Wake up", "Activate"
 *
 * @param {Function} onWake   - fires when wake word is detected
 * @param {Function} onReady  - fires(true/false) when mic permission resolved
 * @param {Object}   options  - { enabled, warmupMs, wakeWords }
 */
const useWakeDetection = (onWake, onReady, options = {}) => {
  const {
    enabled = true,
    warmupMs = 2000,
    wakeWords = ['jarvis', 'hey jarvis', 'wake up', 'activate', 'j.a.r.v.i.s'],
  } = options;

  // Store callbacks in refs so they never invalidate the effect
  const onWakeRef  = useRef(onWake);
  const onReadyRef = useRef(onReady);
  useEffect(() => { onWakeRef.current  = onWake;  }, [onWake]);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

  const enabledRef = useRef(enabled);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  // Internal state refs
  const firedRef  = useRef(false);
  const readyRef  = useRef(false);
  const cleanupRef = useRef(null);

  const fire = useCallback(() => {
    if (firedRef.current || !readyRef.current || !enabledRef.current) return;
    firedRef.current = true;
    onWakeRef.current?.();
    setTimeout(() => { firedRef.current = false; }, 5000);
  }, []); // no deps — uses refs only

  useEffect(() => {
    // Main detection setup — runs ONCE on mount
    let stopped = false;
    let recognition = null;
    let audioCtx = null;
    let micStream = null;
    let rafId = null;

    const stop = () => {
      stopped = true;
      readyRef.current = false;
      if (recognition) { try { recognition.abort(); } catch {} }
      if (rafId) cancelAnimationFrame(rafId);
      if (micStream) micStream.getTracks().forEach(t => t.stop());
      if (audioCtx) { try { audioCtx.close(); } catch {} }
    };

    cleanupRef.current = stop;

    // ── VOICE WAKE WORD ───────────────────────────────────────
    const startVoice = () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        console.warn('[JARVIS Wake] SpeechRecognition not supported in this browser.');
        onReadyRef.current?.(false);
        return;
      }

      // Request mic permission to show the listening indicator and setup offline fallback
      navigator.mediaDevices?.getUserMedia({ audio: true })
        .then(stream => {
          micStream = stream;
          if (!stopped) {
            onReadyRef.current?.(true);
            setupOfflineAudio(stream);
          }
        })
        .catch(() => {
          if (!stopped) onReadyRef.current?.(false);
        });

      const recog = new SR();
      recog.continuous = true;
      recog.interimResults = true;
      recog.maxAlternatives = 3;
      recog.lang = 'en-US';
      recognition = recog;

      recog.onresult = (e) => {
        if (!readyRef.current) return;
        for (let i = e.resultIndex; i < e.results.length; i++) {
          for (let j = 0; j < e.results[i].length; j++) {
            const text = e.results[i][j].transcript.toLowerCase().trim();
            if (wakeWords.some(w => text.includes(w))) {
              fire();
              return;
            }
          }
        }
      };

      recog.onerror = (e) => {
        if (!stopped && e.error !== 'aborted') {
          setTimeout(() => { if (!stopped) { try { recog.start(); } catch {} } }, 300);
        }
      };

      recog.onend = () => {
        if (!stopped) {
          setTimeout(() => { if (!stopped) { try { recog.start(); } catch {} } }, 200);
        }
      };

      // Start after warmup
      setTimeout(() => {
        if (!stopped) {
          readyRef.current = true;
          try { recog.start(); } catch {}
        }
      }, warmupMs);
    };

    const setupOfflineAudio = (stream) => {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let lastWake = 0;

        const checkAudio = () => {
          if (stopped) return;
          if (!navigator.onLine && readyRef.current) {
            analyser.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const avg = sum / dataArray.length;
            
            // If offline, a loud noise (avg > 80) triggers wake
            if (avg > 80) {
              const now = Date.now();
              if (now - lastWake > 5000) {
                lastWake = now;
                fire();
              }
            }
          }
          rafId = requestAnimationFrame(checkAudio);
        };
        checkAudio();
      } catch (err) {
        console.warn('Offline audio fallback failed to init:', err);
      }
    };

    startVoice();

    return () => stop();
  }, []); // Empty deps — intentional. Callbacks via refs.
};

export default useWakeDetection;
