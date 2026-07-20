import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser.');
      return;
    }
    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (e) => {
      const t = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join('');
      setTranscript(t);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if we haven't manually stopped it
      if (shouldListenRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current) {
            try {
              recognition.start();
              setIsListening(true);
            } catch (e) {}
          }
        }, 300);
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
      if (e.error === 'no-speech' && shouldListenRef.current) {
        // On no-speech, it also ends. The onend handler will restart it.
      } else if (e.error === 'not-allowed') {
        shouldListenRef.current = false;
      }
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    shouldListenRef.current = true;
    setTranscript('');
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (!recognitionRef.current || !isListening) return;
    setIsListening(false);
    recognitionRef.current.stop();
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.92;
    utterance.pitch = options.pitch || 0.85;
    utterance.volume = options.volume || 0.9;

    // Try to find a deep male voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.toLowerCase().includes('male') ||
        v.name.includes('Daniel') ||
        v.name.includes('David') ||
        v.name.includes('Google UK English Male')
    );
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    speak,
    cancelSpeech,
  };
};

export default useSpeech;
