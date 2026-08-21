export type PortalSupply = {
  cups: string;
  address: string;
  holder?: string | null;
  cif?: string | null;
  contractId?: string | null;
  contractCode?: string | null;
  contractStatus?: string | null;
  tariff?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type PortalInvoice = {
  id: string;
  title: string;
  cups: string;
  invoiceDate: string;
  dateFrom: string;
  dateTo: string;
  period: string;
  concept: "Electricidad";
  amount: number;
  amountLabel: string;
  status: "Pagada" | "Pendiente" | string;
  rawStatus: string;
  tariff?: string | null;
  consumption: {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    p5: number;
    p6: number;
    total: number;
  };
};

export type PortalConsumptionMonth = {
  month: string;
  label: string;
  year: number;
  peak: number;
  flat: number;
  valley: number;
  total: number;
};

export type PortalSuppliesResponse = {
  customer: {
    name: string;
    email: string;
    cif?: string | null;
  };
  supplies: PortalSupply[];
  source: string;
};

export type PortalViewerAccountsResponse = {
  rows: Array<{
    id: number;
    email: string;
    name: string;
    cif?: string | null;
    cups?: string[];
    isAdmin?: boolean;
    passwordChangeRequired?: boolean;
  }>;
  count: number;
};

export type PortalInvoicesResponse = {
  cups: string;
  invoices: PortalInvoice[];
  totals: {
    count: number;
    amount: number;
  };
  source: string;
};

export type PortalConsumptionResponse = {
  cups: string;
  dateFrom: string;
  dateTo: string;
  months: PortalConsumptionMonth[];
  invoices: PortalInvoice[];
  summary: {
    average: number;
    peakAverage: number;
    flatAverage: number;
    valleyAverage: number;
  };
  source: string;
};

export type PortalHistoricalConsumptionMonth = {
  cups: string;
  fechaInicioMesConsumo: string;
  fechaFinMesConsumo: string;
  codigoTarifaATR: string;
  consumoEnergiaActivaEnWhP1: number;
  consumoEnergiaActivaEnWhP2: number;
  consumoEnergiaActivaEnWhP3: number;
  consumoEnergiaActivaEnWhP4: number;
  consumoEnergiaActivaEnWhP5: number;
  consumoEnergiaActivaEnWhP6: number;
  consumoEnergiaActivaTotalKwh: number;
  codigoDHEquipoDeMedida: string;
  codigoTipoLectura: string;
};

export type PortalHistoricalConsumptionResponse = {
  cups: string;
  dateFrom: string | null;
  dateTo: string | null;
  months: PortalHistoricalConsumptionMonth[];
  summary: {
    totalKwh: number;
    averageKwh: number;
    periods: {
      p1: number;
      p2: number;
      p3: number;
      p4: number;
      p5: number;
      p6: number;
    };
  };
  source: string;
};
