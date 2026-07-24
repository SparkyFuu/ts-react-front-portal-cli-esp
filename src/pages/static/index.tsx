import { selectUser } from "@/pages/auth/features/authSlice";
import { useAppSelector } from "@/store/hooks";
import { openEmail, openPhone, openWhatsapp } from "@/utils/portalActions";
import {
  FiBell,
  FiCreditCard,
  FiFileText,
  FiHeadphones,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const titleByPath: Record<string, string> = {
  "/productos": "Productos",
  "/plan-amigo": "Plan Amigo",
  "/contacto": "Contacto",
  "/ayuda": "Centro de ayuda",
  "/noticias": "Noticias y novedades",
  "/nosotros": "Nosotros",
  "/servicios": "Servicios",
  "/profile": "Configuración",
  "/mas": "Más opciones",
  "/metodos-de-pago": "Métodos de pago",
  "/notificaciones": "Notificaciones",
  "/contratos": "Mis contratos",
};

const StaticPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const title = titleByPath[location.pathname] ?? "Portal ENERGYASSET";
  const query = new URLSearchParams(location.search);
  const newsTitle = query.get("title");
  const cups = Array.isArray(user.cups) ? user.cups : [];

  const contactActions = (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <button
        onClick={() =>
          openEmail("clientes@energyasset.es", "Consulta portal cliente ENERGYASSET")
        }
        className="rounded-xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0b82df]/40 hover:shadow-lg"
      >
        <FiMail className="h-8 w-8 text-[#0b82df]" />
        <h2 className="mt-4 text-xl font-bold text-[#07133d]">Email</h2>
        <p className="mt-2 text-gray-500">clientes@energyasset.es</p>
      </button>
      <button
        onClick={() => openWhatsapp("900 103 254", "Hola, necesito ayuda con mi portal.")}
        className="rounded-xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0b82df]/40 hover:shadow-lg"
      >
        <FiHeadphones className="h-8 w-8 text-emerald-500" />
        <h2 className="mt-4 text-xl font-bold text-[#07133d]">WhatsApp</h2>
        <p className="mt-2 text-gray-500">900 103 254</p>
      </button>
      <button
        onClick={() => openPhone("900 103 254")}
        className="rounded-xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0b82df]/40 hover:shadow-lg"
      >
        <FiHeadphones className="h-8 w-8 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold text-[#07133d]">Teléfono</h2>
        <p className="mt-2 text-gray-500">900 103 254</p>
      </button>
    </div>
  );

  const portalActions = (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[
        { label: "Mis facturas", path: "/facturas", Icon: FiFileText },
        { label: "Mis consumos", path: "/consumo", Icon: FiCreditCard },
        { label: "Mis datos", path: "/profile", Icon: FiUser },
        { label: "Cambiar contraseña", path: "/change-password", Icon: FiUser },
        { label: "Notificaciones", path: "/notificaciones", Icon: FiBell },
        { label: "Contacto", path: "/contacto", Icon: FiMail },
      ].map(({ label, path, Icon }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className="rounded-xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0b82df]/40 hover:shadow-lg"
        >
          <Icon className="h-8 w-8 text-[#0b82df]" />
          <span className="mt-4 block text-xl font-bold text-[#07133d]">
            {label}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="text-5xl font-bold text-[#07133d]">{title}</h1>
      {location.pathname === "/profile" ? (
        <section className="mt-8 max-w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#07133d]">
            {user.name || "Cliente"}
          </h2>
          <p className="mt-2 text-gray-500">{user.email}</p>
          <p className="mt-4 font-semibold text-[#07133d]">CIF/NIF</p>
          <p className="text-gray-600">{user.cif || "No informado"}</p>
          <p className="mt-4 font-semibold text-[#07133d]">CUPS asociados</p>
          <p className="text-gray-600">
            {cups.length ? cups.join(", ") : "No hay CUPS asociados"}
          </p>
          <button
            onClick={() => navigate("/change-password")}
            className="mt-6 rounded-lg bg-[#0b82df] px-6 py-3 font-bold text-white transition hover:bg-[#076fc0]"
          >
            Cambiar contraseña
          </button>
        </section>
      ) : location.pathname === "/contacto" || location.pathname === "/ayuda" ? (
        <>
          <p className="mt-4 max-w-2xl text-xl text-gray-600">
            Elige el canal que prefieras y te atenderemos lo antes posible.
          </p>
          {contactActions}
        </>
      ) : location.pathname === "/notificaciones" ? (
        <section className="mt-8 max-w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <FiBell className="h-10 w-10 text-[#0b82df]" />
          <h2 className="mt-4 text-2xl font-bold text-[#07133d]">
            No tienes notificaciones pendientes
          </h2>
          <p className="mt-2 text-gray-500">
            Aquí verás avisos de facturas, cambios de contrato y comunicaciones del portal.
          </p>
        </section>
      ) : location.pathname === "/noticias" ? (
        <section className="mt-8 max-w-3xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#07133d]">
            {newsTitle || "Últimas novedades ENERGYASSET"}
          </h2>
          <p className="mt-3 text-gray-600">
            Contenido informativo preparado para publicarse próximamente.
          </p>
        </section>
      ) : location.pathname === "/mas" ? (
        portalActions
      ) : (
        <p className="mt-4 max-w-2xl text-xl text-gray-600">
          Sección disponible para consultar y gestionar información de tu portal.
        </p>
      )}
    </main>
  );
};

export default StaticPage;
