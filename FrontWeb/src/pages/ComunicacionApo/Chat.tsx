import React from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { GET_ALL_USERS } from "../../graphql/queries/user";

// Chat.tsx
const Chat: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ALL_USERS);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const loggedInUserId = user?.id;

  if (!loggedInUserId) {
    return <p>Error: Usuario logueado no identificado.</p>;
  }

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar usuarios: {error.message}</p>;

  const users = data?.getAllUser?.filter(
    (u: { id: number }) => Number(u.id) !== Number(loggedInUserId)
  );
  
  return (
    <div className="bg-[#DDE5B6] min-h-screen">
      <NavBar />
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-5xl font-bold text-[#1B4332] mb-8">
          Lista de Usuarios
        </h1>
        <div className="text-left px-4 text-[#1B4332]">
          <h2 className="text-2xl font-bold mb-4">Usuarios Registrados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users && users.length > 0 ? (
              users.map((user: { id: number; firstName: string; lastName: string; email: string; rut: string; role: string }) => (
                <div key={user.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold">{`${user.firstName} ${user.lastName}`}</h3>
                  <p className="text-gray-500">Email: {user.email}</p>
                  <p className="text-gray-500">RUT: {user.rut}</p>
                  <p className="text-gray-500">Rol: {user.role}</p>
                  <button
                    onClick={() => {
                      if (user.id !== loggedInUserId) {
                        navigate(`/chatApoderado/${user.id}`, {
                          state: { senderId: loggedInUserId, recipientId: user.id },
                        });
                      }
                    }}
                    className="bg-[#ADC178] text-white py-2 px-4 rounded-lg hover:bg-[#DDE5B6] mt-4"
                  >
                    Ir al Chat
                  </button>

                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay usuarios disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Chat;
