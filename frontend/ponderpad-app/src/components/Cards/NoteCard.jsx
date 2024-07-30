import React from 'react';
import { MdOutlinePushPin } from 'react-icons/md';
import { MdCreate, MdDelete } from 'react-icons/md';

const NoteCard = (
  title,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote
) => {
  return (
    <div>
      <div className="">
        <div>
          <h6 className="text-sm font medium">Titulo</h6>
          <span className="text-xs text-slate-500"></span>
        </div>

        <MdOutlinePushPin className="" onClick={onPinNote} />
      </div>

      <p className=''>{content?.slice(0, 60)}</p>

      <div className=''>
        <div className='text-xs text-slate-500'>{tags}</div>
        
        <div className='flex items-center gap-2'></div>
        
        <MdCreate className='icon-btn hover:text-green-600' onClick={onEdir}></div>

        <div></div>
      </div>
    </div>
  );
};

export default NoteCard;
