import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "../socket";
import {
  addAnnotation,
  updateAnnotation,
  removeAnnotation
} from "../store/annotationSlice";

const useAnnotationSocket = (documentId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!documentId) return;

    socket.connect();

    socket.emit("join-document", documentId);

    socket.on("annotation-updated", ({ action, annotation }) => {
      if (action === "create") dispatch(addAnnotation(annotation));
      if (action === "edit") dispatch(updateAnnotation(annotation));
      if (action === "delete") dispatch(removeAnnotation(annotation._id));
    });

    return () => {
      socket.emit("leave-document", documentId);
      socket.off("annotation-updated");
      socket.disconnect();
    };
  }, [documentId]);
};

export default useAnnotationSocket;
