import React, { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api";
import Header from "./components/Header";
import Note from "./components/Note";
import Empty from "./components/Empty";
import Edit from "./components/Edit";

import "./index.scss";

function App() {
  const [notes, setNotes] = useState([]);
  const [hasScroll, setHasScroll] = useState(false);
  const notesRef = useRef(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const loadedNotes = await invoke("read_from_json");
        setNotes(loadedNotes);
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };

    loadNotes();
  }, []);

  const handleDeleteNote = async (id) => {
    try {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      await invoke("delete_from_json", { id });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditNote = async (id, newTitle) => {
    try {
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, title: newTitle } : note
      );
      setNotes(updatedNotes);
      await invoke("edit_in_json", { id, newTitle });
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  useEffect(() => {
    const checkScroll = () => {
      if (notesRef.current) {
        const hasVerticalScroll =
          notesRef.current.scrollHeight > notesRef.current.clientHeight;
        setHasScroll(hasVerticalScroll);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);

    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, [notes]);

  return (
    <div className="wrapper">
      <div className="container">
        <Header notes={notes} setNotes={setNotes} />

        <div className="notes-wrap">
          <div className="notes" ref={notesRef}>
            {notes.length > 0 ? (
              notes.map((note) => (
                <Note
                  key={note.id}
                  id={note.id}
                  title={note.title}
                  onDelete={() => handleDeleteNote(note.id)}
                  onEdit={handleEditNote}
                />
              ))
            ) : (
              <Empty />
            )}
          </div>
          <div className="scroll-arrow">
            <img
              style={{ transform: "rotate(90deg)" }}
              className={hasScroll ? "visible" : ""}
              width={18}
              height={18}
              src="./img/scrollArrow.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
