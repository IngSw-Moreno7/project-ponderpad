import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-12">
          <form onSubmit={() => {}}>
            <h4 className="text-2xl mb-7">Inicio de Sesión</h4>

            <input type="text" placeholder="Correo Electrónico" className="input-box" />


            <button type="submit" className="btn-primary">
              Iniciar sesión
            </button>

            <p className="text-sm text-center mt-4">
              No se encuentra registrado? {''}
              <Link to="/signUp" className="font-medium text-primary underline">
                Crear una cuenta aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
