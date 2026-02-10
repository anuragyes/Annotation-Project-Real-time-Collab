import express from "express";
import UserMiddleware from "../Middleware/auth.middleware.js";
import {
    createAnnotation,
    editAnnotation,
    getAnnotations
} from "../Controllers/Annotation.controller.js";

const Annotationrouter = express.Router();

/**
 * Create annotation
 * POST /api/annotations
 */
Annotationrouter.post(
    "/Create/Annotation/pdf",
    UserMiddleware,
    createAnnotation
);

/**
 * Get annotations of a document
 * GET /api/annotations/:documentId
 */
Annotationrouter.get(
    "/:documentId",
    UserMiddleware,
    getAnnotations
);

Annotationrouter.put("/Edit/Annotation/:id", UserMiddleware, editAnnotation);



export default Annotationrouter;
