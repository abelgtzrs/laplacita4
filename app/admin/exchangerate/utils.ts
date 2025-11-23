/**
 * Utility functions for the Exchange Rate feature.
 */

/**
 * Validates a rate input string.
 * 
 * DEVELOPER NOTES:
 * - Must be a valid number.
 * - Must be greater than 0.
 * - Must have at most 2 decimal places.
 * 
 * @param value The rate string to validate.
 * @returns true if valid, false otherwise.
 */
export const validateRate = (value: string): boolean => {
  if (!value) return false;
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return false;
  
  // Check if it has at most 2 decimal places
  const decimalPart = value.split(".")[1];
  return !decimalPart || decimalPart.length <= 2;
};

/**
 * Returns the current date formatted in Spanish.
 * Example: "22 de noviembre de 2025"
 */
export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Generates random rates for testing purposes.
 * 
 * DEVELOPER NOTES:
 * This is used by the "Autocompletar" button.
 * Ranges are hardcoded to be somewhat realistic for each currency.
 */
export const generateRandomRate = (currency: string): string => {
  if (currency === "MXN") {
    return (Math.random() * (19 - 18.0) + 18.0).toFixed(2);
  } else if (currency === "HNL") {
    return (Math.random() * (24.7 - 24.5) + 25).toFixed(2);
  } else if (currency === "GTQ") {
    return (Math.random() * (7.8 - 7.6) + 7.6).toFixed(2);
  } else if (currency === "COP") {
    return (Math.random() * (4000 - 3800) + 3800).toFixed(2);
  } else if (currency === "HTG") {
    return (Math.random() * (135 - 130) + 130).toFixed(2);
  } else {
    return (Math.random() * (100 - 10) + 10).toFixed(2); // Default for others
  }
};
