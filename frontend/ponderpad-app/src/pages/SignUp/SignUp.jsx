import React, { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Entre un usuario valido porfavor...");
      return;
    }
    else if (!validateEmail(email)) {
      setError("Entre un correo valido porfavor...");
      return;
    }
    else if (!password) {
      setError("Ingrese una contrase;a porfavor");
      return;
    }

    try {
      const response = await axiosInstance.post("/create-account", {
        name: name,
        email: email,
        password: password
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
      }

      console.log(response.data);

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      setError("Error inesperado, intente nuevamente...");
    }
    setError("")
  }
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-12">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">SignUp</h4>

            <input
              type="text"
              placeholder="Nombre"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Correo Electrónico"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}></PasswordInput>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type="submit" className="btn-primary">
              Registrate
            </button>

            <p className="text-sm text-center mt-4">
              Ya se encuentra registrado? {''}
              <Link to="/login" className="font-medium text-primary underline">
                login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
};

export default SignUp;
