import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("wav");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormatChange = (event) => {
    setOutputFormat(event.target.value);
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to convert.");
      return;
    }

    setIsConverting(true);

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const fileData = await fetchFile(selectedFile);
    ffmpeg.FS("writeFile", selectedFile.name, fileData);

    const outputFileName = `output.${outputFormat}`;
    await ffmpeg.run("-i", selectedFile.name, outputFileName);

    const output = ffmpeg.FS("readFile", outputFileName);
    const outputBlob = new Blob([output.buffer], { type: `audio/${outputFormat}` });
    const outputUrl = URL.createObjectURL(outputBlob);

    setConvertedFile(outputUrl);
    setIsConverting(false);
    toast("File converted successfully!");
  };

  return (
    <Card className="mt-4 responsive-margin">
      <CardHeader>
        <CardTitle>Audio Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 responsive-margin">
          <label>Select File</label>
          <Input type="file" onChange={handleFileChange} />
        </div>
        <div className="mb-4 responsive-margin">
          <label>Select Output Format</label>
          <select value={outputFormat} onChange={handleFormatChange} className="responsive-margin">
            <option value="wav">WAV</option>
            <option value="mp3">MP3</option>
            <option value="flac">FLAC</option>
            <option value="aac">AAC</option>
          </select>
        </div>
        <Button onClick={handleConvert} disabled={isConverting} className="responsive-button">
          {isConverting ? "Converting..." : "Convert"}
        </Button>
        {convertedFile && (
          <div className="mt-4 responsive-margin">
            <a href={convertedFile} download={`converted.${outputFormat}`}>
              <Button className="responsive-button">Download Converted File</Button>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioConverter;