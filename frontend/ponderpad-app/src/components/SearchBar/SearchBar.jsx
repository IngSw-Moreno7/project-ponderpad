import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar Notas"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
      />

        <IoMdClose className='text-xl text-slate-500' onClick={onClearSearch} />
        <FaMagnifyingGlass className=" text-slate-400 hover:text-black" onClick={handleSearch} />

    </div>
  );
};

export default SearchBar;
