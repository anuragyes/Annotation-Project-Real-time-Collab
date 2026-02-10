import mongoose from "mongoose";
const AnnotationSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startOffset: { type: Number, required: true },
  endOffset: { type: Number, required: true },
  textSnapshot: { type: String, required: true },
  comment: { type: String },
  documentVersion: { type: Number, required: true },
  version: { type: Number, default: 1 }, // version of annotation
  history: [
    {
      comment: String,
      textSnapshot: String,
      updatedAt: Date,
    },
  ],
}, { timestamps: true });

export default mongoose.model("Annotation", AnnotationSchema);