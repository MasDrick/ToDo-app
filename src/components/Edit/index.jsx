import React, { useState, useEffect, useRef } from "react";
import s from "./edit.module.scss";

const Edit = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const textareaRef = useRef(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(note.id, title);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave(e);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    adjustTextareaHeight();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form className={s.TodoForm} onSubmit={handleSave}>
      <textarea
        ref={textareaRef}
        className={s.input}
        value={title}
        onChange={handleTitleChange}
        onKeyDown={handleKeyDown}
        placeholder="Update task"
      />

      <button type="submit" className={s.btn}>
        Save
      </button>
    </form>
  );
};

export default Edit;
