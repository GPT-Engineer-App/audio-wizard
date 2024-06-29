import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");

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

  return (
    <div className="p-4">
      <Tabs defaultValue="files">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="file" multiple onChange={handleFileUpload} />
            </CardContent>
          </Card>
          <div className="mt-4">
            <h2 className="text-xl">Uploaded Files</h2>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="folders">
          <Card>
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
              <Button onClick={handleCreateFolder} className="mt-2">
                Create Folder
              </Button>
            </CardContent>
          </Card>
          <div className="mt-4">
            <h2 className="text-xl">Folders</h2>
            <ul>
              {folders.map((folder, index) => (
                <li key={index}>{folder}</li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileManagement;