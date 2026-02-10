import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Feature/AnnotationApi";

// GET
export const getAnnotations = createAsyncThunk(
  "annotations/get",
  async ({ documentId, page }, thunkAPI) => {
    const res = await api.fetchAnnotationsApi(documentId, page);
    return res.data.data;
  }
);

// CREATE
export const addAnnotation = createAsyncThunk(
  "annotations/create",
  async (payload) => {
    const res = await api.createAnnotationApi(payload);
    return res.data.data;
  }
);

// EDIT

export const editAnnotation = createAsyncThunk(
  "annotations/edit",
  async ({ id, payload }) => {
    const res = await editAnnotationApi(id, payload);
    return res.data.annotation;
  }
);

export const deleteAnnotation = createAsyncThunk(
  "annotations/delete",
  async (id) => {
    await deleteAnnotationApi(id);
    return id;
  }
);




export const updateAnnotation = createAsyncThunk(
  "annotations/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/annotation/${id}`, data);
      return res.data.annotation;
    } catch (err) {
      if (err.response?.data?.message === "ANNOTATION_CONFLICT") {
        return rejectWithValue("CONFLICT");
      }
      return rejectWithValue(err.message);
    }
  }
);
