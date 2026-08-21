import { selectUser } from "@/pages/auth/features/authSlice";
import {
  fetchPublicBlogBySlug,
  fetchPublicBlogs,
  resolveBlogImageUrl,
} from "@/pages/blogs/services";
import type { Blog } from "@/pages/blogs/types";
import { fetchPortalSupplies } from "@/pages/portalClient/services";
import type { PortalSupply } from "@/pages/portalClient/types";
import { useAppSelector } from "@/store/hooks";
import { openEmail, openPhone, openWhatsapp } from "@/utils/portalActions";
import { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiFileText,
  FiHeadphones,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const titleByPath: Record<string, string> = {
  "/productos": "Productos",
  "/tarifas": "Tarifas",
  "/plan-amigo": "Plan Amigo",
  "/contacto": "Contacto",
  "/ayuda": "Centro de ayuda",
  "/noticias": "Noticias y novedades",
  "/nosotros": "Nosotros",
  "/servicios": "Servicios",
  "/profile": "Configuración",
  "/mas": "Más opciones",
  "/contratos": "Mis contratos",
};

const formatDate = (value?: string | null) => {
  if (!value) return "No informada";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const StaticPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const title = titleByPath[location.pathname] ?? "Portal ENERGYASSET";
  const query = new URLSearchParams(location.search);
  const newsSlug = query.get("slug");
  const cups = Array.isArray(user.cups) ? user.cups : [];
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [contracts, setContracts] = useState<PortalSupply[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/noticias") return;

    let active = true;

    const loadBlogs = async () => {
      setBlogsLoading(true);
      try {
        if (newsSlug) {
          const blog = await fetchPublicBlogBySlug(newsSlug);
          if (active) {
            setSelectedBlog(blog);
            setBlogs([]);
          }
          return;
        }

        const response = await fetchPublicBlogs({ limit: 12 });
        if (active) {
          setBlogs(response.rows);
          setSelectedBlog(null);
        }
      } catch {
        if (active) {
          setBlogs([]);
          setSelectedBlog(null);
        }
      } finally {
        if (active) setBlogsLoading(false);
      }
    };

    loadBlogs();

    return () => {
      active = false;
    };
  }, [location.pathname, newsSlug]);

  useEffect(() => {
    if (location.pathname !== "/contratos") return;

    let active = true;

    const loadContracts = async () => {
      setContractsLoading(true);
      try {
        const response = await fetchPortalSupplies();
        if (active) setContracts(response.supplies);
      } catch {
        if (active) setContracts([]);
      } finally {
        if (active) setContractsLoading(false);
      }
    };

    loadContracts();

    return () => {
      active = false;
    };
  }, [location.pathname]);

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
        { label: "Mis consumos", path: "/dashboard", Icon: FiCreditCard },
        { label: "Mis datos", path: "/profile", Icon: FiUser },
        { label: "Cambiar contraseña", path: "/change-password", Icon: FiUser },
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
      ) : location.pathname === "/contratos" ? (
        <section className="mt-8">
          {contractsLoading ? (
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-gray-500 shadow-sm">
              Cargando contratos...
            </div>
          ) : contracts.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {contracts.map((contract) => (
                <article
                  key={`${contract.cups}-${contract.contractId || contract.contractCode || contract.address}`}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase text-[#0b82df]">
                        Contrato eléctrico
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-[#07133d]">
                        {contract.contractCode ||
                          contract.contractId ||
                          contract.cups}
                      </h2>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600">
                      {contract.contractStatus || "Sin estado"}
                    </span>
                  </div>

                  <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                    <div>
                      <dt className="font-bold text-[#07133d]">CUPS</dt>
                      <dd className="mt-1 text-gray-600">{contract.cups}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#07133d]">Tarifa</dt>
                      <dd className="mt-1 text-gray-600">
                        {contract.tariff || "No informada"}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#07133d]">Inicio</dt>
                      <dd className="mt-1 text-gray-600">
                        {formatDate(contract.startDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[#07133d]">Fin</dt>
                      <dd className="mt-1 text-gray-600">
                        {formatDate(contract.endDate)}
                      </dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="font-bold text-[#07133d]">Dirección</dt>
                      <dd className="mt-1 text-gray-600">{contract.address}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-gray-500 shadow-sm">
              No hay contratos disponibles por el momento.
            </div>
          )}
        </section>
      ) : location.pathname === "/noticias" ? (
        selectedBlog ? (
          <article className="mt-8 max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            {selectedBlog.imageUrl && (
              <img
                src={resolveBlogImageUrl(selectedBlog.imageUrl)}
                alt=""
                className="mb-6 max-h-[24rem] w-full rounded-xl object-cover"
              />
            )}
            {selectedBlog.category && (
              <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-bold uppercase text-[#0b82df]">
                {selectedBlog.category}
              </span>
            )}
            <h2
              className="mt-4 text-3xl font-bold text-[#07133d]"
              dangerouslySetInnerHTML={{
                __html: selectedBlog.titleHtml || selectedBlog.title,
              }}
            />
            {selectedBlog.subtitleHtml || selectedBlog.subtitle ? (
              <div
                className="mt-3 text-xl text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: selectedBlog.subtitleHtml || selectedBlog.subtitle || "",
                }}
              />
            ) : null}
            <div
              className="prose prose-slate mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedBlog.bodyHtml }}
            />
          </article>
        ) : (
          <section className="mt-8">
            {blogsLoading ? (
              <div className="rounded-xl border border-gray-100 bg-white p-6 text-gray-500 shadow-sm">
                Cargando noticias...
              </div>
            ) : blogs.length ? (
              <div className="grid gap-5 md:grid-cols-3">
                {blogs.map((blog) => (
                  <button
                    key={blog.id}
                    onClick={() => navigate(`/noticias?slug=${blog.slug}`)}
                    className="rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0b82df]/40 hover:shadow-lg"
                  >
                    {blog.imageUrl && (
                      <img
                        src={resolveBlogImageUrl(blog.imageUrl)}
                        alt=""
                        className="mb-4 h-40 w-full rounded-lg object-cover"
                      />
                    )}
                    {blog.category && (
                      <span className="text-xs font-bold uppercase text-[#0b82df]">
                        {blog.category}
                      </span>
                    )}
                    <h2 className="mt-2 text-xl font-bold text-[#07133d]">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                        {blog.excerpt}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-white p-6 text-gray-500 shadow-sm">
                No hay noticias publicadas por el momento.
              </div>
            )}
          </section>
        )
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
