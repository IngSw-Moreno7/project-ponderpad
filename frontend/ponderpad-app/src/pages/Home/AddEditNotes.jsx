import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosinstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose }) => {

  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || "");

  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      setError("Error inesperado, intente nuevamentee...");
    }
  }
  const editNote = async () => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      setError("Error inesperado, intente nuevamentee...");
    }
  }

  const handleAddNote = () => {
    if (!title) {
      setError("Porfavor entre un titulo");
      return;
    }
    else if (!content) {
      setError("Porfavor entre un contenido");
      return;
    }

    setError("");

    if (type === 'edit') {
      editNote();
    } else {
      addNewNote();
    }
  }

  return (
    <div className='relative'>

      <button className='w-10 h-10 rounded-full flex items-center justfy-center absolute -top-3 -right-3 hover:bg-slate-50' onClick={onClose}>
        <MdClose className='text-xl text-slate-400'></MdClose>
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TÍTULO</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENIDO</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags}></TagInput>
      </div>

      {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

      <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
        {type === "edit" ? "ACTUALIZAR" : "AGREGAR"}
      </button>
    </div >
  );
};

export default AddEditNotes;
