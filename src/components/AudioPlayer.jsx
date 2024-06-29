import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <audio ref={audioRef} src={src} />
      <div className="flex space-x-2">
        <Button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={handleStop}>Stop</Button>
      </div>
    </div>
  );
};

export default AudioPlayer;