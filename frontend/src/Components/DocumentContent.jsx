import { useDispatch, useSelector } from "react-redux";
import { renderWithHighlights } from "./RenderWithHighlights";

const DocumentContent = ({ document }) => {
  const dispatch = useDispatch();

  const annotations = useSelector(
    (state) => state.annotations.list || []
  );

  //  guard
  if (!document || !document.content) {
    return <p>Loading document...</p>;
  }

  return (
    <p>
      {renderWithHighlights(
        document.content,
        annotations,
        dispatch
      )}
    </p>
  );
};

export default DocumentContent;

