import Document from "../Models/DocModel.js";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import mongoose from "mongoose";

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    let textContent = "";

    if (req.file.mimetype === "application/pdf") {
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(req.file.buffer),
      });

      const pdf = await loadingTask.promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(" ");
        textContent += pageText + "\n";
      }
    }

    if (!textContent.trim()) {
      return res.status(400).json({ message: "Empty PDF" });
    }

    const doc = await Document.create({
      title: req.body.title || req.file.originalname,
      content: textContent,
      ownerId: req.user._id,
    });

    res.status(201).json({
      success: true,
      id: doc._id,
      length: doc.content.length,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    next(err);
  }
};


export const getDocumentsByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    // console.log("OWNER ID FROM PARAM", ownerId);

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ownerId",
      });
    }

    const documents = await Document.find({ ownerId })
      .select("title content ownerId createdAt");

    if (!documents || documents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No documents found for this ownerId",
      });
    }

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("GET DOCS BY OWNER ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// get All Documnent 

export const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find().select("title createdAt ownerId content");  // include content for admin view
    res.status(200).json({
      success: true,
      documents,
    });
  } catch (err) {
    console.error("GET ALL DOCUMENTS ERROR:", err);
    next(err);
  }
};
export default uploadDocument;
