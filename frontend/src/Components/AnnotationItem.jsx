import { useDispatch } from "react-redux";
import { updateAnnotation } from "../features/annotations/annotationThunks";

const AnnotationItem = ({ annotation }) => {
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(
      updateAnnotation({
        id: annotation._id, //  correct ID
        data: { comment: "Edited from frontend" }
      })
    );
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
      <p><b>Text:</b> {annotation.textSnapshot}</p>
      <p><b>Comment:</b> {annotation.comment}</p>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default AnnotationItem;
