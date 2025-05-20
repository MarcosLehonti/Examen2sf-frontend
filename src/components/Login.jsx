import React, { useState } from 'react';
import { login } from '../services/authService';
import '../styles/login.css'; // Importa el CSS separado
import { useNavigate } from 'react-router-dom';
import LoginSVG  from '../assets/login.svg';
import espacioSVG from '../assets/espacio.svg'


const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await login(form);
    if (res.token) {
      localStorage.setItem('token', res.token);
      setMessage('¡Login exitoso!');
      navigate('/home');
    } else {
      setMessage(res.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
        <div className="login-image-left">
            <img src={LoginSVG} alt="Decoración Login" />
        </div>
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Iniciar Sesión</h2>
        <img src={espacioSVG} alt="Login Illustration" className="login-image" />
        <input
          name="email"
          placeholder="Correo"
          type="email"
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          name="password"
          placeholder="Contraseña"
          type="password"
          onChange={handleChange}
          autoComplete="new-password"
          required
        />
        <button type="submit">Ingresar</button>
        {message && <p className="login-message">{message}</p>}
        <button type="submit" onClick={()=>navigate('/register')}>Regitrate</button>
        
      </form>
    </div>
  );
};

export default Login;
