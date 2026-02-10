// src/models/Document.js
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },

    content: {
      type: String, // extracted plain text
      required: true
    },

    version: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

DocumentSchema.index({ ownerId: 1 });

export default mongoose.model("Document", DocumentSchema);
