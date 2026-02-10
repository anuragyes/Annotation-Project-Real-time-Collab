import React from "react";

import  selectAnnotation  from "../Redux/Feature/AnnotationsSlice";

export const renderWithHighlights = (
  text,
  annotations,
  dispatch
) => {
  let result = [];
  let lastIndex = 0;

  const sorted = [...(annotations || [])].sort(
    (a, b) => a.startOffset - b.startOffset
  );

  sorted.forEach((ann) => {
    if (ann.startOffset > lastIndex) {
      result.push(text.slice(lastIndex, ann.startOffset));
    }

    result.push(
      <span
        key={ann._id}
        style={{ backgroundColor: "yellow", cursor: "pointer" }}
        onClick={() => dispatch(selectAnnotation(ann))}
      >
        {text.slice(ann.startOffset, ann.endOffset)}
      </span>
    );

    lastIndex = ann.endOffset;
  });

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
};
