import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import PrivateRoute from '@/auth/PrivateRoute';
import MePage from '@/pages/MePage';
import CatalogoPage from '@/pages/CatalogoPage';
import LibroDetallePage from '@/pages/LibroDetallePage';
import MisReservasPage from '@/pages/MisReservasPage';
import MisPrestamosPage from '@/pages/MisPrestamosPage';
import MisMultasPage from '@/pages/MisMultasPage';
import AdminLibrosPage from '@/pages/admin/AdminLibrosPage';
import AdminReservasPage from '@/pages/admin/AdminReservasPage';
import AdminPrestamosPage from '@/pages/admin/AdminPrestamosPage';
import AdminMultasPage from '@/pages/admin/AdminMultasPage';
import AdminUsuariosPage from '@/pages/admin/AdminUsuariosPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage/> },
  { path: '/register', element: <RegisterPage/> },
  {
    path: '/',
    element: <PrivateRoute><Layout/></PrivateRoute>,
    children: [
      { index: true, element: <Dashboard/> },
      { path: 'me', element: <MePage/> },
      { path: 'catalogo', element: <CatalogoPage/> },
      { path: 'libros/:id', element: <LibroDetallePage/> },
      { path: 'mis-reservas', element: <MisReservasPage/> },
      { path: 'mis-prestamos', element: <MisPrestamosPage/> },
      { path: 'mis-multas', element: <MisMultasPage/> },
      { path: 'admin/libros', element: <AdminLibrosPage/> },
      { path: 'admin/reservas', element: <AdminReservasPage/> },
      { path: 'admin/prestamos', element: <AdminPrestamosPage/> },
      { path: 'admin/multas', element: <AdminMultasPage/> },
      { path: 'admin/usuarios', element: <AdminUsuariosPage/> },
    ],
  },
]);

export default function AppRouter(){ return <RouterProvider router={router}/>; }
