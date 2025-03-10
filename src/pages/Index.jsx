import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import AudioRecorderComponent from "@/components/AudioRecorder";
import AudioPlayer from "@/components/AudioPlayer";
import AudioWaveform from "@/components/AudioWaveform";
import AudioSpectrogram from "@/components/AudioSpectrogram";
import BatchAudioProcessor from "@/components/BatchAudioProcessor";
import LiveAudioStream from "@/components/LiveAudioStream";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const handleLogin = () => {
    // Dummy authentication logic
    if (username === "user" && password === "password") {
      setMessageType("success");
      setMessage("Login successful!");
    } else {
      setMessageType("error");
      setMessage("Invalid username or password.");
    }
  };

  return (
    <div className="container h-screen w-screen flex items-center justify-center">
      <div className="w-full max-w-xs responsive-padding">
        <h1 className="text-3xl text-center mb-4 responsive-text">Login</h1>
        <div className="mb-4 responsive-margin">
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4 responsive-margin">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleLogin} className="w-full responsive-button">
          Login
        </Button>
        {message && (
          <Alert className={`mt-4 ${messageType === "error" ? "bg-red-100" : "bg-green-100"}`}>
            <AlertTitle>{messageType === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <AudioRecorderComponent />
        <AudioPlayer src="path/to/your/audio/file.mp3" />
        <AudioWaveform src="path/to/your/audio/file.mp3" />
        <AudioSpectrogram src="path/to/your/audio/file.mp3" />
        <BatchAudioProcessor />
        <LiveAudioStream />
        <div className="mt-4 responsive-margin">
          <Link to="/file-management">
            <Button className="w-full responsive-button">Go to File Management</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;