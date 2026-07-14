export const ROUTE_PRIVILEGES = {
  dashboard: "privilege.dashboard",
  clients: "privilege.administracion.clients",
  bars: "privilege.administracion.bars",
  marginalCost: "privilege.administracion.marginal-cost",
  consumption: "privilege.administracion.consumption",
  salesDashboard: "privilege.comercial.sales-dashboard",
  prospects: "privilege.comercial.prospects",
  spainProspects: "privilege.comercial-espana.prospects",
  spainWebTariffs: "privilege.espana-web.tariffs.manage",
  spainWebBlogs: "privilege.espana-web.blogs.manage",
  quoter: "privilege.comercial.quoter",
  bessDimensioning: "privilege.comercial.bess-dimensioning",
  projects: "privilege.proyectos.btm",
  donguil: "privilege.coordinacion-cen.donguil",
  cpi: "privilege.development.cpi",
  typeMaster: "privilege.development.type-master",
  billingTypeMaster: "privilege.development.billing-type-master",
  authAdmin: "privilege.development.auth",
  proforma: "privilege.facturacion.proforma",
  proformaScenarios: "privilege.facturacion.proforma-scenarios",
  obtainedCharges: "privilege.facturacion.obtained-charges",
  proformaCatalogs: "privilege.facturacion.proforma-catalogs",
  txZonalSystem: "privilege.facturacion.tx-zonal-system",
  txZonalSegment: "privilege.facturacion.tx-zonal-segment",
} as const;

export type RoutePrivilege =
  (typeof ROUTE_PRIVILEGES)[keyof typeof ROUTE_PRIVILEGES];

type AuthPrivilegeSource = {
  decodedToken?: {
    privileges?: unknown;
  };
  user?: {
    privileges?: unknown;
  };
};

export const getAuthPrivileges = (auth: AuthPrivilegeSource) => {
  const tokenPrivileges = auth.decodedToken?.privileges;
  const userPrivileges = auth.user?.privileges;
  const privileges = Array.isArray(tokenPrivileges)
    ? tokenPrivileges
    : Array.isArray(userPrivileges)
      ? userPrivileges
      : [];

  return new Set(privileges.filter((item) => typeof item === "string"));
};

export const canAccessPrivilege = (
  auth: AuthPrivilegeSource,
  privilege?: string,
) => {
  if (!privilege) return true;
  return getAuthPrivileges(auth).has(privilege);
};
