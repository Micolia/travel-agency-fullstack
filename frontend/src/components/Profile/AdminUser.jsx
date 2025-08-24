import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'

const AdminUsers = () => {
  const { usersList, fetchUsers, deleteUserById, updateUserById, isAdmin } = useContext(UserContext)
  const [editingUserId, setEditingUserId] = useState(null)
  const [editForm, setEditForm] = useState({ nombre: '', apellido: '', email: '', user_type: '' })

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers()
    }
  }, [])

  const startEdit = (user) => {
    setEditingUserId(user.id)
    setEditForm({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      user_type: user.user_type
    })
  }

  const cancelEdit = () => {
    setEditingUserId(null)
    setEditForm({ nombre: '', apellido: '', email: '', user_type: '' })
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    await updateUserById(editingUserId, editForm)
    cancelEdit()
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUserById(id)
    }
  }

  if (!isAdmin()) {
    return <p>No tienes permisos para ver esta sección</p>
  }

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usersList.map(user => (
            <tr key={user.id}>
              {editingUserId === user.id ? (
                <>
                  <td>{user.id}</td>
                  <td>
                    <input
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="apellido"
                      value={editForm.apellido}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <select name="user_type" value={editForm.user_type} onChange={handleEditChange}>
                      <option value="traveler">Traveler</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleEditSubmit}>Guardar</button>
                    <button onClick={cancelEdit}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.email}</td>
                  <td>{user.user_type}</td>
                  <td>
                    <button onClick={() => startEdit(user)}>Editar</button>
                    <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsers
