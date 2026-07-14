import { useLocation } from "react-router-dom";

const titleByPath: Record<string, string> = {
  "/productos": "Productos",
  "/plan-amigo": "Plan Amigo",
  "/contacto": "Contacto",
  "/nosotros": "Nosotros",
  "/servicios": "Servicios",
  "/profile": "Configuración",
};

const StaticPage = () => {
  const location = useLocation();
  const title = titleByPath[location.pathname] ?? "Portal ENERGYASSET";

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="text-5xl font-bold text-[#07133d]">{title}</h1>
      <p className="mt-4 max-w-2xl text-xl text-gray-600">
        Vista preparada para conectar contenido y acciones desde el backend.
      </p>
    </main>
  );
};

export default StaticPage;
