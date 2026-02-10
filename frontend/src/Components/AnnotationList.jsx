import { useSelector } from "react-redux";
import AnnotationItem from "./AnnotationItem";

const AnnotationList = () => {
  const { list, loading } = useSelector(state => state.annotations);

  if (loading) return <p>Loading annotations...</p>;

  return (
    <div>
      {list.map(a => (
        <AnnotationItem key={a._id} annotation={a} />
      ))}
    </div>
  );
};

export default AnnotationList;
