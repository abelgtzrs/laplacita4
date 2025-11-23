import { Countries } from "./types";

/**
 * Static configuration for supported countries and their banks.
 * 
 * DEVELOPER NOTES:
 * This object defines the structure of the form and the generated images.
 * If you need to add a new country or bank, add it here.
 * The keys (Mexico, Honduras, etc.) are used as identifiers throughout the app.
 */
export const COUNTRIES: Countries = {
  Mexico: {
    currency: "MXN",
    flag: "🇲🇽",
    banks: [
      "Elektra / Banco Azteca",
      "Bancoppel",
      "Bancomer",
      "Banorte",
      "Pago Express",
      "Soriana",
      "Walmart",
      "Bodega Aurrerá",
      "Farmacias Guadalajara",
      "OXXO",
    ],
  },
  Honduras: {
    currency: "HNL",
    flag: "🇭🇳",
    banks: [
      "Banco Atlántida",
      "Banco de Occidente",
      "Banrural Honduras",
      "Banco Azteca HN",
    ],
  },
  Guatemala: {
    currency: "GTQ",
    flag: "🇬🇹",
    banks: [
      "Banrural",
      "Banco Industrial",
      "Banco Azteca GT",
      "Banco G&T Continental",
    ],
  },
  Colombia: {
    currency: "COP",
    flag: "🇨🇴",
    banks: ["Bancolombia", "Grupo Éxito", "Banco Davivienda"],
  },
  Haiti: {
    currency: "HTG",
    flag: "🇭🇹",
    banks: ["Unibank", "Sogebank", "Capital Bank"],
  },
};

/**
 * Initial empty state for rates.
 * This ensures all fields are controlled inputs from the start.
 */
export const INITIAL_RATES = {
  // Mexico banks (USD to MXN)
  "Elektra / Banco Azteca": "",
  Bancoppel: "",
  Bancomer: "",
  Banorte: "",
  "Pago Express": "",
  Soriana: "",
  Walmart: "",
  OXXO: "",
  // Honduras banks (USD to HNL)
  "Banco Atlántida": "",
  "Banco de Occidente": "",
  "Banrural Honduras": "",
  "Banco Azteca HN": "",
  // Guatemala banks (USD to GTQ)
  Banrural: "",
  "Banco Industrial": "",
  "Banco Azteca GT": "",
  "Banco G&T Continental": "",
  // Colombia banks (USD to COP)
  Bancolombia: "",
  "Grupo Éxito": "",
  "Banco Davivienda": "",
  // Haiti banks (USD to HTG)
  Unibank: "",
  Sogebank: "",
  "Capital Bank": "",
};

export const INITIAL_SELECTED_COUNTRIES = [
  "Mexico",
  "Honduras",
  "Guatemala",
  "Colombia",
  "Haiti",
];

export const FLAG_IMAGES: { [key: string]: string } = {
  Mexico: "/flags/mexico.png",
  Honduras: "/flags/honduras.png",
  Guatemala: "/flags/guatemala.png",
  Colombia: "/flags/colombia.png",
  Haiti: "/flags/haiti.png",
};
