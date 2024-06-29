import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const AudioTranscription = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const { resetTranscript } = useSpeechRecognition();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleTranscribe = () => {
    if (!selectedFile) {
      toast.error("Please select a file to transcribe.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.decodeAudioData(e.target.result, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);

        SpeechRecognition.startListening({
          continuous: true,
          language: "en-US",
        });

        source.onended = () => {
          SpeechRecognition.stopListening();
          setTranscript(SpeechRecognition.browserSupportsSpeechRecognition() ? SpeechRecognition.getRecognition().transcript : "Speech recognition not supported in this browser.");
        };
      });
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <Card className="mt-4 responsive-margin">
      <CardHeader>
        <CardTitle>Audio Transcription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 responsive-margin">
          <label>Select File</label>
          <Input type="file" onChange={handleFileChange} />
        </div>
        <Button onClick={handleTranscribe} className="responsive-button">
          Transcribe
        </Button>
        {transcript && (
          <div className="mt-4 responsive-margin">
            <h2 className="text-xl responsive-text">Transcript</h2>
            <p>{transcript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioTranscription;