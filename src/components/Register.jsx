import React, { useState } from 'react';
import { register } from '../services/authService';
import '../styles/Register.css'; // Importa el nuevo CSS

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await register(form);
    setMessage(res.message || 'Registro completo');
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Registro</h2>
        <input
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          autoComplete="off"
          required
        />
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
        <button type="submit">Registrar</button>
        {message && <p className="register-message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
