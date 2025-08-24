import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'

const AdminPackages = () => {
  const { token, isAdmin, isOrganizer } = useContext(UserContext)
  const [packages, setPackages] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    destination: '',
    price: '',
    duration_days: '',
    max_participants: '',
    category: 'cultural',
    start_date: '',
    end_date: ''
  })

  const fetchPackages = async () => {
    if (!token) return
    try {
      const res = await fetch('http://localhost:5000/api/packages', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setPackages(data)
    } catch (err) {
      console.error('Error al obtener paquetes:', err)
    }
  }

  useEffect(() => {
    if (isAdmin() || isOrganizer()) fetchPackages()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Error al crear paquete')
      await fetchPackages()
      setForm({
        title: '',
        description: '',
        destination: '',
        price: '',
        duration_days: '',
        max_participants: '',
        category: 'cultural',
        start_date: '',
        end_date: ''
      })
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (pkg) => {
    setEditingId(pkg.id)
    setForm({
      title: pkg.title,
      description: pkg.description,
      destination: pkg.destination,
      price: pkg.price,
      duration_days: pkg.duration_days,
      max_participants: pkg.max_participants,
      category: pkg.category,
      start_date: pkg.start_date,
      end_date: pkg.end_date
    })
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/api/packages/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Error al actualizar paquete')
      setEditingId(null)
      await fetchPackages()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar paquete?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/packages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al eliminar paquete')
      await fetchPackages()
    } catch (err) {
      console.error(err)
    }
  }

  if (!isAdmin() && !isOrganizer()) return <p>No tienes permisos para administrar paquetes</p>

  return (
    <div>
      <h2>Gestión de Paquetes Turísticos</h2>
      
      <form onSubmit={editingId ? handleEdit : handleCreate}>
        <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
        <input name="destination" placeholder="Destino" value={form.destination} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} required />
        <input name="duration_days" type="number" placeholder="Duración (días)" value={form.duration_days} onChange={handleChange} required />
        <input name="max_participants" type="number" placeholder="Máx. participantes" value={form.max_participants} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="cultural">Cultural</option>
          <option value="gastronomic">Gastronómico</option>
          <option value="beach">Playa</option>
          <option value="romantic">Romántico</option>
          <option value="adventure">Aventura</option>
          <option value="nature">Naturaleza</option>
        </select>
        <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
        <input name="end_date" type="date" value={form.end_date} onChange={handleChange} />
        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
        {editingId && <button type="button" onClick={() => setEditingId(null)}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Destino</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Máx. Participantes</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {packages.map(pkg => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.title}</td>
              <td>{pkg.destination}</td>
              <td>{pkg.price}</td>
              <td>{pkg.duration_days}</td>
              <td>{pkg.max_participants}</td>
              <td>{pkg.category}</td>
              <td>
                <button onClick={() => startEdit(pkg)}>Editar</button>
                <button onClick={() => handleDelete(pkg.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPackages
