import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/profile.css';
import Navbar from './Navbar';

const EditProfile = () => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:4000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setForm({ name: res.data.name, email: res.data.email }))
    .catch(err => console.error(err));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:4000/api/users/me', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Perfil actualizado con éxito');
    } catch (err) {
      setMessage('Error al actualizar perfil');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Editar Perfil</h2>
        <label htmlFor='name'>Nombre:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo"
          type="email"
          required
        />
        <button type="submit">Actualizar</button>
        {message && <p className="profile-message">{message}</p>}
      </form>
    </div>
    </>
  );
};

export default EditProfile;
