import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import MetadataEditor from "@/components/MetadataEditor"; // Import the MetadataEditor component
import AudioConverter from "@/components/AudioConverter"; // Import the AudioConverter component
import AudioTranscription from "@/components/AudioTranscription"; // Import the AudioTranscription component

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // State to track selected file for metadata editing

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
    toast("Files uploaded successfully!");
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() === "") {
      toast.error("Folder name cannot be empty.");
      return;
    }
    setFolders([...folders, newFolderName]);
    setNewFolderName("");
    toast("Folder created successfully!");
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="container p-4 responsive-padding">
      <Tabs defaultValue="files">
        <TabsList className="responsive-margin">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>
        <TabsContent value="files">
          <Card className="responsive-margin">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="file" multiple onChange={handleFileUpload} />
            </CardContent>
          </Card>
          <div className="mt-4 responsive-margin">
            <h2 className="text-xl responsive-text">Uploaded Files</h2>
            <ul className="responsive-grid">
              {files.map((file, index) => (
                <li key={index} onClick={() => handleFileClick(file)}>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="folders">
          <Card className="responsive-margin">
            <CardHeader>
              <CardTitle>Create Folder</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Folder Name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={handleCreateFolder} className="mt-2 responsive-button">
                Create Folder
              </Button>
            </CardContent>
          </Card>
          <div className="mt-4 responsive-margin">
            <h2 className="text-xl responsive-text">Folders</h2>
            <ul className="responsive-grid">
              {folders.map((folder, index) => (
                <li key={index}>{folder}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
      {selectedFile && (
        <MetadataEditor file={selectedFile} />
      )}
      <AudioConverter />
      <AudioTranscription />
    </div>
  );
};

export default FileManagement;