"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);

      const shareRequest = await fetch("/api/share", {
        method: "POST",
        body: JSON.stringify({ url: signedUrl }),
      });

      const shareResponse = await shareRequest.json();
      console.log(shareResponse);

      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target?.files?.[0]);
  };

return (
    <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <a href="#" className="text-white text-lg font-semibold">Secure Data Sharing</a>
                <div>
                    <a href="/share" className="text-white mr-4">Share</a>
                    <button 
                        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
                        onClick={uploadFile}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </nav>
        <main className="container mx-auto flex flex-col justify-center items-center py-10">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <input 
                    type="file" 
                    onChange={handleChange} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button 
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={uploadFile}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
                {url && (
                    <div className="mt-4 p-4 bg-gray-200 rounded text-center">
                        <a
                            className="text-blue-500"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {url}
                        </a>
                    </div>
                )}
            </div>
        </main>
    </div>
);
}
