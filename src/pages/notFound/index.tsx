import { selectAuthOptions } from "@/pages/auth/features/authSlice";
import { useAppSelector } from "@/store/hooks";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const auth = useAppSelector(selectAuthOptions);
  const isAuthenticated = auth.authenticated && Boolean(auth.token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fbff] px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,38,71,0.10)]">
        <p className="text-sm font-bold uppercase tracking-wide text-[#0b82df]">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-bold text-[#07133d]">
          Página no encontrada
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          La dirección que buscas no existe o ya no está disponible.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#0b82df] px-5 py-3 font-bold text-[#0b82df] transition hover:bg-[#eef6ff]"
          >
            <FiArrowLeft />
            Volver
          </button>
          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/area-clientes" : "/login")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0b82df] px-5 py-3 font-bold text-white transition hover:bg-[#076fc0]"
          >
            <FiHome />
            {isAuthenticated ? "Ir al área" : "Ir al login"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
