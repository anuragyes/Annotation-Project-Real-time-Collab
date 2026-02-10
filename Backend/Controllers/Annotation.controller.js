
import AnnotationService from "../Services/AnnotationServices.js";

export const createAnnotation = async (req, res) => {
    try {
        const annotation = await AnnotationService.createAnnotation(
            req.body,
            req.user
        );

         console.log("Created annotation:", annotation);

        res.status(201).json({
            success: true,
            data: annotation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getAnnotations = async (req, res) => {
    try {
        const { documentId } = req.params;

        console.log("this is reqbody ", documentId);  // we got userid 
        const { page = 1, limit = 20 } = req.query;

        console.log("this is reqquery ", page, limit);  // we got userid   

        const skip = (page - 1) * limit;

        const annotations = await AnnotationService.getAnnotations(
            documentId,
            Number(limit),
            skip
        );
        console.log("Annotation data", annotations)

        res.status(200).json({
            success: true,
            data: annotations
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



export const editAnnotation = async (req, res) => {
    try {
        const annotationId = req.params.id;
        const user = req.user;
        const payload = req.body;

        const updatedAnnotation = await AnnotationService.editAnnotation(annotationId, user, payload);
        res.json({ success: true, annotation: updatedAnnotation });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

