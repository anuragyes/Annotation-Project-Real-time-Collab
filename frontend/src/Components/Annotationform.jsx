import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAnnotation } from "../features/annotations/annotationThunks";

const AnnotationForm = ({ selection, documentId, onClose }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    dispatch(
      addAnnotation({
        documentId,
        startOffset: selection.startOffset,
        endOffset: selection.endOffset,
        textSnapshot: selection.textSnapshot,
        comment
      })
    );

    onClose();
  };

  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      <p><b>Selected:</b> {selection.textSnapshot}</p>

      <textarea
        placeholder="Add comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <br />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default AnnotationForm;
