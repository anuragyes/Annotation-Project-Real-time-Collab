import API from "./Api";

// Get annotations of a document
export const fetchAnnotationsApi = (documentId) => {
  return API.get(`/Annotation/pdf/${documentId}`);
};

// Create annotation
export const createAnnotationApi = (data, config) => {
  return API.post(
    "/Annotation/pdf/Create/Annotation/pdf",
    data,
    config
  );
};


// Edit annotation
export const editAnnotationApi = (id, data) => {
  return API.put(`/Annotation/pdf/Edit/Annotation/${id}`, data);
};

// Delete annotation
export const deleteAnnotationApi = (id) => {
  return API.delete(`/annotations/${id}`);
};
export const uploadDocumentApi = (formData) => {
  return API.post("/Document/upload", formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      Bearer: `Bearer ${localStorage.getItem("token")}`
    },
  });
};


  export const GetAllDocumentsApi = () => {
    return API.get("/Document/get/AllDocuments");
  }

    export const GetDociumentByIdApi = (id) => {
    return API.get(`/Document/documents/${id}`);
  }