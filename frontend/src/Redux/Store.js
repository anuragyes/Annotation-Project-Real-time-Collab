
import { configureStore } from "@reduxjs/toolkit";
import annotationReducer from "./Feature/AnnotationsSlice"; 

export const store = configureStore({
  reducer: {
    annotations: annotationReducer,
  },
})
