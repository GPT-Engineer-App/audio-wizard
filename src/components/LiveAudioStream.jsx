import React, { useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { Button } from "@/components/ui/button";

const LiveAudioStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [peer, setPeer] = useState(null);
  const audioRef = useRef(null);

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRef.current.srcObject = stream;

    const newPeer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    newPeer.on("signal", (data) => {
      // Send signal data to the server or the other peer
      console.log("SIGNAL", data);
    });

    newPeer.on("connect", () => {
      console.log("Peer connected");
    });

    newPeer.on("stream", (remoteStream) => {
      audioRef.current.srcObject = remoteStream;
    });

    setPeer(newPeer);
    setIsStreaming(true);
  };

  const stopStreaming = () => {
    if (peer) {
      peer.destroy();
    }
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 responsive-padding">
      <audio ref={audioRef} autoPlay className="responsive-margin" />
      <div className="flex space-x-2 responsive-margin">
        <Button onClick={startStreaming} disabled={isStreaming} className="responsive-button">
          Start Streaming
        </Button>
        <Button onClick={stopStreaming} disabled={!isStreaming} className="responsive-button">
          Stop Streaming
        </Button>
      </div>
    </div>
  );
};

export default LiveAudioStream;