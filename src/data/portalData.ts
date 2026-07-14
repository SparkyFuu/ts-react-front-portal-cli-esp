import solarImage from "@/assets/images/10.png";
import renewableImage from "@/assets/images/9.png";
import savingImage from "@/assets/images/11.png";

export type InvoiceStatus = "Pagada" | "Pendiente";

export type Invoice = {
  id: string;
  title: string;
  date: string;
  concept: "Electricidad" | "Gas";
  period: string;
  amount: string;
  status: InvoiceStatus;
};

export type ConsumptionMonth = {
  month: string;
  peak: number;
  flat: number;
  valley: number;
};

export const customer = {
  name: "María",
  address: "Gran Vía, 123 - Barcelona",
  estimatedSavings: "23,40 €",
};

export const invoices: Invoice[] = [
  {
    id: "2024-000123",
    title: "Luz y servicios",
    date: "18/03/2024",
    concept: "Electricidad",
    period: "01/02/2024 - 29/02/2024",
    amount: "23,99 €",
    status: "Pagada",
  },
  {
    id: "2024-000122",
    title: "Gas luz y servicios",
    date: "05/03/2024",
    concept: "Gas",
    period: "01/02/2024 - 29/02/2024",
    amount: "196,83 €",
    status: "Pagada",
  },
  {
    id: "2024-000121",
    title: "Luz",
    date: "20/02/2024",
    concept: "Electricidad",
    period: "01/01/2024 - 31/01/2024",
    amount: "25,01 €",
    status: "Pagada",
  },
  {
    id: "2024-000120",
    title: "Gas",
    date: "18/01/2024",
    concept: "Gas",
    period: "01/01/2024 - 31/01/2024",
    amount: "120,45 €",
    status: "Pagada",
  },
];

export const consumptionMonths: ConsumptionMonth[] = [
  { month: "NOV", peak: 16, flat: 44, valley: 34 },
  { month: "DIC", peak: 26, flat: 54, valley: 28 },
  { month: "ENE", peak: 20, flat: 48, valley: 42 },
  { month: "FEB", peak: 46, flat: 44, valley: 38 },
  { month: "MAR", peak: 24, flat: 18, valley: 56 },
  { month: "ABR", peak: 36, flat: 16, valley: 40 },
  { month: "MAY", peak: 32, flat: 16, valley: 50 },
  { month: "JUN", peak: 14, flat: 24, valley: 74 },
  { month: "JUL", peak: 38, flat: 46, valley: 36 },
  { month: "AGO", peak: 24, flat: 16, valley: 58 },
  { month: "SEP", peak: 18, flat: 16, valley: 18 },
  { month: "OCT", peak: 24, flat: 40, valley: 24 },
];

export const quickLinks = [
  "Mis facturas",
  "Mis consumos",
  "Mis datos",
  "Mis contratos",
  "Métodos de pago",
  "Notificaciones",
];

export const supportCards = [
  {
    title: "Escríbenos",
    subtitle: "Email",
    text: "Te respondemos lo antes posible.",
    value: "clientes@energyasset.es",
    tone: "blue",
  },
  {
    title: "WhatsApp",
    subtitle: "900 103 254",
    text: "Atención rápida por WhatsApp.",
    value: "900 103 254",
    tone: "green",
  },
  {
    title: "Llámanos",
    subtitle: "Atención telefónica",
    text: "Lunes a viernes de 9:00 a 18:00h.",
    value: "900 103 254",
    tone: "amber",
  },
];

export const news = [
  {
    title: "Más energía renovable, más futuro para todos",
    tag: "Novedad",
    date: "15 may 2024",
    image: renewableImage,
  },
  {
    title: "5 consejos para ahorrar energía en casa",
    tag: "Consejos",
    date: "8 may 2024",
    image: savingImage,
  },
  {
    title: "Nuevas ayudas para instalaciones solares",
    tag: "Actualidad",
    date: "2 may 2024",
    image: solarImage,
  },
];
