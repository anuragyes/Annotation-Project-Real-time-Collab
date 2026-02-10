import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket";
import {
  addAnnotation,
  updateAnnotation,
  removeAnnotation
} from "../Redux/Feature/AnnotationsSlice";

const useAnnotationSocket = (documentId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!documentId) return;

    // 🔌 connect once
    if (!socket.connected) {
      socket.connect();
    }

    // 🏠 join room
    socket.emit("join-document", documentId);

    // 📥 listeners
    const onAdd = (annotation) => {
      dispatch(addAnnotation(annotation));
    };

    const onUpdate = (annotation) => {
      dispatch(updateAnnotation(annotation));
    };

    const onDelete = (annotationId) => {
      dispatch(removeAnnotation(annotationId));
    };

    socket.on("annotation-added", onAdd);
    socket.on("annotation-updated", onUpdate);
    socket.on("annotation-deleted", onDelete);

    // 🧹 cleanup
    return () => {
      socket.emit("leave-document", documentId);

      socket.off("annotation-added", onAdd);
      socket.off("annotation-updated", onUpdate);
      socket.off("annotation-deleted", onDelete);
    };
  }, [documentId, dispatch]);
};

export default useAnnotationSocket;
