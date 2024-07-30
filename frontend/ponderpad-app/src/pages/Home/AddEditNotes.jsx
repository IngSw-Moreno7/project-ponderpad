import React from 'react';

const AddEditNotes = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-2">
        <label className="input-label">TÍTULO</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
        />
      </div>
      
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENIDO</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          rows={10}
        />
      </div>
      
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">TAGS</label>
        <input
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
        />
      </div>
      
      <button className="btn-primary font-medium mt-5 p-3" onClick={() => {}}>
        AGREGAR
      </button>
    </div>
  );
};

export default AddEditNotes;
