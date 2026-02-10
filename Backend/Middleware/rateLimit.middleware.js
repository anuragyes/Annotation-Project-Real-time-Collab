import rateLimit from "express-rate-limit";

export const annotationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 annotations per minute per user
  message: "Too many annotations. Slow down."
});
