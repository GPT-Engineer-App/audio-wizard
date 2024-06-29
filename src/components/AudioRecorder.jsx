import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { removeSilence } from "@/lib/audioUtils"; // Import the utility function

const AudioRecorderComponent = () => {
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const editedAudioBlob = await removeSilence(audioBlob); // Remove silence
      const url = URL.createObjectURL(editedAudioBlob);
      setAudioURL(url);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

export default AudioRecorderComponent;