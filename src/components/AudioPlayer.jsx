import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { applyDistortion, applyDelay, applyFilter, applyEqualizer, applyNoiseReduction, detectClipping, normalizeAudio } from "@/lib/audioEffects"; // Import additional audio effects

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
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);
  const [equalizerSettings, setEqualizerSettings] = useState({ low: 0, mid: 0, high: 0 });
  const [clippingDetected, setClippingDetected] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

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
      case "equalizer":
        source = applyEqualizer(audioContext, audioBuffer, equalizerSettings);
        break;
      case "noiseReduction":
        source = applyNoiseReduction(audioContext, audioBuffer);
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

  const handlePlaybackSpeedChange = (value) => {
    setPlaybackSpeed(value);
    audioRef.current.playbackRate = value;
  };

  const handleLoopToggle = () => {
    setIsLooping(!isLooping);
    if (isLooping) {
      audioRef.current.loop = false;
    } else {
      audioRef.current.loop = true;
      audioRef.current.currentTime = loopStart;
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current.currentTime >= loopEnd) {
          audioRef.current.currentTime = loopStart;
        }
      };
    }
  };

  const handleFadeInChange = (value) => {
    setFadeIn(value);
    // Apply fade-in effect using Web Audio API or any other method
  };

  const handleFadeOutChange = (value) => {
    setFadeOut(value);
    // Apply fade-out effect using Web Audio API or any other method
  };

  const handleEqualizerChange = (band, value) => {
    setEqualizerSettings({ ...equalizerSettings, [band]: value });
    // Apply equalizer effect using Web Audio API or any other method
  };

  const handleDetectClipping = () => {
    const clipping = detectClipping(audioBuffer);
    setClippingDetected(clipping);
    if (clipping) {
      toast.error("Clipping detected in the audio file.");
    } else {
      toast("No clipping detected.");
    }
  };

  const handleNormalizeAudio = () => {
    const normalizedBuffer = normalizeAudio(audioBuffer);
    setAudioBuffer(normalizedBuffer);
    toast("Audio normalized successfully!");
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack.pop();
      setRedoStack([...redoStack, lastAction]);
      // Apply undo logic based on lastAction
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastUndoneAction = redoStack.pop();
      setUndoStack([...undoStack, lastUndoneAction]);
      // Apply redo logic based on lastUndoneAction
    }
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
        <label>Playback Speed</label>
        <Slider value={playbackSpeed} onChange={handlePlaybackSpeedChange} max={2} step={0.1} />
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Loop Start</label>
        <Input type="number" value={loopStart} onChange={(e) => setLoopStart(e.target.value)} />
        <label>Loop End</label>
        <Input type="number" value={loopEnd} onChange={(e) => setLoopEnd(e.target.value)} />
        <Button onClick={handleLoopToggle} className="mt-2 responsive-button">
          {isLooping ? "Stop Looping" : "Start Looping"}
        </Button>
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Fade In</label>
        <Slider value={fadeIn} onChange={handleFadeInChange} max={10} step={0.1} />
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Fade Out</label>
        <Slider value={fadeOut} onChange={handleFadeOutChange} max={10} step={0.1} />
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <label>Equalizer</label>
        <label>Low</label>
        <Slider value={equalizerSettings.low} onChange={(value) => handleEqualizerChange("low", value)} max={100} step={1} />
        <label>Mid</label>
        <Slider value={equalizerSettings.mid} onChange={(value) => handleEqualizerChange("mid", value)} max={100} step={1} />
        <label>High</label>
        <Slider value={equalizerSettings.high} onChange={(value) => handleEqualizerChange("high", value)} max={100} step={1} />
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <Button onClick={handleDetectClipping} className="responsive-button">
          Detect Clipping
        </Button>
        {clippingDetected && <p className="text-red-500">Clipping detected!</p>}
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <Button onClick={handleNormalizeAudio} className="responsive-button">
          Normalize Audio
        </Button>
      </div>
      <div className="w-full max-w-xs responsive-margin">
        <Button onClick={handleUndo} className="responsive-button">
          Undo
        </Button>
        <Button onClick={handleRedo} className="responsive-button">
          Redo
        </Button>
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
            <SelectItem value="equalizer">Equalizer</SelectItem>
            <SelectItem value="noiseReduction">Noise Reduction</SelectItem>
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