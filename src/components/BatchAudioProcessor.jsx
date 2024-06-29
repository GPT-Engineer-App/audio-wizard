import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { removeSilence } from "@/lib/audioUtils";
import { isolateVocals } from "@/lib/vocalIsolation";

const BatchAudioProcessor = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelection = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const processFiles = async () => {
    setProcessing(true);
    setProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const audioBlob = new Blob([file], { type: file.type });

      const editedAudioBlob = await removeSilence(audioBlob);
      const vocalsBlob = await isolateVocals(editedAudioBlob);

      // Save or use the processed file (vocalsBlob) as needed
      // For example, you can create a download link:
      const url = URL.createObjectURL(vocalsBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `processed_${file.name}`;
      a.click();

      setProgress(((i + 1) / selectedFiles.length) * 100);
    }

    setProcessing(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 responsive-padding">
      <input type="file" multiple onChange={handleFileSelection} className="responsive-margin" />
      <Button onClick={processFiles} disabled={processing} className="responsive-button">
        {processing ? `Processing... ${progress.toFixed(2)}%` : "Start Batch Processing"}
      </Button>
    </div>
  );
};

export default BatchAudioProcessor;