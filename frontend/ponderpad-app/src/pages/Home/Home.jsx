import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import moment from "moment";

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("error");
    }
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => { };
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo}></Navbar>

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={moment(item.createdOn).format('Do MMM YYYY')}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => { }}
              onDelete={() => { }}
              onPinNote={() => { }}
            ></NoteCard>
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {}}
      >
        <MdAdd className="text-[32px] text-white"></MdAdd>
      </button>

      <AddEditNotes />
    </>
  );
};

export default Home;
