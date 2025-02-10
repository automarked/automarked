import { useState, useEffect, useCallback } from "react";

const useSound = (soundFile: string) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Carregar o som na montagem do componente
  useEffect(() => {
    const audio = new Audio("/sounds/notification.mp3");
    setAudioElement(audio);

    // Limpar recurso ao desmontar
    return () => {
      audio.pause();
      setAudioElement(null);
    };
  }, [soundFile]); // Apenas "soundFile" como dependência

  // Tocar o som
  const playSound = useCallback(() => {
    if (audioElement) {
      audioElement.currentTime = 0; // Reinicia o som do início
      audioElement
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Erro ao tocar o som:", error));
    }
  }, [audioElement]);

  // Parar o som
  const stopSound = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0; // Reseta o som para o início
      setIsPlaying(false);
    }
  }, [audioElement]);

  return { playSound, stopSound, isPlaying };
};

export default useSound;
