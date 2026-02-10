import { createSlice } from "@reduxjs/toolkit";
import {
  getAnnotations,
  editAnnotation,
  deleteAnnotation
} from  '../Feature/AnnotationReducer';

const annotationSlice = createSlice({
  name: "annotations",
  initialState: {
    list: [],
    selected: null,
    loading: false
  },

  //  SYNC reducers
  reducers: {
    selectAnnotation: (state, action) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = null;
    },
    addAnnotation: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateAnnotation: (state, action) => {
      const idx = state.list.findIndex(
        a => a._id === action.payload._id
      );
      if (idx !== -1) state.list[idx] = action.payload;
    },
    removeAnnotation: (state, action) => {
      state.list = state.list.filter(
        a => a._id !== action.payload
      );
    }
  },

  //  ASYNC reducers
  extraReducers: (builder) => {
    builder
      .addCase(getAnnotations.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(editAnnotation.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          a => a._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.selected = action.payload;
      })
      .addCase(deleteAnnotation.fulfilled, (state, action) => {
        state.list = state.list.filter(
          a => a._id !== action.payload
        );
        state.selected = null;
      });
  }
});

export const {
  selectAnnotation,
  clearSelected,
  addAnnotation,
  updateAnnotation,
  removeAnnotation
} = annotationSlice.actions;

export default annotationSlice.reducer;
