import mongoose from "mongoose";
const AnnotationAuditSchema = new mongoose.Schema(
  {
    annotationId: mongoose.Schema.Types.ObjectId,
    documentId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,

    action: {
      type: String, // CREATED | EDITED
      required: true
    }
  },
  {
    timestamps: true
  }
);

AnnotationAuditSchema.index({ documentId: 1 });

 export default mongoose.model("AnnotationAudit", AnnotationAuditSchema);


  // use case : It records who did what, on which annotation, and when. It exists for tracking, debugging, analytics, and compliance.