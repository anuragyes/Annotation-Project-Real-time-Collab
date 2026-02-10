import useAnnotationSocket from "../Socket/useAnnotationSocket";

const DocumentViewer = ({ documentId }) => {
  useAnnotationSocket(documentId);

  return (
    <div>
      {/* PDF / Text Viewer */}
      {/* Annotation list */}
    </div>
  );
};

export default DocumentViewer;
