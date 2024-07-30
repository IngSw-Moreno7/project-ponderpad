import React from 'react';

const AddEditNotes = () => {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className="input-label">TITULO</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="xxxc"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label"> CONTENIDO</label>
        <textarea
            type="text"
            className='text-5m text-slate-950 outline-none bg-slate-50 p-2 rounded'
            rows={10}
        />
        </div>

        <div className='mt-3'>
            <label className="input-label">TAGS</label>
        </div>

        <button className='btn-primary font-medium mt-5 p-3' onClick={() => {}}>AGREGAR</button>
  );
};

export default AddEditNotes;
