import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { applyDistortion, applyDelay, applyFilter } from "@/lib/audioEffects"; // Import audio effects

const AudioPlayer = ({ filename }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [effect, setEffect] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkName, setBookmarkName] = useState("");

  useEffect(() => {
    const savedPresets = JSON.parse(localStorage.getItem("audioPresets")) || [];
    setPresets(savedPresets);

    const savedBookmarks = JSON.parse(localStorage.getItem("audioBookmarks")) || [];
    setBookmarks(savedBookmarks);
  }, []);

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    fetch(`http://localhost:3001/stream/${filename}`)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(buffer => setAudioBuffer(buffer));
  }, [filename]);

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

  const applyEffect = () => {
    if (!audioContext || !audioBuffer) return;

    let source;
    switch (effect) {
      case "distortion":
        source = applyDistortion(audioContext, audioBuffer, 400);
        break;
      case "delay":
        source = applyDelay(audioContext, audioBuffer, 0.5);
        break;
      case "filter":
        source = applyFilter(audioContext, audioBuffer, "lowshelf", 1000);
        break;
      default:
        return;
    }

    source.start();
    setIsPlaying(true);
  };

  const addBookmark = () => {
    if (!bookmarkName) {
      toast.error("Bookmark name cannot be empty.");
      return;
    }
    const newBookmark = { name: bookmarkName, time: audioRef.current.currentTime };
    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    localStorage.setItem("audioBookmarks", JSON.stringify(updatedBookmarks));
    toast("Bookmark added successfully!");
  };

  const goToBookmark = (time) => {
    audioRef.current.currentTime = time;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center space-y-4 responsive-padding">
      <audio ref={audioRef} src={`http://localhost:3001/stream/${filename}`} />
      <div className="flex space-x-2 responsive-margin">
        <Button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={handleStop}>Stop</Button>
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Volume</label>
        <Slider value={volume} onChange={handleVolumeChange} max={1} step={0.01} />
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Bass</label>
        <Slider value={bass} onChange={handleBassChange} max={100} step={1} />
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Treble</label>
        <Slider value={treble} onChange={handleTrebleChange} max={100} step={1} />
      </div>
      <div className="w-full max-w-xs responsive-margin">
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
        <Button onClick={() => applyPreset(selectedPreset)} className="mt-2 responsive-button">
          Apply Preset
        </Button>
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Save Preset</label>
        <Input type="text" placeholder="Preset Name" id="presetName" />
        <Button onClick={() => savePreset(document.getElementById("presetName").value)} className="mt-2 responsive-button">
          Save Preset
        </Button>
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Effects</label>
        <Select onValueChange={setEffect}>
          <SelectTrigger>
            <SelectValue placeholder="Select an effect" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distortion">Distortion</SelectItem>
            <SelectItem value="delay">Delay</SelectItem>
            <SelectItem value="filter">Filter</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={applyEffect} className="mt-2 responsive-button">
          Apply Effect
        </Button>
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Bookmarks</label>
        <Input type="text" placeholder="Bookmark Name" value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
        <Button onClick={addBookmark} className="mt-2 responsive-button">
          Add Bookmark
        </Button>
        <ul className="mt-2 responsive-margin">
          {bookmarks.map((bookmark, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{bookmark.name}</span>
              <Button onClick={() => goToBookmark(bookmark.time)} className="ml-2 responsive-button">
                Go
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AudioPlayer;