import { useEffect, useRef } from 'react';

export function useAntiCheat(onCheat: () => void) {
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Basic alarm sound using oscillators if no audio file is available
    // But for a better experience, we'd use a real sound.
    // Let's create a simple oscillator alarm.
    
    let audioCtx: AudioContext | null = null;
    
    function playAlarm() {
      if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onCheat();
        playAlarm();
      }
    };

    const handleBlur = () => {
      onCheat();
      playAlarm();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      if (audioCtx) audioCtx.close();
    };
  }, [onCheat]);
}
