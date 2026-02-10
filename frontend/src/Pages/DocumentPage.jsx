import DocumentContent from  "../Components/DocumentContent"
import AnnotationPanel from "../Components/AnnotationPanel"

const DocumentPage = ({ document }) => {
  return (
    <div style={{ display: "flex" }}>
      
      {/* LEFT SIDE: DOCUMENT */}
      <div style={{ flex: 3, padding: "16px" }}>
        <DocumentContent document={document} />
      </div>

      {/* RIGHT SIDE: EDIT PANEL */}
      <div style={{ flex: 1, borderLeft: "1px solid #ddd" }}>
        <AnnotationPanel />
      </div>

    </div>
  );
};

export default DocumentPage;
