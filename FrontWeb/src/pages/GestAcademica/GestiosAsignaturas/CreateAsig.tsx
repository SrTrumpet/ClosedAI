import NavBar from "../../../components/NavBar";



const CreateAsig: React.FC = () => {
return (
    <div className="bg-[#DDE5B6] min-h-screen">
      <NavBar />
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-5xl font-bold text-[#1B4332] mb-8">Gestión de Asignaturas</h1>
        <div className="text-left px-4 text-[#1B4332]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Matemáticas", "Ciencias", "Historia", "Inglés", "Arte"].map((subject, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold">{subject}</h3>
                <p className="text-gray-500">Gestión y horario</p>
                <div className="mt-4 flex space-x-4">
                  <button className="bg-[#ADC178] text-white py-2 px-4 rounded-lg hover:bg-[#DDE5B6]">
                    Ver Asignatura
                  </button>
                  <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAsig;