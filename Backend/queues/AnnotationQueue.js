import { Queue, Worker } from "bullmq";
import queueRedis from "../Config/QueueRedis.js";

export const annotationQueue = new Queue("annotationQueue", {
  connection: queueRedis,
});

// Worker to process annotation events asynchronously
export const annotationWorker = new Worker(
  "annotationQueue",
  async (job) => {
    const { type, annotation } = job.data;

    const { default: AnnotationAudit } = await import(
      "../Models/AnnotationAudit.js"
    );

    switch (type) {
      case "create":
        console.log(" Logging annotation creation:", annotation._id);
        await AnnotationAudit.create({
          annotationId: annotation._id,
          documentId: annotation.documentId,
          userId: annotation.userId,
          action: "CREATED",
        });
        break;

      case "edit":
        console.log(" Logging annotation edit:", annotation._id);
        await AnnotationAudit.create({
          annotationId: annotation._id,
          documentId: annotation.documentId,
          userId: annotation.userId,
          action: "EDITED",
        });
        break;
    }
  },
  {
    connection: queueRedis, // ✅ THIS IS THE KEY FIX
  }
);
