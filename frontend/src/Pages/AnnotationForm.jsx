
import React, { useState } from 'react';

const AnnotationForm = ({ document, onSave, onCancel, loading }) => {
    const [annotation, setAnnotation] = useState({
        textSnapshot: '',
        comment: '',
        startOffset: 0,
        endOffset: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...annotation,
            documentId: document._id,
            documentVersion: document.version
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnnotation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {/* Text Snapshot */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Snapshot <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="textSnapshot"
                        value={annotation.textSnapshot}
                        onChange={handleChange}
                        placeholder="Paste or type the text you want to annotate..."
                        className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {annotation.textSnapshot.length}/500 characters
                    </p>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comment
                    </label>
                    <textarea
                        name="comment"
                        value={annotation.comment}
                        onChange={handleChange}
                        placeholder="Add your comments about this annotation..."
                        className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {annotation.comment.length}/250 characters
                    </p>
                </div>

                {/* Offset Inputs */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Offset
                        </label>
                        <input
                            type="number"
                            name="startOffset"
                            value={annotation.startOffset}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Offset
                        </label>
                        <input
                            type="number"
                            name="endOffset"
                            value={annotation.endOffset}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Document Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Document Information</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex">
                            <span className="text-blue-600 w-16 flex-shrink-0">Title:</span>
                            <span className="text-gray-700 font-medium truncate">{document.title}</span>
                        </div>
                        <div className="flex">
                            <span className="text-blue-600 w-16 flex-shrink-0">Version:</span>
                            <span className="text-gray-700">{document.version || 'N/A'}</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Fixed Bottom Buttons */}
            <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        disabled={loading || !annotation.textSnapshot.trim()}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            'Save Annotation'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-white text-gray-700 py-2.5 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AnnotationForm;