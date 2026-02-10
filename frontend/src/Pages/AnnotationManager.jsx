

// AnnotationManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';  //   from MyVirtualizedList   
import { createAnnotationApi, fetchAnnotationsApi, GetAllDocumentsApi } from '../Redux/Feature/AnnotationApi';
import AnnotationForm from './AnnotationForm';

const AnnotationManager = () => {
    // States
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState({ documents: false, annotations: false, saving: false });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle escape key to close edit panel
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isEditing) {
                setIsEditing(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isEditing]);

    // Fetch all documents on component mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    // Fetch documents from API
    const fetchDocuments = async () => {
        try {
            setLoading(prev => ({ ...prev, documents: true }));
            const response = await GetAllDocumentsApi({
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data && response.data.documents) {
                setDocuments(response.data.documents);
            } else if (Array.isArray(response.data)) {
                setDocuments(response.data);
            } else {
                setError("Invalid response structure from API");
            }
            setError("");
        } catch (err) {
            setError("Failed to fetch documents");
            console.error("Error fetching documents:", err);
        } finally {
            setLoading(prev => ({ ...prev, documents: false }));
        }
    };

    // Fetch annotations for selected document
    const fetchAnnotations = async (documentId) => {
        try {
            setLoading(prev => ({ ...prev, annotations: true }));
            const response = await fetchAnnotationsApi(documentId, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data && Array.isArray(response.data)) {
                setAnnotations(response.data);
            } else if (response.data && response.data.annotations) {
                setAnnotations(response.data.annotations);
            } else if (response.data && response.data.success && response.data.data) {
                setAnnotations(response.data.data);
            } else {
                setAnnotations([]);
            }

            setError('');
        } catch (err) {
            setError('Failed to fetch annotations');
            console.error('Error fetching annotations:', err);
        } finally {
            setLoading(prev => ({ ...prev, annotations: false }));
        }
    };

    // Handle document selection
    const handleDocumentSelect = (document) => {
        setSelectedDocument(document);
        fetchAnnotations(document._id);
        setIsEditing(false);
    };

    // Handle edit button click
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Handle save annotation
    const handleSaveAnnotation = async (annotationData) => {
        try {

            setLoading(prev => ({ ...prev, saving: true }));

            const response = await createAnnotationApi(annotationData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });



            setSuccess("Annotation saved successfully!");
            fetchAnnotations(selectedDocument?._id);

            setTimeout(() => {
                setIsEditing(false);
                setSuccess("");
            }, 2000);

        } catch (err) {
            console.error(" Error saving annotation:", err);
            console.error(" Server response:", err?.response?.data);
            setError("Failed to save annotation");
        } finally {
            setLoading(prev => ({ ...prev, saving: false }));
            console.log("🔁 Saving state reset");
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Document & Annotation Manager
                        </h1>
                        <p className="text-gray-600 mt-2">Manage your documents and add annotations</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={() => fetchDocuments()}
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-fadeIn">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-fadeIn">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel - Documents List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Documents</h2>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {documents.length} items
                                </span>
                            </div>

                            {loading.documents && !documents.length ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="animate-pulse">
                                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-3">
                                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No documents found</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc._id}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${selectedDocument?._id === doc._id
                                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                                                }`}
                                            onClick={() => handleDocumentSelect(doc)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-800 truncate">{doc.title}</h3>
                                                {selectedDocument?._id === doc._id && (
                                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-3 space-y-1">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Version: {doc.version || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{formatDate(doc.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Panel - Document Details & Annotations */}
                    <div className="lg:col-span-2">
                        {selectedDocument ? (
                            <div className="space-y-6">
                                {/* Document Details Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.title}</h2>
                                                    <p className="text-gray-600 text-sm">Document details and annotations</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                               

                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Timestamps</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Created:</span>
                                                            <span className="font-medium text-gray-900">{formatDate(selectedDocument.createdAt)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Updated:</span>
                                                            <span className="font-medium text-gray-900">{formatDate(selectedDocument.updatedAt || selectedDocument.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleEditClick}
                                            disabled={isEditing}
                                            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            {isEditing ? 'Adding Annotation...' : 'Add Annotation'}
                                        </button>
                                    </div>

                                    {/* Document Content */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Document Content
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                                            <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                                                {selectedDocument.content || 'No content available'}
                                            </pre>
                                        </div>
                                    </div>
                                </div>

                                {/* Annotations Card */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <h3 className="text-xl font-bold text-gray-800">Annotations</h3>
                                            <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                                {annotations.length} {annotations.length === 1 ? 'annotation' : 'annotations'}
                                            </span>
                                        </div>
                                        {loading.annotations && (
                                            <div className="flex items-center text-gray-500">
                                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Loading...
                                            </div>
                                        )}
                                    </div>

                                    {annotations.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                            <div className="text-gray-400 mb-4">
                                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-600 mb-2">No Annotations Yet</h4>
                                            <p className="text-gray-500 mb-4">Start by adding your first annotation</p>
                                            <button
                                                onClick={handleEditClick}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Add First Annotation
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                            {annotations.map((annotation) => (
                                                <div key={annotation._id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all bg-gradient-to-r from-white to-gray-50">
                                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                                        <div>
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                    v{annotation.version || '1'}
                                                                </div>
                                                                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                                    Doc v{annotation.documentVersion || '1'}
                                                                </div>
                                                            </div>
                                                          
                                                        </div>
                                                        <div className="mt-2 md:mt-0 text-xs text-gray-500">
                                                            {formatDate(annotation.updatedAt || annotation.createdAt)}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                Text Snapshot
                                                            </h5>
                                                            <div className="bg-white p-4 rounded-lg border border-gray-100">
                                                                <p className="text-gray-800 italic">"{annotation.textSnapshot}"</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                                </svg>
                                                                Comment
                                                            </h5>
                                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                                <p className="text-gray-700">{annotation.comment || 'No comment provided'}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="text-xs text-gray-500 mb-1">Character Range</div>
                                                                <div className="font-medium text-gray-800">
                                                                    {annotation.startOffset || 0} → {annotation.endOffset || 0}
                                                                </div>
                                                            </div>
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="text-xs text-gray-500 mb-1">Created</div>
                                                                <div className="font-medium text-gray-800">{formatDate(annotation.createdAt)}</div>
                                                            </div>
                                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="text-xs text-gray-500 mb-1">Updated</div>
                                                                <div className="font-medium text-gray-800">{formatDate(annotation.updatedAt || annotation.createdAt)}</div>
                                                            </div>
                                                        </div>

                                                        {annotation.history && annotation.history.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                                <h6 className="text-sm font-medium text-gray-700 mb-3">History ({annotation.history.length} changes)</h6>
                                                                <div className="space-y-2">
                                                                    {annotation.history.slice(0, 3).map((hist, idx) => (
                                                                        <div key={idx} className="flex items-start text-xs">
                                                                            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded mr-3">
                                                                                v{hist.version || idx + 1}
                                                                            </div>
                                                                            <div className="text-gray-500 flex-1">{hist.comment || 'Updated'}</div>
                                                                        </div>
                                                                    ))}
                                                                    {annotation.history.length > 3 && (
                                                                        <div className="text-xs text-gray-500 italic">
                                                                            + {annotation.history.length - 3} more changes
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center h-full flex flex-col justify-center items-center">
                                <div className="mb-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto">
                                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Select a Document</h3>
                                <p className="text-gray-600 max-w-md mx-auto mb-8">
                                    Choose a document from the left panel to view its details, content, and annotations. You can also add new annotations to selected documents.
                                </p>
                                <div className="text-gray-400">
                                    <svg className="w-8 h-8 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Panel - Modern Sidebar */}

            {isEditing && selectedDocument && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

                    {/* Modal Container */}
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="bg-white p-2 rounded-lg mr-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">New Annotation</h2>
                                            <p className="text-blue-100 text-sm mt-1">
                                                Add annotation to: <span className="font-semibold">{selectedDocument.title}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-white hover:text-blue-100 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <AnnotationForm
                                    document={selectedDocument}
                                    onSave={handleSaveAnnotation}
                                    onCancel={() => setIsEditing(false)}
                                    loading={loading.saving}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnotationManager;