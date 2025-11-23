"use client";
import React from "react";
import { AdminLayout } from "@/components/admin-layout";
import {
  RateErrors,
  Rates,
  LogEntry,
} from "./types";
import {
  COUNTRIES,
  INITIAL_RATES,
  INITIAL_SELECTED_COUNTRIES,
  FLAG_IMAGES,
} from "./constants";
import {
  validateRate,
  getCurrentDate,
  generateRandomRate,
} from "./utils";
import { preloadImages } from "./image-utils";

/**
 * ExchangeRatePage Component
 * 
 * DEVELOPER NOTES:
 * This is the main container for the Exchange Rate admin interface.
 * It wraps the MainComponent in the AdminLayout.
 */
function ExchangeRatePage() {
  return (
    <AdminLayout>
      <MainComponent />
    </AdminLayout>
  );
}

/**
 * MainComponent
 * 
 * DEVELOPER NOTES:
 * This component handles all the logic for the Exchange Rate feature.
 * 
 * Key Responsibilities:
 * 1. State Management:
 *    - rates: Stores the current input values for all banks.
 *    - errors: Stores validation error messages.
 *    - logoType: Toggles between "intermex" and "ria".
 *    - selectedCountries: Controls which countries are displayed/exported.
 *    - savedLogs: History of saved configurations.
 * 
 * 2. Persistence:
 *    - Uses localStorage to persist state between reloads.
 *    - Keys: "exchangeRates", "exchangeLogoType", "exchangeSelectedCountries", "exchangeRateLogs".
 * 
 * 3. Export Generation:
 *    - Generates PNGs using HTML5 Canvas (detailed logic in generateTemplate).
 *    - Generates PDFs by opening a new window with styled HTML and calling window.print().
 */
function MainComponent() {
  // --- State Initialization ---
  const [rates, setRates] = React.useState<Rates>(INITIAL_RATES);
  const [errors, setErrors] = React.useState<RateErrors>({});
  const [logoType, setLogoType] = React.useState("intermex");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedCountries, setSelectedCountries] = React.useState(
    INITIAL_SELECTED_COUNTRIES
  );
  
  // Preview State
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState("");
  const [previewType, setPreviewType] = React.useState("");
  
  // Logs State
  const [savedLogs, setSavedLogs] = React.useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = React.useState(false);

  // --- Effects ---

  /**
   * Load saved values from localStorage on component mount.
   * This ensures the user doesn't lose their work if they refresh the page.
   */
  React.useEffect(() => {
    const savedRates = localStorage.getItem("exchangeRates");
    const savedLogoType = localStorage.getItem("exchangeLogoType");
    const savedCountries = localStorage.getItem("exchangeSelectedCountries");
    const logs = localStorage.getItem("exchangeRateLogs");

    if (savedRates) {
      try {
        setRates(JSON.parse(savedRates));
      } catch (error) {
        console.error("Error loading saved rates:", error);
      }
    }

    if (savedLogoType) {
      setLogoType(savedLogoType);
    }

    if (savedCountries) {
      try {
        setSelectedCountries(JSON.parse(savedCountries));
      } catch (error) {
        console.error("Error loading saved countries:", error);
      }
    }

    if (logs) {
      try {
        setSavedLogs(JSON.parse(logs));
      } catch (error) {
        console.error("Error loading logs:", error);
      }
    }
  }, []);

  // --- Handlers ---

  /**
   * Handles changes to rate inputs.
   * Performs real-time validation.
   */
  const handleRateChange = (bank: string, value: string) => {
    setRates((prev) => ({ ...prev, [bank]: value }));

    if (value && !validateRate(value)) {
      setErrors((prev) => ({
        ...prev,
        [bank]: "Debe ser un número válido con hasta 2 decimales",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[bank];
        return newErrors;
      });
    }
  };

  /**
   * Checks if all fields for the *selected* countries are valid.
   * Used to enable/disable export buttons.
   */
  const allFieldsValid = () => {
    // Only check banks belonging to selected countries
    const activeBanks: string[] = [];
    selectedCountries.forEach(country => {
      const countryData = COUNTRIES[country];
      if (countryData) {
        activeBanks.push(...countryData.banks);
      }
    });

    // Check if all active banks have a value and are valid
    const allRatesValid = activeBanks.every(bank => {
      const rate = rates[bank];
      return rate && validateRate(rate);
    });

    return allRatesValid && Object.keys(errors).length === 0;
  };

  /**
   * Saves the current state to localStorage and adds an entry to the logs.
   */
  const saveCurrentValues = () => {
    const now = new Date();
    const logEntry: LogEntry = {
      id: now.getTime().toString(),
      date: getCurrentDate(),
      timestamp: now.toLocaleString("es-ES"),
      rates: { ...rates },
      logoType,
      selectedCountries: [...selectedCountries],
    };

    // Save current values to localStorage
    localStorage.setItem("exchangeRates", JSON.stringify(rates));
    localStorage.setItem("exchangeLogoType", logoType);
    localStorage.setItem(
      "exchangeSelectedCountries",
      JSON.stringify(selectedCountries)
    );

    // Add to logs (keep last 50)
    const updatedLogs = [logEntry, ...savedLogs].slice(0, 50);
    setSavedLogs(updatedLogs);
    localStorage.setItem("exchangeRateLogs", JSON.stringify(updatedLogs));

    alert("Valores guardados exitosamente!");
  };

  /**
   * Restores a previous state from the logs.
   */
  const loadLogEntry = (logEntry: LogEntry) => {
    setRates(logEntry.rates);
    setLogoType(logEntry.logoType);
    setSelectedCountries(logEntry.selectedCountries);
    setErrors({});
    alert(`Valores del ${logEntry.timestamp} cargados exitosamente!`);
  };

  const clearLogs = () => {
    if (confirm("¿Estás seguro de que quieres borrar todos los registros?")) {
      setSavedLogs([]);
      localStorage.removeItem("exchangeRateLogs");
      alert("Registros borrados exitosamente!");
    }
  };

  /**
   * Generates the export template (PNG or PDF).
   * 
   * DEVELOPER NOTES:
   * This is the core "business logic" of this page.
   * 
   * PNG Generation:
   * - Creates an HTML5 Canvas.
   * - Draws the background, headers, logos, and text manually.
   * - Calculates layout positions dynamically based on selected countries.
   * - Handles column balancing (splitting countries into two columns).
   * - Exports the canvas as a data URL.
   * 
   * PDF Generation:
   * - Opens a new browser window.
   * - Writes a full HTML document with inline CSS into that window.
   * - Calls window.print() to trigger the browser's print dialog.
   * - Automatically closes the window after printing.
   */
  const generateTemplate = async (format: "png" | "pdf", preview = false) => {
    if (!allFieldsValid()) return;

    setIsGenerating(true);
    let generatedContent = "";

    if (format === "png") {
      // Create a canvas for the PNG template (Portrait 4:5 ratio for Social Media)
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      // --- Dimensions (1080x1350 - Instagram Portrait) ---
      canvas.width = 1080;
      canvas.height = 1350;
      const W = canvas.width;
      const H = canvas.height;

      // --- Design Configuration ---
      const colors = {
        primary: logoType === "intermex" ? "#e74c3c" : "#f39c12", // Red or Orange
        primaryDark: logoType === "intermex" ? "#c0392b" : "#d35400",
        backgroundTop: "#ffffff",
        backgroundBottom: "#f0f2f5",
        textMain: "#2c3e50",
        textLight: "#7f8c8d",
        cardBg: "rgba(255, 255, 255, 0.95)",
        cardShadow: "rgba(0, 0, 0, 0.1)",
        accent: "#27ae60", // Green for rates
      };

      // --- 1. Background ---
      // Create a subtle gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, H);
      bgGradient.addColorStop(0, colors.backgroundTop);
      bgGradient.addColorStop(1, colors.backgroundBottom);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, W, H);

      // Add a decorative top curve/shape
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(W, 250);
      ctx.bezierCurveTo(W, 250, W / 2, 350, 0, 250);
      ctx.closePath();
      ctx.fill();

      // --- Assets Preloading ---
      const storeLogoPath =
        logoType === "intermex" ? "/logos/intermex.png" : "/logos/ria.png";
      const cornerLogoPath = "/storelogo.png";

      const { flagMap, storeLogoImg, cornerLogoImg } = await preloadImages(
        FLAG_IMAGES,
        selectedCountries,
        storeLogoPath,
        cornerLogoPath
      );

      // --- 2. Header Section ---
      
      // Store Logo (Centered Top)
      if (storeLogoImg) {
        const logoH = 120;
        const aspectRatio = storeLogoImg.naturalWidth / storeLogoImg.naturalHeight;
        const logoW = logoH * aspectRatio;
        
        // Draw with a white glow/shadow for better visibility on color
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 15;
        ctx.drawImage(storeLogoImg, (W - logoW) / 2, 40, logoW, logoH);
        ctx.shadowBlur = 0; // Reset shadow
      }

      // Corner Logo (Top Left - Larger branding)
      if (cornerLogoImg) {
        // Draw larger at top left
        ctx.drawImage(cornerLogoImg, 30, 30, 250, 250);
      }

      // Title & Date
      ctx.textAlign = "center";
      
      // "Tipos de Cambio"
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 60px 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      ctx.fillText("TIPOS DE CAMBIO", W / 2, 220);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Date Badge
      const dateText = getCurrentDate();
      ctx.font = "bold 28px 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
      const dateWidth = ctx.measureText(dateText).width + 60;
      
      // Date background pill
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect((W - dateWidth) / 2, 260, dateWidth, 50, 25);
      ctx.fill();
      
      // Date text
      ctx.fillStyle = colors.primaryDark;
      ctx.fillText(dateText, W / 2, 295);

      // --- 3. Content Grid (Countries) ---
      const startY = 360;
      const cardGap = 30;
      const colWidth = 480; // (1080 - 3*30) / 2 approx
      const col1X = 40;
      const col2X = W - 40 - colWidth;
      
      let leftColY = startY;
      let rightColY = startY;

      // Distribute countries logic (same as before but cleaner)
      let countriesForColumns = [...selectedCountries];
      const idxHonduras = countriesForColumns.indexOf("Honduras");
      const idxGuatemala = countriesForColumns.indexOf("Guatemala");
      if (idxHonduras !== -1 && idxGuatemala !== -1) {
        [countriesForColumns[idxHonduras], countriesForColumns[idxGuatemala]] =
          [countriesForColumns[idxGuatemala], countriesForColumns[idxHonduras]];
      }
      
      const countriesInColumns: string[][] = [[], []];
      countriesForColumns.forEach((country, index) => {
        countriesInColumns[index % 2].push(country);
      });
      // Force Haiti right
      const leftIdx = countriesInColumns[0].indexOf("Haiti");
      if (leftIdx !== -1) {
        countriesInColumns[0].splice(leftIdx, 1);
        countriesInColumns[1].push("Haiti");
      }

      // Helper to draw a country card
      const drawCountryCard = (countryName: string, x: number, y: number): number => {
        const data = COUNTRIES[countryName];
        if (!data) return y;

        const bankCount = data.banks.length;
        const headerH = 70;
        const rowH = 55;
        const padding = 15;
        const cardHeight = headerH + (bankCount * rowH) + padding;

        // Card Shadow & Background
        ctx.shadowColor = colors.cardShadow;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = colors.cardBg;
        
        ctx.beginPath();
        ctx.roundRect(x, y, colWidth, cardHeight, 20);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Country Header (Flag + Name)
        const flagImg = flagMap[countryName];
        if (flagImg) {
          // Circular flag mask
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + 50, y + 35, 20, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(flagImg, x + 30, y + 15, 40, 40); // Draw slightly larger to cover
          ctx.restore();
        }

        // Country Name
        ctx.textAlign = "left";
        ctx.fillStyle = colors.textMain;
        ctx.font = "bold 28px 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(countryName.toUpperCase(), x + 85, y + 45);
        
        // Currency Code (Small pill)
        ctx.font = "bold 14px 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = "#ecf0f1";
        ctx.beginPath();
        ctx.roundRect(x + colWidth - 70, y + 25, 50, 24, 12);
        ctx.fill();
        ctx.fillStyle = "#7f8c8d";
        ctx.textAlign = "center";
        ctx.fillText(data.currency, x + colWidth - 45, y + 42);

        // Divider
        ctx.strokeStyle = "#ecf0f1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 20, y + 70);
        ctx.lineTo(x + colWidth - 20, y + 70);
        ctx.stroke();

        // Bank Rows
        let rowY = y + headerH + 35; // Start of first row text baseline
        ctx.textAlign = "left";
        
        data.banks.forEach((bank) => {
          // Bank Name
          ctx.fillStyle = "#34495e";
          ctx.font = "600 22px 'Segoe UI', Roboto, sans-serif";
          ctx.fillText(bank, x + 25, rowY);

          // Rate (Highlighted)
          const rateVal = rates[bank] || "---";
          ctx.textAlign = "right";
          ctx.fillStyle = colors.accent;
          ctx.font = "bold 32px 'Segoe UI', Roboto, sans-serif";
          ctx.fillText(rateVal, x + colWidth - 25, rowY);
          
          // Reset for next row
          ctx.textAlign = "left";
          rowY += rowH;
        });

        return y + cardHeight + cardGap;
      };

      // Draw Columns
      countriesInColumns[0].forEach(country => {
        leftColY = drawCountryCard(country, col1X, leftColY);
      });
      countriesInColumns[1].forEach(country => {
        rightColY = drawCountryCard(country, col2X, rightColY);
      });

      // --- 4. Footer ---
      const footerY = H - 60;
      ctx.fillStyle = colors.textLight;
      ctx.font = "18px 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("¡Visítanos hoy para obtener el mejor servicio!", W / 2, footerY);
      ctx.font = "bold 20px 'Segoe UI', Roboto, sans-serif";
      ctx.fillStyle = colors.primary;
      ctx.fillText("Síguenos en Facebook", W / 2, footerY + 30);

      // --- Finalize ---
      generatedContent = canvas.toDataURL("image/png");

      if (preview) {
        setPreviewContent(generatedContent);
        setPreviewType("image");
        setShowPreview(true);
      } else {
        const link = document.createElement("a");
        link.download = `exchange-rates-${
          new Date().toISOString().split("T")[0]
        }.png`;
        link.href = generatedContent;
        link.click();
      }
    } else if (format === "pdf") {
      // --- PDF Export Logic ---
      // Create HTML for PDF with enhanced design
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Exchange Rates - ${getCurrentDate()}</title>
            <style>
              @page {
                margin: 0;
                size: 850px 1100px;
              }
              body {
                margin: 0;
              }
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Arial', sans-serif; 
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                color: #111;
              }
              .container {
                max-width: 850px;
                min-height: 1100px;
                margin: 0 auto;
                background: white;
                padding: 50px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              .header { 
                color: #fff; 
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                border-radius: 8px;
                margin-bottom: 6px;
              }
              .logo-placeholder {
                position: absolute;
                left: 30px;
                width: 80px;
                height: 60px;
                border: 2px solid white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
              }
              .qr-section {
                position: absolute;
                top: 30px;
                left: 60px;
                width: 200px;
                text-align: center;
                background: rgba(255, 255, 255, 0.95);
                padding: 15px;
                border-radius: 8px;
              }
              .qr-placeholder {
                width: 100px;
                height: 100px;
                background: #f8f9fa;
                border: 2px dashed #666;
                margin: 0 auto 20px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                color: #666;
              }
              .qr-text {
                font-size: 12px;
                color: #2c3e50;
                font-weight: bold;
                line-height: 1.3;
              }
              .facebook-text {
                color: #3498db;
                font-weight: bold;
              }
              .company-name { 
                font-size: 42px; 
                font-weight: bold; 
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              }
              .date-title {
                text-align: center;
                padding: 10px 0 10px 0;
                border-radius: 8px;
                margin-bottom: 8px;
              }
              .date { 
                font-size: 28px; 
                color: #111; 
                margin-bottom: 10px;
                font-weight: bold;
              }
              .title { 
                font-size: 40px; 
                font-weight: bold; 
                color: #111;
                letter-spacing: 2px;
              }
              .rates-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                padding: 0;
              }
              .country-section {
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                overflow: hidden;
              }
              .country-header {
                background: linear-gradient(135deg, #34495e, #2c3e50);
                color: white;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                font-weight: bold;
              }
              .flag-placeholder {
                width: 40px;
                height: 25px;
                background: #27ae60;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
              }
              .country-name {
                font-size: 20px;
                font-weight: bold;
                color: #fff;
              }
              .bank-list {
                padding: 0 20px;
              }
              .bank-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e9ecef;
                transition: background-color 0.2s;
              }
              .bank-row:hover {
                background-color: #f8f9fa;
              }
              .bank-row:last-child {
                border-bottom: none;
              }
              .bank-info {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .bank-logo-placeholder {
                width: 30px;
                height: 20px;
                background: #6c757d;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 8px;
                font-weight: bold;
              }
              .bank-name {
                font-weight: bold;
                font-size: 20px;
                color: #111;
              }
              .rate {
                color: #111;
                font-weight: bold;
                font-size: 18px;
                background: #ffe5e5;
                padding: 4px 16px;
                border-radius: 20px;
                border: 2px solid #111;
              }
              .mexico-section {
                grid-row: span 2;
              }
              @media print {
                body { background: white !important; }
                .container { box-shadow: none; padding: 0 !important; }
                .header, .date-title { margin-bottom: 15px; }
                .bank-row:hover { background-color: transparent !important; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo-placeholder">LOGO</div>
                <div class="company-name">${
                  logoType === "intermex"
                    ? `<img src="${window.location.origin}/logos/intermex.png" alt="INTERMEX" style="height: 120px;" />`
                    : `<img src="${window.location.origin}/logos/ria.png" alt="RIA" style="height: 120px;" />`
                }</div>
              </div>
              
              <div class="date-title">
                <div class="date">${getCurrentDate()}</div>
                <div class="title">TIPO DE CAMBIO</div>
              </div>
              
              <div class="rates-container">
                ${selectedCountries
                  .map((countryName) => {
                    const countryData = COUNTRIES[countryName];
                    if (!countryData) return "";

                    return `
                    <div class="country-section ${
                      countryName === "Mexico" ? "mexico-section" : ""
                    }">
                      <div class="country-header">
                        <div class="flag-placeholder"><img src="/flags/${countryName.toLowerCase()}.png"></div>
                        <div class="country-name">${countryName.toUpperCase()} (USD → ${
                      countryData.currency
                    })</div>
                      </div>
                      <div class="bank-list">
                        ${countryData.banks
                          .map(
                            (bank) => `
                          <div class="bank-row">
                            <div class="bank-info">
                              <div class="bank-name">${bank}</div>
                            </div>
                            <div class="rate">${rates[bank]} ${countryData.currency}</div>
                          </div>
                        `
                          )
                          .join("")}
                      </div>
                    </div>
                    `;
                  })
                  .join("")}
              </div>
              
              <!-- QR Code Section -->
              <div class="qr-section">
                <div class="qr-placeholder"><img src="/qrcode.png"/></div>
                <div class="qr-text">
                  ¡Escanea y síguenos en <span class="facebook-text">Facebook</span> para actualizaciones diarias del tipo de cambio!
                </div>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => window.close(), 1000);
                }, 500);
              }
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        alert(
          "No se pudo abrir la ventana de impresión. Por favor, permita las ventanas emergentes (popups) en su navegador."
        );
      }
    }

    setIsGenerating(false);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewContent("");
    setPreviewType("");
  };

  /**
   * Generates a JSON representation of the current state.
   * Displayed in the UI for debugging/verification.
   */
  const getJsonData = () => {
    const jsonData: {
      date: string;
      logo: string;
      rates: {
        [key: string]: { currency: string; banks: { [key: string]: number } };
      };
    } = {
      date: getCurrentDate(),
      logo: logoType,
      rates: {},
    };

    Object.entries(COUNTRIES).forEach(([country, data]) => {
      jsonData.rates[country] = {
        currency: data.currency,
        banks: {},
      };

      data.banks.forEach((bank) => {
        if (rates[bank]) {
          jsonData.rates[country].banks[bank] = parseFloat(rates[bank]);
        }
      });
    });

    return JSON.stringify(jsonData, null, 2);
  };

  /**
   * Autopopulates the form with random valid data.
   * Useful for testing the layout without typing everything manually.
   */
  const handleAutopopulate = () => {
    const newRates: Rates = {};
    Object.entries(COUNTRIES).forEach(([country, data]) => {
      data.banks.forEach((bank) => {
        newRates[bank] = generateRandomRate(data.currency);
      });
    });
    setRates(newRates);
    setErrors({}); // Clear any existing errors
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((c) => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
            Tipos de Cambio
          </h1>

          {/* Country Selection */}
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
            <h3 className="text-md font-medium text-gray-700 mb-2 text-center">
              Países a Incluir:
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.entries(COUNTRIES).map(([country, data]) => (
                <button
                  key={country}
                  onClick={() => handleCountryToggle(country)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
                    selectedCountries.includes(country)
                      ? "bg-blue-700 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {data.flag} {country}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Toggle */}
          <div className="mb-4 text-center">
            <label className="text-md font-medium text-gray-700 mr-3">
              Compañía:
            </label>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setLogoType("intermex")}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                  logoType === "intermex"
                    ? "bg-green-700 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Intermex
              </button>
              <button
                onClick={() => setLogoType("ria")}
                className={`px-3 py-1.5 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  logoType === "ria"
                    ? "bg-orange-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                RIA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Ingresar Tipos de Cambio
              </h2>

              {Object.entries(COUNTRIES).map(([country, data]) => (
                <div key={country} className="mb-4">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    {country} (USD → {data.currency})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    {data.banks.map((bank) => (
                      <div key={bank}>
                        <label className="block text-sm font-medium text-gray-600 mb-0.5">
                          {bank}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={rates[bank]}
                          onChange={(e) =>
                            handleRateChange(bank, e.target.value)
                          }
                          className={`w-full px-2 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors[bank] ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors[bank] && (
                          <p className="text-red-500 text-xs mt-0.5">
                            {errors[bank]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* JSON Display */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Formato JSON
              </h2>
              <div className="bg-gray-100 rounded-md p-3 h-96 overflow-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {getJsonData()}
                </pre>
              </div>

              {/* Preview Buttons */}
              <div className="mt-4 bg-gray-100 rounded-lg shadow-inner p-4">
                <h3 className="text-md font-medium text-gray-700 mb-2 text-center">
                  Vista Previa
                </h3>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => generateTemplate("pdf", true)}
                    disabled={!allFieldsValid() || isGenerating}
                    className="px-4 py-1.5 bg-red-700 text-white rounded-md hover:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => generateTemplate("png", true)}
                    disabled={!allFieldsValid() || isGenerating}
                    className="px-4 py-1.5 bg-blue-700 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    PNG
                  </button>
                </div>

                {/* Export Buttons */}
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2 text-center">
                    Exportar
                  </h3>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => generateTemplate("pdf")}
                      disabled={!allFieldsValid() || isGenerating}
                      className="px-4 py-1.5 bg-red-700 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? "Generando..." : "PDF"}
                    </button>
                    <button
                      onClick={() => generateTemplate("png")}
                      disabled={!allFieldsValid() || isGenerating}
                      className="px-4 py-1.5 bg-blue-700 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? "Generando..." : "PNG"}
                    </button>
                  </div>

                  {!allFieldsValid() && (
                    <p className="text-yellow-600 text-xs mt-1 text-center">
                      {selectedCountries.length === 0
                        ? "✅ Los países seleccionados mostrarán campos de entrada abajo"
                        : "Por favor complete todos los campos para los países seleccionados con tasas válidas para habilitar la exportación"}
                    </p>
                  )}
                </div>

                {/* Management Buttons */}
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2 text-center">
                    Administración
                  </h3>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={handleAutopopulate}
                      className="px-4 py-1.5 bg-purple-700 text-white rounded-md hover:bg-purple-600"
                    >
                      Autocompletar
                    </button>
                    <button
                      onClick={saveCurrentValues}
                      className="px-4 py-1.5 bg-green-700 text-white rounded-md hover:bg-green-600"
                    >
                      Guardar Valores
                    </button>
                    <button
                      onClick={() => setShowLogs(!showLogs)}
                      className="px-4 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                    >
                      {showLogs ? "Ocultar" : "Ver"} Historial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Section */}
          {showLogs && (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Historial de Valores Guardados
                </h2>
                {savedLogs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  >
                    Borrar Historial
                  </button>
                )}
              </div>

              {savedLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay registros guardados aún.
                </p>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {savedLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {log.timestamp}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Logo:{" "}
                              {log.logoType === "intermex" ? "Intermex" : "RIA"}{" "}
                              | Países: {log.selectedCountries.join(", ")}
                            </p>
                          </div>
                          <button
                            onClick={() => loadLogEntry(log)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                          >
                            Cargar
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {Object.entries(log.rates)
                              .filter(([_, rate]) => rate)
                              .map(([bank, rate]) => (
                                <span key={bank} className="truncate">
                                  {bank}: {rate}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                Vista Previa de Plantilla
              </h2>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="flex-grow overflow-auto p-3">
              {previewType === "image" && (
                <img
                  src={previewContent}
                  alt="Vista Previa PNG"
                  className="max-w-full h-auto mx-auto"
                />
              )}
              {previewType === "html" && (
                <iframe
                  srcDoc={previewContent}
                  className="w-full h-full border-none"
                  title="Vista Previa PDF"
                ></iframe>
              )}
            </div>
            <div className="p-3 border-t border-gray-200 text-right">
              <button
                onClick={closePreview}
                className="px-4 py-1.5 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExchangeRatePage;
