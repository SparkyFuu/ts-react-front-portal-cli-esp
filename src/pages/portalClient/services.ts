import apiClient from "@/api/apiClient";
import type {
  PortalConsumptionResponse,
  PortalInvoicesResponse,
  PortalSuppliesResponse,
} from "./types";

type PortalDataParams = {
  cups?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
};

export const fetchPortalSupplies = async (): Promise<PortalSuppliesResponse> => {
  const { data } = await apiClient.get<PortalSuppliesResponse>(
    "/spain/portal/client/supplies",
  );
  return data;
};

export const fetchPortalInvoices = async (
  params: PortalDataParams,
): Promise<PortalInvoicesResponse> => {
  const { data } = await apiClient.get<PortalInvoicesResponse>(
    "/spain/portal/client/invoices",
    { params },
  );
  return data;
};

export const fetchPortalConsumption = async (
  params: PortalDataParams,
): Promise<PortalConsumptionResponse> => {
  const { data } = await apiClient.get<PortalConsumptionResponse>(
    "/spain/portal/client/consumption",
    { params },
  );
  return data;
};

export const downloadPortalInvoicePdf = async (invoiceId: string) => {
  const { data } = await apiClient.get<Blob>(
    `/spain/portal/client/invoices/${encodeURIComponent(invoiceId)}/pdf`,
    { responseType: "blob" },
  );
  return data;
};
