import "../styles/banner.css";
import { Link } from 'react-router-dom';
import img_user from '../components/Imagenes/img_user.png';

const NavBar: React.FC = () => {
  return (
    <nav className="bg-[#ADC178] py-4">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="h-10 w-auto text-white text-5xl font-bold">CloseAI</h1>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link to={"/HomeLogin"} className="text-white hover:bg-[#DDE5B6] rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Inicio</Link>
                <Link to={"/RegisterEst"} className="text-white hover:bg-[#DDE5B6] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Registro de Estudiantes</Link>
                <Link to={"/CreateAsig"} className="text-white hover:bg-[#DDE5B6] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Gestión de Asignaturas</Link>
                <Link to={"/Anuncios"} className="text-white hover:bg-[#DDE5B6] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Anuncios</Link>
                <Link to={"/Chat"} className="text-white hover:bg-[#DDE5B6] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Chat</Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Cambiar a Link que lleva a la página de Comunicación con Apoderados */}
            <Link to={"/Chat"} className="relative rounded-full hover:bg-[#DDE5B6] p-1 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </Link>
            <div className="relative ml-3">
              <div>
                <button type="button" className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={img_user} alt="user" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
