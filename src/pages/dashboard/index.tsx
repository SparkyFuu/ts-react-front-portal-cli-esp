import piggyImage from "@/assets/images/a.png";
import solarImage from "@/assets/images/10.png";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  customer,
  news,
  quickLinks,
  supportCards,
} from "@/data/portalData";
import { selectUser } from "@/pages/auth/features/authSlice";
import { fetchPortalSupplies } from "@/pages/portalClient/services";
import type { PortalSupply } from "@/pages/portalClient/types";
import { useAppSelector } from "@/store/hooks";
import { openEmail, openPhone, openWhatsapp } from "@/utils/portalActions";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiBell,
  FiCreditCard,
  FiFileText,
  FiHeadphones,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const firstName = user.name?.split(" ")[0] || "Cliente";
  const cups = Array.isArray(user.cups) ? user.cups : [];
  const [supplies, setSupplies] = useState<PortalSupply[]>([]);
  const areaTitle = firstName.toLowerCase().endsWith("a")
    ? "Bienvenida a tu"
    : "Bienvenido a tu";

  useEffect(() => {
    let active = true;

    const loadSupplies = async () => {
      try {
        const response = await fetchPortalSupplies();
        if (active) setSupplies(response.supplies);
      } catch {
        if (active) setSupplies([]);
      }
    };

    loadSupplies();

    return () => {
      active = false;
    };
  }, []);

  const handleSupportAction = (title: string, value: string) => {
    if (title === "WhatsApp") {
      openWhatsapp(value, "Hola, necesito ayuda con mi portal de cliente.");
      return;
    }
    if (title === "Llámanos") {
      openPhone(value);
      return;
    }
    openEmail(value, "Ayuda portal cliente ENERGYASSET");
  };

  const quickLinkRoute = (link: string) => {
    if (link.includes("facturas")) return "/facturas";
    if (link.includes("consumos")) return "/consumo";
    if (link.includes("pago")) return "/metodos-de-pago";
    if (link.includes("Notificaciones")) return "/notificaciones";
    if (link.includes("contratos")) return "/contratos";
    return "/profile";
  };

  return (
    <main className="bg-white pb-24 md:pb-0">
      <section className="relative overflow-hidden border-b border-gray-100 px-6 py-8 md:px-16 md:py-12">
        <div className="absolute right-0 top-8 h-72 w-72 rounded-full bg-[#edf7ff] md:top-0 md:h-full md:w-3/5 md:rounded-bl-[18rem]" />
        <div className="relative grid grid-cols-[1fr_11rem] items-center gap-2 md:gap-8 lg:grid-cols-[1fr_28rem_18rem]">
          <div>
            <p className="text-xl font-bold text-[#07133d] md:text-2xl">
              ¡Hola, {firstName}! 👋
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight text-[#07133d] md:mt-4 md:text-5xl">
              {areaTitle} <span className="text-[#0b82df]">área de clientes</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 md:mt-5 md:text-xl">
              Gestiona tu energía de forma fácil y rápida.
            </p>
            {cups.length > 0 && (
              <p className="mt-4 max-w-xl text-sm font-semibold text-[#0b82df]">
                {supplies[0]?.address || `CUPS asociado${cups.length > 1 ? "s" : ""}: ${cups.join(", ")}`}
              </p>
            )}
            {supplies[0]?.contractStatus && (
              <p className="mt-2 text-sm text-gray-500">
                Contrato {supplies[0].contractStatus}
                {supplies[0].tariff ? ` · Tarifa ${supplies[0].tariff}` : ""}
              </p>
            )}
          </div>

          <img src={piggyImage} alt="" className="mx-auto h-48 w-48 object-contain md:h-72 md:w-72" />

          <div className="col-span-2 hidden rounded-xl bg-white p-7 shadow-[0_18px_45px_rgba(15,38,71,0.12)] md:col-span-1 md:block">
            <p className="font-bold text-[#07133d]">Tu ahorro estimado</p>
            <p className="mt-3 text-4xl font-bold text-emerald-500">
              {customer.estimatedSavings}
            </p>
            <p className="mt-2 text-gray-500">desde el último mes</p>
            <button
              onClick={() => navigate("/consumo")}
              className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#0b82df] text-sm font-bold text-[#0b82df] transition hover:bg-[#0b82df] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
            >
              <FiBarChart2 /> Ver mi consumo
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 px-6 py-6 md:px-16 md:py-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-7">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_18px_45px_rgba(15,38,71,0.08)] md:rounded-none md:p-0 md:shadow-none">
          <h2 className="text-2xl font-bold text-[#07133d]">¿Necesitas ayuda?</h2>
          <div className="mt-5 grid grid-cols-3 gap-3 md:mt-0 md:gap-6">
            {supportCards.map((card) => {
              const Icon = card.tone === "green" ? FaWhatsapp : card.tone === "amber" ? FiHeadphones : FiMail;
              const toneClass =
                card.tone === "green"
                  ? "bg-emerald-50 text-emerald-500"
                  : card.tone === "amber"
                    ? "bg-amber-50 text-amber-500"
                    : "bg-blue-50 text-[#0b82df]";

              return (
                <article
                  key={card.title}
                  className="rounded-xl border border-transparent bg-white p-2 text-center transition hover:-translate-y-1 hover:border-[#0b82df]/30 hover:shadow-[0_18px_38px_rgba(15,38,71,0.08)] md:border-gray-100 md:p-7 md:text-left md:shadow-sm"
                >
                  <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full md:mx-0 md:h-16 md:w-16 ${toneClass}`}>
                    <Icon className="h-10 w-10 md:h-8 md:w-8" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#07133d] md:mt-5 md:text-xl">{card.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-gray-500 md:text-base">{card.subtitle}</p>
                  <p className="mt-4 hidden text-sm text-gray-500 md:block">{card.text}</p>
                  <p className="mt-1 text-xs font-bold text-[#0b82df] md:mt-3 md:text-base">{card.value}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleSupportAction(card.title, card.value)}
                        className={`mx-auto mt-4 flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15 md:mx-0 md:mt-6 md:h-9 md:w-9 ${toneClass}`}
                        aria-label={`Contactar por ${card.title}`}
                      >
                        <FiArrowRight />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Contactar por {card.title}</TooltipContent>
                  </Tooltip>
                </article>
              );
            })}
          </div>
          </div>

          <article className="relative overflow-hidden rounded-[1.5rem] bg-[#eaf6ff] p-7 md:rounded-xl md:p-8">
            <div className="relative z-10 max-w-md">
              <span className="rounded-full bg-[#0b82df] px-4 py-2 text-sm font-bold uppercase text-white">
                Promoción exclusiva
              </span>
              <h2 className="mt-6 max-w-[14rem] text-2xl font-bold text-[#07133d] md:max-w-md md:text-3xl">
                Ahorra más con nuestras tarifas
              </h2>
              <p className="mt-3 max-w-[15rem] text-sm text-gray-600 md:max-w-none md:text-base">
                Descubre nuestras tarifas personalizadas y empieza a pagar menos por tu luz.
              </p>
              <button
                onClick={() => navigate("/productos")}
                className="mt-6 rounded-lg bg-[#0b82df] px-10 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#076fc0] hover:shadow-[0_16px_30px_rgba(11,130,223,0.25)] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/20"
              >
                Ver tarifas
              </button>
            </div>
            <img src={solarImage} alt="" className="absolute -right-6 top-8 h-52 w-52 object-contain md:right-10 md:top-2 md:h-64 md:w-64" />
          </article>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#07133d]">Noticias y novedades</h2>
              <button
                onClick={() => navigate("/noticias")}
                className="rounded-md px-3 py-2 text-sm font-bold text-[#0b82df] transition hover:bg-[#eef6ff] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
              >
                Ver todas
              </button>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {news.map((item) => (
                <button
                  key={item.title}
                  onClick={() =>
                    navigate(`/noticias?title=${encodeURIComponent(item.title)}`)
                  }
                  className="flex gap-4 rounded-lg border border-gray-100 p-4 text-left transition hover:-translate-y-0.5 hover:border-[#0b82df]/40 hover:shadow-[0_14px_30px_rgba(15,38,71,0.08)] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15 [&:nth-child(n+2)]:hidden md:[&:nth-child(n+2)]:flex"
                >
                  <img src={item.image} alt="" className="h-24 w-24 rounded-lg object-cover" />
                  <div>
                    <span className="text-xs font-bold uppercase text-[#0b82df]">{item.tag}</span>
                    <h3 className="mt-1 font-bold text-[#07133d]">{item.title}</h3>
                    <p className="mt-3 text-sm text-gray-500">{item.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden rounded-xl border border-gray-100 bg-white shadow-sm md:block">
          <h2 className="border-b border-gray-100 p-6 text-xl font-bold text-[#07133d]">
            Accesos rápidos
          </h2>
          {quickLinks.map((link) => {
            const Icon = link.includes("facturas") ? FiFileText : link.includes("consumos") ? FiBarChart2 : link.includes("pago") ? FiCreditCard : link.includes("Notificaciones") ? FiBell : FiUser;
            return (
              <button
                key={link}
                onClick={() => navigate(quickLinkRoute(link))}
                className="flex w-full items-center justify-between border-b border-gray-100 px-6 py-5 text-left font-semibold text-[#07133d] transition hover:bg-[#f7fbff] hover:text-[#0b82df] focus:outline-none focus:ring-4 focus:ring-inset focus:ring-[#0b82df]/15"
              >
                <span className="flex items-center gap-4">
                  <Icon className="h-5 w-5" />
                  {link}
                </span>
                <FiArrowRight />
              </button>
            );
          })}
          <div className="p-6">
            <button
              onClick={() => navigate("/mas")}
              className="h-12 w-full rounded-lg border border-[#0b82df] font-bold text-[#0b82df] transition hover:bg-[#0b82df] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
            >
              Ver todas las opciones
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default DashboardPage;
