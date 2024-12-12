import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import NavBar from "../components/NavBar";
import Swal from "sweetalert2";
import "../styles/banner.css";
import { LISTAR_CURSOS, GET_ALL_NOTICES } from "../graphql/queries/user";

interface Subject {
  id: string;
  name: string;
  numberOfClasses: number;
}

function HomeLogin() {
  const navigate = useNavigate();
  const { data: coursesData, loading: loadingCourses, error: errorCourses } = useQuery(LISTAR_CURSOS);
  const { data: noticesData, loading: loadingNotices, error: errorNotices } = useQuery(GET_ALL_NOTICES);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isChangePassword = localStorage.getItem("isChangePassword") === "true";

    if (!token) {
      Swal.fire({
        title: "Error de autenticación",
        text: "No se encontró un token válido. Inicia sesión nuevamente.",
        icon: "warning",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/");
      });
    } else if (isChangePassword) {
      Swal.fire({
        title: "Recuperación de contraseña detectada",
        text: "Por seguridad, es necesario que cambie su contraseña.",
        icon: "info",
        confirmButtonText: "Ir a cambiar contraseña",
      }).then(() => {
        navigate("/ChangePassword");
      });
    }
  }, [navigate]);

  const handleViewSubject = (id: string) => {
    navigate(`/DetalleAsig/${id}`);
  };

  // Obtener los 3 anuncios más recientes
  const recentNotices = noticesData?.getAllNotices
    ? [...noticesData.getAllNotices]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    : [];

  if (loadingCourses || loadingNotices) return <p className="text-gray-500">Cargando...</p>;
  if (errorCourses || errorNotices) return <p className="text-red-500">Error al cargar datos.</p>;

  return (
    <div className="bg-[#DDE5B6] min-h-screen">
      <NavBar />
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-5xl font-bold text-[#1B4332] mb-8">Bienvenido, {user.firstName} {user.lastName}</h1>

        <div className="text-left px-4 text-[#1B4332]">
          <h2 className="text-3xl font-bold mb-6">Cursos Recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesData.listSubject.map((subject: Subject) => (
              <div key={subject.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold">{subject.name}</h3>
                <p className="text-gray-500">Cantidad de clases: {subject.numberOfClasses}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-[#ADC178] text-gray-700 py-2 px-4 rounded-lg hover:bg-[#DDE5B6] hover:border-[#ADC178] hover:border-2"
                    onClick={() => handleViewSubject(subject.id)}
                  >
                    Ver Asignatura
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-[#1B4332]">Anuncios Recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentNotices.map((notice: any) => (
              <div key={notice.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold">{notice.title}</h3>
                <p className="text-gray-500">{notice.description}</p>
                {notice.imageUrl && (
                  <img
                    src={notice.imageUrl}
                    alt="Anuncio"
                    className="mt-4 rounded-lg w-full max-h-48 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeLogin;
