import { useState } from "react";
import { uploadDocumentApi } from "../Redux/Feature/AnnotationApi";

const UploadDocument = () => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setError("");
        setSuccess("");

        if (selectedFile) {
            if (selectedFile.type === "application/pdf") {
                setFilePreview(URL.createObjectURL(selectedFile));
            } else if (selectedFile.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = (e) => setFilePreview(e.target.result);
                reader.readAsText(selectedFile);
            } else {
                setFilePreview(null);
                setError("Only PDF and TXT files are supported");
            }
            
            // Auto-generate title from filename (without extension)
            if (!title) {
                const fileName = selectedFile.name;
                const titleName = fileName.substring(0, fileName.lastIndexOf('.'));
                setTitle(titleName || fileName);
            }
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        if (!title.trim()) {
            setError("Please enter a title for the document.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            // Change from "document" to "file" to match backend
            formData.append("file", file);
            formData.append("title", title);

            // If it's a text file, also send content as text
            if (file.type === "text/plain") {
                const textContent = await file.text();
                formData.append("content", textContent);
            }

            const response = await uploadDocumentApi(formData);
            console.log("Upload successful:", response.data);
            
            setSuccess("Document uploaded successfully!");
            // Reset form
            setFile(null);
            setTitle("");
            setFilePreview(null);
            
        } catch (error) {
            console.error("Upload error:", error);
            if (error.response) {
                setError(error.response.data?.message || "Failed to upload document.");
            } else if (error.request) {
                setError("Network error. Please check your connection.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        
        if (droppedFile) {
            if (droppedFile.type === "application/pdf" || droppedFile.type === "text/plain") {
                handleFileChange({ target: { files: [droppedFile] } });
            } else {
                setError("Only PDF and TXT files are supported");
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Upload Document
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {/* Title Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Document Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter document title"
                    />
                </div>

                {/* File Upload Box */}
                <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                        }`}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("fileInput").click()}
                >
                    <input
                        type="file"
                        accept=".pdf,.txt,.text"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div>
                        <p className="text-gray-600">Drag & drop a PDF or Text file</p>
                        <p className="text-sm text-gray-400">or click to browse</p>
                    </div>

                    {file && (
                        <p className="mt-3 text-sm text-green-600">
                            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                    )}
                </div>

                {/* File Preview */}
                {filePreview && file && (
                    <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
                        {file.type === "application/pdf" ? (
                            <div className="w-full h-48 overflow-hidden">
                                <iframe 
                                    src={filePreview} 
                                    className="w-full h-full" 
                                    title="PDF Preview" 
                                />
                            </div>
                        ) : (
                            <div className="max-h-48 overflow-auto">
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-100 p-2 rounded">
                                    {filePreview.length > 500 ? filePreview.substring(0, 500) + "..." : filePreview}
                                </pre>
                                {filePreview.length > 500 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Showing first 500 characters
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Upload Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className={`mt-6 w-full py-2 rounded-xl font-medium transition ${loading || !file
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        "Upload Document"
                    )}
                </button>

                <p className="text-xs text-gray-400 mt-4 text-center">
                    Supported formats: PDF, TXT (Max size: 10MB)
                </p>
            </div>
        </div>
    );
};

export default UploadDocument;