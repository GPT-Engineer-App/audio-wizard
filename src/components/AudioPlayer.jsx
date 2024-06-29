import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AudioPlayer = ({ filename }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState("");

  useEffect(() => {
    const savedPresets = JSON.parse(localStorage.getItem("audioPresets")) || [];
    setPresets(savedPresets);
  }, []);

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

  const savePreset = (presetName) => {
    if (!presetName) {
      toast.error("Preset name cannot be empty.");
      return;
    }
    const newPreset = { name: presetName, volume, bass, treble };
    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem("audioPresets", JSON.stringify(updatedPresets));
    toast("Preset saved successfully!");
  };

  const applyPreset = (presetName) => {
    const preset = presets.find((p) => p.name === presetName);
    if (preset) {
      setVolume(preset.volume);
      setBass(preset.bass);
      setTreble(preset.treble);
      audioRef.current.volume = preset.volume;
      // Apply bass and treble effects using Web Audio API or any other method
      toast("Preset applied successfully!");
    }
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
      <div className="w-full max-w-xs">
        <label>Presets</label>
        <Select onValueChange={setSelectedPreset}>
          <SelectTrigger>
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset, index) => (
              <SelectItem key={index} value={preset.name}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => applyPreset(selectedPreset)} className="mt-2">
          Apply Preset
        </Button>
      </div>
      <div className="w-full max-w-xs">
        <label>Save Preset</label>
        <Input type="text" placeholder="Preset Name" id="presetName" />
        <Button onClick={() => savePreset(document.getElementById("presetName").value)} className="mt-2">
          Save Preset
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;