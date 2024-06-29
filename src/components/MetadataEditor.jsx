import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const MetadataEditor = ({ file }) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [coverArt, setCoverArt] = useState(null);

  const handleSaveMetadata = () => {
    // Logic to save metadata
    toast("Metadata saved successfully!");
  };

  return (
    <Card className="mt-4 responsive-margin">
      <CardHeader>
        <CardTitle>Edit Metadata for {file.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 responsive-margin">
          <label>Title</label>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4 responsive-margin">
          <label>Artist</label>
          <Input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>
        <div className="mb-4 responsive-margin">
          <label>Album</label>
          <Input
            type="text"
            placeholder="Album"
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
          />
        </div>
        <div className="mb-4 responsive-margin">
          <label>Genre</label>
          <Input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div className="mb-4 responsive-margin">
          <label>Cover Art</label>
          <Input
            type="file"
            onChange={(e) => setCoverArt(e.target.files[0])}
          />
        </div>
        <Button onClick={handleSaveMetadata} className="responsive-button">Save Metadata</Button>
      </CardContent>
    </Card>
  );
};

export default MetadataEditor;