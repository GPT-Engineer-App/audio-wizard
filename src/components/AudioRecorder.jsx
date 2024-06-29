import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

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
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
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