import { Link } from "react-router-dom";

export function Page404() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#00478f] via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Fondo decorativo animado */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-[#00478f] opacity-30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-blue-800 opacity-20 rounded-full blur-3xl animate-ping"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-900 opacity-10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
      {/* GIF animado con tonos azules */}
      <img
        src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
        alt="Astronauta Unison"
        className="w-40 h-40 mb-6 z-10 drop-shadow-xl animate-float border-4 border-[#00478f] bg-blue-900 rounded-full"
      />
      <h1 className="text-7xl font-extrabold text-white drop-shadow-2xl z-10 animate-bounce">
        404
      </h1>
      <p className="mt-4 text-2xl text-white font-semibold z-10 animate-fade-in drop-shadow-lg">
        ¡Ups! Página no encontrada
      </p>
      <p className="mt-2 text-lg text-blue-100 z-10 animate-fade-in delay-200 drop-shadow">
        Parece que te perdiste en el espacio digital universitario.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-[#00478f] via-blue-800 to-blue-900 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-900 hover:to-[#00478f] transition-all duration-300 z-10 animate-fade-in delay-500"
      >
        Volver al inicio
      </Link>
      {/* Animaciones personalizadas */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px);}
            50% { transform: translateY(-20px);}
            100% { transform: translateY(0px);}
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .animate-spin-slow {
            animation: spin-slow 18s linear infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fade-in 1s ease forwards;
          }
          .animate-fade-in.delay-200 {
            animation-delay: 0.2s;
          }
          .animate-fade-in.delay-500 {
            animation-delay: 0.5s;
          }
        `}
      </style>
    </div>
  );
}