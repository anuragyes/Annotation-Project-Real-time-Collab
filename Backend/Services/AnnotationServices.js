import redisClient from "../Config/redis.js";
import * as annotationRepo from "../repositories/Annotation.repo.js";
import DocModel from "../Models/DocModel.js";
import { io } from "../server.js"; // Make sure io is exported
import { annotationQueue } from "../queues/AnnotationQueue.js";

const CACHE_PREFIX = "annotations";

const createAnnotation = async (payload, user) => {
  const { documentId, startOffset, endOffset, textSnapshot, comment } = payload;

  // 1️ Validate document
  const document = await DocModel.findById(documentId).lean();
  if (!document) throw new Error("Document not found");

  // 2️ Offset validation
  if (startOffset < 0 || endOffset > document.content.length || startOffset >= endOffset) {
    throw new Error("Invalid text range");
  }

  // 3️ Conflict detection: overlapping annotations for same user
  const existingAnnotations = await annotationRepo.findByDocument(documentId, 1000, 0); // get all annotations
  const userOverlap = existingAnnotations.find(a =>
    a.userId.toString() === user._id.toString() &&
    !(endOffset <= a.startOffset || startOffset >= a.endOffset)
  );

  if (userOverlap) {
    console.log(" Overlapping annotation detected for same user");
    // optional: you can reject or allow
  }

  // 4️ Create annotation (DB = source of truth)
  const annotation = await annotationRepo.create({
    ...payload,
    userId: user._id,
    documentVersion: document.version,
    version: 1,
    history: []
  });

  // 5️ Cache invalidation
  const keys = await redisClient.keys(`${CACHE_PREFIX}:${documentId}:*`);
  if (keys.length) await redisClient.del(keys);

  // 6️ Real-time broadcast via Socket.io
  io.to(`document:${documentId}`).emit("annotation-updated", {
    action: "create",
    annotation
  });

  // 7️ Async audit logging via queue
  await annotationQueue.add("annotationEvent", {
    type: "create",
    annotation
  });

  return annotation;
};



// GET annotations with caching
const getAnnotations = async (documentId, limit = 20, skip = 0) => {
  const cacheKey = `${CACHE_PREFIX}:${documentId}:${limit}:${skip}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const annotations = await annotationRepo.findByDocument(documentId, limit, skip);

  await redisClient.setEx(cacheKey, 60, JSON.stringify(annotations));

  return annotations;
};








const editAnnotation = async (annotationId, user, payload) => {
  const annotation = await annotationRepo.findById(annotationId);
  

  console.log("Editing annotation", annotationId, "by user", user._id);
  console.log("Current annotation data:", annotation);
  if (!annotation) {
    throw new Error("Annotation not found");
  } 
  // Ownership check
  if (annotation.userId.toString() !== user._id.toString()) {
    throw new Error("Unauthorized");
  }

  const newVersion = annotation.version + 1;

  const historyEntry = {
    comment: annotation.comment,
    textSnapshot: annotation.textSnapshot,
    updatedAt: new Date()
  };

  const updatedAnnotation = await annotationRepo.edit(annotationId, {
    ...payload,
    version: newVersion,
    $push: { history: historyEntry }
  });

  // Cache invalidate
  const keys = await redisClient.keys(
    `${CACHE_PREFIX}:${annotation.documentId}:*`
  );
  if (keys.length) await redisClient.del(keys);

  // Realtime update
  io.to(`document:${annotation.documentId}`).emit("annotation-updated", {
    action: "edit",
    annotation: updatedAnnotation
  });

  return updatedAnnotation;
}




export default {
  createAnnotation,
  getAnnotations,
  editAnnotation
};
