import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const AudioPlayer = ({ filename }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);

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

  const handleVolumeChange = (value) => {
    setVolume(value);
    audioRef.current.volume = value;
  };

  const handleBassChange = (value) => {
    setBass(value);
    // Apply bass effect using Web Audio API or any other method
  };

  const handleTrebleChange = (value) => {
    setTreble(value);
    // Apply treble effect using Web Audio API or any other method
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <audio ref={audioRef} src={`http://localhost:3001/stream/${filename}`} />
      <div className="flex space-x-2">
        <Button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={handleStop}>Stop</Button>
      </div>
      <div className="w-full max-w-xs">
        <label>Volume</label>
        <Slider value={volume} onChange={handleVolumeChange} max={1} step={0.01} />
      </div>
      <div className="w-full max-w-xs">
        <label>Bass</label>
        <Slider value={bass} onChange={handleBassChange} max={100} step={1} />
      </div>
      <div className="w-full max-w-xs">
        <label>Treble</label>
        <Slider value={treble} onChange={handleTrebleChange} max={100} step={1} />
      </div>
    </div>
  );
};

export default AudioPlayer;