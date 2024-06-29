import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioWaveform = ({ src }) => {
  const waveformRef = useRef(null);
  const waveSurfer = useRef(null);

  useEffect(() => {
    if (waveformRef.current) {
      waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#ff5500",
        cursorColor: "#ff5500",
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 100,
      });

      waveSurfer.current.load(src);

      return () => waveSurfer.current.destroy();
    }
  }, [src]);

  return <div ref={waveformRef} />;
};

export default AudioWaveform;