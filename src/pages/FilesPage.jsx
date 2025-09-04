import React, { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import FileUpload from "../components/file-upload/FileUpload";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { fileAPI } from "../services/api";
import {
  Search,
  Share2,
  Link as LinkIcon,
  Mail,
  Download,
  Trash2,
  File as GenericFile,
  Image,
  FileText,
  Copy,
  Check,
  X,
} from "lucide-react";

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "-";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const getIconForType = (type) => {
  if (!type) return GenericFile;
  if (type.startsWith("image/")) return Image;
  if (type.includes("pdf")) return FileText;
  return GenericFile;
};

const ShareModal = ({ file, open, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareLink = useMemo(() => {
    if (!file) return "";
    const token = btoa(`${file.id}:${Date.now()}`);
    return `${window.location.origin}/download/${file.id}?token=${token}`;
  }, [file]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  const sendEmail = () => {
    const subject = encodeURIComponent(`File shared with you: ${file?.name}`);
    const body = encodeURIComponent(
      `Hello,%0D%0A%0D%0AI've shared a file with you.%0D%0A%0D%0AFile: ${
        file?.name
      }\nSize: ${formatFileSize(
        file?.size
      )}%0D%0ADownload: ${shareLink}%0D%0A%0D%0ARegards,`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg border-0 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Share File</CardTitle>
              <CardDescription>
                Create a shareable link or send via email
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {file.type || "Unknown"} • {formatFileSize(file.size)}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Shareable Link
            </label>
            <div className="flex gap-2">
              <Input readOnly value={shareLink} className="flex-1" />
              <Button onClick={copyToClipboard} className="gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Note: This is a demo link generated on the client. Integrate with
              your backend to create secure, expiring links.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" className="gap-2" onClick={sendEmail}>
              <Mail className="h-4 w-4" />
              Share via Email
            </Button>
            <Button className="gap-2" onClick={copyToClipboard}>
              <LinkIcon className="h-4 w-4" /> Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const onFilesChange = (updated) => {
    setFiles(updated);
  };

  const filteredFiles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return files;
    return files.filter((f) => f.name.toLowerCase().includes(q));
  }, [files, search]);

  const totalSize = useMemo(
    () => files.reduce((sum, f) => sum + (f.size || 0), 0),
    [files]
  );

  const downloadLocalFile = async (fileObj) => {
    try {
      if (fileObj.file instanceof File || fileObj.file instanceof Blob) {
        const url = URL.createObjectURL(fileObj.file);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileObj.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }
      // Server-side fallback if file object isn't available (expects backend)
      if (fileObj.serverId) {
        const res = await fileAPI.download(fileObj.serverId);
        const url = URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = fileObj.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed. Check console for details.");
    }
  };

  const handleShare = (file) => {
    setSelectedFile(file);
    setShareOpen(true);
  };

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Layout showSidebar>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Files</h1>
              <p className="text-blue-100 text-lg">
                Upload, manage, and share your files securely
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <GenericFile className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Upload */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Drag and drop files or click to select them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              onFilesChange={onFilesChange}
              maxFiles={20}
              maxSize={200 * 1024 * 1024}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>
                  Files: <span className="font-semibold">{files.length}</span>
                </span>
                <span>
                  Total Size:{" "}
                  <span className="font-semibold">
                    {formatFileSize(totalSize)}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>Your uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <GenericFile className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No files found
                </h3>
                <p className="text-gray-500">Upload files to see them here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFiles.map((f) => {
                  const Icon = getIconForType(f.type);
                  return (
                    <Card
                      key={f.id}
                      className="border-0 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-sm font-medium text-gray-900 truncate"
                              title={f.name}
                            >
                              {f.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {f.type || "Unknown"} • {formatFileSize(f.size)}
                            </p>
                            <div className="mt-2">
                              {f.uploaded ? (
                                <Badge className="bg-green-100 text-green-800">
                                  Uploaded
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Uploading…
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => downloadLocalFile(f)}
                            disabled={!f.uploaded}
                            title={
                              !f.uploaded
                                ? "Wait until upload completes"
                                : "Download"
                            }
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleShare(f)}
                            disabled={!f.uploaded}
                            title={
                              !f.uploaded
                                ? "Wait until upload completes"
                                : "Share"
                            }
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(f.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Modal */}
        <ShareModal
          file={selectedFile}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default FilesPage;
