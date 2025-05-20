import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../styles/Home.css';
import UserIcon from '../assets/user_icon.svg';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/users/lista-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener usuarios');
        }

        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsuarios();
  }, []);

  // ⚡ Función para cambiar el rol
  const handleChangeRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:4000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) throw new Error('Error al actualizar el rol');

      alert('✅ Rol actualizado correctamente');

      // Actualizar el estado local sin volver a llamar al backend
      const updatedUsers = usuarios.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      setUsuarios(updatedUsers);

    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      alert('❌ No se pudo actualizar el rol');
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="card-container">
          {usuarios.map((usuario) => (
            <div className="card" key={usuario.id}>
              <img src={UserIcon} alt="Usuario" className="card-image" />
              <h2>{usuario.name}</h2>
              <p>Email: {usuario.email}</p>
              <p><strong>Rol actual:</strong> {usuario.role}</p>

              {/* 🔽 Select para cambiar rol */}
              <select
                value={usuario.role}
                onChange={(e) => handleChangeRole(usuario.id, e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="colaborador">Colaborador</option>
                <option value="diseñador">Diseñador</option>
              </select>

              <button className="card-button">Ver Perfil</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListaUsuarios;
