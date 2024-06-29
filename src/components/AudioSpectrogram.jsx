import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import SpectrogramPlugin from "wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js";

const AudioSpectrogram = ({ src }) => {
  const spectrogramRef = useRef(null);
  const waveSurfer = useRef(null);

  useEffect(() => {
    if (spectrogramRef.current) {
      waveSurfer.current = WaveSurfer.create({
        container: spectrogramRef.current,
        waveColor: "#ddd",
        progressColor: "#ff5500",
        cursorColor: "#ff5500",
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 100,
        plugins: [
          SpectrogramPlugin.create({
            container: spectrogramRef.current,
            labels: true,
          }),
        ],
      });

      waveSurfer.current.load(src);

      return () => waveSurfer.current.destroy();
    }
  }, [src]);

  return <div ref={spectrogramRef} />;
};

export default AudioSpectrogram;