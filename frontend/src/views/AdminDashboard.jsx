import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
  const {
    token,
    isAdmin,
    usersList,
    fetchUsers,
    deleteUserById,
    packagesList,
    fetchPackages,
    deletePackage,
    updateUserById,
    updatePackage
  } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [tempUserData, setTempUserData] = useState({});
  const [tempPackageData, setTempPackageData] = useState({});

  useEffect(() => {
    if (token && isAdmin()) {
      fetchUsers();
      fetchPackages();
    }
  }, [token]);

  useEffect(() => {
    if (Array.isArray(usersList)) setUsers(usersList);
  }, [usersList]);

  useEffect(() => {
    if (Array.isArray(packagesList)) setPackages(packagesList);
  }, [packagesList]);

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setTempUserData({ ...user });
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setTempUserData({});
  };

  const handleUserChange = (field, value) => {
    setTempUserData({ ...tempUserData, [field]: value });
  };

  const saveUser = async () => {
    try {
      await updateUserById(editingUserId, tempUserData);
      setEditingUserId(null);
      setTempUserData({});
    } catch { alert('Error al actualizar usuario'); }
  };

  const startEditPackage = (pkg) => {
    setEditingPackageId(pkg.id);
    setTempPackageData({ ...pkg });
  };

  const cancelEditPackage = () => {
    setEditingPackageId(null);
    setTempPackageData({});
  };

  const handlePackageChange = (field, value) => {
    setTempPackageData({ ...tempPackageData, [field]: value });
  };

  const savePackage = async () => {
    try {
      await updatePackage(editingPackageId, tempPackageData);
      setEditingPackageId(null);
      setTempPackageData({});
    } catch { alert('Error al actualizar paquete'); }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Panel de Administración</h1>

      {/* --- Usuarios --- */}
      <section className="mb-5">
        <h2>Usuarios</h2>
        {users.length === 0 ? <p>No hay usuarios registrados.</p> : (
          <table className="table table-sm table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{editingUserId === u.id ? <input className="form-control form-control-sm" value={tempUserData.nombre} onChange={e => handleUserChange('nombre', e.target.value)} /> : u.nombre}</td>
                  <td>{editingUserId === u.id ? <input className="form-control form-control-sm" value={tempUserData.apellido} onChange={e => handleUserChange('apellido', e.target.value)} /> : u.apellido}</td>
                  <td>{editingUserId === u.id ? <input className="form-control form-control-sm" value={tempUserData.email} onChange={e => handleUserChange('email', e.target.value)} /> : u.email}</td>
                  <td>{editingUserId === u.id ? (
                    <select className="form-select form-select-sm" value={tempUserData.user_type} onChange={e => handleUserChange('user_type', e.target.value)}>
                      <option value="traveler">Traveler</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : u.user_type}</td>
                  <td className="d-flex gap-2">
                    {editingUserId === u.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={saveUser}><FaSave /></button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEditUser}><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => startEditUser(u)}><FaEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUserById(u.id)}><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* --- Paquetes --- */}
      <section>
        <h2>Paquetes</h2>
        {packages.length === 0 ? <p>No hay paquetes registrados.</p> : (
          <table className="table table-sm table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Destino</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{editingPackageId === p.id ? <input className="form-control form-control-sm" value={tempPackageData.title} onChange={e => handlePackageChange('title', e.target.value)} /> : p.title}</td>
                  <td>{editingPackageId === p.id ? <input className="form-control form-control-sm" value={tempPackageData.destination} onChange={e => handlePackageChange('destination', e.target.value)} /> : p.destination}</td>
                  <td>{editingPackageId === p.id ? <input type="number" className="form-control form-control-sm" value={tempPackageData.price} onChange={e => handlePackageChange('price', e.target.value)} /> : p.price}</td>
                  <td className="d-flex gap-2">
                    {editingPackageId === p.id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={savePackage}><FaSave /></button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEditPackage}><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => startEditPackage(p)}><FaEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => deletePackage(p.id)}><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
