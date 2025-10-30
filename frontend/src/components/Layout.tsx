import { NavLink, Outlet } from 'react-router-dom'
import { forceLogout } from '@/auth/AuthProvider'

const linkCls = ({isActive}:{isActive:boolean}) =>
  `px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'font-semibold text-black' : 'text-gray-700'}`

export default function Layout(){
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r p-4 space-y-3">
        <h1 className="text-xl font-bold">Biblioteca</h1>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" className={linkCls}>Dashboard</NavLink>
          <NavLink to="/catalogo" className={linkCls}>Catálogo</NavLink>
          <NavLink to="/mis-reservas" className={linkCls}>Mis reservas</NavLink>
          <NavLink to="/mis-prestamos" className={linkCls}>Mis préstamos</NavLink>
          <NavLink to="/mis-multas" className={linkCls}>Mis multas</NavLink>
        </nav>

        <div className="pt-4 border-t">
          <div className="text-xs uppercase text-gray-500 mb-2">Administración</div>
          <nav className="flex flex-col gap-1">
            <NavLink to="/admin/libros" className={linkCls}>Libros</NavLink>
            <NavLink to="/admin/reservas" className={linkCls}>Reservas</NavLink>
            <NavLink to="/admin/prestamos" className={linkCls}>Préstamos</NavLink>
            <NavLink to="/admin/multas" className={linkCls}>Multas</NavLink>
            <NavLink to="/admin/usuarios" className={linkCls}>Usuarios</NavLink>
          </nav>
        </div>

        <div className="mt-auto pt-4 border-t">
          <button
            onClick={forceLogout}
            className="w-full px-3 py-2 rounded bg-gray-900 text-white hover:opacity-90"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="p-6">
        <Outlet/>
      </main>
    </div>
  )
}
