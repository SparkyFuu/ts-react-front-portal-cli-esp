import { selectUser } from "@/pages/auth/features/authSlice";
import { fetchPortalHistoricalConsumption } from "@/pages/portalClient/services";
import type {
  PortalHistoricalConsumptionMonth,
  PortalHistoricalConsumptionResponse,
} from "@/pages/portalClient/types";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiChevronDown,
  FiRefreshCw,
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
import { toast } from "react-toastify";

type ChartRow = PortalHistoricalConsumptionMonth & {
  label: string;
};

const periodKeys = [
  "consumoEnergiaActivaEnWhP1",
  "consumoEnergiaActivaEnWhP2",
  "consumoEnergiaActivaEnWhP3",
  "consumoEnergiaActivaEnWhP4",
  "consumoEnergiaActivaEnWhP5",
  "consumoEnergiaActivaEnWhP6",
] as const;

const periodLabels = ["P1", "P2", "P3", "P4", "P5", "P6"] as const;
const periodColors = [
  "#0b82df",
  "#00a7a0",
  "#f59e0b",
  "#7c3aed",
  "#ef4444",
  "#64748b",
];

const HistoricalConsumptionPage = () => {
  const user = useAppSelector(selectUser);
  const accountCups = useMemo(
    () => (Array.isArray(user.cups) ? user.cups.filter(Boolean) : []),
    [user.cups],
  );
  const [selectedCups, setSelectedCups] = useState(accountCups[0] ?? "");
  const [data, setData] = useState<PortalHistoricalConsumptionResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCups && accountCups[0]) setSelectedCups(accountCups[0]);
  }, [accountCups, selectedCups]);

  const effectiveCups = selectedCups.toUpperCase();
  const chartData: ChartRow[] = useMemo(
    () =>
      (data?.months ?? []).map((item) => ({
        ...item,
        label: formatMonthLabel(item.fechaFinMesConsumo),
      })),
    [data?.months],
  );
  const latestRows = [...(data?.months ?? [])].reverse();

  const loadHistoricalConsumption = async () => {
    if (!effectiveCups) {
      toast.info("Ingresa o selecciona un CUPS para consultar.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchPortalHistoricalConsumption({
        cups: effectiveCups,
      });
      setData(response);
      toast.success("Consumos históricos actualizados.");
    } catch (error: unknown) {
      setData(null);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!effectiveCups) {
      setData(null);
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchPortalHistoricalConsumption({
          cups: effectiveCups,
        });
        if (active) setData(response);
      } catch (error: unknown) {
        if (active) {
          setData(null);
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [effectiveCups]);

  return (
    <main className="min-h-screen bg-[#f6f9fc] pb-28 md:pb-12">
      <section className="border-b border-gray-200 bg-white px-6 py-8 md:px-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0b82df]">
              Consumos históricos
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[#07133d] md:text-5xl">
              Consulta por CUPS
            </h1>
            <p className="mt-3 max-w-2xl text-base text-gray-600 md:text-lg">
              Histórico mensual del punto de suministro seleccionado.
            </p>
          </div>

          <div className="grid gap-3 rounded-xl border border-gray-200 bg-[#fbfdff] p-3 md:grid-cols-[18rem_auto] md:items-center">
            {accountCups.length > 1 ? (
              <label className="relative block">
                <span className="sr-only">Seleccionar CUPS</span>
                <select
                  value={selectedCups}
                  onChange={(event) => {
                    setSelectedCups(event.target.value);
                  }}
                  className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-semibold text-[#07133d] outline-none transition focus:border-[#0b82df] focus:ring-4 focus:ring-[#0b82df]/15"
                >
                  {accountCups.map((cups) => (
                    <option key={cups} value={cups}>
                      {cups}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-gray-500" />
              </label>
            ) : (
              <div className="flex h-12 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-[#07133d]">
                {selectedCups || "Sin CUPS asociado"}
              </div>
            )}

            <button
              onClick={loadHistoricalConsumption}
              disabled={loading || !effectiveCups}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0b82df] px-5 font-bold text-white shadow-[0_14px_30px_rgba(11,130,223,0.22)] transition hover:bg-[#076fc0] focus:outline-none focus:ring-4 focus:ring-[#0b82df]/20 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
            >
              <FiRefreshCw className={loading ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
              Actualizar
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 px-6 py-6 md:grid-cols-3 md:px-16">
        <Metric
          icon={FiZap}
          label="Consumo total"
          value={`${formatKwh(data?.summary.totalKwh ?? 0)} kWh`}
        />
        <Metric
          icon={FiActivity}
          label="Promedio mensual"
          value={`${formatKwh(data?.summary.averageKwh ?? 0)} kWh`}
        />
        <Metric
          icon={FiBarChart2}
          label="Periodos informados"
          value={`${data?.months.length ?? 0} registros`}
        />
      </section>

      <section className="grid gap-6 px-6 md:px-16 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-[0_14px_35px_rgba(15,38,71,0.08)] md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#07133d]">
                Energía activa por periodo
              </h2>
              <p className="text-sm text-gray-500">
                {data?.dateFrom && data?.dateTo
                  ? `${formatDate(data.dateFrom)} - ${formatDate(data.dateTo)}`
                  : "Selecciona un CUPS para cargar el histórico"}
              </p>
            </div>
            <span className="rounded-lg bg-[#eef6ff] px-3 py-2 text-sm font-bold text-[#0b82df]">
              {data?.cups ?? effectiveCups}
            </span>
          </div>

          <div className="mt-6 h-[24rem]">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="#edf2f7" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={46} />
                  <ChartTooltip
                    cursor={{ fill: "rgba(11,130,223,0.06)" }}
                    formatter={(value: number, name: string) => [
                      `${formatKwh(value)} kWh`,
                      periodName(name),
                    ]}
                    labelFormatter={(label) => `Periodo ${label}`}
                  />
                  {periodKeys.map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="consumption"
                      fill={periodColors[index]}
                      radius={index === periodKeys.length - 1 ? [7, 7, 0, 0] : 0}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 text-center text-gray-500">
                {loading
                  ? "Consultando tus consumos..."
                  : "No hay consumos históricos para mostrar."}
              </div>
            )}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,38,71,0.08)]">
          <h2 className="text-xl font-bold text-[#07133d]">Totales P1-P6</h2>
          <div className="mt-5 space-y-4">
            {periodLabels.map((label, index) => {
              const value =
                data?.summary.periods[
                  label.toLowerCase() as keyof PortalHistoricalConsumptionResponse["summary"]["periods"]
                ] ?? 0;
              const total = data?.summary.totalKwh ?? 0;
              const width = total > 0 ? Math.max((value / total) * 100, 2) : 0;

              return (
                <div key={label}>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-[#07133d]">{label}</span>
                    <span className="text-gray-600">{formatKwh(value)} kWh</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${width}%`,
                        backgroundColor: periodColors[index],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="px-6 py-6 md:px-16">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_14px_35px_rgba(15,38,71,0.08)]">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-xl font-bold text-[#07133d]">Detalle mensual</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[62rem] w-full text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Periodo</th>
                  <th className="px-5 py-3">Tarifa</th>
                  {periodLabels.map((period) => (
                    <th key={period} className="px-5 py-3">
                      {period}
                    </th>
                  ))}
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Lectura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {latestRows.map((item) => (
                  <tr key={`${item.fechaInicioMesConsumo}-${item.fechaFinMesConsumo}`}>
                    <td className="px-5 py-4 font-semibold text-[#07133d]">
                      {formatDate(item.fechaInicioMesConsumo)} -{" "}
                      {formatDate(item.fechaFinMesConsumo)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {item.codigoTarifaATR || "-"}
                    </td>
                    {periodKeys.map((key) => (
                      <td key={key} className="px-5 py-4 text-gray-600">
                        {formatKwh(item[key])}
                      </td>
                    ))}
                    <td className="px-5 py-4 font-bold text-[#07133d]">
                      {formatKwh(item.consumoEnergiaActivaTotalKwh)}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {item.codigoTipoLectura || "-"}
                    </td>
                  </tr>
                ))}
                {!loading && latestRows.length === 0 && (
                  <tr>
                    <td className="px-5 py-8 text-center text-gray-500" colSpan={10}>
                      Consulta un CUPS para ver el detalle mensual.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

const Metric = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FiZap;
  label: string;
  value: string;
}) => (
  <article className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,38,71,0.08)]">
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#eef6ff] text-[#0b82df]">
      <Icon className="h-6 w-6" />
    </span>
    <div className="min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="truncate text-2xl font-bold text-[#07133d]">{value}</p>
    </div>
  </article>
);

const formatKwh = (value: number) =>
  value.toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const formatMonthLabel = (value: string) => {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleDateString("es-ES", { month: "short", year: "2-digit" })
    .replace(".", "")
    .toUpperCase();
};

const periodName = (key: string) => {
  const index = periodKeys.findIndex((periodKey) => periodKey === key);
  return index >= 0 ? periodLabels[index] : key;
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;
    if (typeof response === "object" && response !== null && "data" in response) {
      const data = response.data;
      if (typeof data === "object" && data !== null && "message" in data) {
        const message = data.message;
        if (typeof message === "string") return message;
      }
    }
  }

  return "No pudimos cargar los consumos históricos.";
};

export default HistoricalConsumptionPage;
