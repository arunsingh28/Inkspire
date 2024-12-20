import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const Quill = React.lazy(() => import("react-quill")); // Dynamically import Quill editor

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue = "",
  onChange,
}) => {
  const [editorContent, setEditorContent] = useState(initialValue);

  useEffect(() => {
    setEditorContent(initialValue);
  }, [initialValue]);

  const handleChange = (content: string) => {
    setEditorContent(content);
    onChange(content);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="rich-text-editor mt-5">
      <React.Suspense fallback={<p>Loading Editor...</p>}>
        <Quill
          theme="snow"
          value={editorContent}
          onChange={handleChange}
          modules={modules}
          className=""
          placeholder="Write something amazing..."
          
        />
      </React.Suspense>
    </div>
  );
};

export default RichTextEditor;
