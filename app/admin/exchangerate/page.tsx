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
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCountries, setSelectedCountries] = React.useState(
    INITIAL_SELECTED_COUNTRIES
  );
  
  // New State for Dynamic Countries
  const [countries, setCountries] = React.useState<any>(COUNTRIES);
  const [isEditingBanks, setIsEditingBanks] = React.useState(false);
  const [editingCountry, setEditingCountry] = React.useState<string | null>(null);
  const [newBankName, setNewBankName] = React.useState("");

  // Preview State
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState("");
  const [previewType, setPreviewType] = React.useState("");
  
  // Logs State
  const [savedLogs, setSavedLogs] = React.useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = React.useState(false);

  // --- Effects ---

  /**
   * Load saved values from API on component mount.
   * This ensures we get the persistent "current" values and history.
   */
  React.useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/exchangerate");
        if (response.ok) {
          const data = await response.json();
          
          // 1. Load Latest (Current) Values
          if (data.latest) {
            setRates(data.latest.rates);
            setLogoType(data.latest.logoType);
            setSelectedCountries(data.latest.selectedCountries);
            if (data.latest.countries) {
              setCountries(data.latest.countries);
            }
          }

          // 2. Load History
          if (data.history && Array.isArray(data.history)) {
            const mappedLogs: LogEntry[] = data.history.map((item: any) => ({
              id: item._id,
              date: new Date(item.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              timestamp: new Date(item.created_at).toLocaleString("es-ES"),
              rates: item.rates,
              logoType: item.logoType,
              selectedCountries: item.selectedCountries,
              countries: item.countries || COUNTRIES,
            }));
            setSavedLogs(mappedLogs);
          }
        }
      } catch (error) {
        console.error("Error fetching rates from API:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
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
      const countryData = countries[country];
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
   * Saves the current state to the API and updates the logs.
   */
  const saveCurrentValues = async () => {
    try {
      const response = await fetch("/api/admin/exchangerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rates,
          logoType,
          selectedCountries,
          countries,
        }),
      });

      if (response.ok) {
        const newRate = await response.json();
        const now = new Date(newRate.created_at);
        
        const logEntry: LogEntry = {
          id: newRate._id,
          date: now.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          timestamp: now.toLocaleString("es-ES"),
          rates: newRate.rates,
          logoType: newRate.logoType,
          selectedCountries: newRate.selectedCountries,
          countries: newRate.countries,
        };

        // Add to logs (keep last 50)
        setSavedLogs((prev) => [logEntry, ...prev].slice(0, 50));
        alert("Valores guardados exitosamente!");
      } else {
        alert("Error al guardar los valores.");
      }
    } catch (error) {
      console.error("Error saving values:", error);
      alert("Error al guardar los valores.");
    }
  };

  /**
   * Restores a previous state from the logs.
   */
  const loadLogEntry = (logEntry: LogEntry) => {
    setRates(logEntry.rates);
    setLogoType(logEntry.logoType);
    setSelectedCountries(logEntry.selectedCountries);
    if (logEntry.countries) {
      setCountries(logEntry.countries);
    }
    setErrors({});
    alert(`Valores del ${logEntry.timestamp} cargados exitosamente!`);
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
        primary: logoType === "intermex" ? "#98fa94ff" : "#3f52ffff", // Red or Orange
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

  // --- Bank Management Handlers ---

  const handleAddBank = (country: string) => {
    setEditingCountry(country);
    setNewBankName("");
    setIsEditingBanks(true);
  };

  const saveNewBank = () => {
    if (!editingCountry || !newBankName.trim()) return;
    
    setCountries((prev: any) => {
      const updated = { ...prev };
      if (updated[editingCountry]) {
        updated[editingCountry] = {
          ...updated[editingCountry],
          banks: [...updated[editingCountry].banks, newBankName.trim()]
        };
      }
      return updated;
    });
    
    setNewBankName("");
  };

  const deleteBank = (country: string, bankToDelete: string) => {
    if (!confirm(`¿Estás seguro de eliminar ${bankToDelete} de ${country}?`)) return;

    setCountries((prev: any) => {
      const updated = { ...prev };
      if (updated[country]) {
        updated[country] = {
          ...updated[country],
          banks: updated[country].banks.filter((b: string) => b !== bankToDelete)
        };
      }
      return updated;
    });
  };

  const closeBankManager = () => {
    setIsEditingBanks(false);
    setEditingCountry(null);
  };

  // --- Render Helpers ---

  const renderCountryCard = (countryName: string) => {
    const data = countries[countryName];
    if (!data) return null;

    // Use image flag if available, fallback to emoji (though we should have images for all)
    const flagSrc = FLAG_IMAGES[countryName] || null;

    return (
      <div key={countryName} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {flagSrc ? (
              <img 
                src={flagSrc} 
                alt={`${countryName} flag`} 
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <span className="text-2xl" role="img" aria-label={countryName}>
                {data.flag}
              </span>
            )}
            <h3 className="font-bold text-gray-700">{countryName}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-200 text-gray-600 px-2 py-1 rounded">
              {data.currency}
            </span>
            <button
              onClick={() => handleAddBank(countryName)}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
              title="Administrar Bancos"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {data.banks.map((bank: string) => (
            <div key={bank} className="flex items-center justify-between gap-3 group">
              <label className="text-sm font-medium text-gray-600 flex-1 truncate" title={bank}>
                {bank}
              </label>
              <div className="flex items-center gap-2">
                <div className="relative w-32">
                  <input
                    type="text"
                    value={rates[bank] || ""}
                    onChange={(e) => handleRateChange(bank, e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-3 py-1.5 text-right text-sm border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                      errors[bank]
                        ? "border-red-300 focus:ring-red-200 bg-red-50"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-gray-100 -m-6">
      
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Tipo de Cambio</h1>
            <p className="text-xs text-gray-500">{getCurrentDate()}</p>
          </div>
          
          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          {/* Logo Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setLogoType("intermex")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                logoType === "intermex"
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Intermex
            </button>
            <button
              onClick={() => setLogoType("ria")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                logoType === "ria"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Ria
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button
            onClick={handleAutopopulate}
            className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium"
            title="Autocompletar con datos de prueba"
          >
            🪄 Auto
          </button>

           <button
            onClick={saveCurrentValues}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            {isLoading ? "Guardando..." : "Guardar Valores"}
          </button>
          
          <div className="h-8 w-px bg-gray-300 mx-2"></div>

          <button
            onClick={() => generateTemplate("png", true)}
            disabled={!allFieldsValid() || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Vista Previa
          </button>
          
          <button
            onClick={() => generateTemplate("png")}
            disabled={!allFieldsValid() || isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors text-sm font-medium shadow-sm ${
              !allFieldsValid() || isGenerating
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Descargar PNG
          </button>

          <button
            onClick={() => generateTemplate("pdf")}
            disabled={!allFieldsValid() || isGenerating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors text-sm font-medium shadow-sm ${
              !allFieldsValid() || isGenerating
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            PDF
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Country Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* Column 1: Mexico (Largest) */}
            <div className="space-y-6">
              {renderCountryCard("Mexico")}
            </div>

            {/* Column 2: Central America */}
            <div className="space-y-6">
              {renderCountryCard("Honduras")}
              {renderCountryCard("Guatemala")}
            </div>

            {/* Column 3: South America & Caribbean */}
            <div className="space-y-6">
              {renderCountryCard("Colombia")}
              {renderCountryCard("Haiti")}
            </div>

          </div>
        </div>

        {/* Right: History Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-700">Historial</h2>
            <p className="text-xs text-gray-500">Últimos cambios guardados</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            {savedLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                No hay historial disponible
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {savedLogs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => loadLogEntry(log)}
                    className="w-full text-left p-4 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-gray-800 text-sm">
                        {log.date}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        log.logoType === 'intermex' 
                          ? 'border-red-100 text-red-600 bg-red-50' 
                          : 'border-orange-100 text-orange-600 bg-orange-50'
                      }`}>
                        {log.logoType === 'intermex' ? 'IMX' : 'RIA'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {log.timestamp.split(' ')[1]}
                    </div>
                    <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Cargar estos valores →
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bank Manager Modal */}
      {isEditingBanks && editingCountry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Administrar Bancos - {editingCountry}</h3>
              <button onClick={closeBankManager} className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2 mb-4">
                {countries[editingCountry]?.banks.map((bank: string) => (
                  <div key={bank} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">{bank}</span>
                    <button 
                      onClick={() => deleteBank(editingCountry, bank)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                      title="Eliminar banco"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <input
                  type="text"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="Nombre del nuevo banco"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && saveNewBank()}
                />
                <button
                  onClick={saveNewBank}
                  disabled={!newBankName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Vista Previa</h3>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-gray-100 flex justify-center">
              {previewType === "image" && (
                <img
                  src={previewContent}
                  alt="Preview"
                  className="max-w-full shadow-lg rounded-lg object-contain"
                  style={{ maxHeight: "70vh" }}
                />
              )}
            </div>
            <div className="p-4 border-t bg-white flex justify-end gap-3">
              <button
                onClick={closePreview}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.download = `exchange-rates-${new Date().toISOString().split("T")[0]}.png`;
                  link.href = previewContent;
                  link.click();
                  closePreview();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExchangeRatePage;
