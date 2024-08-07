import React, { useState, useEffect } from "react";
import Edit from "../Edit";
import s from "./note.module.scss";

const Note = ({ id, title, onDelete, onEdit, isAdd }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = (id, newTitle) => {
    onEdit(id, newTitle);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const checkThrow = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (isAdd) {
      const timer = setTimeout(() => {
        document.getElementById(`note-${id}`).classList.remove(s.adding);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdd, id]);

  return (
    <div
      id={`note-${id}`}
      className={`${s.note} ${isDeleting ? s.deleting : ""} ${
        isAdd ? s.adding : ""
      }`}
    >
      {isEditing ? (
        <Edit
          note={{ id, title }}
          onSave={handleEditSubmit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <div className={s.justCont}>
          <div className={s.content}>
            <label className={s.customCheckbox}>
              <input onChange={checkThrow} type="checkbox" />
              <span className={s.checkmark}></span>
            </label>
            <p
              className={`${s.strikethrough} ${isChecked ? s.active : ""} ${
                isChecked ? s.add : ""
              }`}
            >
              {title}
            </p>
          </div>
          <div className={s.tools}>
            <svg
              className={s.iconEdit}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleEdit}
            >
              <desc>Created with Pixso.</desc>
              <defs />
              <path
                id="Vector"
                d="M2 12.66L2 16L5.33 16L12 9.32L14.4 6.93L14.4 6.93C14.73 6.6 14.89 6.43 14.95 6.24C15.01 6.08 15.01 5.9 14.95 5.73C14.89 5.54 14.73 5.37 14.4 5.04L12.95 3.59C12.62 3.26 12.45 3.1 12.26 3.04C12.09 2.98 11.91 2.98 11.75 3.04C11.56 3.1 11.39 3.26 11.06 3.59L11.06 3.59L8.67 5.99L2 12.66ZM8.67 5.99L12 9.32"
                stroke="#CDCDCD"
                strokeOpacity="1"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className={s.iconTrash}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleDelete}
            >
              <desc>Created with Pixso.</desc>
              <defs>
                <clipPath id="clip18_285">
                  <rect
                    id="trash-svgrepo-com 1"
                    rx="0.5"
                    width="17"
                    height="17"
                    transform="translate(0.5 0.5)"
                    fill="white"
                    fillOpacity="0"
                  />
                </clipPath>
              </defs>
              <rect
                id="trash-svgrepo-com 1"
                rx="0.5"
                width="17"
                height="17"
                transform="translate(0.5 0.5)"
                fill="#FFFFFF"
                fillOpacity="0"
              />
              <g clipPath="url(#clip18_285)">
                <path
                  id="Vector"
                  d="M5.36 6L12.63 6C13.5 6 14.19 6.74 14.12 7.61L13.6 14.36C13.54 15.14 12.89 15.75 12.11 15.75L5.88 15.75C5.1 15.75 4.45 15.14 4.39 14.36L3.87 7.61C3.8 6.74 4.49 6 5.36 6Z"
                  stroke="#CDCDCD"
                  strokeOpacity="1"
                  strokeWidth="1"
                />
                <path
                  id="Vector"
                  d="M14.62 3.75L3.37 3.75"
                  stroke="#CDCDCD"
                  strokeOpacity="1"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  id="Vector"
                  d="M8.25 1.5L9.75 1.5C10.16 1.5 10.5 1.83 10.5 2.25L10.5 3.75L7.5 3.75L7.5 2.25C7.5 1.83 7.83 1.5 8.25 1.5Z"
                  stroke="#CDCDCD"
                  strokeOpacity="1"
                  strokeWidth="1"
                />
                <path
                  id="Vector"
                  d="M10.5 9L10.5 12.75"
                  stroke="#CDCDCD"
                  strokeOpacity="1"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  id="Vector"
                  d="M7.5 9L7.5 12.75"
                  stroke="#CDCDCD"
                  strokeOpacity="1"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Note;
