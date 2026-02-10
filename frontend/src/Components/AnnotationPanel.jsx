import { useDispatch, useSelector } from "react-redux";
import {
  editAnnotation,
  deleteAnnotation
} from  "../Redux/Feature/AnnotationReducer";
 import clearSelected  from "../Redux/Feature/AnnotationsSlice";

const AnnotationPanel = () => {
  const dispatch = useDispatch();
  const annotation = useSelector(state => state.annotations.selected);

  if (!annotation) return null;

  const onSave = () => {
    dispatch(editAnnotation({
      id: annotation._id,
      payload: { comment: annotation.comment }
    }));
  };

  const onDelete = () => {
    dispatch(deleteAnnotation(annotation._id));
  };

  return (
    <div>
      <textarea
        value={annotation.comment}
        onChange={e =>
          dispatch({
            type: "annotations/selectAnnotation",
            payload: { ...annotation, comment: e.target.value }
          })
        }
      />

      <button onClick={onSave}>Save</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={() => dispatch(clearSelected())}>Close</button>
    </div>
  );
};

export default AnnotationPanel;
