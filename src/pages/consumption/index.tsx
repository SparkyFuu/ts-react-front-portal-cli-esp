import piggyImage from "@/assets/images/a.png";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { selectUser } from "@/pages/auth/features/authSlice";
import { fetchPortalConsumption } from "@/pages/portalClient/services";
import type { PortalConsumptionResponse } from "@/pages/portalClient/types";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import {
  FiBarChart2,
  FiCalendar,
  FiChevronRight,
  FiClock,
  FiInfo,
  FiShield,
  FiHeadphones,
  FiFileText,
  FiFeather,
  FiZap,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type RangeOption = 6 | 12;
type RangeSelectOption = {
  label: string;
  value: RangeOption;
};

const rangeOptions: RangeSelectOption[] = [
  { label: "Últ. 12 meses", value: 12 },
  { label: "Últ. 6 meses", value: 6 },
];

const selectStyles: StylesConfig<RangeSelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: "40px",
    border: "none",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(11,130,223,0.2)" : "none",
    background: "transparent",
    cursor: "pointer",
  }),
  valueContainer: (base) => ({ ...base, paddingLeft: 0 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "#07133d" }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 18px 45px rgba(15,38,71,0.14)",
    zIndex: 50,
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? "#0b82df"
      : state.isFocused
        ? "#eef6ff"
        : "white",
    color: state.isSelected ? "white" : "#07133d",
    cursor: "pointer",
  }),
  singleValue: (base) => ({ ...base, color: "#07133d", fontWeight: 700 }),
};

const ConsumptionPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const firstName = user.name?.split(" ")[0] || "Cliente";
  const cups = Array.isArray(user.cups) ? user.cups[0] : undefined;
  const [range, setRange] = useState<RangeOption>(12);
  const [selectedMonth, setSelectedMonth] = useState<string>("FEB");
  const [data, setData] = useState<PortalConsumptionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const visibleMonths = useMemo(
    () =>
      (data?.months ?? []).slice(range === 6 ? -6 : 0).map((item) => ({
        ...item,
        total: item.total ?? item.peak + item.flat + item.valley,
      })),
    [data?.months, range],
  );
  const selectedData =
    visibleMonths.find((item) => item.month === selectedMonth) ?? visibleMonths[0];
  const averageConsumption =
    visibleMonths.length > 0
      ? visibleMonths.reduce((sum, item) => sum + item.total, 0) /
        visibleMonths.length
      : 0;
  const peakAverage =
    visibleMonths.length > 0
      ? visibleMonths.reduce((sum, item) => sum + item.peak, 0) /
        visibleMonths.length
      : 0;
  const flatAverage =
    visibleMonths.length > 0
      ? visibleMonths.reduce((sum, item) => sum + item.flat, 0) /
        visibleMonths.length
      : 0;
  const valleyAverage =
    visibleMonths.length > 0
      ? visibleMonths.reduce((sum, item) => sum + item.valley, 0) /
        visibleMonths.length
      : 0;

  useEffect(() => {
    let active = true;

    const loadConsumption = async () => {
      setLoading(true);

      try {
        const response = await fetchPortalConsumption({ cups });
        if (active) setData(response);
      } catch {
        if (active) {
          setData(null);
          toast.error("No pudimos cargar tu consumo eléctrico.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadConsumption();

    return () => {
      active = false;
    };
  }, [cups]);

  const formatKwh = (value: number) =>
    value.toLocaleString("es-ES", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  const handleMonthClick = (data: unknown) => {
    if (typeof data === "object" && data !== null && "activeLabel" in data) {
      const month = data.activeLabel;
      if (typeof month === "string") setSelectedMonth(month);
    }
  };

  const invoicePreview = (invoiceId: string) =>
    navigate(`/facturas?invoice=${encodeURIComponent(invoiceId)}`);

  const showPeakHours = () => {
    setRange(6);
    document
      .getElementById("consumption-chart")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="bg-white pb-24 md:pb-0">
      <section className="relative overflow-hidden px-6 py-8 md:px-16 md:py-16">
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-[#edf7ff] md:top-0 md:h-full md:w-3/5 md:rounded-bl-[18rem]" />
        <div className="relative grid grid-cols-[1fr_13rem] items-center gap-2 lg:grid-cols-[1fr_34rem] lg:gap-8">
          <div>
            <p className="text-3xl font-bold text-[#0b82df] md:text-4xl">
              ¡Hola, {firstName}!
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-[#07133d] md:text-6xl">
              Este es tu consumo
            </h1>
            <p className="mt-4 text-lg text-gray-600 md:mt-6 md:text-2xl">Resumen de tu energía</p>
            <button
              onClick={() =>
                document
                  .getElementById("consumption-chart")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="mt-8 hidden items-center gap-3 rounded-full bg-[#0b82df] px-8 py-4 font-bold text-white shadow-[0_15px_35px_rgba(11,130,223,0.24)] transition hover:-translate-y-0.5 hover:bg-[#076fc0] hover:shadow-[0_20px_40px_rgba(11,130,223,0.32)] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/20 md:flex"
            >
              <FiBarChart2 className="h-5 w-5" />
              Ver mi consumo
            </button>
          </div>
          <img src={piggyImage} alt="" className="mx-auto h-56 w-56 object-contain md:h-96 md:w-96" />
        </div>
      </section>

      <section className="grid gap-7 px-6 pb-10 md:px-16 lg:grid-cols-[1fr_28rem]">
        <article
          id="consumption-chart"
          className="-mt-2 rounded-[1.75rem] bg-white p-5 shadow-[0_18px_45px_rgba(15,38,71,0.12)] md:mt-0 md:rounded-2xl md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-7">
              <h2 className="text-2xl font-bold text-[#0b82df]">Mensual</h2>
              <span className="h-8 w-px bg-gray-200" />
              <div className="flex min-w-44 items-center gap-2 rounded-lg px-2 transition hover:bg-[#eef6ff] md:min-w-48 md:gap-3">
                <FiCalendar />
                <Select<RangeSelectOption, false>
                  aria-label="Seleccionar rango de consumo"
                  className="w-36 md:w-40"
                  options={rangeOptions}
                  value={rangeOptions.find((option) => option.value === range)}
                  onChange={(option: SingleValue<RangeSelectOption>) => {
                    if (option) setRange(option.value);
                  }}
                  styles={selectStyles}
                  isSearchable={false}
                />
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    toast.info("El consumo se calcula sumando energía punta, llano y valle por periodo.")
                  }
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#07133d] transition hover:bg-[#eef6ff] hover:text-[#0b82df] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
                >
                  <FiInfo /> ¿Cómo se calcula?
                </button>
              </TooltipTrigger>
              <TooltipContent>Ver explicación del cálculo de consumo</TooltipContent>
            </Tooltip>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
            <div>
              <p className="text-5xl font-bold text-[#07133d] md:text-6xl">
                {formatKwh(averageConsumption)} <span className="text-3xl">kWh</span>
              </p>
              <p className="mt-3 text-lg text-gray-600">
                {loading ? "Cargando consumo..." : "Consumo medio"}{" "}
                <FiInfo className="inline" />
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                [`${formatKwh(peakAverage)} kWh`, "Punta", "bg-[#0b82df]"],
                [`${formatKwh(flatAverage)} kWh`, "Llano", "bg-[#31aef3]"],
                [`${formatKwh(valleyAverage)} kWh`, "Valle", "bg-[#cfe9ff]"],
              ].map(([value, label, color]) => (
                <div key={label} className="flex gap-3">
                  <span className={`mt-1 h-10 w-1 rounded-full ${color}`} />
                  <div>
                    <p className="font-bold text-[#07133d]">{value}</p>
                    <p className="text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#fbfdff] p-2 md:p-4">
            <p className="mb-3 text-sm font-semibold text-[#07133d]">
              {selectedData
                ? `Mes seleccionado: ${selectedData.month} · ${formatKwh(
                    selectedData.total,
                  )} kWh`
                : "Sin consumos eléctricos para el periodo"}
            </p>
            <div className="h-72 md:h-72">
              {visibleMonths.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visibleMonths} onClick={handleMonthClick}>
                    <CartesianGrid vertical={false} stroke="#edf2f7" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={36} />
                    <ChartTooltip
                      cursor={{ fill: "rgba(11,130,223,0.06)" }}
                      formatter={(value: number, name: string) => [
                        `${formatKwh(value)} kWh`,
                        name === "peak"
                          ? "Punta"
                          : name === "flat"
                            ? "Llano"
                            : "Valle",
                      ]}
                      labelFormatter={(label) => `Mes ${label}`}
                    />
                    <Bar dataKey="peak" stackId="energy" fill="#0b82df" radius={[0, 0, 8, 8]} />
                    <Bar dataKey="flat" stackId="energy" fill="#36b6f5" />
                    <Bar dataKey="valley" stackId="energy" fill="#cfe9ff" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-200 text-center text-gray-500">
                  {loading
                    ? "Consultando tus datos..."
                    : "Aún no hay consumo eléctrico disponible."}
                </div>
              )}
            </div>
          </div>
        </article>

        <article className="hidden overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(15,38,71,0.12)] md:block">
          <div className="border-b border-gray-100 p-7">
            <h2 className="text-2xl font-bold text-[#07133d]">
              Últimas facturas <span className="text-base font-normal text-gray-400">IVA incl.</span>
            </h2>
          </div>
          {(data?.invoices ?? []).slice(0, 3).map((invoice) => {
            const Icon = FiZap;
            return (
              <button
                key={invoice.id}
                onClick={() => invoicePreview(invoice.id)}
                className="flex w-full items-center gap-4 border-b border-gray-100 p-7 text-left transition hover:bg-[#f7fbff]"
                title={`Ver detalle de factura ${invoice.id}`}
              >
                <span className="h-3 w-3 rounded-full bg-[#0b82df]" />
                <Icon className="h-8 w-8 text-amber-500" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#07133d]">{invoice.title}</h3>
                  <p className="text-sm text-gray-500">{invoice.period}</p>
                </div>
                <p className="text-3xl text-[#17446f]">{invoice.amountLabel}</p>
                <FiChevronRight className="h-6 w-6 text-gray-500" />
              </button>
            );
          })}
          {!loading && (data?.invoices ?? []).length === 0 && (
            <div className="p-7 text-gray-500">
              No hay facturas eléctricas disponibles.
            </div>
          )}
          <button
            onClick={() => navigate("/facturas")}
            className="h-16 w-full font-bold text-[#0b82df] transition hover:bg-[#eef6ff] hover:text-[#076fc0] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
          >
            Ver todas mis facturas
          </button>
        </article>
      </section>

      <section className="px-6 md:hidden">
        <div className="mx-auto mb-6 flex justify-center gap-4">
          <span className="h-3 w-3 rounded-full bg-[#0b82df]" />
          <span className="h-3 w-3 rounded-full bg-[#cfe9ff]" />
          <span className="h-3 w-3 rounded-full bg-[#cfe9ff]" />
        </div>
        <button
          onClick={showPeakHours}
          className="flex w-full items-center gap-5 rounded-2xl bg-white p-6 text-left shadow-[0_18px_45px_rgba(15,38,71,0.10)]"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef6ff] text-[#0b82df]">
            <FiClock className="h-9 w-9" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xl font-bold text-[#07133d]">Horas punta</span>
            <span className="text-gray-500">Semana pasada</span>
          </span>
          <FiChevronRight className="h-7 w-7 text-gray-600" />
        </button>
      </section>

      <section className="hidden border-t border-gray-200 bg-white px-6 py-8 md:grid md:grid-cols-4 md:px-16">
        {[
          {
            Icon: FiShield,
            title: "Seguridad",
            text: "Protegemos tu información",
          },
          {
            Icon: FiHeadphones,
            title: "Soporte",
            text: "Estamos para ayudarte",
          },
          {
            Icon: FiFileText,
            title: "Transparencia",
            text: "Información clara y accesible",
          },
          {
            Icon: FiFeather,
            title: "Sostenibilidad",
            text: "Comprometidos con el futuro",
          },
        ].map(({ Icon, title, text }) => (
          <div key={title} className="flex items-center justify-center gap-5 py-4">
            <Icon className="h-10 w-10 text-[#0b82df]" />
            <div>
              <h2 className="text-xl font-bold text-[#07133d]">{title}</h2>
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default ConsumptionPage;
