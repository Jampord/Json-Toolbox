import React from "react";
import "./JsonEditor.scss";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function JsonEditor({ value, onChange, placeholder }: JsonEditorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <textarea className="editor" value={value} onChange={handleChange} placeholder={placeholder} spellCheck={false} />
  );
}

export default JsonEditor;
