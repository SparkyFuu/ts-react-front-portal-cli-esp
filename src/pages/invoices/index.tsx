import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { customer } from "@/data/portalData";
import { selectUser } from "@/pages/auth/features/authSlice";
import {
  downloadPortalInvoicePdf,
  fetchPortalInvoices,
} from "@/pages/portalClient/services";
import type { PortalInvoice } from "@/pages/portalClient/types";
import { useAppSelector } from "@/store/hooks";
import { downloadTextFile } from "@/utils/portalActions";
import { useEffect, useMemo, useState } from "react";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import {
  FiCalendar,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiInfo,
  FiMapPin,
  FiSettings,
  FiChevronRight,
  FiZap,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type InvoiceTab = "invoices" | "consumptions";
type SelectOption = {
  label: string;
  value: string;
};
type PeriodOption = SelectOption & {
  startDate: string;
  endDate: string;
};

const statusOptions: SelectOption[] = [
  { label: "Todos los estados", value: "Todos los estados" },
  { label: "Pagada", value: "Pagada" },
  { label: "Pendiente", value: "Pendiente" },
];

const periodOptions: PeriodOption[] = [
  {
    label: "01/01/2024 — 04/05/2024",
    value: "2024-01-01_2024-05-04",
    startDate: "2024-01-01",
    endDate: "2024-05-04",
  },
  {
    label: "Últimos 30 días",
    value: "2024-03-18_2024-04-18",
    startDate: "2024-03-18",
    endDate: "2024-04-18",
  },
  {
    label: "Enero 2024",
    value: "2024-01-01_2024-01-31",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  },
  {
    label: "Febrero 2024",
    value: "2024-02-01_2024-02-29",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
  },
];

const makeSelectStyles = <Option extends SelectOption>(
  valuePaddingLeft = "18px",
): StylesConfig<
  Option,
  false
> => ({
  control: (base, state) => ({
    ...base,
    minHeight: "64px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(11,130,223,0.12)" : "none",
    "&:hover": { borderColor: "#0b82df" },
    cursor: "pointer",
  }),
  valueContainer: (base) => ({ ...base, paddingLeft: valuePaddingLeft }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, color: "#07133d" }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 18px 45px rgba(15,38,71,0.14)",
    zIndex: 60,
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
  singleValue: (base) => ({ ...base, color: "#07133d" }),
});

const selectStyles = makeSelectStyles<SelectOption>();
const iconSelectStyles = makeSelectStyles<SelectOption>("42px");
const periodIconSelectStyles = makeSelectStyles<PeriodOption>("42px");

const InvoicesPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const supplyOptions: SelectOption[] = useMemo(() => {
    const cups = Array.isArray(user.cups) ? user.cups : [];
    if (!cups.length) return [{ label: customer.address, value: customer.address }];

    return cups.map((cup) => ({
      label: cup,
      value: cup,
    }));
  }, [user.cups]);
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [supplyFilter, setSupplyFilter] = useState(
    supplyOptions[0]?.value || customer.address,
  );
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-05-04");
  const [activeTab, setActiveTab] = useState<InvoiceTab>("invoices");
  const [showConfig, setShowConfig] = useState(false);
  const [invoices, setInvoices] = useState<PortalInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedSupply =
    supplyOptions.find((option) => option.value === supplyFilter) ??
    supplyOptions[0];

  useEffect(() => {
    let active = true;

    const loadInvoices = async () => {
      setLoading(true);

      try {
        const response = await fetchPortalInvoices({
          cups: selectedSupply?.value,
          dateFrom: startDate,
          dateTo: endDate,
          status: statusFilter,
        });
        if (active) setInvoices(response.invoices);
      } catch {
        if (active) {
          setInvoices([]);
          toast.error("No pudimos cargar tus facturas eléctricas.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInvoices();

    return () => {
      active = false;
    };
  }, [endDate, selectedSupply?.value, startDate, statusFilter]);

  const filteredInvoices = invoices;

  const exportInvoices = () => {
    const csv = [
      "Factura,Fecha,Concepto,Periodo,Importe,Estado",
      ...filteredInvoices.map((invoice) =>
        [
          invoice.id,
          invoice.invoiceDate,
          invoice.concept,
          invoice.period,
          invoice.amountLabel,
          invoice.status,
        ].join(","),
      ),
    ].join("\n");

    downloadTextFile("facturas-energyasset.csv", csv, "text/csv;charset=utf-8");
    toast.success("Exportación generada");
  };

  const downloadInvoice = async (invoiceId: string) => {
    const invoice = filteredInvoices.find((item) => item.id === invoiceId);
    if (!invoice) return;

    try {
      const blob = await downloadPortalInvoicePdf(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factura-${invoice.id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Factura ${invoice.id} descargada`);
    } catch {
      toast.error("No pudimos descargar el PDF de la factura.");
    }
  };

  const openInvoice = async (invoiceId: string) => {
    try {
      const blob = await downloadPortalInvoicePdf(invoiceId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => window.URL.revokeObjectURL(url), 30000);
    } catch {
      toast.error("No pudimos abrir la factura.");
    }
  };

  return (
    <main className="px-6 py-8 pb-28 md:px-16 md:py-10 md:pb-10">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-4xl font-bold text-[#07133d] md:text-5xl">Facturas</h1>
          <p className="mt-3 hidden text-xl text-gray-600 md:block">
            Consulta y gestiona todas tus facturas de energía.
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowConfig((current) => !current)}
              className="mt-0 flex items-center gap-3 rounded-lg px-3 py-2 font-bold text-[#0b82df] transition hover:bg-[#eef6ff] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15 md:mt-6"
            >
              <FiSettings className="h-8 w-8 md:h-6 md:w-6" />
              <span className="hidden md:inline">Configuración de facturas</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Editar preferencias de envío y adjuntos</TooltipContent>
        </Tooltip>
      </div>

      {showConfig && (
        <section className="mt-8 rounded-xl border border-[#0b82df]/20 bg-[#eef6ff] p-6">
          <h2 className="text-xl font-bold text-[#07133d]">Configuración de facturas</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#0b82df]" />
              Recibir aviso por email
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#0b82df]" />
              Adjuntar PDF
            </label>
            <button
              onClick={() => toast.success("Preferencias guardadas")}
              className="rounded-lg bg-[#0b82df] px-6 py-2 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#076fc0] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/20"
            >
              Guardar
            </button>
          </div>
        </section>
      )}

      <section className="mt-8 grid gap-0 overflow-hidden rounded-2xl bg-white shadow-[0_16px_45px_rgba(15,38,71,0.08)] md:mt-12 md:gap-8 md:overflow-visible md:rounded-xl md:p-8 lg:grid-cols-[1.2fr_1.2fr_0.9fr_auto]">
        <label>
          <span className="mb-4 hidden font-bold text-[#07133d] md:block">Suministro</span>
          <div className="relative border-b border-gray-100 md:border-b-0">
            <FiMapPin className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#0b82df]" />
            <Select<SelectOption, false>
              aria-label="Seleccionar suministro"
              options={supplyOptions}
              value={selectedSupply}
              onChange={(option: SingleValue<SelectOption>) => {
                if (!option) return;
                setSupplyFilter(option.value);
                toast.info(`Suministro seleccionado: ${option.label}`);
              }}
              styles={iconSelectStyles}
              isSearchable={false}
            />
          </div>
        </label>

        <label>
          <span className="mb-4 hidden font-bold text-[#07133d] md:block">Periodo</span>
          <div className="relative md:border-b-0">
            <FiCalendar className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#0b82df]" />
            <Select<PeriodOption, false>
              aria-label="Seleccionar periodo"
              options={periodOptions}
              value={
                periodOptions.find(
                  (option) =>
                    option.startDate === startDate && option.endDate === endDate,
                ) ?? periodOptions[0]
              }
              onChange={(option: SingleValue<PeriodOption>) => {
                if (!option) return;
                setStartDate(option.startDate);
                setEndDate(option.endDate);
              }}
              styles={periodIconSelectStyles}
              isSearchable={false}
            />
          </div>
        </label>

        <label className="hidden md:block">
          <span className="mb-4 block font-bold text-[#07133d]">Estado</span>
          <Select<SelectOption, false>
            aria-label="Seleccionar estado de factura"
            options={statusOptions}
            value={statusOptions.find((option) => option.value === statusFilter)}
            onChange={(option: SingleValue<SelectOption>) => {
              if (option) setStatusFilter(option.value);
            }}
            styles={selectStyles}
            isSearchable={false}
          />
        </label>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={exportInvoices}
              className="hidden self-end rounded-lg border border-[#0b82df] px-9 py-5 font-bold text-[#0b82df] transition hover:-translate-y-0.5 hover:bg-[#0b82df] hover:text-white hover:shadow-[0_16px_30px_rgba(11,130,223,0.22)] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15 md:block"
            >
              <span className="flex items-center gap-3">
                <FiDownload /> Exportar
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Descargar facturas filtradas en CSV</TooltipContent>
        </Tooltip>
      </section>

      <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_rgba(15,38,71,0.06)] md:mt-12 md:flex md:gap-14 md:rounded-none md:border-b md:border-gray-200 md:bg-transparent md:shadow-none">
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-6 py-5 font-bold transition hover:text-[#0b82df] md:px-12 md:pb-5 md:pt-0 ${
            activeTab === "invoices"
              ? "border-b-4 border-[#0b82df] text-[#0b82df]"
              : "text-gray-500"
          }`}
        >
          Mis facturas
        </button>
        <button
          onClick={() => setActiveTab("consumptions")}
          className={`px-6 py-5 font-bold transition hover:text-[#0b82df] md:px-12 md:pb-5 md:pt-0 ${
            activeTab === "consumptions"
              ? "border-b-4 border-[#0b82df] text-[#0b82df]"
              : "text-gray-500"
          }`}
        >
          Mis consumos
        </button>
      </div>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
        <article className="overflow-hidden rounded-xl bg-white shadow-[0_16px_45px_rgba(15,38,71,0.08)]">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#07133d]">
              {activeTab === "invoices" ? "Últimas facturas" : "Últimos consumos"}{" "}
              <span className="text-base font-normal text-gray-500">IVA incl.</span>{" "}
              <FiInfo className="inline h-4 w-4" />
            </h2>
          </div>

          {activeTab === "invoices" ? (
            <>
            <div className="md:hidden">
              {loading && (
                <div className="border-t border-gray-100 p-6 text-gray-500">
                  Consultando facturas eléctricas...
                </div>
              )}
              {filteredInvoices.map((invoice) => {
                const Icon = FiZap;
                return (
                  <button
                    key={invoice.id}
                    onClick={() => openInvoice(invoice.id)}
                    className="flex w-full items-center gap-5 border-t border-gray-100 p-6 text-left"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef6ff]">
                      <Icon className="h-9 w-9 text-[#0b82df]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-[#07133d]">
                        {invoice.title}
                      </span>
                      <span className="mt-1 block text-gray-500">
                        {invoice.period}
                      </span>
                      <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                        {invoice.status}
                      </span>
                    </span>
                    <span className="text-3xl text-[#17446f]">
                      {invoice.amountLabel}
                    </span>
                    <FiChevronRight className="h-6 w-6 text-gray-500" />
                  </button>
                );
              })}
              {!loading && filteredInvoices.length === 0 && (
                <div className="border-t border-gray-100 p-6 text-gray-500">
                  No hay facturas eléctricas para este periodo.
                </div>
              )}
            </div>
            <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[56rem]">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-[#07133d]">
                  <th className="px-8 py-4">Factura</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Concepto</th>
                  <th className="px-6 py-4">Periodo</th>
                  <th className="px-6 py-4">Importe</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td className="px-8 py-10 text-gray-500" colSpan={7}>
                      Consultando facturas eléctricas...
                    </td>
                  </tr>
                )}
                {filteredInvoices.map((invoice) => {
                  const Icon = FiZap;
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100 transition hover:bg-[#f8fbff]"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6ff]">
                            <Icon className="h-8 w-8 text-[#0b82df]" />
                          </span>
                          <div>
                            <p className="font-bold text-[#07133d]">{invoice.title}</p>
                            <p className="text-sm text-gray-500">N° {invoice.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">{invoice.invoiceDate}</td>
                      <td className="px-6 py-6">{invoice.concept}</td>
                      <td className="px-6 py-6">{invoice.period}</td>
                      <td className="px-6 py-6 font-semibold">
                        {invoice.amountLabel}
                      </td>
                      <td className="px-6 py-6">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-5 text-[#0b82df]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => downloadInvoice(invoice.id)}
                                aria-label="Descargar factura"
                                className="rounded-md p-2 transition hover:bg-[#eef6ff] hover:text-[#076fc0] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
                              >
                                <FiDownload className="h-5 w-5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Descargar factura</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => openInvoice(invoice.id)}
                                aria-label="Ver factura"
                                className="rounded-md p-2 transition hover:bg-[#eef6ff] hover:text-[#076fc0] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
                              >
                                <FiFileText className="h-5 w-5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalle de factura</TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filteredInvoices.length === 0 && (
                  <tr>
                    <td className="px-8 py-10 text-gray-500" colSpan={7}>
                      No hay facturas eléctricas para este periodo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
            </>
          ) : (
            <div className="grid gap-4 p-8 md:grid-cols-3">
              {["Electricidad", "Total"].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate("/consumo")}
                  className="rounded-xl border border-gray-100 p-6 text-left transition hover:-translate-y-0.5 hover:border-[#0b82df]/40 hover:shadow-[0_16px_34px_rgba(15,38,71,0.08)] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
                >
                  <p className="font-bold text-[#07133d]">{item}</p>
                  <p className="mt-3 text-3xl font-bold text-[#0b82df]">
                    {filteredInvoices
                      .reduce(
                        (sum, invoice) => sum + invoice.consumption.total,
                        0,
                      )
                      .toLocaleString("es-ES", {
                        maximumFractionDigits: 1,
                      })}{" "}
                    kWh
                  </p>
                  <p className="mt-2 text-sm text-gray-500">Ver detalle de consumo</p>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-center p-8">
            <button
              onClick={() => {
                setStatusFilter("Todos los estados");
                setStartDate("2024-01-01");
                setEndDate("2024-05-04");
                setActiveTab("invoices");
              }}
              className="flex items-center gap-3 rounded-lg border border-[#0b82df] px-10 py-4 font-bold text-[#0b82df] transition hover:bg-[#0b82df] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
            >
              <FiFileText /> Ver todas mis facturas
            </button>
          </div>
        </article>

        <aside className="hidden h-fit rounded-xl bg-[#eef6ff] p-8 shadow-[0_16px_45px_rgba(15,38,71,0.08)] lg:block">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0b82df] text-[#0b82df]">
            ?
          </div>
          <h2 className="mt-7 text-xl font-bold text-[#07133d]">¿Necesitas ayuda?</h2>
          <p className="mt-5 text-gray-600">
            Encuentra respuestas a las preguntas más frecuentes sobre tus facturas.
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/ayuda")}
                className="mt-8 flex items-center gap-3 rounded-lg border border-[#0b82df] px-6 py-4 font-bold text-[#0b82df] transition hover:bg-[#0b82df] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#0b82df]/15"
              >
                Centro de ayuda <FiExternalLink />
              </button>
            </TooltipTrigger>
            <TooltipContent>Ir al centro de ayuda</TooltipContent>
          </Tooltip>
        </aside>
      </section>
    </main>
  );
};

export default InvoicesPage;
