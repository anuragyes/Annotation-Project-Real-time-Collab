// routes/document.routes.js
import express from "express";
import UserMiddleware from "../Middleware/auth.middleware.js";
import { upload } from "../Middleware/Multer.js";
import uploadDocument, { getAllDocuments } from "../Controllers/document.controller.js";
import { getDocumentsByOwnerId } from "../Controllers/document.controller.js";

const DocRouter = express.Router();

DocRouter.post(
  "/upload",
  UserMiddleware,
  upload.single("file"),
  uploadDocument
);

// Routes/document.routes.js
DocRouter.get(
  "/documents/:ownerId",
  UserMiddleware,
   getDocumentsByOwnerId
);


DocRouter.get("/get/AllDocuments", UserMiddleware, getAllDocuments);

export default DocRouter;
