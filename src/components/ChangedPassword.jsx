import React, { useState } from 'react';
import axios from 'axios';
import '../styles/profile.css'; // usamos el mismo CSS del perfil

import Navbar from './Navbar';
const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put('https://localhost:4000/api/users/me/password', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Contraseña actualizada correctamente');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setMessage('Error al cambiar contraseña');
    }
  };

  return (
    <>
   
    <Navbar />
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Cambiar Contraseña</h2>
        <label htmlFor="currentPassword">Escriba su contraseña acutal:</label>
        <input
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          placeholder="Contraseña actual"
          required
        />
        <label htmlFor="newpassword">Escriba su nueva contraseña:</label>
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Nueva contraseña"
          required
        />
        <button type="submit">Cambiar</button>
        {message && <p className="profile-message">{message}</p>}
      </form>
    </div>
    </>
  );
};

export default ChangePassword;
