import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { removeSilence } from "@/lib/audioUtils"; // Import the utility function
import { isolateVocals } from "@/lib/vocalIsolation"; // Import the vocal isolation function

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
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const editedAudioBlob = await removeSilence(audioBlob); // Remove silence
    const vocalsBlob = await isolateVocals(editedAudioBlob); // Isolate vocals
    const url = URL.createObjectURL(vocalsBlob);
    setAudioURL(url);
    audioChunksRef.current = [];
  };

  return (
    <div className="flex flex-col items-center space-y-4 responsive-padding">
      <Button onClick={isRecording ? handleStopRecording : handleStartRecording} className="responsive-button">
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {audioURL && (
        <div className="mt-4 responsive-margin">
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

export default AudioRecorderComponent;