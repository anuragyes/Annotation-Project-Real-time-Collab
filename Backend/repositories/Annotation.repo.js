import AnnotationModel from "../Models/Annotation.js";

export const create = async (data) => {
  return AnnotationModel.create(data);
};

export const findById = async (id) => {
  return AnnotationModel.findById(id);
};

export const findByDocument = async (documentId, limit, skip) => {
  return AnnotationModel.find({ documentId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const edit = async (annotationId, update) => {
  return AnnotationModel.findByIdAndUpdate(
    annotationId,
    update,
    { new: true }
  );
};
