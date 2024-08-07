import { useState } from "react";
import { invoke } from "@tauri-apps/api";

import s from "./header.module.scss";

const Header = ({ notes, setNotes }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddNote = async () => {
    if (!inputValue) return; // Не добавлять пустые заметки

    const newNote = { id: Date.now(), title: inputValue }; // Генерация уникального ID
    const newNotes = [...notes, newNote];
    setNotes(newNotes);

    try {
      await invoke("write_to_json", { note: newNote }); // Передача объекта заметки с ключом `note`
      console.log("Note added successfully");
    } catch (error) {
      console.error("Error adding note:", error);
    }

    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue) {
      handleAddNote();
    }
  };

  return (
    <div className={s.header}>
      <h1>ToDo List</h1>
      <div className={s.input}>
        <input
          type="text"
          placeholder="Add note"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={s.verLine}></div>
        <img src="./img/add.svg" alt="add-note" onClick={handleAddNote} />
      </div>
    </div>
  );
};

export default Header;
