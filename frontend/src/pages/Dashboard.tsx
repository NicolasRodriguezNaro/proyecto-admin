import { Link } from 'react-router-dom'

export default function Dashboard(){
  const items = [
    { to: '/me', title: 'Perfil', desc: 'Visualiza la infromacion del usuario'},
    { to:'/catalogo', title:'Catálogo', desc:'Explora todos los libros' },
    { to:'/mis-reservas', title:'Mis reservas', desc:'Consulta y cancela reservas' },
    { to:'/mis-prestamos', title:'Mis préstamos', desc:'Seguimiento de tus préstamos' },
    { to:'/mis-multas', title:'Mis multas', desc:'Pendientes y pagadas' },
    { to:'/admin/libros', title:'Admin · Libros', desc:'Gestión del catálogo' },
    { to:'/admin/usuarios', title:'Admin · Usuarios', desc:'Gestión de usuarios' },
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map(i=>(
          <Link key={i.to} to={i.to}
            className="border rounded p-4 hover:shadow-sm transition">
            <div className="font-semibold">{i.title}</div>
            <div className="text-sm text-gray-600">{i.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
