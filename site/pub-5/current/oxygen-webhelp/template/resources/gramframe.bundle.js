var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  // Inject CSS styles
  const style = document.createElement('style');
  style.textContent = "/**\n * GramFrame Component Styles - Military/Industrial Theme\n */\n\n/* Container that replaces the config table */\n.gram-frame-container {\n  position: relative;\n  width: 100%;\n  max-width: 100%;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n  background: #1a1a1a;\n  transition: box-shadow 0.2s ease, border-color 0.2s ease;\n  margin-bottom: 20px;\n}\n\n/* Focus indicator for multiple instances */\n.gram-frame-container.gram-frame-focused {\n  box-shadow: 0 0 0 3px rgba(66, 139, 202, 0.5);\n  border-radius: 8px;\n}\n\n/* Military-style table layout for proper resizing */\n.gram-frame-table {\n  display: table;\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%);\n  border: 3px solid #444;\n  border-radius: 8px;\n  box-shadow: \n    inset 0 2px 4px rgba(255,255,255,0.1),\n    inset 0 -2px 4px rgba(0,0,0,0.3),\n    0 4px 8px rgba(0,0,0,0.5);\n}\n\n.gram-frame-row {\n  display: table-row;\n}\n\n.gram-frame-row:nth-child(2) {\n  height: 100%; /* Main panel row should stretch */\n}\n\n.gram-frame-cell {\n  display: table-cell;\n  vertical-align: middle;\n  padding: 0;\n}\n\n\n/* Main panel with military frame */\n.gram-frame-main-panel {\n  padding: 15px;\n  background: linear-gradient(135deg, #333 0%, #1a1a1a 50%, #000 100%);\n  border: 3px solid #555;\n  border-radius: 8px;\n  box-shadow: \n    inset 0 3px 6px rgba(0,0,0,0.5),\n    inset 0 -2px 4px rgba(255,255,255,0.1),\n    0 0 10px rgba(0,0,0,0.7);\n  position: relative;\n}\n\n.gram-frame-main-panel:before {\n  content: '';\n  position: absolute;\n  top: 5px;\n  left: 5px;\n  right: 5px;\n  bottom: 5px;\n  border: 1px solid #666;\n  border-radius: 4px;\n  pointer-events: none;\n}\n\n/* SVG container for drawing the spectrogram and overlays */\n.gram-frame-svg {\n  display: block;\n  width: 100%;\n  height: auto;\n  background: #000;\n  border: 2px solid #333;\n  border-radius: 4px;\n  cursor: crosshair;\n  box-shadow: inset 0 2px 8px rgba(0,0,0,0.8);\n}\n\n/* SVG image element for the spectrogram */\n.gram-frame-image {\n  /* Remove width/height CSS to allow SVG attributes to control positioning */\n}\n\n/* SVG axes styling - white on dark background */\n.gram-frame-axis-line {\n  stroke: #fff;\n  stroke-width: 1;\n  fill: none;\n}\n\n.gram-frame-axis-tick {\n  stroke: #fff;\n  stroke-width: 1;\n}\n\n.gram-frame-axis-tick-major {\n  stroke: #fff;\n  stroke-width: 1;\n}\n\n.gram-frame-axis-tick-minor {\n  stroke: #fff;\n  stroke-width: 1;\n}\n\n.gram-frame-axis-label {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n  font-size: 12px;\n  fill: #fff;\n  dominant-baseline: central;\n}\n\n.gram-frame-axis-label-major {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n  font-size: 10px;\n  fill: #fff;\n  dominant-baseline: central;\n}\n\n\n\n\n/* Military-style display panel */\n.gram-frame-display-panel {\n  padding: 10px;\n  background: linear-gradient(180deg, #333 0%, #1a1a1a 50%, #000 100%);\n  border-top: 2px solid #555;\n}\n\n.gram-frame-readout {\n  flex: 0 1 auto;\n  padding: 0;\n  background: transparent;\n}\n\n/* Harmonics mode CSS removed - now using unified layout */\n\n/* Harmonics layout container - two columns */\n\n/* Left column for controls - 40% width */\n.gram-frame-harmonics-controls {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  flex: 0 0 40%;\n  max-width: 40%;\n}\n\n/* Top row in left column */\n.gram-frame-harmonics-top-row {\n  display: flex;\n  gap: 10px;\n  align-items: stretch;\n}\n\n/* Right column for table - 60% width */\n.gram-frame-harmonics-table-column {\n  flex: 0 0 60%;\n  max-width: 60%;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n/* Make color picker more compact in harmonics mode */\n.gram-frame-harmonics-mode .gram-frame-color-picker {\n  margin: 0;\n}\n\n/* Harmonic panel layout - always visible in unified layout */\n\n/* Military-style display windows */\n.gram-frame-led {\n  font-family: 'Courier New', monospace;\n  background: linear-gradient(135deg, #1a1a1a 0%, #000 50%, #0a0a0a 100%);\n  color: #00ff00; /* LED green */\n  padding: 6px 0px;\n  border: 0px solid #333;\n  border-radius: 4px;\n  display: flex;\n  flex-direction: column;\n  flex: 0 0 auto;\n  min-width: 100px;\n  text-align: center;\n  box-shadow: \n    inset 0 2px 6px rgba(0,0,0,0.8),\n    inset 0 -1px 2px rgba(255,255,255,0.05),\n    0 2px 4px rgba(0,0,0,0.5);\n  position: relative;\n  font-size: 11px;\n  height: fit-content;\n}\n\n.gram-frame-led:before {\n  content: '';\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  right: 2px;\n  bottom: 2px;\n  border: 1px solid #444;\n  border-radius: 2px;\n  pointer-events: none;\n}\n\n/* LED label */\n.gram-frame-led-label {\n  font-size: 10px;\n  color: #00ff00;\n  margin-bottom: 4px;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: bold;\n}\n\n/* LED value */\n.gram-frame-led-value {\n  font-size: 14px;\n  font-weight: bold;\n  text-shadow: 0 0 4px #00ff00;\n}\n\n/* Manual harmonic button */\n.gram-frame-manual-button {\n  padding: 6px 12px;\n  background: linear-gradient(180deg, #6a6a6a 0%, #4a4a4a 50%, #2a2a2a 100%);\n  color: #ddd;\n  border: 2px solid #555;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: bold;\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  box-shadow: \n    inset 0 1px 2px rgba(255,255,255,0.2),\n    inset 0 -1px 2px rgba(0,0,0,0.3),\n    0 2px 4px rgba(0,0,0,0.3);\n  transition: all 0.1s ease;\n  min-width: 80px;\n}\n\n.gram-frame-manual-button:hover {\n  background: linear-gradient(180deg, #7a7a7a 0%, #5a5a5a 50%, #3a3a3a 100%);\n  box-shadow: \n    inset 0 1px 2px rgba(255,255,255,0.3),\n    inset 0 -1px 2px rgba(0,0,0,0.4),\n    0 3px 6px rgba(0,0,0,0.4);\n}\n\n.gram-frame-manual-button:active {\n  transform: translateY(1px);\n  box-shadow: \n    inset 0 2px 4px rgba(0,0,0,0.4),\n    0 1px 2px rgba(0,0,0,0.2);\n}\n\n/* Color picker for harmonics */\n.gram-frame-color-picker {\n  margin-top: 0;\n  padding: 8px;\n  background: linear-gradient(135deg, #1a1a1a 0%, #000 50%, #0a0a0a 100%);\n  border: 2px solid #333;\n  border-radius: 4px;\n  box-shadow: \n    inset 0 2px 6px rgba(0,0,0,0.8),\n    inset 0 -1px 2px rgba(255,255,255,0.05),\n    0 2px 4px rgba(0,0,0,0.5);\n  max-width: 200px;\n  flex-shrink: 0;\n}\n\n.gram-frame-color-picker-label {\n  font-size: 10px;\n  color: #00ff00;\n  margin-bottom: 6px;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: bold;\n  text-align: center;\n}\n\n.gram-frame-color-palette {\n  position: relative;\n}\n\n.gram-frame-color-canvas {\n  width: 140px;\n  max-width: 140px;\n  height: 20px;\n  border: 1px solid #555;\n  border-radius: 2px;\n  cursor: pointer;\n  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);\n}\n\n.gram-frame-color-indicator {\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  width: 3px;\n  height: 26px;\n  background: #fff;\n  border: 1px solid #000;\n  border-radius: 1px;\n  pointer-events: none;\n  box-shadow: 0 0 2px rgba(0,0,0,0.8);\n}\n\n/* Analysis mode layout styles */\n.gram-frame-analysis-layout {\n  height: 100%;\n}\n\n.gram-frame-analysis-controls {\n  align-self: flex-start;\n}\n\n.gram-frame-analysis-leds {\n  /* Side-by-side LEDs container */\n}\n\n.gram-frame-analysis-leds .gram-frame-led {\n  /* Ensure LEDs in the horizontal container are sized properly */\n  font-size: 9px; /* Slightly smaller to fit side-by-side */\n}\n\n.gram-frame-analysis-leds .gram-frame-led-label {\n  font-size: 8px; /* Smaller label text */\n  color: #00ff00;\n}\n\n.gram-frame-analysis-markers {\n  height: 100%;\n}\n\n/* Unified table styles for both markers and harmonics */\n.gram-frame-table-container {\n  padding: 0;\n  background: linear-gradient(135deg, #1a1a1a 0%, #000 50%, #0a0a0a 100%);\n  border: 2px solid #333;\n  border-radius: 4px;\n  box-shadow: \n    inset 0 2px 6px rgba(0,0,0,0.8),\n    inset 0 -1px 2px rgba(255,255,255,0.05),\n    0 2px 4px rgba(0,0,0,0.5);\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n}\n\n.gram-frame-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 10px;\n  color: #ccc;\n  table-layout: fixed;\n}\n\n.gram-frame-table th {\n  background: #222;\n  color: #00ff00;\n  padding: 4px;\n  text-align: center;\n  border: 1px solid #444;\n  font-weight: bold;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\n.gram-frame-table td {\n  padding: 4px;\n  text-align: center;\n  border: 1px solid #444;\n  background: #1a1a1a;\n}\n\n.gram-frame-table tbody tr {\n  cursor: pointer;\n  transition: all 0.2s ease;\n  position: relative;\n}\n\n.gram-frame-table tbody tr:hover {\n  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);\n  box-shadow: \n    inset 0 1px 2px rgba(255,255,255,0.05),\n    inset 0 -1px 2px rgba(0,0,0,0.2),\n    0 0 4px rgba(255,255,255,0.1);\n}\n\n.gram-frame-table tbody tr:hover td {\n  background: transparent;\n}\n\n/* Legacy markers styles - kept for compatibility */\n.gram-frame-markers-container {\n  padding: 8px;\n  background: linear-gradient(135deg, #1a1a1a 0%, #000 50%, #0a0a0a 100%);\n  border: 2px solid #333;\n  border-radius: 4px;\n  box-shadow: \n    inset 0 2px 6px rgba(0,0,0,0.8),\n    inset 0 -1px 2px rgba(255,255,255,0.05),\n    0 2px 4px rgba(0,0,0,0.5);\n}\n\n.gram-frame-markers-label {\n  font-size: 10px;\n  color: #00ff00;\n  margin: 0 0 8px 0;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: bold;\n  text-align: center;\n}\n\n.gram-frame-markers-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 10px;\n  color: #ccc;\n  table-layout: fixed;\n}\n\n.gram-frame-markers-table th {\n  background: #222;\n  color: #00ff00;\n  padding: 4px;\n  text-align: center;\n  border: 1px solid #444;\n  font-weight: bold;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n\n.gram-frame-markers-table td {\n  padding: 4px;\n  text-align: center;\n  border: 1px solid #444;\n  background: #1a1a1a;\n}\n\n.gram-frame-color-swatch {\n  margin: 0 auto;\n  display: block;\n}\n\n.gram-frame-marker-delete-btn {\n  padding: 2px 6px;\n  border-radius: 2px;\n  transition: background-color 0.2s;\n}\n\n.gram-frame-marker-delete-btn:hover {\n  background-color: #ff4444 !important;\n  color: #fff !important;\n}\n\n/* Marker rendering styles */\n.gram-frame-marker-line {\n  opacity: 0.8;\n}\n\n.gram-frame-marker-point {\n  opacity: 0.9;\n}\n\n.gram-frame-current-color {\n  border: 1px solid #555;\n  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);\n}\n\n/* Military-style mode selection header */\n.gram-frame-mode-header {\n  background: linear-gradient(180deg, #444 0%, #2a2a2a 50%, #1a1a1a 100%);\n  border-bottom: 2px solid #555;\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-start;\n}\n\n.gram-frame-modes {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  justify-content: center;\n  align-items: stretch;\n  flex: 0 0 auto;\n  flex-shrink: 0;\n}\n\n.gram-frame-mode-group {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  width: 100%;\n  flex-wrap: nowrap;\n}\n\n/* Simplified left panel - no sub-columns needed */\n\n/* Guidance panel */\n.gram-frame-guidance {\n  flex: 1;\n  padding: 8px 12px;\n  background: linear-gradient(135deg, #1a1a1a 0%, #000 50%, #0a0a0a 100%);\n  border: 2px solid #333;\n  border-radius: 4px;\n  color: #ccc;\n  font-size: 12px;\n  line-height: 1.4;\n  box-shadow: \n    inset 0 2px 6px rgba(0,0,0,0.8),\n    inset 0 -1px 2px rgba(255,255,255,0.05),\n    0 2px 4px rgba(0,0,0,0.5);\n}\n\n.gram-frame-guidance h4 {\n  margin: 0 0 6px 0;\n  font-size: 11px;\n  color: #00ff00;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: bold;\n}\n\n.gram-frame-guidance p {\n  margin: 0 0 4px 0;\n}\n\n/* Military-style metal buttons */\n.gram-frame-mode-btn {\n  padding: 8px 6px;\n  background: linear-gradient(180deg, #6a6a6a 0%, #4a4a4a 50%, #2a2a2a 100%);\n  color: #ddd;\n  border: 2px solid #555;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: bold;\n  font-size: 12px;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  flex: 1;\n  min-width: 0;\n  box-shadow: \n    inset 0 1px 2px rgba(255,255,255,0.2),\n    inset 0 -1px 2px rgba(0,0,0,0.3),\n    0 2px 4px rgba(0,0,0,0.3);\n  transition: all 0.1s ease;\n}\n\n.gram-frame-command-btn {\n  padding: 8px 10px;\n  background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 50%, #1a1a1a 100%);\n  color: #ddd;\n  border: 2px solid #444;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: bold;\n  font-size: 14px;\n  line-height: 1;\n  flex: 0 0 auto;\n  min-width: 32px;\n  height: 36px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: \n    inset 0 1px 2px rgba(255,255,255,0.2),\n    inset 0 -1px 2px rgba(0,0,0,0.3),\n    0 2px 4px rgba(0,0,0,0.3);\n  transition: all 0.1s ease;\n}\n\n.gram-frame-mode-btn:hover {\n  background: linear-gradient(180deg, #7a7a7a 0%, #5a5a5a 50%, #3a3a3a 100%);\n  box-shadow: \n    inset 0 1px 2px rgba(255,255,255,0.3),\n    inset 0 -1px 2px rgba(0,0,0,0.4),\n    0 3px 6px rgba(0,0,0,0.4);\n}\n\n.gram-frame-mode-btn.active {\n  background: linear-gradient(180deg, #4a6a4a 0%, #2a4a2a 50%, #1a2a1a 100%);\n  color: #aaffaa;\n  border-color: #4a8a4a;\n  box-shadow: \n    inset 0 1px 2px rgba(0,0,0,0.3),\n    inset 0 -1px 2px rgba(255,255,255,0.1),\n    0 0 4px rgba(74, 138, 74, 0.3);\n}\n\n.gram-frame-mode-btn:active {\n  transform: translateY(1px);\n  box-shadow: \n    inset 0 2px 4px rgba(0,0,0,0.4),\n    0 1px 2px rgba(0,0,0,0.2);\n}\n\n.gram-frame-mode-btn:disabled,\n.gram-frame-mode-btn.disabled {\n  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);\n  color: #666;\n  border-color: #333;\n  cursor: not-allowed;\n  opacity: 0.6;\n  box-shadow: \n    inset 0 1px 2px rgba(0,0,0,0.3),\n    0 1px 2px rgba(0,0,0,0.1);\n}\n\n.gram-frame-mode-btn:disabled:hover,\n.gram-frame-mode-btn.disabled:hover {\n  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);\n  box-shadow: \n    inset 0 1px 2px rgba(0,0,0,0.3),\n    0 1px 2px rgba(0,0,0,0.1);\n  transform: none;\n}\n\n.gram-frame-command-btn:hover:not(:disabled) {\n  background: linear-gradient(180deg, #6a6a6a 0%, #4a4a4a 50%, #2a2a2a 100%);\n  box-shadow: \n    inset 0 1px 2px rgba(255,255,255,0.3),\n    inset 0 -1px 2px rgba(0,0,0,0.4),\n    0 3px 6px rgba(0,0,0,0.4);\n}\n\n.gram-frame-command-btn:active:not(:disabled) {\n  transform: translateY(1px);\n  box-shadow: \n    inset 0 2px 4px rgba(0,0,0,0.4),\n    0 1px 2px rgba(0,0,0,0.2);\n}\n\n.gram-frame-command-btn:disabled {\n  background: linear-gradient(180deg, #333 0%, #222 50%, #111 100%);\n  color: #666;\n  border-color: #333;\n  cursor: not-allowed;\n  box-shadow: \n    inset 0 1px 2px rgba(0,0,0,0.3),\n    0 1px 2px rgba(0,0,0,0.1);\n}\n\n/* Rate input UI styles removed - backend functionality preserved */\n\n/* SVG cursor styles removed - using CSS cursor only */\n\n/* SVG Harmonic line styles */\n\n\n.gram-frame-harmonic-line {\n  stroke-width: 2;\n  fill: none;\n  pointer-events: none;\n  stroke-linecap: round;\n}\n\n\n.gram-frame-harmonic-number {\n  font-family: Arial, sans-serif;\n  font-size: 12px;\n  font-weight: bold;\n  pointer-events: none;\n  /* Add text shadow for readability */\n  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.5));\n}\n\n/* SVG Harmonic Set styles (new system) */\n\n.gram-frame-harmonic-set-line {\n  stroke-width: 2;\n  fill: none;\n  pointer-events: auto !important;\n  /*cursor: grab !important;*/\n  stroke-linecap: round;\n}\n\n.gram-frame-harmonic-set-line:hover {\n  stroke-width: 3;\n  /* cursor: grab !important; */\n}\n\n.gram-frame-harmonic-set-line:active {\n  cursor: grabbing !important;\n}\n\n/* Legacy harmonic styles (for backward compatibility) */\n.gram-frame-harmonic {\n  position: absolute;\n  height: 1px;\n  background-color: rgba(255, 255, 0, 0.7);\n  pointer-events: none;\n}\n\n\n\n/* Debug grid */\n\n/* Canvas boundary overlay */\n\n/* Message display */\n\n/* Error state */\n.gram-frame-error {\n  padding: 10px;\n  background-color: #f8d7da;\n  color: #721c24;\n  border: 1px solid #f5c6cb;\n  border-radius: 4px;\n  margin: 10px 0;\n}\n\n/* Legacy harmonic panel styles - now using unified table structure */\n\n.gram-frame-harmonic-spacing,\n.gram-frame-harmonic-rate {\n  font-size: 14px;\n  font-weight: bold;\n}\n\n.gram-frame-harmonic-color {\n  width: 20px;\n  height: 12px;\n  border: 1px solid #555;\n  border-radius: 2px;\n  display: inline-block;\n}\n\n.gram-frame-harmonic-delete {\n  background: linear-gradient(180deg, #6a4a4a 0%, #4a2a2a 50%, #2a1a1a 100%);\n  color: #ff6666;\n  border: 1px solid #555;\n  border-radius: 2px;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  font-weight: bold;\n  font-size: 12px;\n  line-height: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.1s ease;\n}\n\n.gram-frame-harmonic-delete:hover {\n  background: linear-gradient(180deg, #8a5a5a 0%, #6a3a3a 50%, #4a2a2a 100%);\n  border-color: #777;\n}\n\n.gram-frame-harmonic-delete:active {\n  transform: translateY(1px);\n}\n\n.gram-frame-harmonic-empty {\n  color: #666;\n  font-style: italic;\n  text-align: center;\n  padding: 20px;\n  font-size: 12px;\n}\n\n/* Doppler mode styles */\n.gram-frame-doppler-fPlus {\n  pointer-events: auto;\n}\n\n.gram-frame-doppler-fMinus {\n  pointer-events: auto;\n}\n\n.gram-frame-doppler-crosshair {\n  pointer-events: auto;\n}\n\n.gram-frame-doppler-curve {\n  pointer-events: none;\n}\n\n.gram-frame-doppler-guide {\n  pointer-events: none;\n}\n\n.gram-frame-doppler-label {\n  pointer-events: none;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;\n}\n\n/* Cursor position readout styles */\n.gram-frame-cursor-readout {\n  display: flex;\n  gap: 15px;\n  margin-bottom: 10px;\n  padding: 8px;\n  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);\n  border: 1px solid #444;\n  border-radius: 4px;\n}\n\n.gram-frame-readout-item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-width: 80px;\n}\n\n.gram-frame-readout-label {\n  font-size: 10px;\n  color: #aaa;\n  text-transform: uppercase;\n  margin-bottom: 2px;\n  font-weight: bold;\n}\n\n.gram-frame-readout-value {\n  font-family: 'Courier New', monospace;\n  font-size: 14px;\n  font-weight: bold;\n  color: #00ff00;\n  background: #000;\n  padding: 4px 8px;\n  border: 1px solid #333;\n  border-radius: 2px;\n  text-align: center;\n  min-width: 60px;\n  box-shadow: inset 0 1px 3px rgba(0,0,0,0.8);\n}\n\n/* Modal dialog styles */\n.gram-frame-modal-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.7);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n\n.gram-frame-modal {\n  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);\n  border: 2px solid #555;\n  border-radius: 8px;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);\n  min-width: 350px;\n  max-width: 500px;\n  color: #ddd;\n}\n\n.gram-frame-modal-header {\n  padding: 15px 20px;\n  border-bottom: 1px solid #444;\n  background: linear-gradient(180deg, #444 0%, #333 100%);\n  border-radius: 6px 6px 0 0;\n}\n\n.gram-frame-modal-header h3 {\n  margin: 0;\n  font-size: 16px;\n  color: #fff;\n  text-align: center;\n}\n\n.gram-frame-modal-body {\n  padding: 20px;\n}\n\n.gram-frame-modal-input-group {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n\n.gram-frame-modal-input-group label {\n  font-weight: bold;\n  color: #ccc;\n  font-size: 14px;\n}\n\n.gram-frame-modal-input-group input {\n  padding: 10px 12px;\n  border: 2px solid #555;\n  border-radius: 4px;\n  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);\n  color: #fff;\n  font-size: 14px;\n  font-family: 'Courier New', monospace;\n}\n\n.gram-frame-modal-input-group input:focus {\n  outline: none;\n  border-color: #777;\n  box-shadow: 0 0 4px rgba(119, 119, 119, 0.3);\n}\n\n.gram-frame-modal-error {\n  color: #ff6b6b;\n  font-size: 12px;\n  margin-top: 4px;\n}\n\n.gram-frame-modal-footer {\n  padding: 15px 20px;\n  border-top: 1px solid #444;\n  display: flex;\n  justify-content: flex-end;\n  gap: 10px;\n  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);\n  border-radius: 0 0 6px 6px;\n}\n\n.gram-frame-modal-btn {\n  padding: 8px 16px;\n  border: 2px solid #555;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: bold;\n  font-size: 12px;\n  transition: all 0.1s ease;\n  min-width: 80px;\n}\n\n.gram-frame-modal-cancel {\n  background: linear-gradient(180deg, #6a4a4a 0%, #4a2a2a 50%, #2a1a1a 100%);\n  color: #ffaaaa;\n}\n\n.gram-frame-modal-cancel:hover {\n  background: linear-gradient(180deg, #7a5a5a 0%, #5a3a3a 50%, #3a2a2a 100%);\n}\n\n.gram-frame-modal-add {\n  background: linear-gradient(180deg, #4a6a4a 0%, #2a4a2a 50%, #1a2a1a 100%);\n  color: #aaffaa;\n}\n\n.gram-frame-modal-add:hover {\n  background: linear-gradient(180deg, #5a7a5a 0%, #3a5a3a 50%, #2a3a2a 100%);\n}\n\n.gram-frame-modal-add:disabled {\n  background: linear-gradient(180deg, #444 0%, #333 50%, #222 100%);\n  color: #666;\n  cursor: not-allowed;\n}\n\n.gram-frame-modal-btn:active:not(:disabled) {\n  transform: translateY(1px);\n}\n\n/* Zoom controls removed - now integrated into pan mode command buttons */\n\n/* Unified Layout Styles */\n.gram-frame-unified-layout {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  gap: 2px; /* Match JavaScript gap */\n  width: 100%;\n  height: 100%;\n  overflow: hidden; /* Prevent columns from overflowing container */\n}\n\n.gram-frame-left-column {\n  position: relative; /* Enable absolute positioning for child elements */\n  display: flex;\n  flex-direction: row;\n  gap: 4px;\n  flex: 0 0 600px;\n  width: 600px;\n  overflow: hidden;\n  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);\n  border: 2px solid #333;\n  border-radius: 4px;\n  box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);\n}\n\n/* Left column sub-columns */\n.gram-frame-mode-column {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: 0 0 130px;\n  width: 130px;\n  padding: 8px;\n  border: none;\n}\n\n.gram-frame-guidance-column {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: 1;\n  min-width: 150px;\n  border: none;\n}\n\n.gram-frame-controls-column {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  flex: 0 0 210px;\n  width: 210px;\n  padding: 0px;\n  border: none;\n}\n\n.gram-frame-middle-column {\n  display: flex;\n  flex-direction: column;\n  flex: 0 0 160px;\n  width: 160px;\n  min-width: 160px;\n  max-width: 160px;\n  padding: 5px;\n  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);\n  border: 2px solid #333;\n  border-radius: 4px;\n  box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);\n}\n\n.gram-frame-right-column {\n  display: flex;\n  flex-direction: column;\n  flex: 0 0 200px;\n  min-width: 200px;\n  width: 200px;\n  padding: 5px;\n  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);\n  border: 2px solid #333;\n  border-radius: 4px;\n  box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);\n}\n\n.gram-frame-cursor-leds {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 6px;\n  align-items: flex-start;\n  flex: 0 0 auto;\n  height: fit-content;\n}\n\n.gram-frame-markers-persistent-container,\n.gram-frame-harmonics-persistent-container {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-height: 0;\n}\n\n.gram-frame-markers-persistent-container h4,\n.gram-frame-harmonics-persistent-container h4 {\n  margin: 0 0 8px 0;\n  flex-shrink: 0;\n  color: #ddd;\n  font-size: 14px;\n  text-align: center;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  border-bottom: 1px solid #444;\n  padding-bottom: 4px;\n}\n\n.gram-frame-harmonics-button-container {\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: center;\n}\n\n/* Responsive behavior for smaller screens */\n@media (max-width: 1200px) {\n  .gram-frame-unified-layout {\n    flex-direction: column;\n    gap: 8px;\n  }\n  \n  .gram-frame-left-column,\n  .gram-frame-middle-column,\n  .gram-frame-right-column {\n    flex: 0 0 auto;\n    min-height: 200px;\n  }\n}\n\n/* Selection highlighting for keyboard control */\n.gram-frame-selected-row {\n  background: linear-gradient(135deg, #4a6a4a 0%, #2a4a2a 50%, #1a2a1a 100%) !important;\n  color: #aaffaa !important;\n  outline: 2px solid #4a8a4a !important;\n  outline-offset: -1px;\n  position: relative;\n  z-index: 10;\n  box-shadow: \n    inset 0 2px 4px rgba(255,255,255,0.15),\n    inset 0 -2px 4px rgba(0,0,0,0.3),\n    0 0 8px rgba(74, 138, 74, 0.6),\n    0 0 2px rgba(74, 138, 74, 0.8) !important;\n}\n\n.gram-frame-selected-row td {\n  color: #aaffaa !important;\n  border-color: #4a8a4a !important;\n  position: relative;\n  z-index: 11;\n}\n\n/* Enhanced table row interactivity - now handled by unified .gram-frame-table styles */\n\n/* Selected Doppler marker highlighting */\n.gram-frame-selected-doppler-marker {\n  stroke: #4a8a4a !important;\n  stroke-width: 3 !important;\n  filter: drop-shadow(0 0 8px rgba(74, 138, 74, 0.6)) !important;\n}\n\n.gram-frame-selected-doppler-marker[fill] {\n  fill: #4a8a4a !important;\n  stroke: #aaffaa !important;\n}\n\n";
  document.head.appendChild(style);

  "use strict";
  class BaseMode {
    /**
     * Constructor for base mode
     * @param {GramFrame} instance - GramFrame instance
     */
    constructor(instance) {
      this.instance = instance;
    }
    /**
     * Activate this mode - called when switching to this mode
     * Override in subclasses to perform mode-specific initialization
     */
    activate() {
    }
    /**
     * Deactivate this mode - called when switching away from this mode
     * Override in subclasses to perform mode-specific cleanup
     */
    deactivate() {
    }
    /**
     * Handle mouse move events
     * @param {MouseEvent} _event - Mouse event (unused in base implementation)
     * @param {DataCoordinates} _dataCoords - Data coordinates {freq, time} (unused in base implementation)
     */
    handleMouseMove(_event, _dataCoords) {
    }
    /**
     * Handle mouse down events
     * @param {MouseEvent} _event - Mouse event (unused in base implementation)
     * @param {DataCoordinates} _dataCoords - Data coordinates {freq, time} (unused in base implementation)
     */
    handleMouseDown(_event, _dataCoords) {
    }
    /**
     * Handle mouse up events
     * @param {MouseEvent} _event - Mouse event (unused in base implementation)
     * @param {DataCoordinates} _dataCoords - Data coordinates {freq, time} (unused in base implementation)
     */
    handleMouseUp(_event, _dataCoords) {
    }
    /**
     * Handle mouse leave events
     */
    handleMouseLeave() {
    }
    /**
     * Render persistent features for this mode
     * Override in subclasses to render mode-specific persistent features
     */
    renderPersistentFeatures() {
    }
    /**
     * Render current cursor for this mode
     * Override in subclasses to render mode-specific cursor indicators
     */
    renderCursor() {
    }
    /**
     * Update LED displays with mode-specific values
     * @param {CursorPosition} _coords - Current cursor coordinates {svgCoords, dataCoords, imageCoords}
     */
    updateLEDs(_coords) {
    }
    /**
     * Get guidance content for this mode
     * @returns {Object} Structured guidance content
     */
    getGuidanceText() {
      return {
        title: "Base Mode",
        items: [
          "No specific guidance available"
        ]
      };
    }
    /**
     * Get command buttons for this mode
     * Override in subclasses to provide mode-specific command buttons
     * @returns {Array<CommandButton>} Array of command button definitions
     */
    getCommandButtons() {
      return [];
    }
    /**
     * Check if this mode is currently enabled
     * Override in subclasses to provide mode-specific enable/disable logic
     * @returns {boolean} True if mode is enabled, false if disabled
     */
    isEnabled() {
      return true;
    }
    /**
     * Reset mode-specific state
     * Override in subclasses to clear mode-specific state properties
     */
    resetState() {
    }
    /**
     * Clean up mode-specific state when switching away from this mode
     * Override in subclasses to perform mode-specific state cleanup
     */
    cleanup() {
    }
    /**
     * Create mode-specific UI elements when entering this mode
     * Override in subclasses to create mode-specific UI elements
     * @param {HTMLElement} _readoutPanel - Container for UI elements (unused in base implementation)
     */
    createUI(_readoutPanel) {
      this.uiElements = {};
    }
    /**
     * Destroy mode-specific UI elements when leaving this mode
     * Override in subclasses to clean up mode-specific UI elements
     */
    destroyUI() {
      if (this.uiElements) {
        Object.values(this.uiElements).forEach((element) => {
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
        });
        this.uiElements = {};
      }
    }
    /**
     * Get a snapshot of current mode-specific state
     * @returns {*} Mode-specific state snapshot
     */
    getStateSnapshot() {
      return {};
    }
    /**
     * Get initial state for this mode
     * Override in subclasses to provide mode-specific initial state
     * @returns {*} Mode-specific initial state object
     */
    static getInitialState() {
      return {};
    }
    /**
     * Get viewport configuration for coordinate transformations
     * @returns {ViewportConfig} Viewport configuration object
     */
    getViewport() {
      return {
        margins: this.instance.state.margins,
        imageDetails: this.instance.state.imageDetails,
        config: this.instance.state.config,
        zoom: this.instance.state.zoom
      };
    }
    /**
     * Update cursor style for drag operations
     * @param {string} style - Cursor style ('crosshair', 'grab', 'grabbing')
     */
    updateCursorStyle(style) {
      if (this.instance.spectrogramImage) {
        this.instance.spectrogramImage.style.cursor = style;
      }
    }
  }
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = remainingSeconds.toString().padStart(2, "0");
    return `${paddedMinutes}:${paddedSeconds}`;
  }
  function dataToSVG(dataPoint, viewport, spectrogramImage = null) {
    const { margins, imageDetails, config, zoom } = viewport;
    const { naturalWidth, naturalHeight } = imageDetails;
    const { timeMin, timeMax, freqMin, freqMax } = config;
    const zoomLevel = zoom.level;
    const timeRatio = (dataPoint.time - timeMin) / (timeMax - timeMin);
    const freqRatio = (dataPoint.freq - freqMin) / (freqMax - freqMin);
    let imageLeft = margins.left;
    let imageTop = margins.top;
    let imageWidth = naturalWidth;
    let imageHeight = naturalHeight;
    if (zoomLevel !== 1 && spectrogramImage) {
      imageLeft = parseFloat(spectrogramImage.getAttribute("x") || String(margins.left));
      imageTop = parseFloat(spectrogramImage.getAttribute("y") || String(margins.top));
      imageWidth = parseFloat(spectrogramImage.getAttribute("width") || String(naturalWidth));
      imageHeight = parseFloat(spectrogramImage.getAttribute("height") || String(naturalHeight));
    }
    return {
      x: imageLeft + freqRatio * imageWidth,
      y: imageTop + (1 - timeRatio) * imageHeight
      // Invert Y coordinate
    };
  }
  function calculateZoomAwarePosition(point, viewport, spectrogramImage = null) {
    const { margins, imageDetails, config } = viewport;
    const { naturalWidth, naturalHeight } = imageDetails;
    const { timeMin, timeMax, freqMin, freqMax } = config;
    const normalizedX = (point.freq - freqMin) / (freqMax - freqMin);
    const normalizedY = 1 - (point.time - timeMin) / (timeMax - timeMin);
    let currentX, currentY;
    if (spectrogramImage) {
      const imageLeft = parseFloat(spectrogramImage.getAttribute("x") || String(margins.left));
      const imageTop = parseFloat(spectrogramImage.getAttribute("y") || String(margins.top));
      const imageWidth = parseFloat(spectrogramImage.getAttribute("width") || String(naturalWidth));
      const imageHeight = parseFloat(spectrogramImage.getAttribute("height") || String(naturalHeight));
      currentX = imageLeft + normalizedX * imageWidth;
      currentY = imageTop + normalizedY * imageHeight;
    } else {
      currentX = margins.left + normalizedX * naturalWidth;
      currentY = margins.top + normalizedY * naturalHeight;
    }
    return { x: currentX, y: currentY };
  }
  function getImageBounds(viewport, spectrogramImage = null) {
    const { margins, imageDetails, zoom } = viewport;
    const { naturalWidth, naturalHeight } = imageDetails;
    const zoomLevel = zoom.level;
    if (zoomLevel !== 1 && spectrogramImage) {
      return {
        left: parseFloat(spectrogramImage.getAttribute("x") || String(margins.left)),
        top: parseFloat(spectrogramImage.getAttribute("y") || String(margins.top)),
        width: parseFloat(spectrogramImage.getAttribute("width") || String(naturalWidth)),
        height: parseFloat(spectrogramImage.getAttribute("height") || String(naturalHeight))
      };
    }
    return {
      left: margins.left,
      top: margins.top,
      width: naturalWidth,
      height: naturalHeight
    };
  }
  class BaseDragHandler {
    /**
     * Create a new BaseDragHandler
     * @param {Object} instance - Mode instance
     * @param {DragCallbacks} callbacks - Drag lifecycle callbacks
     */
    constructor(instance, callbacks) {
      this.instance = instance;
      this.callbacks = callbacks;
      this.dragState = {
        isDragging: false,
        draggedTargetId: null,
        draggedTargetType: null,
        dragStartPosition: null,
        originalData: null
      };
    }
    /**
     * Check if currently dragging
     * @returns {boolean} True if drag operation is active
     */
    isDragging() {
      return this.dragState.isDragging;
    }
    /**
     * Get the current dragged target information
     * @returns {Object|null} Drag target info or null if not dragging
     */
    getDraggedTarget() {
      if (!this.dragState.isDragging) return null;
      return {
        id: this.dragState.draggedTargetId,
        type: this.dragState.draggedTargetType,
        startPosition: this.dragState.dragStartPosition,
        originalData: this.dragState.originalData
      };
    }
    /**
     * Handle mouse move events for drag operations
     * @param {DataCoordinates} currentPosition - Current mouse position in data coordinates
     */
    handleMouseMove(currentPosition) {
      if (!this.dragState.isDragging) return;
      const target = {
        id: this.dragState.draggedTargetId,
        type: this.dragState.draggedTargetType,
        position: currentPosition
      };
      this.callbacks.onDragUpdate(target, currentPosition, this.dragState.dragStartPosition);
    }
    /**
     * Start a drag operation
     * @param {DataCoordinates} position - Position where drag started
     * @returns {boolean} True if drag started successfully, false otherwise
     */
    startDrag(position) {
      if (this.dragState.isDragging) return false;
      const target = this.callbacks.findTargetAt(position);
      if (!target) return false;
      this.dragState.isDragging = true;
      this.dragState.draggedTargetId = target.id;
      this.dragState.draggedTargetType = target.type;
      this.dragState.dragStartPosition = { ...position };
      this.dragState.originalData = target.data ? { ...target.data } : null;
      if (this.callbacks.updateCursor) {
        this.callbacks.updateCursor("grabbing");
      }
      this.callbacks.onDragStart(target, position);
      return true;
    }
    /**
     * End the current drag operation
     * @param {DataCoordinates} position - Position where drag ended
     */
    endDrag(position) {
      if (!this.dragState.isDragging) return;
      const target = {
        id: this.dragState.draggedTargetId,
        type: this.dragState.draggedTargetType,
        position
      };
      this.callbacks.onDragEnd(target, position);
      if (this.callbacks.updateCursor) {
        this.callbacks.updateCursor("crosshair");
      }
      this.dragState.isDragging = false;
      this.dragState.draggedTargetId = null;
      this.dragState.draggedTargetType = null;
      this.dragState.dragStartPosition = null;
      this.dragState.originalData = null;
    }
    /**
     * Cancel the current drag operation without applying changes
     */
    cancelDrag() {
      if (!this.dragState.isDragging) return;
      if (this.callbacks.updateCursor) {
        this.callbacks.updateCursor("crosshair");
      }
      this.dragState.isDragging = false;
      this.dragState.draggedTargetId = null;
      this.dragState.draggedTargetType = null;
      this.dragState.dragStartPosition = null;
      this.dragState.originalData = null;
    }
    /**
     * Update cursor style based on proximity to drag targets
     * @param {DataCoordinates} position - Current mouse position
     */
    updateCursorForHover(position) {
      if (this.dragState.isDragging) return;
      const target = this.callbacks.findTargetAt(position);
      const cursorStyle = target ? "grab" : "crosshair";
      if (this.callbacks.updateCursor) {
        this.callbacks.updateCursor(cursorStyle);
      }
    }
    /**
     * Reset drag handler state
     */
    reset() {
      this.cancelDrag();
    }
    /**
     * Clean up drag handler resources
     */
    cleanup() {
      this.reset();
    }
  }
  const DEFAULT_TOLERANCE = {
    // Pixel tolerance for drag/click detection (in SVG coordinate space)
    pixelRadius: 8,
    // Minimum data space tolerance (prevents overly sensitive interactions at high zoom)
    minDataTolerance: {
      time: 0.01,
      // 0.01 seconds minimum
      freq: 1
      // 1 Hz minimum
    },
    // Maximum data space tolerance (prevents insensitive interactions at low zoom)
    maxDataTolerance: {
      time: 0.5,
      // 0.5 seconds maximum
      freq: 50
      // 50 Hz maximum
    }
  };
  function calculateDataTolerance(viewport, spectrogramImage, customTolerance = {}) {
    const config = { ...DEFAULT_TOLERANCE, ...customTolerance };
    if (!viewport || !spectrogramImage) {
      return config.minDataTolerance;
    }
    const { config: dataConfig, imageDetails, zoom } = viewport;
    const { naturalWidth, naturalHeight } = imageDetails;
    if (!dataConfig || !naturalWidth || !naturalHeight) {
      return config.minDataTolerance;
    }
    const timeRange = dataConfig.timeMax - dataConfig.timeMin;
    const freqRange = dataConfig.freqMax - dataConfig.freqMin;
    const effectiveZoom = (zoom == null ? void 0 : zoom.level) || 1;
    const timeToleranceFromPixels = config.pixelRadius / naturalHeight * timeRange / effectiveZoom;
    const freqToleranceFromPixels = config.pixelRadius / naturalWidth * freqRange / effectiveZoom;
    const timeTolerance = Math.max(
      config.minDataTolerance.time,
      Math.min(config.maxDataTolerance.time, timeToleranceFromPixels)
    );
    const freqTolerance = Math.max(
      config.minDataTolerance.freq,
      Math.min(config.maxDataTolerance.freq, freqToleranceFromPixels)
    );
    return {
      time: timeTolerance,
      freq: freqTolerance
    };
  }
  function calculateNormalizedDistance(pos1, pos2, tolerance) {
    const timeDiff = Math.abs(pos1.time - pos2.time) / tolerance.time;
    const freqDiff = Math.abs(pos1.freq - pos2.freq) / tolerance.freq;
    return Math.sqrt(timeDiff * timeDiff + freqDiff * freqDiff);
  }
  function isWithinToleranceRadius(position, targetPosition, tolerance) {
    return calculateNormalizedDistance(position, targetPosition, tolerance) <= 1;
  }
  function getUniformTolerance(viewport, spectrogramImage) {
    return calculateDataTolerance(viewport, spectrogramImage, DEFAULT_TOLERANCE);
  }
  class AnalysisMode extends BaseMode {
    /**
     * Initialize AnalysisMode with drag handler
     * @param {Object} instance - GramFrame instance
     */
    constructor(instance) {
      super(instance);
      this.dragHandler = new BaseDragHandler(instance, {
        findTargetAt: (position) => this.findMarkerAtPosition(position),
        onDragStart: (target, position) => this.onMarkerDragStart(target, position),
        onDragUpdate: (target, currentPos, startPos) => this.onMarkerDragUpdate(target, currentPos, startPos),
        onDragEnd: (target, position) => this.onMarkerDragEnd(target, position),
        updateCursor: (style) => this.updateCursorStyle(style)
      });
    }
    /**
     * Start dragging a marker
     * @param {Object} target - Drag target with id and type
     * @param {DataCoordinates} position - Start position
     */
    onMarkerDragStart(target, position) {
      this.instance.state.analysis.isDragging = true;
      this.instance.state.analysis.draggedMarkerId = target.id;
      this.instance.state.analysis.dragStartPosition = { ...position };
      const marker = this.instance.state.analysis.markers.find((m) => m.id === target.id);
      if (marker) {
        const index = this.instance.state.analysis.markers.findIndex((m) => m.id === target.id);
        this.instance.setSelection("marker", target.id, index);
      }
    }
    /**
     * Update marker position during drag
     * @param {Object} target - Drag target with id and type
     * @param {DataCoordinates} currentPos - Current position
     * @param {DataCoordinates} _startPos - Start position (unused)
     */
    onMarkerDragUpdate(target, currentPos, _startPos) {
      const marker = this.instance.state.analysis.markers.find((m) => m.id === target.id);
      if (marker) {
        marker.freq = currentPos.freq;
        marker.time = currentPos.time;
        if (this.instance.featureRenderer) {
          this.instance.featureRenderer.renderAllPersistentFeatures();
        }
        if (!this.updateTableScheduled) {
          this.updateTableScheduled = true;
          requestAnimationFrame(() => {
            this.updateMarkersTable();
            this.updateTableScheduled = false;
          });
        }
        notifyStateListeners(this.instance.state, this.instance.stateListeners);
      }
    }
    /**
     * End dragging a marker
     * @param {Object} _target - Drag target with id and type (unused)
     * @param {DataCoordinates} _position - End position (unused)
     */
    onMarkerDragEnd(_target, _position) {
      this.instance.state.analysis.isDragging = false;
      this.instance.state.analysis.draggedMarkerId = null;
      this.instance.state.analysis.dragStartPosition = null;
    }
    /**
     * Update cursor style for drag operations
     * @param {string} style - Cursor style ('crosshair', 'grab', 'grabbing')
     */
    updateCursorStyle(style) {
      if (this.instance.svg) {
        this.instance.svg.style.cursor = style;
      }
    }
    /**
     * Get guidance content for analysis mode
     * @returns {Object} Structured guidance content
     */
    getGuidanceText() {
      return {
        title: "Cross Cursor Mode",
        items: [
          "Click to place persistent markers",
          "Drag existing markers to reposition them",
          "Right-click markers to delete them",
          "Click table row + arrow keys (Shift for larger steps)"
        ]
      };
    }
    /**
     * Handle mouse move events in analysis mode
     * @param {MouseEvent} _event - Mouse event (unused in current implementation)
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseMove(_event, dataCoords) {
      if (this.dragHandler.isDragging()) {
        this.dragHandler.handleMouseMove(dataCoords);
      } else {
        this.dragHandler.updateCursorForHover(dataCoords);
      }
    }
    /**
     * Handle mouse down events in analysis mode
     * @param {MouseEvent} event - Mouse event
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseDown(event, dataCoords) {
      if (event.button !== 0) {
        return;
      }
      const dragStarted = this.dragHandler.startDrag(dataCoords);
      if (!dragStarted) {
        this.createMarkerAtPosition(dataCoords);
      }
    }
    /**
     * Handle mouse up events in analysis mode
     * @param {MouseEvent} _event - Mouse event (unused in current implementation)
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseUp(_event, dataCoords) {
      this.dragHandler.endDrag(dataCoords);
    }
    /**
     * Handle mouse leave events in analysis mode
     */
    handleMouseLeave() {
    }
    /**
     * Handle context menu (right-click) events in analysis mode
     * @param {MouseEvent} event - Mouse event
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleContextMenu(event, dataCoords) {
      event.preventDefault();
      const target = this.findMarkerAtPosition(dataCoords);
      if (target) {
        this.removeMarker(target.id);
      }
    }
    // Cursor position updates are now handled universally in main.js
    // No need for mode-specific cursor position management
    /**
     * Create a marker at the specified position
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    createMarkerAtPosition(dataCoords) {
      const color = this.instance.state.selectedColor || "#ff6b6b";
      const marker = {
        id: `marker-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        color,
        time: dataCoords.time,
        freq: dataCoords.freq
      };
      this.addMarker(marker);
    }
    /**
     * Render persistent features for analysis mode
     */
    renderPersistentFeatures() {
      var _a;
      if (!this.instance.cursorGroup || !((_a = this.instance.state.analysis) == null ? void 0 : _a.markers)) {
        return;
      }
      const existingMarkers = this.instance.cursorGroup.querySelectorAll(".gram-frame-analysis-marker");
      existingMarkers.forEach((marker) => marker.remove());
      this.instance.state.analysis.markers.forEach((marker) => {
        this.renderMarker(marker);
      });
    }
    /**
     * Render a single marker as a crosshair
     * @param {AnalysisMarker} marker - Marker object
     */
    renderMarker(marker) {
      if (!this.instance.cursorGroup) {
        return;
      }
      const markerPoint = { freq: marker.freq, time: marker.time };
      const markerSVG = calculateZoomAwarePosition(markerPoint, this.getViewport(), this.instance.spectrogramImage);
      const currentX = markerSVG.x;
      const currentY = markerSVG.y;
      const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      markerGroup.setAttribute("class", "gram-frame-analysis-marker");
      markerGroup.setAttribute("data-marker-id", marker.id);
      const crosshairSize = 15;
      const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      hLine.setAttribute("x1", String(currentX - crosshairSize));
      hLine.setAttribute("y1", String(currentY));
      hLine.setAttribute("x2", String(currentX + crosshairSize));
      hLine.setAttribute("y2", String(currentY));
      hLine.setAttribute("stroke", marker.color);
      hLine.setAttribute("stroke-width", "2");
      hLine.setAttribute("stroke-linecap", "round");
      const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      vLine.setAttribute("x1", String(currentX));
      vLine.setAttribute("y1", String(currentY - crosshairSize));
      vLine.setAttribute("x2", String(currentX));
      vLine.setAttribute("y2", String(currentY + crosshairSize));
      vLine.setAttribute("stroke", marker.color);
      vLine.setAttribute("stroke-width", "2");
      vLine.setAttribute("stroke-linecap", "round");
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(currentX));
      circle.setAttribute("cy", String(currentY));
      circle.setAttribute("r", "3");
      circle.setAttribute("fill", marker.color);
      circle.setAttribute("stroke", "#fff");
      circle.setAttribute("stroke-width", "1");
      markerGroup.appendChild(hLine);
      markerGroup.appendChild(vLine);
      markerGroup.appendChild(circle);
      this.instance.cursorGroup.appendChild(markerGroup);
    }
    /**
     * Create UI elements for analysis mode
     * @param {HTMLElement} markersContainer - Persistent container for markers table
     */
    createUI(markersContainer) {
      this.uiElements = {};
      this.uiElements.markersContainer = markersContainer;
      this.createMarkersTable(markersContainer);
      this.uiElements.markersTable = markersContainer.querySelector(".gram-frame-table");
      this.uiElements.markersTableBody = markersContainer.querySelector(".gram-frame-table tbody");
      this.instance.colorPicker = this.instance.colorPicker || null;
      this.instance.timeLED = this.instance.timeLED || null;
      this.instance.freqLED = this.instance.freqLED || null;
    }
    /**
     * Create markers table for displaying active markers
     * @param {HTMLElement} markersContainer - Persistent container for markers (already has label)
     */
    createMarkersTable(markersContainer) {
      if (markersContainer.querySelector(".gram-frame-table")) {
        return;
      }
      const tableWrapper = document.createElement("div");
      tableWrapper.className = "gram-frame-table-container";
      const table = document.createElement("table");
      table.className = "gram-frame-table";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      const colorHeader = document.createElement("th");
      colorHeader.textContent = "";
      colorHeader.style.width = "15%";
      headerRow.appendChild(colorHeader);
      const timeHeader = document.createElement("th");
      timeHeader.textContent = "Time (mm:ss)";
      timeHeader.style.width = "35%";
      headerRow.appendChild(timeHeader);
      const freqHeader = document.createElement("th");
      freqHeader.textContent = "Freq (Hz)";
      freqHeader.style.width = "35%";
      headerRow.appendChild(freqHeader);
      const deleteHeader = document.createElement("th");
      deleteHeader.textContent = "";
      deleteHeader.style.width = "15%";
      headerRow.appendChild(deleteHeader);
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);
      tableWrapper.appendChild(table);
      markersContainer.appendChild(tableWrapper);
      this.uiElements.markersTable = table;
      this.uiElements.markersTableBody = tbody;
      this.updateMarkersTable();
    }
    /**
     * Update LED displays for analysis mode
     * @param {CursorPosition} _coords - Current cursor coordinates
     */
    updateLEDs(_coords) {
    }
    /**
     * Get initial state for analysis mode
     * @returns {AnalysisInitialState} Analysis mode state including markers
     */
    static getInitialState() {
      return {
        analysis: {
          markers: [],
          // Note: isDragging, draggedMarkerId, dragStartPosition are now managed by BaseDragHandler
          // but kept here for backward compatibility with existing code
          isDragging: false,
          draggedMarkerId: null,
          dragStartPosition: null
        }
      };
    }
    /**
     * Add a new persistent marker
     * @param {AnalysisMarker} marker - Marker object with all properties
     */
    addMarker(marker) {
      if (!this.instance.state.analysis) {
        this.instance.state.analysis = {
          markers: [],
          isDragging: false,
          draggedMarkerId: null,
          dragStartPosition: null
        };
      }
      this.instance.state.analysis.markers.push(marker);
      const index = this.instance.state.analysis.markers.length - 1;
      this.instance.setSelection("marker", marker.id, index);
      this.updateMarkersTable();
      if (this.instance.featureRenderer) {
        this.instance.featureRenderer.renderAllPersistentFeatures();
      }
      notifyStateListeners(this.instance.state, this.instance.stateListeners);
    }
    /**
     * Remove a marker by ID
     * @param {string} markerId - ID of marker to remove
     */
    removeMarker(markerId) {
      if (!this.instance.state.analysis || !this.instance.state.analysis.markers) return;
      const index = this.instance.state.analysis.markers.findIndex((m) => m.id === markerId);
      if (index !== -1) {
        if (this.instance.state.selection.selectedType === "marker" && this.instance.state.selection.selectedId === markerId) {
          this.instance.clearSelection();
        }
        this.instance.state.analysis.markers.splice(index, 1);
        this.updateMarkersTable();
        if (this.instance.featureRenderer) {
          this.instance.featureRenderer.renderAllPersistentFeatures();
        }
        notifyStateListeners(this.instance.state, this.instance.stateListeners);
      }
    }
    /**
     * Find marker at given position (with tolerance)
     * Returns a drag target object compatible with BaseDragHandler
     * @param {DataCoordinates} position - Position to check
     * @returns {Object|null} Drag target if found, null otherwise
     */
    findMarkerAtPosition(position) {
      if (!this.instance.state.analysis || !this.instance.state.analysis.markers) return null;
      const tolerance = getUniformTolerance(this.getViewport(), this.instance.spectrogramImage);
      const marker = this.instance.state.analysis.markers.find((marker2) => {
        if (isWithinToleranceRadius(
          position,
          { freq: marker2.freq, time: marker2.time },
          tolerance
        )) {
          return true;
        }
        const markerPoint = { freq: marker2.freq, time: marker2.time };
        const markerSVG = calculateZoomAwarePosition(markerPoint, this.getViewport(), this.instance.spectrogramImage);
        const clickSVG = calculateZoomAwarePosition(position, this.getViewport(), this.instance.spectrogramImage);
        const crosshairSize = 15;
        const lineThickness = 3;
        const onHorizontalLine = Math.abs(clickSVG.y - markerSVG.y) <= lineThickness && Math.abs(clickSVG.x - markerSVG.x) <= crosshairSize;
        const onVerticalLine = Math.abs(clickSVG.x - markerSVG.x) <= lineThickness && Math.abs(clickSVG.y - markerSVG.y) <= crosshairSize;
        return onHorizontalLine || onVerticalLine;
      });
      if (marker) {
        return {
          id: marker.id,
          type: "marker",
          position: { freq: marker.freq, time: marker.time },
          data: marker
        };
      }
      return null;
    }
    /**
     * Update markers table with current markers
     */
    updateMarkersTable() {
      if (!this.uiElements.markersTableBody) return;
      if (!this.instance.state.analysis || !this.instance.state.analysis.markers) return;
      const existingRows = this.uiElements.markersTableBody.querySelectorAll("tr");
      const markers = this.instance.state.analysis.markers;
      markers.forEach((marker, index) => {
        let row = existingRows[index];
        if (row && row.getAttribute("data-marker-id") === marker.id) {
          this.updateMarkerRow(row, marker);
        } else {
          this.rebuildMarkersTableFrom(index);
          return;
        }
      });
      for (let i = markers.length; i < existingRows.length; i++) {
        existingRows[i].remove();
      }
    }
    /**
     * Update only the changing cells in an existing marker row
     * @param {HTMLTableRowElement} row - The table row to update
     * @param {AnalysisMarker} marker - The marker data
     */
    updateMarkerRow(row, marker) {
      const timeCell = row.cells[1];
      if (timeCell) {
        const newTime = formatTime(marker.time);
        if (timeCell.textContent !== newTime) {
          timeCell.textContent = newTime;
        }
      }
      const freqCell = row.cells[2];
      if (freqCell) {
        const newFreq = marker.freq.toFixed(2);
        if (freqCell.textContent !== newFreq) {
          freqCell.textContent = newFreq;
        }
      }
    }
    /**
     * Rebuild the markers table from a specific index
     * @param {number} startIndex - Index to start rebuilding from
     */
    rebuildMarkersTableFrom(startIndex) {
      if (!this.uiElements.markersTableBody) return;
      const markers = this.instance.state.analysis.markers;
      const existingRows = this.uiElements.markersTableBody.querySelectorAll("tr");
      for (let i = startIndex; i < existingRows.length; i++) {
        existingRows[i].remove();
      }
      for (let index = startIndex; index < markers.length; index++) {
        const marker = markers[index];
        const row = document.createElement("tr");
        row.setAttribute("data-marker-id", marker.id);
        row.addEventListener("click", (event) => {
          if (event.target && /** @type {Element} */
          event.target.closest(".gram-frame-marker-delete-btn")) {
            return;
          }
          if (this.instance.state.selection.selectedType === "marker" && this.instance.state.selection.selectedId === marker.id) {
            this.instance.clearSelection();
          } else {
            this.instance.setSelection("marker", marker.id, index);
          }
        });
        const colorCell = document.createElement("td");
        const colorSwatch = document.createElement("div");
        colorSwatch.className = "gram-frame-color-swatch";
        colorSwatch.style.backgroundColor = marker.color;
        colorSwatch.style.width = "20px";
        colorSwatch.style.height = "20px";
        colorSwatch.style.borderRadius = "3px";
        colorSwatch.style.border = "1px solid #ccc";
        colorCell.appendChild(colorSwatch);
        row.appendChild(colorCell);
        const timeCell = document.createElement("td");
        timeCell.textContent = formatTime(marker.time);
        row.appendChild(timeCell);
        const freqCell = document.createElement("td");
        freqCell.textContent = marker.freq.toFixed(2);
        row.appendChild(freqCell);
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "×";
        deleteButton.className = "gram-frame-marker-delete-btn";
        deleteButton.style.background = "none";
        deleteButton.style.border = "none";
        deleteButton.style.color = "#ff4444";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.fontSize = "16px";
        deleteButton.style.fontWeight = "bold";
        const markerId = marker.id;
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.removeMarker(markerId);
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
        this.uiElements.markersTableBody.appendChild(row);
      }
      this.instance.updateSelectionVisuals();
    }
    /**
     * Update mode-specific LED values based on cursor position
     */
    updateModeSpecificLEDs() {
    }
    /**
     * Clean up analysis mode state
     */
    cleanup() {
    }
    /**
     * Destroy mode-specific UI elements when leaving this mode
     */
    destroyUI() {
    }
    /**
     * Reset analysis mode state
     */
    resetState() {
    }
  }
  function createHarmonicPanel(container) {
    const panel = document.createElement("div");
    panel.className = "gram-frame-table-container";
    panel.innerHTML = `
    <table class="gram-frame-table">
      <thead>
        <tr>
          <th style="width: 15%"></th>
          <th style="width: 35%">Spacing (Hz)</th>
          <th style="width: 35%">Ratio</th>
          <th style="width: 15%"></th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  `;
    container.appendChild(panel);
    return panel;
  }
  function updateHarmonicPanelContent(panel, instance) {
    if (!panel) {
      return;
    }
    const tbody = (
      /** @type {HTMLTableSectionElement} */
      panel.querySelector(".gram-frame-table tbody")
    );
    if (!tbody) {
      return;
    }
    const harmonicSets = instance.state.harmonics.harmonicSets;
    const existingRows = tbody.querySelectorAll("tr");
    harmonicSets.forEach((harmonicSet, index) => {
      let row = existingRows[index];
      if (row && row.getAttribute("data-harmonic-id") === harmonicSet.id) {
        updateHarmonicRow(row, harmonicSet, instance);
      } else {
        rebuildHarmonicTableFrom(tbody, harmonicSets, instance, index);
        return;
      }
    });
    for (let i = harmonicSets.length; i < existingRows.length; i++) {
      existingRows[i].remove();
    }
  }
  function updateHarmonicRow(row, harmonicSet, instance) {
    const spacingCell = row.cells[1];
    if (spacingCell) {
      const newSpacing = harmonicSet.spacing.toFixed(2);
      if (spacingCell.textContent !== newSpacing) {
        spacingCell.textContent = newSpacing;
      }
    }
    const rateCell = row.cells[2];
    if (rateCell) {
      let rate;
      if (instance.state.cursorPosition && instance.state.cursorPosition.freq > 0) {
        rate = (instance.state.cursorPosition.freq / harmonicSet.spacing).toFixed(3);
      } else {
        rate = "5.000";
      }
      if (rateCell.textContent !== rate) {
        rateCell.textContent = rate;
      }
    }
  }
  function rebuildHarmonicTableFrom(tbody, harmonicSets, instance, startIndex) {
    const existingRows = tbody.querySelectorAll("tr");
    for (let i = startIndex; i < existingRows.length; i++) {
      existingRows[i].remove();
    }
    for (let index = startIndex; index < harmonicSets.length; index++) {
      const harmonicSet = harmonicSets[index];
      const row = createHarmonicRow(harmonicSet, instance, index);
      tbody.appendChild(row);
    }
    instance.updateSelectionVisuals();
  }
  function createHarmonicRow(harmonicSet, instance, index) {
    const row = document.createElement("tr");
    row.setAttribute("data-harmonic-id", harmonicSet.id);
    row.className = "gram-frame-harmonic-row";
    const colorCell = document.createElement("td");
    const colorDiv = document.createElement("div");
    colorDiv.className = "gram-frame-harmonic-color";
    colorDiv.style.backgroundColor = harmonicSet.color;
    colorCell.appendChild(colorDiv);
    row.appendChild(colorCell);
    const spacingCell = document.createElement("td");
    spacingCell.className = "gram-frame-harmonic-spacing";
    spacingCell.textContent = harmonicSet.spacing.toFixed(2);
    row.appendChild(spacingCell);
    const rateCell = document.createElement("td");
    rateCell.className = "gram-frame-harmonic-rate";
    let rate;
    if (instance.state.cursorPosition && instance.state.cursorPosition.freq > 0) {
      rate = (instance.state.cursorPosition.freq / harmonicSet.spacing).toFixed(3);
    } else {
      rate = "5.000";
    }
    rateCell.textContent = rate;
    row.appendChild(rateCell);
    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "gram-frame-harmonic-delete";
    deleteButton.setAttribute("data-harmonic-id", harmonicSet.id);
    deleteButton.title = "Delete harmonic set";
    deleteButton.textContent = "×";
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    row.addEventListener("click", (event) => {
      if (event.target && /** @type {Element} */
      event.target.closest(".gram-frame-harmonic-delete")) {
        return;
      }
      if (instance.state.selection.selectedType === "harmonicSet" && instance.state.selection.selectedId === harmonicSet.id) {
        instance.clearSelection();
      } else {
        instance.setSelection("harmonicSet", harmonicSet.id, index);
      }
    });
    deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      instance.removeHarmonicSet(harmonicSet.id);
    });
    return row;
  }
  const HarmonicPanel = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    createHarmonicPanel,
    updateHarmonicPanelContent
  }, Symbol.toStringTag, { value: "Module" }));
  const MAX_IMAGE_WIDTH = 1200;
  function createComponentStructure(instance) {
    instance.container = document.createElement("div");
    instance.container.className = "gram-frame-container";
    instance.table = document.createElement("div");
    instance.table.className = "gram-frame-table";
    instance.container.appendChild(instance.table);
    instance.modeRow = document.createElement("div");
    instance.modeRow.className = "gram-frame-row";
    instance.table.appendChild(instance.modeRow);
    instance.modeCell = document.createElement("div");
    instance.modeCell.className = "gram-frame-cell gram-frame-mode-header";
    instance.modeRow.appendChild(instance.modeCell);
    instance.mainRow = document.createElement("div");
    instance.mainRow.className = "gram-frame-row";
    instance.mainRow.style.height = "100%";
    instance.table.appendChild(instance.mainRow);
    instance.mainCell = document.createElement("div");
    instance.mainCell.className = "gram-frame-cell gram-frame-main-panel";
    instance.mainRow.appendChild(instance.mainCell);
    instance.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    instance.svg.setAttribute("class", "gram-frame-svg");
    instance.svg.style.width = "100%";
    instance.svg.style.height = "100%";
    instance.svg.style.display = "block";
    instance.mainCell.appendChild(instance.svg);
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    instance.svg.appendChild(defs);
    const clipPathId = `imageClip-${instance.instanceId || Date.now()}`;
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", clipPathId);
    defs.appendChild(clipPath);
    instance.imageClipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    clipPath.appendChild(instance.imageClipRect);
    const cursorClipPathId = `cursorClip-${instance.instanceId || Date.now()}`;
    const cursorClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    cursorClipPath.setAttribute("id", cursorClipPathId);
    defs.appendChild(cursorClipPath);
    instance.cursorClipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    cursorClipPath.appendChild(instance.cursorClipRect);
    instance.spectrogramImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
    instance.spectrogramImage.setAttribute("class", "gram-frame-spectrogram-image");
    instance.spectrogramImage.setAttribute("clip-path", `url(#${clipPathId})`);
    instance.spectrogramImage.setAttribute("preserveAspectRatio", "none");
    instance.svg.appendChild(instance.spectrogramImage);
    instance.cursorGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    instance.cursorGroup.setAttribute("class", "gram-frame-cursors");
    instance.cursorGroup.setAttribute("clip-path", `url(#${cursorClipPathId})`);
    instance.svg.appendChild(instance.cursorGroup);
    instance.axesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    instance.axesGroup.setAttribute("class", "gram-frame-axes");
    instance.svg.appendChild(instance.axesGroup);
    instance.readoutPanel = document.createElement("div");
    instance.readoutPanel.className = "gram-frame-readout";
    return {
      container: instance.container,
      table: instance.table,
      modeRow: instance.modeRow,
      modeCell: instance.modeCell,
      mainRow: instance.mainRow,
      mainCell: instance.mainCell,
      readoutPanel: instance.readoutPanel,
      svg: instance.svg,
      spectrogramImage: instance.spectrogramImage,
      cursorGroup: instance.cursorGroup,
      axesGroup: instance.axesGroup,
      imageClipRect: instance.imageClipRect,
      cursorClipRect: instance.cursorClipRect
    };
  }
  function setupSpectrogramImage(instance, imageUrl) {
    if (!instance.spectrogramImage || !imageUrl) {
      return;
    }
    instance.spectrogramImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", imageUrl);
    instance.state.imageDetails.url = imageUrl;
    const tempImg = new Image();
    tempImg.onload = function() {
      let imageWidth = tempImg.naturalWidth;
      let imageHeight = tempImg.naturalHeight;
      if (imageWidth > MAX_IMAGE_WIDTH) {
        const scaleFactor = MAX_IMAGE_WIDTH / imageWidth;
        imageWidth = MAX_IMAGE_WIDTH;
        imageHeight = Math.round(imageHeight * scaleFactor);
        console.log(`GramFrame: Scaling down large image from ${tempImg.naturalWidth}x${tempImg.naturalHeight} to ${imageWidth}x${imageHeight} (scale factor: ${scaleFactor.toFixed(3)})`);
      }
      instance.state.imageDetails.naturalWidth = imageWidth;
      instance.state.imageDetails.naturalHeight = imageHeight;
      updateSVGLayout(instance);
      renderAxes(instance);
      notifyStateListeners(instance.state, instance.stateListeners);
    };
    tempImg.src = imageUrl;
  }
  function updateSVGLayout(instance) {
    const { naturalWidth, naturalHeight } = instance.state.imageDetails;
    const margins = instance.state.margins;
    if (!naturalWidth || !naturalHeight) {
      return;
    }
    const axesWidth = naturalWidth;
    const axesHeight = naturalHeight;
    const totalWidth = axesWidth + margins.left + margins.right;
    const totalHeight = axesHeight + margins.top + margins.bottom;
    instance.container.style.width = "auto";
    instance.container.style.height = "auto";
    instance.container.style.aspectRatio = "unset";
    instance.svg.style.width = `${totalWidth}px`;
    instance.svg.style.height = `${totalHeight}px`;
    instance.svg.setAttribute("viewBox", `0 0 ${totalWidth} ${totalHeight}`);
    instance.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    instance.spectrogramImage.setAttribute("x", String(margins.left));
    instance.spectrogramImage.setAttribute("y", String(margins.top));
    instance.spectrogramImage.setAttribute("width", String(axesWidth));
    instance.spectrogramImage.setAttribute("height", String(axesHeight));
    if (instance.imageClipRect) {
      instance.imageClipRect.setAttribute("x", String(margins.left));
      instance.imageClipRect.setAttribute("y", String(margins.top));
      instance.imageClipRect.setAttribute("width", String(axesWidth));
      instance.imageClipRect.setAttribute("height", String(axesHeight));
    }
    if (instance.cursorClipRect) {
      instance.cursorClipRect.setAttribute("x", String(margins.left));
      instance.cursorClipRect.setAttribute("y", String(margins.top));
      instance.cursorClipRect.setAttribute("width", String(axesWidth));
      instance.cursorClipRect.setAttribute("height", String(axesHeight));
    }
    applyZoomTransform(instance);
  }
  function applyZoomTransform(instance) {
    const { level, centerX, centerY } = instance.state.zoom;
    const { naturalWidth, naturalHeight } = instance.state.imageDetails;
    const margins = instance.state.margins;
    if (!instance.spectrogramImage) {
      return;
    }
    if (level === 1) {
      instance.spectrogramImage.setAttribute("x", String(margins.left));
      instance.spectrogramImage.setAttribute("y", String(margins.top));
      instance.spectrogramImage.setAttribute("width", String(naturalWidth));
      instance.spectrogramImage.setAttribute("height", String(naturalHeight));
      instance.spectrogramImage.removeAttribute("transform");
      renderAxes(instance);
      if (instance.featureRenderer) {
        instance.featureRenderer.renderAllPersistentFeatures();
      }
      return;
    }
    const centerImageX = centerX * naturalWidth;
    const centerImageY = centerY * naturalHeight;
    const zoomedWidth = naturalWidth * level;
    const zoomedHeight = naturalHeight * level;
    const newX = margins.left + centerImageX - centerImageX * level;
    const newY = margins.top + centerImageY - centerImageY * level;
    instance.spectrogramImage.setAttribute("x", String(newX));
    instance.spectrogramImage.setAttribute("y", String(newY));
    instance.spectrogramImage.setAttribute("width", String(zoomedWidth));
    instance.spectrogramImage.setAttribute("height", String(zoomedHeight));
    renderAxes(instance);
    if (instance.featureRenderer) {
      instance.featureRenderer.renderAllPersistentFeatures();
    }
  }
  function renderAxes(instance) {
    if (!instance.axesGroup) {
      return;
    }
    instance.axesGroup.innerHTML = "";
    const { naturalWidth, naturalHeight } = instance.state.imageDetails;
    const margins = instance.state.margins;
    if (!naturalWidth || !naturalHeight) {
      return;
    }
    const visibleRange = calculateVisibleDataRange(instance);
    renderFrequencyAxis(instance, margins, naturalWidth, naturalHeight, visibleRange.freqMin, visibleRange.freqMax);
    renderTimeAxis(instance, margins, naturalWidth, naturalHeight, visibleRange.timeMin, visibleRange.timeMax);
  }
  function calculateVisibleDataRange(instance) {
    const { timeMin, timeMax, freqMin, freqMax } = instance.state.config;
    const { naturalWidth, naturalHeight } = instance.state.imageDetails;
    const margins = instance.state.margins;
    const zoomLevel = instance.state.zoom.level;
    if (zoomLevel === 1) {
      return { timeMin, timeMax, freqMin, freqMax };
    }
    let imageLeft = margins.left;
    let imageTop = margins.top;
    let imageWidth = naturalWidth;
    let imageHeight = naturalHeight;
    if (instance.spectrogramImage) {
      imageLeft = parseFloat(instance.spectrogramImage.getAttribute("x") || String(margins.left));
      imageTop = parseFloat(instance.spectrogramImage.getAttribute("y") || String(margins.top));
      imageWidth = parseFloat(instance.spectrogramImage.getAttribute("width") || String(naturalWidth));
      imageHeight = parseFloat(instance.spectrogramImage.getAttribute("height") || String(naturalHeight));
    }
    const visibleLeft = Math.max(0, margins.left - imageLeft);
    const visibleRight = Math.min(imageWidth, margins.left + naturalWidth - imageLeft);
    const visibleTop = Math.max(0, margins.top - imageTop);
    const visibleBottom = Math.min(imageHeight, margins.top + naturalHeight - imageTop);
    const freqRange = freqMax - freqMin;
    const timeRange = timeMax - timeMin;
    const visibleFreqMin = freqMin + visibleLeft / imageWidth * freqRange;
    const visibleFreqMax = freqMin + visibleRight / imageWidth * freqRange;
    const visibleTimeMax = timeMax - visibleTop / imageHeight * timeRange;
    const visibleTimeMin = timeMax - visibleBottom / imageHeight * timeRange;
    return {
      freqMin: visibleFreqMin,
      freqMax: visibleFreqMax,
      timeMin: visibleTimeMin,
      timeMax: visibleTimeMax
    };
  }
  function renderTimeAxis(instance, margins, _naturalWidth, naturalHeight, timeMin, timeMax) {
    const axisX = margins.left;
    const axisStartY = margins.top;
    const axisEndY = margins.top + naturalHeight;
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", String(axisX));
    axisLine.setAttribute("y1", String(axisStartY));
    axisLine.setAttribute("x2", String(axisX));
    axisLine.setAttribute("y2", String(axisEndY));
    axisLine.setAttribute("class", "gram-frame-axis-line");
    instance.axesGroup.appendChild(axisLine);
    const timeRange = timeMax - timeMin;
    const tickCount = 5;
    const tickInterval = timeRange / (tickCount - 1);
    for (let i = 0; i < tickCount; i++) {
      const time = timeMin + i * tickInterval;
      const y = axisEndY - i / (tickCount - 1) * naturalHeight;
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("x1", String(axisX - 8));
      tick.setAttribute("y1", String(y));
      tick.setAttribute("x2", String(axisX));
      tick.setAttribute("y2", String(y));
      tick.setAttribute("class", "gram-frame-axis-tick");
      instance.axesGroup.appendChild(tick);
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(axisX - 12));
      label.setAttribute("y", String(y + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "gram-frame-axis-label");
      label.textContent = formatTime(time);
      instance.axesGroup.appendChild(label);
    }
  }
  function calculateAxisTicks(min, max, containerSize, targetSpacing = 80) {
    const range = max - min;
    const targetMajorTicks = Math.max(2, Math.floor(containerSize / targetSpacing));
    const rawMajorInterval = range / (targetMajorTicks - 1);
    function niceNum(range2, round) {
      const exponent = Math.floor(Math.log10(range2));
      const fraction = range2 / Math.pow(10, exponent);
      let niceFraction;
      {
        if (fraction <= 1) niceFraction = 1;
        else if (fraction <= 2) niceFraction = 2;
        else if (fraction <= 5) niceFraction = 5;
        else niceFraction = 10;
      }
      return niceFraction * Math.pow(10, exponent);
    }
    const majorInterval = niceNum(rawMajorInterval);
    let minorInterval;
    const majorFraction = majorInterval / Math.pow(10, Math.floor(Math.log10(majorInterval)));
    if (majorFraction === 1) {
      minorInterval = majorInterval / 5;
    } else if (majorFraction === 2) {
      minorInterval = majorInterval / 2;
    } else if (majorFraction === 5) {
      minorInterval = majorInterval / 5;
    } else {
      minorInterval = majorInterval / 2;
    }
    const majorStart = Math.ceil(min / majorInterval) * majorInterval;
    const minorStart = Math.ceil(min / minorInterval) * minorInterval;
    const expectedMajorTicks = Math.ceil(range / majorInterval) + 2;
    const expectedMinorTicks = Math.ceil(range / minorInterval) + 2;
    const maxTicks = Math.max(200, expectedMajorTicks + expectedMinorTicks);
    return {
      majorInterval,
      minorInterval,
      majorStart,
      minorStart,
      expectedMajorTicks,
      expectedMinorTicks,
      maxTicks
    };
  }
  function formatFrequencyLabels(frequency) {
    return Math.round(frequency) + "Hz";
  }
  function renderAxisLine(instance, axisConfig) {
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", String(axisConfig.startX));
    axisLine.setAttribute("y1", String(axisConfig.y));
    axisLine.setAttribute("x2", String(axisConfig.endX));
    axisLine.setAttribute("y2", String(axisConfig.y));
    axisLine.setAttribute("class", "gram-frame-axis-line");
    instance.axesGroup.appendChild(axisLine);
  }
  function renderAxisTicks(instance, tickData, axisConfig) {
    tickData.forEach((tickInfo) => {
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("x1", String(tickInfo.x));
      tick.setAttribute("y1", String(axisConfig.y));
      tick.setAttribute("x2", String(tickInfo.x));
      tick.setAttribute("y2", String(axisConfig.y + tickInfo.height));
      tick.setAttribute("class", tickInfo.className);
      instance.axesGroup.appendChild(tick);
    });
  }
  function renderAxisLabels(instance, labelData, axisConfig) {
    labelData.forEach((labelInfo) => {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(labelInfo.x));
      label.setAttribute("y", String(axisConfig.y + 25));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", labelInfo.className);
      label.textContent = labelInfo.text;
      instance.axesGroup.appendChild(label);
    });
  }
  function renderFrequencyAxis(instance, margins, naturalWidth, _naturalHeight, freqMin, freqMax) {
    const axisY = margins.top + _naturalHeight;
    const axisStartX = margins.left;
    const axisEndX = margins.left + naturalWidth;
    const rate = instance.state.rate;
    const displayFreqMin = freqMin / rate;
    const displayFreqMax = freqMax / rate;
    const freqRange = displayFreqMax - displayFreqMin;
    const axisConfig = { y: axisY, startX: axisStartX, endX: axisEndX };
    renderAxisLine(instance, axisConfig);
    const tickCalculation = calculateAxisTicks(displayFreqMin, displayFreqMax, naturalWidth);
    const minorTickData = [];
    const majorTickData = [];
    const labelData = [];
    const numMinorTicks = Math.floor((displayFreqMax - tickCalculation.minorStart) / tickCalculation.minorInterval) + 1;
    if (numMinorTicks <= tickCalculation.maxTicks) {
      for (let i = 0; i < numMinorTicks; i++) {
        const freq = tickCalculation.minorStart + i * tickCalculation.minorInterval;
        if (freq > displayFreqMax) break;
        if (Math.abs(freq % tickCalculation.majorInterval) < 0.01) continue;
        const x = axisStartX + (freq - displayFreqMin) / freqRange * naturalWidth;
        minorTickData.push({ x, height: 4, className: "gram-frame-axis-tick-minor" });
      }
    }
    const numMajorTicks = Math.floor((displayFreqMax - tickCalculation.majorStart) / tickCalculation.majorInterval) + 1;
    if (numMajorTicks <= tickCalculation.maxTicks) {
      for (let i = 0; i < numMajorTicks; i++) {
        const freq = tickCalculation.majorStart + i * tickCalculation.majorInterval;
        if (freq > displayFreqMax) break;
        const x = axisStartX + (freq - displayFreqMin) / freqRange * naturalWidth;
        majorTickData.push({ x, height: 8, className: "gram-frame-axis-tick-major" });
        labelData.push({
          x,
          text: formatFrequencyLabels(freq),
          className: "gram-frame-axis-label-major"
        });
      }
    } else {
      const tickCount = 5;
      for (let i = 0; i < tickCount; i++) {
        const freq = displayFreqMin + i * freqRange / (tickCount - 1);
        const x = axisStartX + i / (tickCount - 1) * naturalWidth;
        majorTickData.push({ x, height: 8, className: "gram-frame-axis-tick" });
        labelData.push({
          x,
          text: formatFrequencyLabels(freq),
          className: "gram-frame-axis-label"
        });
      }
    }
    renderAxisTicks(instance, minorTickData, axisConfig);
    renderAxisTicks(instance, majorTickData, axisConfig);
    renderAxisLabels(instance, labelData, axisConfig);
  }
  function replaceConfigTable(instance, configTable) {
    if (configTable && configTable.parentNode) {
      configTable.parentNode.replaceChild(instance.container, configTable);
      instance.container.__gramFrameInstance = instance;
    }
  }
  function setupComponentTable(instance, configTable) {
    const domElements = createComponentStructure(instance);
    replaceConfigTable(instance, configTable);
    return domElements;
  }
  function calculateVisibleTimePeriodCenter(state, instance) {
    const ZOOM_EPSILON = 1e-3;
    if (Math.abs(state.zoom.level - 1) < ZOOM_EPSILON) {
      return (state.config.timeMin + state.config.timeMax) / 2;
    }
    const visibleRange = calculateVisibleDataRange(instance);
    return (visibleRange.timeMin + visibleRange.timeMax) / 2;
  }
  function showManualHarmonicModal(state, addHarmonicSet, instance) {
    const overlay = document.createElement("div");
    overlay.className = "gram-frame-modal-overlay";
    const modal = document.createElement("div");
    modal.className = "gram-frame-modal";
    modal.innerHTML = `
    <div class="gram-frame-modal-header">
      <h3>Add Manual Harmonics</h3>
    </div>
    <div class="gram-frame-modal-body">
      <label for="harmonic-spacing-input">Harmonic spacing (Hz):</label>
      <input type="number" id="harmonic-spacing-input" min="0.1" step="0.1" placeholder="Enter spacing in Hz">
      <div class="gram-frame-modal-error" id="spacing-error" style="display: none; color: red; font-size: 12px; margin-top: 5px;">
        Please enter a number ≥ 0.1
      </div>
    </div>
    <div class="gram-frame-modal-footer">
      <button class="gram-frame-modal-cancel" id="cancel-button">Cancel</button>
      <button class="gram-frame-modal-add" id="add-button" disabled>Add</button>
    </div>
  `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    const spacingInput = (
      /** @type {HTMLInputElement} */
      modal.querySelector("#harmonic-spacing-input")
    );
    const errorDiv = (
      /** @type {HTMLDivElement} */
      modal.querySelector("#spacing-error")
    );
    const cancelButton = (
      /** @type {HTMLButtonElement} */
      modal.querySelector("#cancel-button")
    );
    const addButton = (
      /** @type {HTMLButtonElement} */
      modal.querySelector("#add-button")
    );
    const validateInput = () => {
      const value = parseFloat(spacingInput.value);
      const isValid = !isNaN(value) && value >= 0.1;
      if (spacingInput.value.trim() === "") {
        errorDiv.style.display = "none";
        addButton.disabled = true;
      } else if (!isValid) {
        errorDiv.style.display = "block";
        addButton.disabled = true;
      } else {
        errorDiv.style.display = "none";
        addButton.disabled = false;
      }
    };
    spacingInput.addEventListener("input", validateInput);
    spacingInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !addButton.disabled) {
        addHarmonic();
      } else if (e.key === "Escape") {
        closeModal();
      }
    });
    function closeModal() {
      document.body.removeChild(overlay);
    }
    function addHarmonic() {
      const spacing = parseFloat(spacingInput.value);
      if (!isNaN(spacing) && spacing >= 0.1) {
        let anchorTime;
        if (state.cursorPosition) {
          anchorTime = state.cursorPosition.time;
        } else {
          anchorTime = calculateVisibleTimePeriodCenter(state, instance);
        }
        addHarmonicSet(anchorTime, spacing);
        closeModal();
      }
    }
    cancelButton.addEventListener("click", closeModal);
    addButton.addEventListener("click", addHarmonic);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
    spacingInput.focus();
  }
  const _HarmonicsMode = class _HarmonicsMode extends BaseMode {
    /**
     * Initialize HarmonicsMode with drag handler
     * @param {Object} instance - GramFrame instance
     */
    constructor(instance) {
      super(instance);
      this.dragHandler = new BaseDragHandler(instance, {
        findTargetAt: (position) => this.findHarmonicSetTarget(position),
        onDragStart: (target, position) => this.onHarmonicSetDragStart(target, position),
        onDragUpdate: (target, currentPos, startPos) => this.onHarmonicSetDragUpdate(target, currentPos, startPos),
        onDragEnd: (target, position) => this.onHarmonicSetDragEnd(target, position),
        updateCursor: (style) => this.updateCursorStyle(style)
      });
    }
    /**
     * Find harmonic set target for drag handler
     * @param {DataCoordinates} position - Position to check
     * @returns {Object|null} Drag target if found, null otherwise
     */
    findHarmonicSetTarget(position) {
      const harmonicSet = this.findHarmonicSetAtFrequency(position.freq);
      if (harmonicSet) {
        return {
          id: harmonicSet.id,
          type: "harmonicSet",
          position,
          data: {
            harmonicSet,
            clickedHarmonicNumber: this.findClickedHarmonicNumber(harmonicSet, position.freq)
          }
        };
      }
      return null;
    }
    /**
     * Start dragging a harmonic set
     * @param {Object} target - Drag target with id and type
     * @param {DataCoordinates} position - Start position
     */
    onHarmonicSetDragStart(target, position) {
      const harmonicSet = target.data.harmonicSet;
      const clickedHarmonicNumber = target.data.clickedHarmonicNumber;
      const index = this.instance.state.harmonics.harmonicSets.findIndex((set) => set.id === harmonicSet.id);
      if (index !== -1) {
        this.instance.setSelection("harmonicSet", harmonicSet.id, index);
      }
      this.instance.state.dragState.isDragging = true;
      this.instance.state.dragState.dragStartPosition = { ...position };
      this.instance.state.dragState.draggedHarmonicSetId = harmonicSet.id;
      this.instance.state.dragState.originalSpacing = harmonicSet.spacing;
      this.instance.state.dragState.originalAnchorTime = harmonicSet.anchorTime;
      this.instance.state.dragState.clickedHarmonicNumber = clickedHarmonicNumber;
    }
    /**
     * Update harmonic set during drag
     * @param {Object} _target - Drag target with id and type (unused)
     * @param {DataCoordinates} currentPos - Current position
     * @param {DataCoordinates} _startPos - Start position (unused)
     */
    onHarmonicSetDragUpdate(_target, currentPos, _startPos) {
      this.instance.state.cursorPosition = {
        freq: currentPos.freq,
        time: currentPos.time,
        x: 0,
        y: 0,
        svgX: 0,
        svgY: 0,
        imageX: 0,
        imageY: 0
        // Minimal values for compatibility
      };
      this.handleHarmonicSetDrag();
    }
    /**
     * End dragging a harmonic set
     * @param {Object} _target - Drag target with id and type (unused)
     * @param {DataCoordinates} _position - End position (unused)
     */
    onHarmonicSetDragEnd(_target, _position) {
      this.instance.state.dragState.isDragging = false;
      this.instance.state.dragState.dragStartPosition = null;
      this.instance.state.dragState.draggedHarmonicSetId = null;
      this.instance.state.dragState.originalSpacing = null;
      this.instance.state.dragState.originalAnchorTime = null;
      this.instance.state.dragState.clickedHarmonicNumber = null;
    }
    /**
     * Update cursor style for drag operations
     * @param {string} style - Cursor style ('crosshair', 'grab', 'grabbing')
     */
    updateCursorStyle(style) {
      if (this.instance.svg) {
        this.instance.svg.style.cursor = style;
      }
    }
    /**
     * Get guidance content for harmonics mode
     * @returns {Object} Structured guidance content
     */
    getGuidanceText() {
      return {
        title: "Harmonics Mode",
        items: [
          "Click & drag to generate harmonic lines",
          "Drag existing harmonic lines to adjust spacing intervals",
          "Manually add harmonic lines using [+ Manual] button",
          "Click table row + arrow keys (Shift for larger steps)"
        ]
      };
    }
    /**
     * Handle mouse move events in harmonics mode
     * @param {MouseEvent} _event - Mouse event
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseMove(_event, dataCoords) {
      if (this.dragHandler.isDragging()) {
        this.dragHandler.handleMouseMove(dataCoords);
      } else if (this.instance.state.dragState.isCreatingNewHarmonicSet) {
        this.instance.state.cursorPosition = {
          freq: dataCoords.freq,
          time: dataCoords.time,
          x: 0,
          y: 0,
          svgX: 0,
          svgY: 0,
          imageX: 0,
          imageY: 0
          // Minimal values
        };
        this.handleHarmonicSetDrag();
      } else {
        this.dragHandler.updateCursorForHover(dataCoords);
      }
      if (this.instance.state.harmonics.harmonicSets.length > 0) {
        this.updateHarmonicPanel();
      }
    }
    /**
     * Handle mouse down events in harmonics mode
     * @param {MouseEvent} event - Mouse event
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseDown(event, dataCoords) {
      if (event.button !== 0) {
        return;
      }
      const dragStarted = this.dragHandler.startDrag(dataCoords);
      if (!dragStarted) {
        this.startNewHarmonicSetCreation(dataCoords);
      }
    }
    /**
     * Handle mouse up events in harmonics mode
     * @param {MouseEvent} _event - Mouse event
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseUp(_event, dataCoords) {
      if (this.dragHandler.isDragging()) {
        this.dragHandler.endDrag(dataCoords);
      }
      if (this.instance.state.dragState.isCreatingNewHarmonicSet) {
        this.completeNewHarmonicSetCreation(dataCoords);
        if (this.instance.svg) {
          this.instance.svg.style.cursor = "crosshair";
        }
      }
    }
    /**
     * Create UI elements for harmonics mode
     * @param {HTMLElement} harmonicsContainer - Persistent container for harmonics table
     */
    createUI(harmonicsContainer) {
      this.uiElements = {};
      this.uiElements.harmonicsContainer = harmonicsContainer;
      const buttonContainer = harmonicsContainer.querySelector(".gram-frame-harmonics-button-container");
      if (buttonContainer && buttonContainer.querySelector(".gram-frame-manual-button")) {
        this.uiElements.manualButton = buttonContainer.querySelector(".gram-frame-manual-button");
        this.uiElements.harmonicPanel = harmonicsContainer.querySelector(".gram-frame-harmonic-panel");
        this.instance.harmonicPanel = this.uiElements.harmonicPanel;
        return;
      }
      this.uiElements.manualButton = this.createManualButton();
      if (buttonContainer) {
        buttonContainer.appendChild(this.uiElements.manualButton);
      }
      this.uiElements.harmonicPanel = createHarmonicPanel(harmonicsContainer);
      this.instance.harmonicPanel = this.uiElements.harmonicPanel;
      this.instance.colorPicker = this.instance.colorPicker || null;
      this.updateHarmonicPanel();
    }
    /**
     * Update LED displays for harmonics mode
     * @param {CursorPosition} _coords - Current cursor coordinates
     */
    updateLEDs(_coords) {
      this.updateModeSpecificLEDs();
    }
    /**
     * Update mode-specific LED values and labels based on current state
     */
    updateModeSpecificLEDs() {
      this.updateHarmonicPanel();
    }
    /**
     * Reset harmonics-specific state
     */
    resetState() {
      this.instance.state.harmonics.baseFrequency = null;
      this.instance.state.harmonics.harmonicData = [];
    }
    /**
     * Clean up harmonics-specific state when switching away from harmonics mode
     */
    cleanup() {
      this.instance.state.harmonics.baseFrequency = null;
      this.instance.state.harmonics.harmonicData = [];
    }
    /**
     * Destroy mode-specific UI elements when leaving this mode
     */
    destroyUI() {
    }
    /**
     * Add a new harmonic set
     * @param {number} anchorTime - Time position in seconds
     * @param {number} spacing - Frequency spacing in Hz
     * @returns {HarmonicSet} The created harmonic set
     */
    addHarmonicSet(anchorTime, spacing) {
      const id = `harmonic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      let color;
      if (this.instance.state.selectedColor) {
        color = this.instance.state.selectedColor;
      } else {
        const colorIndex = this.instance.state.harmonics.harmonicSets.length % _HarmonicsMode.harmonicColors.length;
        color = _HarmonicsMode.harmonicColors[colorIndex];
      }
      const harmonicSet = {
        id,
        color,
        anchorTime,
        spacing
      };
      this.instance.state.harmonics.harmonicSets.push(harmonicSet);
      const index = this.instance.state.harmonics.harmonicSets.length - 1;
      this.instance.setSelection("harmonicSet", harmonicSet.id, index);
      if (this.instance.harmonicPanel) {
        updateHarmonicPanelContent(this.instance.harmonicPanel, this.instance);
      }
      if (this.instance.featureRenderer) {
        this.instance.featureRenderer.renderAllPersistentFeatures();
      }
      notifyStateListeners(this.instance.state, this.instance.stateListeners);
      return harmonicSet;
    }
    /**
     * Update an existing harmonic set
     * @param {string} id - Harmonic set ID
     * @param {Partial<HarmonicSet>} updates - Properties to update
     */
    updateHarmonicSet(id, updates) {
      const setIndex = this.instance.state.harmonics.harmonicSets.findIndex((set) => set.id === id);
      if (setIndex !== -1) {
        Object.assign(this.instance.state.harmonics.harmonicSets[setIndex], updates);
        if (this.instance.harmonicPanel) {
          updateHarmonicPanelContent(this.instance.harmonicPanel, this.instance);
        }
        if (this.instance.featureRenderer) {
          this.instance.featureRenderer.renderAllPersistentFeatures();
        }
        notifyStateListeners(this.instance.state, this.instance.stateListeners);
      }
    }
    /**
     * Remove a harmonic set
     * @param {string} id - Harmonic set ID
     */
    removeHarmonicSet(id) {
      const setIndex = this.instance.state.harmonics.harmonicSets.findIndex((set) => set.id === id);
      if (setIndex !== -1) {
        if (this.instance.state.selection.selectedType === "harmonicSet" && this.instance.state.selection.selectedId === id) {
          this.instance.clearSelection();
        }
        this.instance.state.harmonics.harmonicSets.splice(setIndex, 1);
        if (this.instance.harmonicPanel) {
          updateHarmonicPanelContent(this.instance.harmonicPanel, this.instance);
        }
        if (this.instance.featureRenderer) {
          this.instance.featureRenderer.renderAllPersistentFeatures();
        }
        notifyStateListeners(this.instance.state, this.instance.stateListeners);
      }
    }
    /**
     * Find harmonic set containing given frequency coordinate
     * @param {number} freq - Frequency in Hz to check
     * @returns {HarmonicSet|null} The harmonic set if found, null otherwise
     */
    findHarmonicSetAtFrequency(freq) {
      if (!this.instance.state.cursorPosition) return null;
      const cursorTime = this.instance.state.cursorPosition.time;
      for (const harmonicSet of this.instance.state.harmonics.harmonicSets) {
        if (harmonicSet.spacing > 0) {
          const freqMin = this.instance.state.config.freqMin;
          const freqMax = this.instance.state.config.freqMax;
          const minHarmonic = Math.max(1, Math.ceil(freqMin / harmonicSet.spacing));
          const maxHarmonic = Math.floor(freqMax / harmonicSet.spacing);
          for (let h = minHarmonic; h <= maxHarmonic; h++) {
            const expectedFreq = h * harmonicSet.spacing;
            const tolerance = getUniformTolerance(this.getViewport(), this.instance.spectrogramImage);
            if (Math.abs(freq - expectedFreq) < tolerance.freq) {
              const { naturalHeight } = this.instance.state.imageDetails;
              const lineHeight = naturalHeight * 0.2;
              const timeRange = this.instance.state.config.timeMax - this.instance.state.config.timeMin;
              const lineHeightInTime = lineHeight / naturalHeight * timeRange;
              const lineStartTime = harmonicSet.anchorTime - lineHeightInTime / 2;
              const lineEndTime = harmonicSet.anchorTime + lineHeightInTime / 2;
              if (cursorTime >= lineStartTime && cursorTime <= lineEndTime) {
                return harmonicSet;
              }
            }
          }
        }
      }
      return null;
    }
    /**
     * Create a new harmonic set immediately and start drag mode for updates
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    startNewHarmonicSetCreation(dataCoords) {
      const freqMin = this.instance.state.config.freqMin;
      let initialSpacing;
      let clickedHarmonicNumber;
      if (freqMin > 0) {
        clickedHarmonicNumber = 10;
        initialSpacing = dataCoords.freq / clickedHarmonicNumber;
      } else {
        clickedHarmonicNumber = 5;
        initialSpacing = dataCoords.freq / clickedHarmonicNumber;
      }
      initialSpacing = Math.max(initialSpacing, 0.1);
      const harmonicSet = this.addHarmonicSet(dataCoords.time, initialSpacing);
      this.instance.state.dragState.isCreatingNewHarmonicSet = true;
      this.instance.state.dragState.dragStartPosition = { ...dataCoords };
      this.instance.state.dragState.draggedHarmonicSetId = harmonicSet.id;
      this.instance.state.dragState.originalSpacing = initialSpacing;
      this.instance.state.dragState.originalAnchorTime = dataCoords.time;
      this.instance.state.dragState.clickedHarmonicNumber = clickedHarmonicNumber;
      if (this.instance.svg) {
        this.instance.svg.style.cursor = "grabbing";
      }
    }
    /**
     * Complete the drag update of the newly created harmonic set
     * @param {DataCoordinates} _dataCoords - Final drag position coordinates (unused)
     */
    completeNewHarmonicSetCreation(_dataCoords) {
      this.instance.state.dragState.isCreatingNewHarmonicSet = false;
      this.instance.state.dragState.dragStartPosition = null;
      this.instance.state.dragState.draggedHarmonicSetId = null;
      this.instance.state.dragState.originalSpacing = null;
      this.instance.state.dragState.originalAnchorTime = null;
      this.instance.state.dragState.clickedHarmonicNumber = null;
    }
    /**
     * Find which harmonic number was clicked
     * @param {HarmonicSet} harmonicSet - The harmonic set
     * @param {number} freq - The clicked frequency
     * @returns {number} The harmonic number (1, 2, 3, etc.)
     */
    findClickedHarmonicNumber(harmonicSet, freq) {
      const harmonicNumber = Math.round(freq / harmonicSet.spacing);
      return Math.max(1, harmonicNumber);
    }
    /**
     * Handle harmonic set dragging (both existing sets and new creation)
     */
    handleHarmonicSetDrag() {
      if (!this.instance.state.cursorPosition || !this.instance.state.dragState.dragStartPosition) return;
      const currentPos = this.instance.state.cursorPosition;
      const startPos = this.instance.state.dragState.dragStartPosition;
      const setId = this.instance.state.dragState.draggedHarmonicSetId;
      if (!setId) return;
      const harmonicSet = this.instance.state.harmonics.harmonicSets.find((set) => set.id === setId);
      if (!harmonicSet) return;
      let newSpacing, newAnchorTime;
      const clickedHarmonicNumber = this.instance.state.dragState.clickedHarmonicNumber || 1;
      newSpacing = currentPos.freq / clickedHarmonicNumber;
      newSpacing = Math.max(newSpacing, 0.1);
      const deltaTime = currentPos.time - startPos.time;
      newAnchorTime = this.instance.state.dragState.originalAnchorTime + deltaTime;
      const updates = {};
      if (newSpacing > 0) {
        updates.spacing = newSpacing;
      }
      updates.anchorTime = newAnchorTime;
      this.updateHarmonicSet(setId, updates);
      this.updateHarmonicPanel();
    }
    /**
     * Update harmonic management panel
     */
    updateHarmonicPanel() {
      if (this.instance.harmonicPanel) {
        updateHarmonicPanelContent(this.instance.harmonicPanel, this.instance);
      }
    }
    /**
     * Create manual harmonic button
     * @returns {HTMLElement} The manual button element
     */
    createManualButton() {
      const button = document.createElement("button");
      button.className = "gram-frame-manual-button";
      button.textContent = "+ Manual";
      button.title = "Manually add a set of harmonics at a specific spacing";
      button.addEventListener("click", () => {
        this.showManualHarmonicModal();
      });
      return button;
    }
    /**
     * Show manual harmonic modal dialog
     */
    showManualHarmonicModal() {
      showManualHarmonicModal(this.instance.state, this.addHarmonicSet.bind(this), this.instance);
    }
    /**
     * Render persistent features for harmonics mode
     */
    renderPersistentFeatures() {
      var _a;
      if (!this.instance.cursorGroup || !((_a = this.instance.state.harmonics) == null ? void 0 : _a.harmonicSets)) {
        return;
      }
      const existingHarmonics = this.instance.cursorGroup.querySelectorAll(".gram-frame-harmonic-line");
      existingHarmonics.forEach((line) => line.remove());
      this.instance.state.harmonics.harmonicSets.forEach((harmonicSet) => {
        this.renderHarmonicSet(harmonicSet);
      });
    }
    /**
     * Get visible harmonics within frequency range
     * @param {HarmonicSet} harmonicSet - Harmonic set configuration
     * @param {Config} config - Configuration object
     * @returns {number[]} Array of harmonic numbers to render
     */
    getVisibleHarmonics(harmonicSet, config) {
      const { freqMin, freqMax } = config;
      const minHarmonic = Math.max(1, Math.ceil(freqMin / harmonicSet.spacing));
      const maxHarmonic = Math.floor(freqMax / harmonicSet.spacing);
      const harmonics = [];
      for (let h = minHarmonic; h <= maxHarmonic; h++) {
        harmonics.push(h);
      }
      return harmonics;
    }
    /**
     * Calculate harmonic line dimensions and positions
     * @param {HarmonicSet} harmonicSet - Harmonic set configuration
     * @returns {Object} Line dimensions with height and top position
     */
    calculateHarmonicLineDimensions(harmonicSet) {
      const { naturalHeight } = this.instance.state.imageDetails;
      const margins = this.instance.state.margins;
      const zoomLevel = this.instance.state.zoom.level;
      const { timeMin, timeMax } = this.instance.state.config;
      const lineHeightRatio = 0.2;
      let lineHeight, lineTop;
      if (zoomLevel === 1) {
        lineHeight = naturalHeight * lineHeightRatio;
        const normalizedAnchorTime = 1 - (harmonicSet.anchorTime - timeMin) / (timeMax - timeMin);
        const anchorY = margins.top + normalizedAnchorTime * naturalHeight;
        lineTop = anchorY - lineHeight / 2;
      } else {
        const imageBounds = getImageBounds(this.getViewport(), this.instance.spectrogramImage);
        lineHeight = imageBounds.height * lineHeightRatio;
        const anchorPoint = { freq: harmonicSet.spacing, time: harmonicSet.anchorTime };
        const anchorSVG = calculateZoomAwarePosition(anchorPoint, this.getViewport(), this.instance.spectrogramImage);
        lineTop = anchorSVG.y - lineHeight / 2;
      }
      return { lineHeight, lineTop };
    }
    /**
     * Create SVG line element for a harmonic
     * @param {number} harmonicNumber - Harmonic number
     * @param {HarmonicSet} harmonicSet - Harmonic set configuration
     * @param {number} lineX - X position for the line
     * @param {number} lineTop - Top Y position for the line
     * @param {number} lineHeight - Height of the line
     * @returns {SVGLineElement} SVG line element
     */
    createHarmonicLine(harmonicNumber, harmonicSet, lineX, lineTop, lineHeight) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("class", "gram-frame-harmonic-line");
      line.setAttribute("data-harmonic-set-id", harmonicSet.id);
      line.setAttribute("data-harmonic-number", String(harmonicNumber));
      line.setAttribute("x1", String(lineX));
      line.setAttribute("y1", String(lineTop));
      line.setAttribute("x2", String(lineX));
      line.setAttribute("y2", String(lineTop + lineHeight));
      line.setAttribute("stroke", harmonicSet.color);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("opacity", "0.9");
      return line;
    }
    /**
     * Create SVG text label for a harmonic number
     * @param {number} harmonicNumber - Harmonic number
     * @param {HarmonicSet} harmonicSet - Harmonic set configuration
     * @param {number} lineX - X position for the label
     * @param {number} lineTop - Top Y position for the label
     * @returns {SVGTextElement} SVG text element
     */
    createHarmonicLabel(harmonicNumber, harmonicSet, lineX, lineTop) {
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("class", "gram-frame-harmonic-number");
      label.setAttribute("x", String(lineX + 3));
      label.setAttribute("y", String(lineTop + 12));
      label.setAttribute("fill", harmonicSet.color);
      label.setAttribute("font-size", "12");
      label.setAttribute("font-weight", "bold");
      label.setAttribute("font-family", "Arial, sans-serif");
      label.textContent = String(harmonicNumber);
      return label;
    }
    /**
     * Render a single harmonic set as vertical lines
     * @param {HarmonicSet} harmonicSet - Harmonic set to render
     */
    renderHarmonicSet(harmonicSet) {
      if (!this.instance.cursorGroup) {
        return;
      }
      const visibleHarmonics = this.getVisibleHarmonics(harmonicSet, this.instance.state.config);
      const { lineHeight, lineTop } = this.calculateHarmonicLineDimensions(harmonicSet);
      visibleHarmonics.forEach((harmonicNumber) => {
        const harmonicFreq = harmonicNumber * harmonicSet.spacing;
        const harmonicPoint = { freq: harmonicFreq, time: harmonicSet.anchorTime };
        const harmonicSVG = calculateZoomAwarePosition(harmonicPoint, this.getViewport(), this.instance.spectrogramImage);
        const lineX = harmonicSVG.x;
        const line = this.createHarmonicLine(harmonicNumber, harmonicSet, lineX, lineTop, lineHeight);
        const label = this.createHarmonicLabel(harmonicNumber, harmonicSet, lineX, lineTop);
        this.instance.cursorGroup.appendChild(line);
        this.instance.cursorGroup.appendChild(label);
      });
    }
    /**
     * Get initial state for harmonics mode
     * @returns {HarmonicsInitialState} Harmonics-specific initial state
     */
    static getInitialState() {
      return {
        harmonics: {
          baseFrequency: null,
          harmonicData: [],
          harmonicSets: []
        },
        dragState: {
          isDragging: false,
          dragStartPosition: null,
          draggedHarmonicSetId: null,
          originalSpacing: null,
          originalAnchorTime: null,
          clickedHarmonicNumber: null,
          isCreatingNewHarmonicSet: false
        }
      };
    }
  };
  /**
   * Color palette for harmonic sets
   * @type {string[]}
   */
  __publicField(_HarmonicsMode, "harmonicColors", ["#ff6b6b", "#2ecc71", "#f39c12", "#9b59b6", "#ffc93c", "#ff9ff3", "#45b7d1", "#e67e22"]);
  let HarmonicsMode = _HarmonicsMode;
  const COLOR_PALETTE = [
    "#ff0000",
    // Red
    "#ff8000",
    // Orange
    "#ffff00",
    // Yellow
    "#80ff00",
    // Yellow-green
    "#00ff00",
    // Green
    "#00ff80",
    // Green-cyan
    "#00ffff",
    // Cyan
    "#0080ff",
    // Cyan-blue
    "#0000ff",
    // Blue
    "#8000ff",
    // Blue-purple
    "#ff00ff",
    // Purple
    "#ff0080"
    // Purple-red
  ];
  function createColorPicker(state) {
    const container = document.createElement("div");
    container.className = "gram-frame-color-picker";
    container.style.display = "block";
    const label = document.createElement("div");
    label.className = "gram-frame-color-picker-label";
    label.textContent = "Harmonic Color";
    container.appendChild(label);
    const paletteContainer = document.createElement("div");
    paletteContainer.className = "gram-frame-color-palette";
    paletteContainer.style.display = "flex";
    paletteContainer.style.alignItems = "center";
    paletteContainer.style.gap = "8px";
    container.appendChild(paletteContainer);
    const sliderContainer = document.createElement("div");
    sliderContainer.className = "gram-frame-color-slider";
    sliderContainer.style.position = "relative";
    sliderContainer.style.flex = "1";
    paletteContainer.appendChild(sliderContainer);
    const canvas = document.createElement("canvas");
    canvas.width = 140;
    canvas.height = 20;
    canvas.className = "gram-frame-color-canvas";
    sliderContainer.appendChild(canvas);
    if (!state.selectedColor) {
      state.selectedColor = "#ff6b6b";
    }
    drawColorPalette(canvas);
    const indicator = document.createElement("div");
    indicator.className = "gram-frame-color-indicator";
    sliderContainer.appendChild(indicator);
    const currentColor = document.createElement("div");
    currentColor.className = "gram-frame-current-color";
    currentColor.style.backgroundColor = state.selectedColor;
    currentColor.style.width = "30px";
    currentColor.style.height = "20px";
    currentColor.style.borderRadius = "10px";
    currentColor.style.flexShrink = "0";
    paletteContainer.appendChild(currentColor);
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const scaleX = canvas.width / rect.width;
      const canvasX = x * scaleX;
      const color = getColorFromPosition(canvasX, canvas.width);
      state.selectedColor = color;
      currentColor.style.backgroundColor = color;
      updateIndicatorPosition(indicator, canvasX, canvas.width);
    });
    const initialPosition = getPositionFromColor(state.selectedColor, canvas.width);
    updateIndicatorPosition(indicator, initialPosition, canvas.width);
    return container;
  }
  function drawColorPalette(canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    COLOR_PALETTE.forEach((color, index) => {
      gradient.addColorStop(index / (COLOR_PALETTE.length - 1), color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  function getColorFromPosition(x, width) {
    const position = Math.max(0, Math.min(1, x / width));
    const segmentSize = 1 / (COLOR_PALETTE.length - 1);
    const segmentIndex = position / segmentSize;
    const lowerIndex = Math.floor(segmentIndex);
    const upperIndex = Math.min(lowerIndex + 1, COLOR_PALETTE.length - 1);
    const t = segmentIndex - lowerIndex;
    if (lowerIndex === upperIndex) {
      return COLOR_PALETTE[lowerIndex];
    }
    const color1 = hexToRgb(COLOR_PALETTE[lowerIndex]);
    const color2 = hexToRgb(COLOR_PALETTE[upperIndex]);
    const r = Math.round(color1.r * (1 - t) + color2.r * t);
    const g = Math.round(color1.g * (1 - t) + color2.g * t);
    const b = Math.round(color1.b * (1 - t) + color2.b * t);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  function getPositionFromColor(hexColor, width) {
    const targetRgb = hexToRgb(hexColor);
    let closestIndex = 0;
    let minDistance = Infinity;
    COLOR_PALETTE.forEach((color, index) => {
      const colorRgb = hexToRgb(color);
      const distance = Math.sqrt(
        Math.pow(targetRgb.r - colorRgb.r, 2) + Math.pow(targetRgb.g - colorRgb.g, 2) + Math.pow(targetRgb.b - colorRgb.b, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    const segmentSize = 1 / (COLOR_PALETTE.length - 1);
    const position = closestIndex * segmentSize;
    return position * width;
  }
  function updateIndicatorPosition(indicator, x, width) {
    const percentage = x / width * 100;
    indicator.style.left = `${Math.max(0, Math.min(100, percentage))}%`;
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function getModeDisplayName(mode) {
    const displayNames = {
      "analysis": "Cross Cursor",
      "harmonics": "Harmonics",
      "doppler": "Doppler",
      "pan": "Pan"
    };
    return displayNames[mode] || capitalizeFirstLetter(mode);
  }
  function createLEDDisplay(label, value) {
    const led = document.createElement("div");
    led.className = "gram-frame-led";
    const labelDiv = document.createElement("div");
    labelDiv.className = "gram-frame-led-label";
    labelDiv.textContent = label;
    const valueDiv = document.createElement("div");
    valueDiv.className = "gram-frame-led-value";
    valueDiv.textContent = value;
    led.appendChild(labelDiv);
    led.appendChild(valueDiv);
    return led;
  }
  function updateLEDDisplays(instance, state) {
    if (instance.modeLED) {
      instance.modeLED.querySelector(".gram-frame-led-value").textContent = getModeDisplayName(state.mode);
    }
    if (instance.rateLED) {
      instance.rateLED.querySelector(".gram-frame-led-value").textContent = `${state.rate}`;
    }
  }
  function createModeSwitchingUI(modeCell, state, modeSwitchCallback, modes = {}) {
    const modesContainer = document.createElement("div");
    modesContainer.className = "gram-frame-modes";
    const modeTypes = ["pan", "analysis", "harmonics", "doppler"];
    const modeButtons = {};
    const commandButtons = {};
    modeTypes.forEach((modeType) => {
      const modeInstance = modes[modeType];
      const commandButtonDefs = modeInstance && typeof modeInstance.getCommandButtons === "function" ? modeInstance.getCommandButtons() : [];
      const modeGroup = document.createElement("div");
      modeGroup.className = "gram-frame-mode-group";
      commandButtons[modeType] = [];
      const preButtons = commandButtonDefs.slice(0, Math.floor(commandButtonDefs.length / 2));
      preButtons.forEach((buttonDef) => {
        const cmdButton = createCommandButton(buttonDef);
        modeGroup.appendChild(cmdButton);
        commandButtons[modeType].push(cmdButton);
      });
      const button = document.createElement("button");
      button.className = "gram-frame-mode-btn";
      button.textContent = getModeDisplayName(modeType);
      button.dataset.mode = modeType;
      if (modeType === state.mode) {
        button.classList.add("active");
      }
      const modeInstanceForDisabled = modes[modeType];
      if (modeInstanceForDisabled && typeof modeInstanceForDisabled.isEnabled === "function") {
        if (!modeInstanceForDisabled.isEnabled()) {
          button.disabled = true;
          button.classList.add("disabled");
        }
      }
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (!button.disabled) {
          modeSwitchCallback(modeType);
        }
      });
      modeButtons[modeType] = button;
      modeGroup.appendChild(button);
      const postButtons = commandButtonDefs.slice(Math.floor(commandButtonDefs.length / 2));
      postButtons.forEach((buttonDef) => {
        const cmdButton = createCommandButton(buttonDef);
        modeGroup.appendChild(cmdButton);
        commandButtons[modeType].push(cmdButton);
      });
      modesContainer.appendChild(modeGroup);
    });
    const guidancePanel = document.createElement("div");
    guidancePanel.className = "gram-frame-guidance";
    modeCell.appendChild(modesContainer);
    modeCell.appendChild(guidancePanel);
    return {
      modesContainer,
      modeButtons,
      commandButtons,
      guidancePanel
    };
  }
  function createCommandButton(buttonDef) {
    const button = document.createElement("button");
    button.className = "gram-frame-command-btn";
    button.textContent = buttonDef.label;
    button.title = buttonDef.title;
    if (buttonDef.isEnabled) {
      button.disabled = !buttonDef.isEnabled();
    }
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      buttonDef.action();
    });
    return button;
  }
  function updateCommandButtonStates(commandButtons, modes) {
    Object.keys(commandButtons).forEach((modeType) => {
      const modeInstance = modes[modeType];
      if (modeInstance && typeof modeInstance.getCommandButtons === "function") {
        const buttonDefs = modeInstance.getCommandButtons();
        const buttons = commandButtons[modeType];
        buttons.forEach((button, index) => {
          const buttonDef = buttonDefs[index];
          if (buttonDef && buttonDef.isEnabled) {
            button.disabled = !buttonDef.isEnabled();
          }
        });
      }
    });
  }
  function updateModeButtonStates(modeButtons, modes) {
    Object.keys(modeButtons).forEach((modeType) => {
      const modeInstance = modes[modeType];
      const button = modeButtons[modeType];
      if (modeInstance && typeof modeInstance.isEnabled === "function" && button) {
        const isEnabled = modeInstance.isEnabled();
        button.disabled = !isEnabled;
        if (isEnabled) {
          button.classList.remove("disabled");
        } else {
          button.classList.add("disabled");
        }
      }
    });
  }
  function createFlexLayout(className, gap = "10px", direction = "row") {
    const container = document.createElement("div");
    container.className = className;
    container.style.display = "flex";
    container.style.flexDirection = direction;
    container.style.gap = gap;
    return container;
  }
  function createFullFlexLayout(className, gap = "10px") {
    const container = createFlexLayout(className, gap);
    container.style.width = "100%";
    container.style.height = "100%";
    return container;
  }
  function createFlexColumn(className, gap = "10px") {
    return createFlexLayout(className, gap, "column");
  }
  function calculateMidpoint(fPlus, fMinus) {
    return {
      time: (fPlus.time + fMinus.time) / 2,
      freq: (fPlus.freq + fMinus.freq) / 2
    };
  }
  function calculateDopplerSpeed(fPlus, fMinus, fZero = null, speedOfSound = 1500) {
    const f0 = fZero ? fZero.freq : calculateMidpoint(fPlus, fMinus).freq;
    const deltaF = (fPlus.freq - fMinus.freq) / 2;
    const speed = speedOfSound / f0 * deltaF;
    return Math.abs(speed);
  }
  function isNearMarker(mousePos, markerSVG, threshold = 25) {
    const dx = mousePos.x - markerSVG.x;
    const dy = mousePos.y - markerSVG.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= threshold;
  }
  function createSVGLine(x1, y1, x2, y2, className) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.setAttribute("class", className);
    return line;
  }
  function createSVGCircle(cx, cy, r, className) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(cx));
    circle.setAttribute("cy", String(cy));
    circle.setAttribute("r", String(r));
    circle.setAttribute("class", className);
    return circle;
  }
  function updateCursorIndicators(instance) {
    if (instance.cursorGroup) {
      instance.cursorGroup.innerHTML = "";
    }
    if (instance.featureRenderer) {
      instance.featureRenderer.renderAllPersistentFeatures();
    }
  }
  function drawDopplerPreview(instance, startPoint, endPoint) {
    const margins = instance.state.margins;
    const { naturalWidth, naturalHeight } = instance.state.imageDetails;
    const { timeMin, timeMax, freqMin, freqMax } = instance.state.config;
    const color = instance.state.selectedColor || "#ff0000";
    let fMinus, fPlus;
    if (startPoint.time < endPoint.time) {
      fMinus = startPoint;
      fPlus = endPoint;
    } else {
      fMinus = endPoint;
      fPlus = startPoint;
    }
    const fZero = {
      time: (fMinus.time + fPlus.time) / 2,
      freq: (fMinus.freq + fPlus.freq) / 2
    };
    const convertToSVG = (point) => {
      const timeRatio = (point.time - timeMin) / (timeMax - timeMin);
      const freqRatio = (point.freq - freqMin) / (freqMax - freqMin);
      return {
        x: margins.left + freqRatio * naturalWidth,
        y: margins.top + (1 - timeRatio) * naturalHeight
      };
    };
    const minusSVG = convertToSVG(fMinus);
    const plusSVG = convertToSVG(fPlus);
    const zeroSVG = convertToSVG(fZero);
    drawPreviewMarker(instance, minusSVG, "fMinus", color);
    drawPreviewMarker(instance, plusSVG, "fPlus", color);
    drawPreviewMarker(instance, zeroSVG, "fZero", color);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const controlPoint1X = minusSVG.x;
    const controlPoint1Y = minusSVG.y + (zeroSVG.y - minusSVG.y) * 0.7;
    const controlPoint2X = plusSVG.x;
    const controlPoint2Y = plusSVG.y + (zeroSVG.y - plusSVG.y) * 0.7;
    const pathData = `
    M ${minusSVG.x} ${minusSVG.y}
    C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${plusSVG.x} ${plusSVG.y}
  `;
    path.setAttribute("d", pathData.replace(/\s+/g, " ").trim());
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    path.setAttribute("opacity", "1.0");
    path.setAttribute("class", "gram-frame-doppler-preview");
    instance.cursorGroup.appendChild(path);
  }
  function drawPreviewMarker(instance, svgPos, type, color) {
    if (type === "fZero") {
      const horizontalLine = createSVGLine(
        svgPos.x - 6,
        svgPos.y,
        svgPos.x + 6,
        svgPos.y,
        "gram-frame-doppler-preview"
      );
      const verticalLine = createSVGLine(
        svgPos.x,
        svgPos.y - 6,
        svgPos.x,
        svgPos.y + 6,
        "gram-frame-doppler-preview"
      );
      horizontalLine.setAttribute("stroke", "#00ff00");
      verticalLine.setAttribute("stroke", "#00ff00");
      horizontalLine.setAttribute("stroke-width", "1");
      verticalLine.setAttribute("stroke-width", "1");
      horizontalLine.setAttribute("opacity", "1.0");
      verticalLine.setAttribute("opacity", "1.0");
      instance.cursorGroup.appendChild(horizontalLine);
      instance.cursorGroup.appendChild(verticalLine);
    } else {
      const circle = createSVGCircle(svgPos.x, svgPos.y, 3, "gram-frame-doppler-preview");
      circle.setAttribute("fill", color);
      circle.setAttribute("opacity", "1.0");
      instance.cursorGroup.appendChild(circle);
    }
  }
  const MS_TO_KNOTS_CONVERSION = 1.94384;
  const DopplerDraggedMarker = {
    fPlus: "fPlus",
    fMinus: "fMinus",
    fZero: "fZero"
  };
  class DopplerMode extends BaseMode {
    /**
     * Initialize DopplerMode with drag handler
     * @param {Object} instance - GramFrame instance
     */
    constructor(instance) {
      super(instance);
      this.dragHandler = new BaseDragHandler(instance, {
        findTargetAt: (position) => this.findDopplerMarkerAtPosition(position),
        onDragStart: (target, position) => this.onMarkerDragStart(target, position),
        onDragUpdate: (target, currentPos, startPos) => this.onMarkerDragUpdate(target, currentPos, startPos),
        onDragEnd: (target, position) => this.onMarkerDragEnd(target, position),
        updateCursor: (style) => this.updateCursorStyle(style)
      });
    }
    /**
     * Find doppler marker at given position
     * Returns a drag target object compatible with BaseDragHandler
     * @param {DataCoordinates} position - Position to check
     * @returns {Object|null} Drag target if found, null otherwise
     */
    findDopplerMarkerAtPosition(position) {
      const doppler = this.instance.state.doppler;
      if (!doppler) return null;
      const tolerance = getUniformTolerance(this.getViewport(), this.instance.spectrogramImage);
      if (doppler.fPlus) {
        const timeDiff = Math.abs(position.time - doppler.fPlus.time);
        const freqDiff = Math.abs(position.freq - doppler.fPlus.freq);
        if (timeDiff <= tolerance.time && freqDiff <= tolerance.freq) {
          return {
            id: "fPlus",
            type: "dopplerMarker",
            position: doppler.fPlus,
            data: { markerType: DopplerDraggedMarker.fPlus }
          };
        }
      }
      if (doppler.fMinus) {
        const timeDiff = Math.abs(position.time - doppler.fMinus.time);
        const freqDiff = Math.abs(position.freq - doppler.fMinus.freq);
        if (timeDiff <= tolerance.time && freqDiff <= tolerance.freq) {
          return {
            id: "fMinus",
            type: "dopplerMarker",
            position: doppler.fMinus,
            data: { markerType: DopplerDraggedMarker.fMinus }
          };
        }
      }
      if (doppler.fZero) {
        const timeDiff = Math.abs(position.time - doppler.fZero.time);
        const freqDiff = Math.abs(position.freq - doppler.fZero.freq);
        if (timeDiff <= tolerance.time && freqDiff <= tolerance.freq) {
          return {
            id: "fZero",
            type: "dopplerMarker",
            position: doppler.fZero,
            data: { markerType: DopplerDraggedMarker.fZero }
          };
        }
      }
      return null;
    }
    /**
     * Start dragging a doppler marker
     * @param {Object} target - Drag target with id and type
     * @param {DataCoordinates} _position - Start position (unused)
     */
    onMarkerDragStart(target, _position) {
      const doppler = this.instance.state.doppler;
      doppler.isDragging = true;
      doppler.draggedMarker = target.data.markerType;
    }
    /**
     * Update doppler marker position during drag
     * @param {Object} _target - Drag target with id and type (unused)
     * @param {DataCoordinates} currentPos - Current position
     * @param {DataCoordinates} _startPos - Start position (unused)
     */
    onMarkerDragUpdate(_target, currentPos, _startPos) {
      this.handleMarkerDrag(currentPos, this.instance.state.doppler);
    }
    /**
     * End dragging a doppler marker
     * @param {Object} _target - Drag target with id and type (unused)
     * @param {DataCoordinates} _position - End position (unused)
     */
    onMarkerDragEnd(_target, _position) {
      const doppler = this.instance.state.doppler;
      doppler.isDragging = false;
      doppler.draggedMarker = null;
    }
    /**
     * Get guidance content for doppler mode
     * @returns {Object} Structured guidance content
     */
    getGuidanceText() {
      return {
        title: "Doppler Mode",
        items: [
          "Click & drag to place markers for f+ and f-",
          "Drag markers to adjust positions",
          "f₀ marker shows automatically at the midpoint",
          "Right-click to reset all markers"
        ]
      };
    }
    /**
     * Detect which marker is closest to mouse position
     * @param {ScreenCoordinates} mousePos - Mouse position
     * @param {DopplerState} doppler - Doppler state
     * @returns {Object} Closest marker info with type and distance
     */
    detectClosestMarker(mousePos, doppler) {
      let closestMarker = null;
      let closestDistance = Infinity;
      if (doppler.fPlus) {
        const fPlusSVG = dataToSVG(doppler.fPlus, this.getViewport(), this.instance.spectrogramImage);
        if (this.isNearMarker(mousePos, fPlusSVG)) {
          const distance = this.getMarkerDistance(mousePos, fPlusSVG);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestMarker = DopplerDraggedMarker.fPlus;
          }
        }
      }
      if (doppler.fMinus) {
        const fMinusSVG = dataToSVG(doppler.fMinus, this.getViewport(), this.instance.spectrogramImage);
        if (this.isNearMarker(mousePos, fMinusSVG)) {
          const distance = this.getMarkerDistance(mousePos, fMinusSVG);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestMarker = DopplerDraggedMarker.fMinus;
          }
        }
      }
      if (doppler.fZero) {
        const fZeroSVG = dataToSVG(doppler.fZero, this.getViewport(), this.instance.spectrogramImage);
        if (this.isNearMarker(mousePos, fZeroSVG)) {
          const distance = this.getMarkerDistance(mousePos, fZeroSVG);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestMarker = DopplerDraggedMarker.fZero;
          }
        }
      }
      return { marker: closestMarker, distance: closestDistance };
    }
    /**
     * Handle preview drag when placing markers
     * @param {DataCoordinates} dataCoords - Data coordinates
     * @param {DopplerState} doppler - Doppler state
     */
    handlePreviewDrag(dataCoords, doppler) {
      doppler.fMinus = {
        time: dataCoords.time,
        freq: dataCoords.freq
      };
      doppler.fZero = this.calculateMidpoint(doppler.fPlus, doppler.fMinus);
      doppler.previewEnd = doppler.fMinus;
      this.renderDopplerFeatures();
    }
    /**
     * Handle marker dragging
     * @param {DataCoordinates} dataCoords - Data coordinates
     * @param {DopplerState} doppler - Doppler state
     */
    handleMarkerDrag(dataCoords, doppler) {
      const newPoint = {
        time: dataCoords.time,
        freq: dataCoords.freq
      };
      if (doppler.draggedMarker === DopplerDraggedMarker.fPlus) {
        doppler.fPlus = newPoint;
      } else if (doppler.draggedMarker === DopplerDraggedMarker.fMinus) {
        doppler.fMinus = newPoint;
      } else if (doppler.draggedMarker === DopplerDraggedMarker.fZero) {
        doppler.fZero = newPoint;
      }
      this.calculateAndUpdateDopplerSpeed();
      this.renderDopplerFeatures();
      notifyStateListeners(this.instance.state, this.instance.stateListeners);
    }
    /**
     * Handle mouse move events in doppler mode
     * @param {MouseEvent} _event - Mouse event
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseMove(_event, dataCoords) {
      const doppler = this.instance.state.doppler;
      if (doppler.isPreviewDrag && doppler.tempFirst) {
        this.handlePreviewDrag(dataCoords, doppler);
        return;
      }
      if (this.dragHandler.isDragging()) {
        this.dragHandler.handleMouseMove(dataCoords);
      } else if (doppler.fPlus || doppler.fMinus || doppler.fZero) {
        this.dragHandler.updateCursorForHover(dataCoords);
      }
    }
    /**
     * Handle mouse down events in doppler mode
     * @param {MouseEvent} _event - Mouse event
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseDown(_event, dataCoords) {
      const doppler = this.instance.state.doppler;
      if (doppler.fPlus || doppler.fMinus || doppler.fZero) {
        const dragStarted = this.dragHandler.startDrag(dataCoords);
        if (dragStarted) {
          notifyStateListeners(this.instance.state, this.instance.stateListeners);
          return;
        }
      }
      if (!doppler.fPlus && !doppler.fMinus) {
        doppler.isPlacingMarkers = true;
        doppler.fPlus = {
          time: dataCoords.time,
          freq: dataCoords.freq
        };
        doppler.isPreviewDrag = true;
        doppler.tempFirst = doppler.fPlus;
        doppler.previewEnd = {
          time: dataCoords.time,
          freq: dataCoords.freq
        };
        this.renderDopplerFeatures();
      }
    }
    /**
     * Handle mouse up events in doppler mode
     * @param {MouseEvent} _event - Mouse event (unused)
     * @param {DataCoordinates} dataCoords - Data coordinates {freq, time}
     */
    handleMouseUp(_event, dataCoords) {
      const doppler = this.instance.state.doppler;
      if (doppler.isPreviewDrag && doppler.tempFirst) {
        if (doppler.fPlus.time > doppler.fMinus.time) ;
        else {
          const temp = doppler.fPlus;
          doppler.fPlus = doppler.fMinus;
          doppler.fMinus = temp;
        }
        doppler.fZero = this.calculateMidpoint(doppler.fPlus, doppler.fMinus);
        if (!doppler.color) {
          doppler.color = this.instance.state.selectedColor || "#ff0000";
        }
        doppler.isPlacingMarkers = false;
        doppler.tempFirst = null;
        doppler.isPreviewDrag = false;
        doppler.previewEnd = null;
        this.calculateAndUpdateDopplerSpeed();
        this.renderDopplerFeatures();
        notifyStateListeners(this.instance.state, this.instance.stateListeners);
        return;
      }
      if (this.dragHandler.isDragging()) {
        this.dragHandler.endDrag(dataCoords);
        notifyStateListeners(this.instance.state, this.instance.stateListeners);
      }
    }
    /**
     * Create UI elements for doppler mode
     * @param {HTMLElement} _leftColumn - Container for UI elements (unused)
     */
    createUI(_leftColumn) {
      this.uiElements = {};
      this.instance.speedLED = this.instance.speedLED || null;
    }
    /**
     * Update LED displays for doppler mode
     * @param {CursorPosition} _coords - Current cursor coordinates
     */
    updateLEDs(_coords) {
      this.updateModeSpecificLEDs();
    }
    /**
     * Update mode-specific LED values based on current state
     */
    updateModeSpecificLEDs() {
    }
    /**
     * Reset doppler-specific state
     */
    resetState() {
      this.instance.state.doppler.fPlus = null;
      this.instance.state.doppler.fMinus = null;
      this.instance.state.doppler.fZero = null;
      this.instance.state.doppler.speed = null;
      this.instance.state.doppler.color = null;
      this.instance.state.doppler.isDragging = false;
      this.instance.state.doppler.draggedMarker = null;
      this.instance.state.doppler.isPlacingMarkers = false;
      this.instance.state.doppler.markersPlaced = 0;
      this.instance.state.doppler.tempFirst = null;
      this.instance.state.doppler.isPreviewDrag = false;
      this.instance.state.doppler.previewEnd = null;
      notifyStateListeners(this.instance.state, this.instance.stateListeners);
    }
    /**
     * Clean up doppler-specific state when switching away from doppler mode
     */
    cleanup() {
      this.instance.state.doppler.isDragging = false;
      this.instance.state.doppler.draggedMarker = null;
      this.instance.state.doppler.isPlacingMarkers = false;
      this.instance.state.doppler.tempFirst = null;
      this.instance.state.doppler.isPreviewDrag = false;
      this.instance.state.doppler.previewEnd = null;
    }
    /**
     * Deactivate doppler mode - hide speed LED
     */
    deactivate() {
    }
    /**
     * Calculate and update Doppler speed
     */
    calculateAndUpdateDopplerSpeed() {
      const doppler = this.instance.state.doppler;
      if (doppler.fPlus && doppler.fMinus && doppler.fZero) {
        const speed = calculateDopplerSpeed(doppler.fPlus, doppler.fMinus, doppler.fZero);
        this.instance.state.doppler.speed = speed;
        this.updateSpeedLED();
        updateLEDDisplays(this.instance, this.instance.state);
        notifyStateListeners(this.instance.state, this.instance.stateListeners);
      }
    }
    /**
     * Get initial state for doppler mode
     * @returns {DopplerInitialState} Doppler-specific initial state
     */
    static getInitialState() {
      return {
        doppler: {
          fPlus: null,
          // DataCoordinates: { time, frequency }
          fMinus: null,
          // DataCoordinates: { time, frequency }
          fZero: null,
          // DataCoordinates: { time, frequency }
          speed: null,
          // calculated speed in m/s
          color: null,
          // color used for this doppler curve
          isDragging: false,
          draggedMarker: null,
          // 'fPlus', 'fMinus', 'fZero'
          isPlacingMarkers: false,
          markersPlaced: 0,
          // 0 = none, 1 = first placed, 2 = both placed
          tempFirst: null,
          // temporary storage for first marker during placement
          isPreviewDrag: false,
          // whether currently dragging to preview curve
          previewEnd: null
          // end point for preview drag
        }
      };
    }
    /**
     * Update the speed LED display with current speed value
     */
    updateSpeedLED() {
      if (this.instance.speedLED && this.instance.state.doppler.speed !== null) {
        const speedInKnots = this.instance.state.doppler.speed * MS_TO_KNOTS_CONVERSION;
        this.instance.speedLED.querySelector(".gram-frame-led-value").textContent = speedInKnots.toFixed(1);
      } else if (this.instance.speedLED) {
        this.instance.speedLED.querySelector(".gram-frame-led-value").textContent = "0.0";
      }
    }
    /**
     * Get mouse position relative to SVG
     * @param {MouseEvent} event - Mouse event
     * @returns {ScreenCoordinates} Mouse position with x, y coordinates
     */
    getMousePosition(event) {
      const svgRect = this.instance.svg.getBoundingClientRect();
      const viewBox = this.instance.svg.viewBox.baseVal;
      const screenX = event.clientX - svgRect.left;
      const screenY = event.clientY - svgRect.top;
      if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
        const scaleX = viewBox.width / svgRect.width;
        const scaleY = viewBox.height / svgRect.height;
        return {
          x: screenX * scaleX + viewBox.x,
          y: screenY * scaleY + viewBox.y
        };
      }
      return {
        x: screenX,
        y: screenY
      };
    }
    /**
     * Check if mouse is near a marker
     * @param {ScreenCoordinates} mousePos - Mouse position with x, y coordinates
     * @param {SVGCoordinates} markerSVG - Marker SVG position with x, y coordinates
     * @returns {boolean} True if mouse is near the marker
     */
    isNearMarker(mousePos, markerSVG) {
      return isNearMarker(mousePos, markerSVG, 20);
    }
    /**
     * Calculate distance between mouse and marker
     * @param {ScreenCoordinates} mousePos - Mouse position with x, y coordinates
     * @param {SVGCoordinates} markerSVG - Marker SVG position with x, y coordinates
     * @returns {number} Distance in pixels
     */
    getMarkerDistance(mousePos, markerSVG) {
      const dx = mousePos.x - markerSVG.x;
      const dy = mousePos.y - markerSVG.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Calculate midpoint between two markers
     * @param {DataCoordinates} fPlus - f+ marker
     * @param {DataCoordinates} fMinus - f- marker
     * @returns {DataCoordinates} Midpoint coordinates
     */
    calculateMidpoint(fPlus, fMinus) {
      return calculateMidpoint(fPlus, fMinus);
    }
    /**
     * Handle context menu (right-click) events in doppler mode
     * @param {MouseEvent} event - Mouse event
     * @param {DataCoordinates} _dataCoords - Data coordinates {freq, time} (unused)
     */
    handleContextMenu(event, _dataCoords) {
      event.preventDefault();
      this.resetState();
      this.updateSpeedLED();
      this.renderDopplerFeatures();
    }
    /**
     * Render all doppler features (markers and curves)
     */
    renderDopplerFeatures() {
      if (!this.instance.cursorGroup) return;
      const existingFeatures = this.instance.cursorGroup.querySelectorAll(".doppler-feature, .gram-frame-doppler-preview, .gram-frame-doppler-curve, .gram-frame-doppler-extension, .gram-frame-doppler-fPlus, .gram-frame-doppler-fMinus, .gram-frame-doppler-crosshair");
      existingFeatures.forEach((element) => element.remove());
      const doppler = this.instance.state.doppler;
      if (doppler.fPlus && doppler.fMinus && doppler.fZero) {
        this.renderMarkers();
        this.renderDopplerCurve();
        if (doppler.isPreviewDrag) {
          const elements = this.instance.cursorGroup.querySelectorAll(".gram-frame-doppler-curve, .gram-frame-doppler-extension");
          elements.forEach((element) => {
            element.setAttribute("opacity", "0.8");
            element.setAttribute("stroke-dasharray", "5,5");
          });
        }
      }
    }
    /**
     * Render preview curve during marker placement
     * @param {DataCoordinates} start - Start point
     * @param {DataCoordinates} end - End point
     */
    renderPreviewCurve(start, end) {
      drawDopplerPreview(this.instance, start, end);
    }
    /**
     * Render doppler markers (f+, f-, f₀) with zoom awareness
     */
    renderMarkers() {
      const doppler = this.instance.state.doppler;
      const color = doppler.color || this.instance.state.selectedColor || "#ff0000";
      const isInDopplerMode = this.instance.state.mode === "doppler";
      const pointerEvents = isInDopplerMode ? "auto" : "none";
      if (doppler.fPlus) {
        const fPlusSVG = dataToSVG(doppler.fPlus, this.getViewport(), this.instance.spectrogramImage);
        const fPlusMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        fPlusMarker.setAttribute("class", "gram-frame-doppler-fPlus");
        fPlusMarker.setAttribute("cx", fPlusSVG.x.toString());
        fPlusMarker.setAttribute("cy", fPlusSVG.y.toString());
        fPlusMarker.setAttribute("r", "4");
        fPlusMarker.setAttribute("fill", color);
        fPlusMarker.setAttribute("stroke", "#ffffff");
        fPlusMarker.setAttribute("stroke-width", "1");
        fPlusMarker.setAttribute("pointer-events", pointerEvents);
        this.instance.cursorGroup.appendChild(fPlusMarker);
      }
      if (doppler.fMinus) {
        const fMinusSVG = dataToSVG(doppler.fMinus, this.getViewport(), this.instance.spectrogramImage);
        const fMinusMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        fMinusMarker.setAttribute("class", "gram-frame-doppler-fMinus");
        fMinusMarker.setAttribute("cx", fMinusSVG.x.toString());
        fMinusMarker.setAttribute("cy", fMinusSVG.y.toString());
        fMinusMarker.setAttribute("r", "4");
        fMinusMarker.setAttribute("fill", color);
        fMinusMarker.setAttribute("stroke", "#ffffff");
        fMinusMarker.setAttribute("stroke-width", "1");
        fMinusMarker.setAttribute("pointer-events", pointerEvents);
        this.instance.cursorGroup.appendChild(fMinusMarker);
      }
      if (doppler.fZero) {
        const fZeroSVG = dataToSVG(doppler.fZero, this.getViewport(), this.instance.spectrogramImage);
        const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hLine.setAttribute("class", "gram-frame-doppler-crosshair");
        hLine.setAttribute("x1", (fZeroSVG.x - 8).toString());
        hLine.setAttribute("y1", fZeroSVG.y.toString());
        hLine.setAttribute("x2", (fZeroSVG.x + 8).toString());
        hLine.setAttribute("y2", fZeroSVG.y.toString());
        hLine.setAttribute("stroke", "#00ff00");
        hLine.setAttribute("stroke-width", "2");
        hLine.setAttribute("pointer-events", pointerEvents);
        this.instance.cursorGroup.appendChild(hLine);
        const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vLine.setAttribute("class", "gram-frame-doppler-crosshair");
        vLine.setAttribute("x1", fZeroSVG.x.toString());
        vLine.setAttribute("y1", (fZeroSVG.y - 8).toString());
        vLine.setAttribute("x2", fZeroSVG.x.toString());
        vLine.setAttribute("y2", (fZeroSVG.y + 8).toString());
        vLine.setAttribute("stroke", "#00ff00");
        vLine.setAttribute("stroke-width", "2");
        vLine.setAttribute("pointer-events", pointerEvents);
        this.instance.cursorGroup.appendChild(vLine);
      }
    }
    /**
     * Render Doppler curve between markers with vertical extensions (zoom-aware)
     */
    renderDopplerCurve() {
      const doppler = this.instance.state.doppler;
      if (!doppler.fPlus || !doppler.fMinus || !doppler.fZero) return;
      const color = doppler.color || this.instance.state.selectedColor || "#ff0000";
      const fPlusSVG = dataToSVG(doppler.fPlus, this.getViewport(), this.instance.spectrogramImage);
      const fMinusSVG = dataToSVG(doppler.fMinus, this.getViewport(), this.instance.spectrogramImage);
      const fZeroSVG = dataToSVG(doppler.fZero, this.getViewport(), this.instance.spectrogramImage);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "gram-frame-doppler-curve");
      const controlPoint1X = fMinusSVG.x;
      const controlPoint1Y = fMinusSVG.y + (fZeroSVG.y - fMinusSVG.y) * 0.7;
      const controlPoint2X = fPlusSVG.x;
      const controlPoint2Y = fPlusSVG.y + (fZeroSVG.y - fPlusSVG.y) * 0.7;
      const pathData = `M ${fMinusSVG.x} ${fMinusSVG.y} C ${controlPoint1X} ${controlPoint1Y} ${controlPoint2X} ${controlPoint2Y} ${fPlusSVG.x} ${fPlusSVG.y}`;
      path.setAttribute("d", pathData);
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", "2");
      path.setAttribute("fill", "none");
      this.instance.cursorGroup.appendChild(path);
      const margins = this.instance.state.margins;
      const { naturalHeight } = this.instance.state.imageDetails;
      const zoomLevel = this.instance.state.zoom.level;
      const spectrogramTop = margins.top;
      const spectrogramBottom = margins.top + naturalHeight;
      let zoomedTop = spectrogramTop;
      let zoomedBottom = spectrogramBottom;
      if (zoomLevel !== 1 && this.instance.spectrogramImage) {
        const zoomedImageTop = parseFloat(this.instance.spectrogramImage.getAttribute("y") || String(margins.top));
        const zoomedImageHeight = parseFloat(this.instance.spectrogramImage.getAttribute("height") || String(naturalHeight));
        zoomedTop = zoomedImageTop;
        zoomedBottom = zoomedImageTop + zoomedImageHeight;
      }
      const clippedTop = Math.max(spectrogramTop, zoomedTop);
      const clippedBottom = Math.min(spectrogramBottom, zoomedBottom);
      if (fPlusSVG.y > clippedTop) {
        const fPlusExtension = document.createElementNS("http://www.w3.org/2000/svg", "line");
        fPlusExtension.setAttribute("class", "gram-frame-doppler-extension");
        fPlusExtension.setAttribute("x1", fPlusSVG.x.toString());
        fPlusExtension.setAttribute("y1", fPlusSVG.y.toString());
        fPlusExtension.setAttribute("x2", fPlusSVG.x.toString());
        fPlusExtension.setAttribute("y2", clippedTop.toString());
        fPlusExtension.setAttribute("stroke", color);
        fPlusExtension.setAttribute("stroke-width", "2");
        this.instance.cursorGroup.appendChild(fPlusExtension);
      }
      if (fMinusSVG.y < clippedBottom) {
        const fMinusExtension = document.createElementNS("http://www.w3.org/2000/svg", "line");
        fMinusExtension.setAttribute("class", "gram-frame-doppler-extension");
        fMinusExtension.setAttribute("x1", fMinusSVG.x.toString());
        fMinusExtension.setAttribute("y1", fMinusSVG.y.toString());
        fMinusExtension.setAttribute("x2", fMinusSVG.x.toString());
        fMinusExtension.setAttribute("y2", clippedBottom.toString());
        fMinusExtension.setAttribute("stroke", color);
        fMinusExtension.setAttribute("stroke-width", "2");
        this.instance.cursorGroup.appendChild(fMinusExtension);
      }
    }
    /**
     * Render persistent features (for FeatureRenderer)
     */
    renderPersistentFeatures() {
      this.renderDopplerFeatures();
    }
  }
  const VERSION = "0.1.8";
  function getVersion() {
    return VERSION;
  }
  class PanMode extends BaseMode {
    /**
     * Constructor for pan mode
     * @param {GramFrame} instance - GramFrame instance
     */
    constructor(instance) {
      super(instance);
      this.isDragging = false;
      this.dragState = {
        lastX: 0,
        lastY: 0
      };
    }
    /**
     * Activate pan mode
     */
    activate() {
      if (this.instance.svg && this.instance.state.zoom.level > 1) {
        this.instance.svg.style.cursor = "grab";
      }
      this.isDragging = false;
      this.dragState = { lastX: 0, lastY: 0 };
    }
    /**
     * Deactivate pan mode
     */
    deactivate() {
      if (this.instance.svg) {
        this.instance.svg.style.cursor = "crosshair";
      }
      this.isDragging = false;
      this.dragState = { lastX: 0, lastY: 0 };
    }
    /**
     * Handle mouse down events - start pan drag
     * @param {MouseEvent} event - Mouse event
     * @param {DataCoordinates} _dataCoords - Data coordinates (unused)
     */
    handleMouseDown(event, _dataCoords) {
      if (this.instance.state.zoom.level <= 1) {
        return;
      }
      this.isDragging = true;
      this.dragState = {
        lastX: event.clientX,
        lastY: event.clientY
      };
      if (this.instance.svg) {
        this.instance.svg.style.cursor = "grabbing";
      }
      event.preventDefault();
    }
    /**
     * Handle mouse move events - perform pan if dragging
     * @param {MouseEvent} event - Mouse event
     * @param {DataCoordinates} _dataCoords - Data coordinates (unused)
     */
    handleMouseMove(event, _dataCoords) {
      if (!this.isDragging || this.instance.state.zoom.level <= 1) {
        return;
      }
      const deltaX = event.clientX - this.dragState.lastX;
      const deltaY = event.clientY - this.dragState.lastY;
      const { naturalWidth, naturalHeight } = this.instance.state.imageDetails;
      const margins = this.instance.state.margins;
      const svgRect = this.instance.svg.getBoundingClientRect();
      const scaleX = (naturalWidth + margins.left + margins.right) / svgRect.width;
      const scaleY = (naturalHeight + margins.top + margins.bottom) / svgRect.height;
      const normalizedDeltaX = -(deltaX * scaleX / naturalWidth) / this.instance.state.zoom.level;
      const normalizedDeltaY = -(deltaY * scaleY / naturalHeight) / this.instance.state.zoom.level;
      this.panImage(normalizedDeltaX, normalizedDeltaY);
      this.dragState.lastX = event.clientX;
      this.dragState.lastY = event.clientY;
    }
    /**
     * Handle mouse up events - end pan drag
     * @param {MouseEvent} _event - Mouse event (unused)
     * @param {DataCoordinates} _dataCoords - Data coordinates (unused)
     */
    handleMouseUp(_event, _dataCoords) {
      if (!this.isDragging) {
        return;
      }
      this.isDragging = false;
      if (this.instance.svg && this.instance.state.zoom.level > 1) {
        this.instance.svg.style.cursor = "grab";
      }
    }
    /**
     * Handle mouse leave events
     */
    handleMouseLeave() {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.instance.svg && this.instance.state.zoom.level > 1) {
          this.instance.svg.style.cursor = "grab";
        }
      }
    }
    /**
     * Pan the image by adjusting the center point
     * @param {number} deltaX - Change in X position (normalized -1 to 1)
     * @param {number} deltaY - Change in Y position (normalized -1 to 1)
     */
    panImage(deltaX, deltaY) {
      if (this.instance.state.zoom.level <= 1) {
        return;
      }
      const newCenterX = Math.max(0, Math.min(1, this.instance.state.zoom.centerX + deltaX));
      const newCenterY = Math.max(0, Math.min(1, this.instance.state.zoom.centerY + deltaY));
      this.setZoom(this.instance.state.zoom.level, newCenterX, newCenterY);
    }
    /**
     * Set zoom level and center point
     * @param {number} level - Zoom level (1.0 = no zoom)
     * @param {number} centerX - Center X (0-1 normalized)
     * @param {number} centerY - Center Y (0-1 normalized)
     */
    setZoom(level, centerX, centerY) {
      this.instance.state.zoom.level = level;
      this.instance.state.zoom.centerX = centerX;
      this.instance.state.zoom.centerY = centerY;
      if (this.instance.svg) {
        applyZoomTransform(this.instance);
      }
      notifyStateListeners(this.instance.state, this.instance.stateListeners);
    }
    /**
     * Get guidance content for pan mode
     * @returns {Object} Structured guidance content
     */
    getGuidanceText() {
      return {
        title: "Pan Mode",
        items: [
          "Pan is only available when image is zoomed in",
          "Click and drag to pan the view when zoomed in",
          "Use the zoom controls to zoom in before panning",
          `GramFrame v${getVersion()}`
        ]
      };
    }
    /**
     * Reset pan-specific state
     */
    resetState() {
      this.isDragging = false;
      this.dragState = { lastX: 0, lastY: 0 };
    }
    /**
     * Check if pan mode is enabled
     * Pan mode is only enabled when zoomed in (zoom level > 1.0)
     * @returns {boolean} True if enabled, false if disabled
     */
    isEnabled() {
      return this.instance.state.zoom.level > 1;
    }
    /**
     * Get command buttons for pan mode
     * @returns {Array<CommandButton>} Array of command button definitions
     */
    getCommandButtons() {
      return [
        {
          label: "−",
          title: "Zoom Out",
          action: () => this.instance._zoomOut(),
          isEnabled: () => this.instance.state.zoom.level > 1
        },
        {
          label: "+",
          title: "Zoom In",
          action: () => this.instance._zoomIn(),
          isEnabled: () => this.instance.state.zoom.level < 10
        }
      ];
    }
    /**
     * Get initial state for pan mode
     * @returns {Object} Pan mode initial state
     */
    static getInitialState() {
      return {
        // Pan mode doesn't need persistent state
        // Pan position is stored in zoom.centerX/centerY
      };
    }
  }
  function buildModeInitialState() {
    const modeStates = [
      AnalysisMode.getInitialState(),
      HarmonicsMode.getInitialState(),
      DopplerMode.getInitialState(),
      PanMode.getInitialState()
    ];
    return Object.assign({}, ...modeStates);
  }
  const initialState = {
    version: "0.0.1",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    instanceId: "",
    mode: "analysis",
    // 'analysis', 'harmonics', 'doppler', 'pan'
    previousMode: null,
    // Previous mode for switching back
    rate: 1,
    selectedColor: "#ff6b6b",
    // Currently selected color for new features across all modes
    cursorPosition: null,
    cursors: [],
    imageDetails: {
      url: "",
      naturalWidth: 0,
      // Original dimensions of the image
      naturalHeight: 0
    },
    config: {
      timeMin: 0,
      timeMax: 0,
      freqMin: 0,
      freqMax: 0
    },
    displayDimensions: {
      // Current display dimensions (responsive)
      width: 0,
      height: 0
    },
    margins: {
      left: 60,
      // Space for time axis labels
      bottom: 50,
      // Space for frequency axis labels  
      right: 15,
      // Small right margin
      top: 15
      // Small top margin
    },
    // Simple zoom state for transform-based zoom
    zoom: {
      level: 1,
      // Current zoom level (1.0 = no zoom, 2.0 = 2x zoom)
      centerX: 0.5,
      // Center point X (0-1 normalized)
      centerY: 0.5,
      // Center point Y (0-1 normalized)
      panMode: false
      // Legacy pan mode flag (deprecated - pan is now a proper mode)
    },
    // Selection state for keyboard fine control
    selection: {
      selectedType: null,
      // 'marker' | 'harmonicSet' | null
      selectedId: null,
      // ID of selected item
      selectedIndex: null
      // Index in table for display purposes
    },
    // Add mode-specific state from mode classes
    ...buildModeInitialState()
  };
  const globalStateListeners = [];
  function createInitialState() {
    return JSON.parse(JSON.stringify(initialState));
  }
  function notifyStateListeners(state, listeners) {
    const stateCopy = JSON.parse(JSON.stringify(state));
    listeners.forEach((listener) => {
      try {
        listener(stateCopy);
      } catch (error) {
        console.error("Error in state listener:", error);
      }
    });
  }
  function addGlobalStateListener(callback) {
    if (!globalStateListeners.includes(callback)) {
      globalStateListeners.push(callback);
      return true;
    }
    return false;
  }
  function removeGlobalStateListener(callback) {
    const index = globalStateListeners.indexOf(callback);
    if (index !== -1) {
      globalStateListeners.splice(index, 1);
      return true;
    }
    return false;
  }
  function getGlobalStateListeners() {
    return [...globalStateListeners];
  }
  function createUnifiedLayout(instance) {
    const unifiedLayoutContainer = (
      /** @type {HTMLDivElement} */
      createFullFlexLayout("gram-frame-unified-layout", "2px")
    );
    unifiedLayoutContainer.style.flexDirection = "row";
    unifiedLayoutContainer.style.flexWrap = "nowrap";
    const leftColumn = (
      /** @type {HTMLDivElement} */
      createFullFlexLayout("gram-frame-left-column", "4px")
    );
    leftColumn.style.flex = "0 0 600px";
    leftColumn.style.width = "600px";
    leftColumn.style.flexDirection = "row";
    const modeColumn = (
      /** @type {HTMLDivElement} */
      createFlexColumn("gram-frame-mode-column", "8px")
    );
    modeColumn.style.flex = "0 0 130px";
    modeColumn.style.width = "130px";
    const guidanceColumn = (
      /** @type {HTMLDivElement} */
      createFlexColumn("gram-frame-guidance-column", "8px")
    );
    guidanceColumn.style.flex = "1";
    guidanceColumn.style.minWidth = "150px";
    const controlsColumn = (
      /** @type {HTMLDivElement} */
      createFlexColumn("gram-frame-controls-column", "1px")
    );
    controlsColumn.style.flex = "0 0 220px";
    controlsColumn.style.width = "220px";
    const cursorContainer = document.createElement("div");
    cursorContainer.className = "gram-frame-cursor-leds";
    const timeLED = createLEDDisplay("Time (mm:ss)", formatTime(0));
    cursorContainer.appendChild(timeLED);
    const freqLED = createLEDDisplay("Frequency (Hz)", "0.0");
    cursorContainer.appendChild(freqLED);
    const speedLED = createLEDDisplay("Doppler Speed (knots)", "0.0");
    speedLED.style.gridColumn = "1 / -1";
    cursorContainer.appendChild(speedLED);
    controlsColumn.appendChild(cursorContainer);
    const colorPicker = createColorPicker(instance.state);
    colorPicker.querySelector(".gram-frame-color-picker-label").textContent = "Color";
    controlsColumn.appendChild(colorPicker);
    leftColumn.appendChild(modeColumn);
    leftColumn.appendChild(guidanceColumn);
    leftColumn.appendChild(controlsColumn);
    const middleColumn = (
      /** @type {HTMLDivElement} */
      createFlexColumn("gram-frame-middle-column")
    );
    middleColumn.style.flex = "0 0 160px";
    middleColumn.style.width = "160px";
    const markersContainer = createMarkersContainer();
    middleColumn.appendChild(markersContainer);
    const rightColumn = (
      /** @type {HTMLDivElement} */
      createFlexColumn("gram-frame-right-column")
    );
    rightColumn.style.flex = "0 0 200px";
    rightColumn.style.minWidth = "200px";
    rightColumn.style.width = "200px";
    const harmonicsContainer = createHarmonicsContainer();
    rightColumn.appendChild(harmonicsContainer);
    unifiedLayoutContainer.appendChild(leftColumn);
    unifiedLayoutContainer.appendChild(middleColumn);
    unifiedLayoutContainer.appendChild(rightColumn);
    instance.unifiedLayoutContainer = unifiedLayoutContainer;
    instance.leftColumn = leftColumn;
    instance.middleColumn = middleColumn;
    instance.rightColumn = rightColumn;
    instance.modeColumn = modeColumn;
    instance.guidanceColumn = guidanceColumn;
    instance.controlsColumn = controlsColumn;
    instance.markersContainer = markersContainer;
    instance.harmonicsContainer = harmonicsContainer;
    instance.timeLED = timeLED;
    instance.freqLED = freqLED;
    instance.speedLED = speedLED;
    instance.colorPicker = colorPicker;
    return unifiedLayoutContainer;
  }
  function createMarkersContainer() {
    const markersContainer = document.createElement("div");
    markersContainer.className = "gram-frame-markers-persistent-container";
    markersContainer.style.flex = "1";
    markersContainer.style.display = "flex";
    markersContainer.style.flexDirection = "column";
    markersContainer.style.minHeight = "0";
    const markersLabel = document.createElement("h4");
    markersLabel.textContent = "Markers";
    markersLabel.style.margin = "0 0 8px 0";
    markersLabel.style.textAlign = "left";
    markersLabel.style.flexShrink = "0";
    markersContainer.appendChild(markersLabel);
    return markersContainer;
  }
  function createHarmonicsContainer() {
    const harmonicsContainer = document.createElement("div");
    harmonicsContainer.className = "gram-frame-harmonics-persistent-container";
    harmonicsContainer.style.flex = "1";
    harmonicsContainer.style.display = "flex";
    harmonicsContainer.style.flexDirection = "column";
    harmonicsContainer.style.minHeight = "0";
    const harmonicsHeader = document.createElement("div");
    harmonicsHeader.className = "gram-frame-harmonics-header";
    harmonicsHeader.style.display = "flex";
    harmonicsHeader.style.justifyContent = "space-between";
    harmonicsHeader.style.alignItems = "center";
    harmonicsHeader.style.margin = "0 0 8px 0";
    harmonicsHeader.style.flexShrink = "0";
    const harmonicsLabel = document.createElement("h4");
    harmonicsLabel.textContent = "Harmonics";
    harmonicsLabel.style.margin = "0";
    harmonicsLabel.style.textAlign = "left";
    harmonicsLabel.style.flexShrink = "0";
    const harmonicsButtonContainer = document.createElement("div");
    harmonicsButtonContainer.className = "gram-frame-harmonics-button-container";
    harmonicsButtonContainer.style.flexShrink = "0";
    harmonicsHeader.appendChild(harmonicsLabel);
    harmonicsHeader.appendChild(harmonicsButtonContainer);
    harmonicsContainer.appendChild(harmonicsHeader);
    return harmonicsContainer;
  }
  function updateUniversalCursorReadouts(instance, dataCoords) {
    if (instance.timeLED) {
      const timeValue = instance.timeLED.querySelector(".gram-frame-led-value");
      if (timeValue) {
        timeValue.textContent = formatTime(dataCoords.time);
      }
    }
    if (instance.freqLED) {
      const freqValue = instance.freqLED.querySelector(".gram-frame-led-value");
      if (freqValue) {
        freqValue.textContent = dataCoords.freq.toFixed(2);
      }
    }
  }
  function updatePersistentPanels(instance) {
    const analysisMode = (
      /** @type {any} */
      instance.modes["analysis"]
    );
    if (analysisMode && typeof analysisMode.updateMarkersTable === "function") {
      analysisMode.updateMarkersTable();
    }
    const harmonicsMode = (
      /** @type {any} */
      instance.modes["harmonics"]
    );
    if (harmonicsMode) {
      if (!harmonicsMode.instance.harmonicPanel && instance.harmonicsContainer) {
        const existingPanel = instance.harmonicsContainer.querySelector(".gram-frame-harmonic-panel");
        if (existingPanel) {
          harmonicsMode.instance.harmonicPanel = existingPanel;
        }
      }
      if (typeof harmonicsMode.updateHarmonicPanel === "function") {
        harmonicsMode.updateHarmonicPanel();
      }
    }
  }
  function extractConfigData(instance) {
    if (!instance.configTable) {
      console.warn("GramFrame: No config table provided for configuration extraction");
      return;
    }
    try {
      const imgElement = instance.configTable.querySelector("img");
      if (!imgElement) {
        throw new Error("No image element found in config table");
      }
      if (!imgElement.src) {
        throw new Error("Image element has no src attribute");
      }
      instance.state.imageDetails.url = imgElement.src;
    } catch (error) {
      console.error("GramFrame: Error setting up image:", error instanceof Error ? error.message : String(error));
    }
    try {
      const rows = instance.configTable.querySelectorAll("tr");
      let timeStart = null;
      let timeEnd = null;
      let freqStart = null;
      let freqEnd = null;
      rows.forEach((row, index) => {
        var _a, _b;
        try {
          const cells = row.querySelectorAll("td");
          if (cells.length === 2) {
            const param = ((_a = cells[0].textContent) == null ? void 0 : _a.trim()) || "";
            const valueText = ((_b = cells[1].textContent) == null ? void 0 : _b.trim()) || "0";
            const value = parseFloat(valueText);
            if (isNaN(value)) {
              console.warn(`GramFrame: Invalid numeric value in row ${index + 1}: value="${valueText}"`);
              return;
            }
            if (param === "time-start") {
              timeStart = value;
            } else if (param === "time-end") {
              timeEnd = value;
            } else if (param === "freq-start") {
              freqStart = value;
            } else if (param === "freq-end") {
              freqEnd = value;
            }
          }
        } catch (error) {
          console.warn(`GramFrame: Error parsing row ${index + 1}:`, error instanceof Error ? error.message : String(error));
        }
      });
      if (timeStart === null || timeEnd === null) {
        throw new Error("Missing required time configuration: both time-start and time-end must be present with valid numeric values");
      }
      if (timeStart >= timeEnd) {
        throw new Error(`Invalid time range: start (${timeStart}) must be less than end (${timeEnd})`);
      }
      instance.state.config.timeMin = timeStart;
      instance.state.config.timeMax = timeEnd;
      if (freqStart === null || freqEnd === null) {
        throw new Error("Missing required frequency configuration: both freq-start and freq-end must be present with valid numeric values");
      }
      if (freqStart >= freqEnd) {
        throw new Error(`Invalid frequency range: start (${freqStart}) must be less than end (${freqEnd})`);
      }
      instance.state.config.freqMin = freqStart;
      instance.state.config.freqMax = freqEnd;
    } catch (error) {
      throw error;
    }
  }
  class FeatureRenderer {
    /**
     * Create a new FeatureRenderer
     * @param {GramFrame} gramFrameInstance - GramFrame instance
     */
    constructor(gramFrameInstance) {
      this.instance = gramFrameInstance;
    }
    /**
     * Render all persistent features across all modes
     * Delegates to each mode's specialized rendering methods
     */
    renderAllPersistentFeatures() {
      if (!this.instance.cursorGroup) {
        return;
      }
      this.instance.cursorGroup.innerHTML = "";
      if (this.hasAnalysisFeatures() && this.instance.modes.analysis) {
        this.instance.modes.analysis.renderPersistentFeatures();
      }
      if (this.hasHarmonicFeatures() && this.instance.modes.harmonics) {
        this.instance.modes.harmonics.renderPersistentFeatures();
      }
      if (this.hasDopplerFeatures() && this.instance.modes.doppler) {
        this.instance.modes.doppler.renderPersistentFeatures();
      }
    }
    /**
     * Check if analysis features exist
     * @returns {boolean}
     */
    hasAnalysisFeatures() {
      return this.instance.state.analysis && this.instance.state.analysis.markers && this.instance.state.analysis.markers.length > 0;
    }
    /**
     * Check if harmonic features exist
     * @returns {boolean}
     */
    hasHarmonicFeatures() {
      return this.instance.state.harmonics && this.instance.state.harmonics.harmonicSets && this.instance.state.harmonics.harmonicSets.length > 0;
    }
    /**
     * Check if doppler features exist
     * @returns {boolean}
     */
    hasDopplerFeatures() {
      return this.instance.state.doppler && (!!this.instance.state.doppler.fPlus || !!this.instance.state.doppler.fMinus || !!this.instance.state.doppler.fZero);
    }
    /**
     * Render current mode's cursor/temporary indicators
     * Delegates to the current active mode
     */
    renderCurrentModeCursor() {
      if (!this.instance.cursorGroup || !this.instance.currentMode) {
        return;
      }
      if (typeof this.instance.currentMode.renderCursor === "function") {
        this.instance.currentMode.renderCursor();
      }
    }
  }
  function initializeDOMProperties(instance) {
    instance.container = null;
    instance.readoutPanel = null;
    instance.modeCell = null;
    instance.mainCell = null;
    instance.modeLED = null;
    instance.rateLED = null;
    instance.colorPicker = null;
    instance.svg = null;
    instance.cursorGroup = null;
    instance.axesGroup = null;
    instance.imageClipRect = null;
    instance.cursorClipRect = null;
    instance.leftColumn = null;
    instance.middleColumn = null;
    instance.rightColumn = null;
    instance.modeColumn = null;
    instance.guidanceColumn = null;
    instance.controlsColumn = null;
    instance.unifiedLayoutContainer = null;
    instance.timeLED = null;
    instance.freqLED = null;
    instance.speedLED = null;
    instance.markersContainer = null;
    instance.harmonicsContainer = null;
    instance.spectrogramImage = null;
    instance.modesContainer = null;
    instance.modeButtons = null;
    instance.commandButtons = null;
    instance.guidancePanel = null;
    instance.modes = null;
    instance.currentMode = null;
    instance.featureRenderer = null;
  }
  function setupSpectrogramComponents(instance) {
    extractConfigData(instance);
    setupComponentTable(instance, instance.configTable);
  }
  function screenToSVGCoordinates(screenX, screenY, svg, _imageDetails) {
    const svgRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
      const scaleX = viewBox.width / svgRect.width;
      const scaleY = viewBox.height / svgRect.height;
      return {
        x: screenX * scaleX + viewBox.x,
        y: screenY * scaleY + viewBox.y
      };
    }
    return { x: screenX, y: screenY };
  }
  function imageToDataCoordinates(imageX, imageY, config, imageDetails, rate) {
    const { freqMin, freqMax, timeMin, timeMax } = config;
    const { naturalWidth, naturalHeight } = imageDetails;
    const boundedX = Math.max(0, Math.min(imageX, naturalWidth));
    const boundedY = Math.max(0, Math.min(imageY, naturalHeight));
    const rawFreq = freqMin + boundedX / naturalWidth * (freqMax - freqMin);
    const time = timeMax - boundedY / naturalHeight * (timeMax - timeMin);
    const freq = rawFreq / rate;
    return { freq, time };
  }
  let currentFocusedInstance = null;
  let registeredInstances = /* @__PURE__ */ new Set();
  function registerInstance(instance) {
    registeredInstances.add(instance);
  }
  function unregisterInstance(instance) {
    registeredInstances.delete(instance);
    if (currentFocusedInstance === instance) {
      if (registeredInstances.size > 0) {
        const firstInstance = registeredInstances.values().next().value;
        setFocusedInstance(firstInstance);
      } else {
        currentFocusedInstance = null;
      }
    }
  }
  function setFocusedInstance(instance) {
    if (currentFocusedInstance && currentFocusedInstance !== instance) {
      removeFocusIndicator(currentFocusedInstance);
    }
    currentFocusedInstance = instance;
    if (instance) {
      addFocusIndicator(instance);
    }
  }
  function getFocusedInstance() {
    return currentFocusedInstance;
  }
  function addFocusIndicator(instance) {
    if (instance.container) {
      instance.container.classList.add("gram-frame-focused");
    }
  }
  function removeFocusIndicator(instance) {
    if (instance.container) {
      instance.container.classList.remove("gram-frame-focused");
    }
  }
  function focusNextInstance() {
    if (registeredInstances.size <= 1) return;
    const instancesArray = Array.from(registeredInstances);
    const currentIndex = instancesArray.indexOf(currentFocusedInstance);
    const nextIndex = (currentIndex + 1) % instancesArray.length;
    setFocusedInstance(instancesArray[nextIndex]);
  }
  function focusPreviousInstance() {
    if (registeredInstances.size <= 1) return;
    const instancesArray = Array.from(registeredInstances);
    const currentIndex = instancesArray.indexOf(currentFocusedInstance);
    const prevIndex = currentIndex === 0 ? instancesArray.length - 1 : currentIndex - 1;
    setFocusedInstance(instancesArray[prevIndex]);
  }
  function screenToDataWithZoom(instance, event) {
    const svgRect = instance.svg.getBoundingClientRect();
    const screenX = event.clientX - svgRect.left;
    const screenY = event.clientY - svgRect.top;
    const svgCoords = screenToSVGCoordinates(screenX, screenY, instance.svg, instance.state.imageDetails);
    const margins = instance.state.margins;
    const zoomLevel = instance.state.zoom.level;
    const { naturalWidth, naturalHeight } = instance.state.imageDetails;
    let imageLeft = margins.left;
    let imageTop = margins.top;
    let imageWidth = naturalWidth;
    let imageHeight = naturalHeight;
    if (zoomLevel !== 1 && instance.spectrogramImage) {
      imageLeft = parseFloat(instance.spectrogramImage.getAttribute("x") || String(margins.left));
      imageTop = parseFloat(instance.spectrogramImage.getAttribute("y") || String(margins.top));
      imageWidth = parseFloat(instance.spectrogramImage.getAttribute("width") || String(naturalWidth));
      imageHeight = parseFloat(instance.spectrogramImage.getAttribute("height") || String(naturalHeight));
    }
    const imageX = (svgCoords.x - imageLeft) * (naturalWidth / imageWidth);
    const imageY = (svgCoords.y - imageTop) * (naturalHeight / imageHeight);
    const withinBounds = svgCoords.x >= imageLeft && svgCoords.x <= imageLeft + imageWidth && svgCoords.y >= imageTop && svgCoords.y <= imageTop + imageHeight && imageX >= 0 && imageX <= naturalWidth && imageY >= 0 && imageY <= naturalHeight;
    if (!withinBounds) {
      return null;
    }
    const dataCoords = imageToDataCoordinates(
      imageX,
      imageY,
      instance.state.config,
      instance.state.imageDetails,
      instance.state.rate
    );
    return { svgCoords, imageX, imageY, dataCoords };
  }
  function setupEventListeners(instance) {
    if (instance.svg) {
      instance.svg.addEventListener("mousemove", (event) => {
        handleMouseMove(instance, event);
      });
      instance.svg.addEventListener("mousedown", (event) => {
        handleMouseDown(instance, event);
      });
      instance.svg.addEventListener("mouseup", (event) => {
        handleMouseUp(instance, event);
      });
      instance.svg.addEventListener("mouseleave", () => {
        handleMouseLeave(instance);
      });
      instance.svg.addEventListener("contextmenu", (event) => {
        handleContextMenu(instance, event);
      });
    }
    instance._boundHandleResize = () => {
      if (instance._handleResize) {
        instance._handleResize();
      }
    };
    Object.keys(instance.modeButtons || {}).forEach((mode) => {
      const button = instance.modeButtons[mode];
      if (button) {
        button.addEventListener("click", () => {
          instance._switchMode(
            /** @type {ModeType} */
            mode
          );
        });
      }
    });
    window.addEventListener("resize", instance._boundHandleResize);
  }
  function setupResizeObserver(instance) {
    if (typeof ResizeObserver !== "undefined") {
      instance.resizeObserver = new ResizeObserver((_entries) => {
        if (instance._handleResize) {
          instance._handleResize();
        }
      });
      instance.resizeObserver.observe(instance.container);
    }
  }
  function handleMouseMove(instance, event) {
    const result = screenToDataWithZoom(instance, event);
    if (result) {
      const { svgCoords, dataCoords } = result;
      instance.state.cursorPosition = {
        x: event.clientX - instance.svg.getBoundingClientRect().left,
        y: event.clientY - instance.svg.getBoundingClientRect().top,
        svgX: svgCoords.x,
        svgY: svgCoords.y,
        imageX: svgCoords.x,
        // Simplified - would need proper image coordinate calculation
        imageY: svgCoords.y,
        // Simplified - would need proper image coordinate calculation
        freq: dataCoords.freq,
        time: dataCoords.time
      };
      updateUniversalCursorReadouts(instance, dataCoords);
      if (instance.currentMode && typeof instance.currentMode.handleMouseMove === "function") {
        instance.currentMode.handleMouseMove(event, dataCoords);
      }
    } else {
      instance.state.cursorPosition = null;
    }
    updateCursorIndicators(instance);
    notifyStateListeners(instance.state, instance.stateListeners);
  }
  function handleMouseDown(instance, event) {
    setFocusedInstance(instance);
    const result = screenToDataWithZoom(instance, event);
    if (result) {
      const { dataCoords } = result;
      if (instance.currentMode && typeof instance.currentMode.handleMouseDown === "function") {
        instance.currentMode.handleMouseDown(event, dataCoords);
      }
    }
  }
  function handleMouseUp(instance, event) {
    const result = screenToDataWithZoom(instance, event);
    if (result) {
      const { dataCoords } = result;
      if (instance.currentMode && typeof instance.currentMode.handleMouseUp === "function") {
        instance.currentMode.handleMouseUp(event, dataCoords);
      }
    }
  }
  function handleMouseLeave(instance) {
    instance.state.cursorPosition = null;
    updateCursorIndicators(instance);
    if (instance.currentMode && typeof instance.currentMode.handleMouseLeave === "function") {
      instance.currentMode.handleMouseLeave();
    }
    notifyStateListeners(instance.state, instance.stateListeners);
  }
  function handleContextMenu(instance, event) {
    const result = screenToDataWithZoom(instance, event);
    if (result) {
      const { dataCoords } = result;
      if (instance.currentMode && typeof instance.currentMode.handleContextMenu === "function") {
        instance.currentMode.handleContextMenu(event, dataCoords);
      }
    }
  }
  function cleanupEventListeners(instance) {
    if (instance.svg) ;
    if (instance._boundHandleResize) {
      window.removeEventListener("resize", instance._boundHandleResize);
    }
    if (instance.resizeObserver) {
      instance.resizeObserver.disconnect();
      instance.resizeObserver = null;
    }
  }
  const scriptRel = "modulepreload";
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (false) {
      document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector(
        "meta[property=csp-nonce]"
      );
      const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
      promise = Promise.allSettled(
        deps.map((dep) => {
          dep = assetsURL(dep);
          if (dep in seen) return;
          seen[dep] = true;
          const isCss = dep.endsWith(".css");
          const cssSelector = isCss ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
            return;
          }
          const link = document.createElement("link");
          link.rel = isCss ? "stylesheet" : scriptRel;
          if (!isCss) {
            link.as = "script";
          }
          link.crossOrigin = "";
          link.href = dep;
          if (cspNonce) {
            link.setAttribute("nonce", cspNonce);
          }
          document.head.appendChild(link);
          if (isCss) {
            return new Promise((res, rej) => {
              link.addEventListener("load", res);
              link.addEventListener(
                "error",
                () => rej(new Error(`Unable to preload CSS for ${dep}`))
              );
            });
          }
        })
      );
    }
    function handlePreloadError(err) {
      const e = new Event("vite:preloadError", {
        cancelable: true
      });
      e.payload = err;
      window.dispatchEvent(e);
      if (!e.defaultPrevented) {
        throw err;
      }
    }
    return promise.then((res) => {
      for (const item of res || []) {
        if (item.status !== "rejected") continue;
        handlePreloadError(item.reason);
      }
      return baseModule().catch(handlePreloadError);
    });
  };
  const MOVEMENT_INCREMENTS = {
    normal: 1,
    // Arrow keys alone: 1-pixel increments
    fast: 5
    // Shift + Arrow keys: 5-pixel increments
  };
  let globalKeyboardHandler = null;
  let keyboardHandlerInitialized = false;
  function initializeKeyboardControl(instance) {
    registerInstance(instance);
    if (!keyboardHandlerInitialized) {
      globalKeyboardHandler = (event) => handleGlobalKeyboardEvent(event);
      document.addEventListener("keydown", globalKeyboardHandler);
      keyboardHandlerInitialized = true;
    }
  }
  function cleanupKeyboardControl(instance) {
    unregisterInstance(instance);
  }
  function handleGlobalKeyboardEvent(event) {
    if (event.key === "Tab") {
      if (event.shiftKey) {
        focusPreviousInstance();
      } else {
        focusNextInstance();
      }
      event.preventDefault();
      return;
    }
    const focusedInstance = getFocusedInstance();
    if (!focusedInstance) {
      return;
    }
    if (!isArrowKey(event.key)) {
      return;
    }
    const selection = focusedInstance.state.selection;
    if (!selection || !selection.selectedType || !selection.selectedId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const baseIncrement = event.shiftKey ? MOVEMENT_INCREMENTS.fast : MOVEMENT_INCREMENTS.normal;
    const zoomLevel = focusedInstance.state.zoom.level || 1;
    const increment = baseIncrement / zoomLevel;
    const movement = calculateMovementFromKey(event.key, increment);
    if (selection.selectedType === "marker") {
      moveSelectedMarker(focusedInstance, selection.selectedId, movement);
    } else if (selection.selectedType === "harmonicSet") {
      moveSelectedHarmonicSet(focusedInstance, selection.selectedId, movement);
    }
  }
  function isArrowKey(key) {
    return ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key);
  }
  function calculateMovementFromKey(key, increment) {
    switch (key) {
      case "ArrowLeft":
        return { dx: -increment, dy: 0 };
      case "ArrowRight":
        return { dx: increment, dy: 0 };
      case "ArrowUp":
        return { dx: 0, dy: -increment };
      case "ArrowDown":
        return { dx: 0, dy: increment };
      default:
        return { dx: 0, dy: 0 };
    }
  }
  function moveSelectedMarker(instance, markerId, movement) {
    if (!instance.state.analysis || !instance.state.analysis.markers) {
      return;
    }
    const marker = instance.state.analysis.markers.find((m) => m.id === markerId);
    if (!marker) {
      return;
    }
    const currentSVG = dataToSVGCoordinates(
      marker.freq,
      marker.time,
      instance.state.config,
      instance.state.imageDetails,
      instance.state.rate,
      instance.state.margins
    );
    const newSVG = {
      x: currentSVG.x + movement.dx,
      y: currentSVG.y + movement.dy
    };
    const newData = svgToDataCoordinates(
      newSVG.x,
      newSVG.y,
      instance.state.config,
      instance.state.imageDetails,
      instance.state.rate,
      instance.state.margins
    );
    marker.freq = newData.freq;
    marker.time = newData.time;
    if (instance.featureRenderer) {
      instance.featureRenderer.renderAllPersistentFeatures();
    }
    if (instance.currentMode && instance.currentMode.updateMarkersTable) {
      instance.currentMode.updateMarkersTable();
    }
    notifyStateListeners(instance.state, instance.stateListeners);
  }
  function moveSelectedHarmonicSet(instance, harmonicSetId, movement) {
    if (!instance.state.harmonics || !instance.state.harmonics.harmonicSets) {
      return;
    }
    const harmonicSet = instance.state.harmonics.harmonicSets.find((h) => h.id === harmonicSetId);
    if (!harmonicSet) {
      return;
    }
    const updates = {};
    if (movement.dx !== 0) {
      const { naturalWidth } = instance.state.imageDetails;
      const { freqMin, freqMax } = instance.state.config;
      const freqRange = (freqMax - freqMin) / instance.state.rate;
      const pixelToFreqRatio = freqRange / naturalWidth;
      const spacingChange = movement.dx * pixelToFreqRatio;
      updates.spacing = Math.max(1, harmonicSet.spacing + spacingChange);
    }
    if (movement.dy !== 0) {
      const { naturalHeight } = instance.state.imageDetails;
      const { timeMin, timeMax } = instance.state.config;
      const margins = instance.state.margins;
      const normalizedTime = 1 - (harmonicSet.anchorTime - timeMin) / (timeMax - timeMin);
      const currentY = margins.top + normalizedTime * naturalHeight;
      const newY = currentY + movement.dy;
      const newNormalizedTime = (newY - margins.top) / naturalHeight;
      updates.anchorTime = timeMax - newNormalizedTime * (timeMax - timeMin);
      updates.anchorTime = Math.max(timeMin, Math.min(timeMax, updates.anchorTime));
    }
    if (Object.keys(updates).length > 0) {
      const setIndex = instance.state.harmonics.harmonicSets.findIndex((set) => set.id === harmonicSetId);
      if (setIndex !== -1) {
        Object.assign(instance.state.harmonics.harmonicSets[setIndex], updates);
        if (instance.harmonicPanel) {
          __vitePreload(async () => {
            const { updateHarmonicPanelContent: updateHarmonicPanelContent2 } = await Promise.resolve().then(() => HarmonicPanel);
            return { updateHarmonicPanelContent: updateHarmonicPanelContent2 };
          }, false ? __VITE_PRELOAD__ : void 0).then(({ updateHarmonicPanelContent: updateHarmonicPanelContent2 }) => {
            updateHarmonicPanelContent2(instance.harmonicPanel, instance);
          }).catch(() => {
          });
        }
        if (instance.featureRenderer) {
          instance.featureRenderer.renderAllPersistentFeatures();
        }
        notifyStateListeners(instance.state, instance.stateListeners);
      }
    }
  }
  function dataToSVGCoordinates(freq, time, config, imageDetails, rate, margins) {
    const { freqMin, freqMax, timeMin, timeMax } = config;
    const { naturalWidth, naturalHeight } = imageDetails;
    const rawFreq = freq * rate;
    const normalizedX = (rawFreq - freqMin) / (freqMax - freqMin);
    const normalizedY = 1 - (time - timeMin) / (timeMax - timeMin);
    return {
      x: margins.left + normalizedX * naturalWidth,
      y: margins.top + normalizedY * naturalHeight
    };
  }
  function svgToDataCoordinates(svgX, svgY, config, imageDetails, rate, margins) {
    const { freqMin, freqMax, timeMin, timeMax } = config;
    const { naturalWidth, naturalHeight } = imageDetails;
    const imageX = svgX - margins.left;
    const imageY = svgY - margins.top;
    const boundedX = Math.max(0, Math.min(imageX, naturalWidth));
    const boundedY = Math.max(0, Math.min(imageY, naturalHeight));
    const rawFreq = freqMin + boundedX / naturalWidth * (freqMax - freqMin);
    const time = timeMax - boundedY / naturalHeight * (timeMax - timeMin);
    const freq = rawFreq / rate;
    return { freq, time };
  }
  function setSelection(instance, type, id, index) {
    setFocusedInstance(instance);
    instance.state.selection.selectedType = type;
    instance.state.selection.selectedId = id;
    instance.state.selection.selectedIndex = index;
    updateSelectionVisuals(instance);
    notifyStateListeners(instance.state, instance.stateListeners);
  }
  function clearSelection(instance) {
    instance.state.selection.selectedType = null;
    instance.state.selection.selectedId = null;
    instance.state.selection.selectedIndex = null;
    updateSelectionVisuals(instance);
    notifyStateListeners(instance.state, instance.stateListeners);
  }
  function removeHarmonicSet(instance, id) {
    const setIndex = instance.state.harmonics.harmonicSets.findIndex((set) => set.id === id);
    if (setIndex !== -1) {
      if (instance.state.selection.selectedType === "harmonicSet" && instance.state.selection.selectedId === id) {
        clearSelection(instance);
      }
      instance.state.harmonics.harmonicSets.splice(setIndex, 1);
      if (instance.harmonicPanel) {
        updateHarmonicPanelContent(instance.harmonicPanel, instance);
      }
      if (instance.featureRenderer) {
        instance.featureRenderer.renderAllPersistentFeatures();
      }
      notifyStateListeners(instance.state, instance.stateListeners);
    }
  }
  function updateSelectionVisuals(instance) {
    if (instance.container) {
      const existingHighlights = instance.container.querySelectorAll(".gram-frame-selected-row");
      existingHighlights.forEach((el) => {
        el.classList.remove("gram-frame-selected-row");
      });
    }
    const selection = instance.state.selection;
    if (selection.selectedType && selection.selectedId) {
      const container = instance.container || document;
      if (selection.selectedType === "marker") {
        const selector = `tr[data-marker-id="${selection.selectedId}"]`;
        const row = container.querySelector(selector);
        if (row) {
          row.classList.add("gram-frame-selected-row");
        }
      } else if (selection.selectedType === "harmonicSet") {
        const selector = `tr[data-harmonic-id="${selection.selectedId}"]`;
        const row = container.querySelector(selector);
        if (row) {
          row.classList.add("gram-frame-selected-row");
        }
      }
    }
  }
  function setupAllEventListeners(instance) {
    setupEventListeners(instance);
    setupResizeObserver(instance);
    initializeKeyboardControl(instance);
    instance.setSelection = (type, id, index) => setSelection(instance, type, id, index);
    instance.clearSelection = () => clearSelection(instance);
    instance.updateSelectionVisuals = () => updateSelectionVisuals(instance);
    instance.removeHarmonicSet = (id) => removeHarmonicSet(instance, id);
  }
  function setupStateListeners(instance) {
    getGlobalStateListeners().forEach((listener) => {
      if (!instance.stateListeners.includes(listener)) {
        instance.stateListeners.push(listener);
      }
    });
  }
  class ModeFactory {
    /**
     * Create a mode instance based on mode name
     * @param {ModeType} modeName - Name of the mode
     * @param {GramFrame} instance - GramFrame instance
     * @returns {BaseMode} Mode instance
     * @throws {Error} If mode name is invalid or mode class is not available
     */
    static createMode(modeName, instance) {
      var _a, _b;
      try {
        switch (modeName) {
          case "analysis":
            return new AnalysisMode(instance);
          case "harmonics":
            return new HarmonicsMode(instance);
          case "doppler":
            return new DopplerMode(instance);
          case "pan":
            return new PanMode(instance);
          default:
            throw new Error(`Invalid mode name: ${modeName}. Valid modes are: analysis, harmonics, doppler, pan`);
        }
      } catch (error) {
        console.error(`CRITICAL ERROR: Failed to create mode "${modeName}":`, error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : void 0,
          modeName,
          instanceType: (_a = instance == null ? void 0 : instance.constructor) == null ? void 0 : _a.name,
          stateExists: !!(instance == null ? void 0 : instance.state)
        });
        if (typeof window !== "undefined" && ((_b = window.location) == null ? void 0 : _b.hostname) === "localhost") {
          throw new Error(`Mode creation failed for "${modeName}": ${error instanceof Error ? error.message : String(error)}`);
        }
        console.warn(`Falling back to BaseMode for "${modeName}" due to error`);
        return new BaseMode(instance);
      }
    }
    /**
     * Get list of available mode names
     * @returns {ModeType[]} Array of mode names
     */
    static getAvailableModes() {
      return ["analysis", "harmonics", "doppler", "pan"];
    }
    /**
     * Validate if a mode name is supported
     * @param {ModeType} modeName - Mode name to validate
     * @returns {boolean} True if mode is supported
     */
    static isValidMode(modeName) {
      return this.getAvailableModes().includes(modeName);
    }
  }
  function renderSecureGuidance(container, content) {
    container.replaceChildren();
    if (content.title) {
      const title = document.createElement("h4");
      title.textContent = content.title;
      container.appendChild(title);
    }
    if (content.items && Array.isArray(content.items)) {
      content.items.forEach((item) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = `• ${item}`;
        container.appendChild(paragraph);
      });
    }
  }
  function updateGuidancePanel(guidancePanel, content) {
    if (!guidancePanel) {
      console.warn("Guidance panel element not found");
      return;
    }
    if (!content) {
      console.warn("No guidance content provided");
      return;
    }
    try {
      renderSecureGuidance(guidancePanel, content);
    } catch (error) {
      console.error("Error updating guidance panel:", error);
      guidancePanel.replaceChildren();
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Error loading guidance content";
      guidancePanel.appendChild(errorMsg);
    }
  }
  function initializeModeInfrastructure(instance) {
    instance.modes = {};
    instance.currentMode = null;
    instance.featureRenderer = new FeatureRenderer(instance);
    const availableModes = ModeFactory.getAvailableModes();
    availableModes.forEach((modeName) => {
      instance.modes[modeName] = ModeFactory.createMode(modeName, instance);
    });
  }
  function setupModeUI(instance) {
    instance.modes["analysis"].createUI(instance.markersContainer);
    instance.modes["harmonics"].createUI(instance.harmonicsContainer);
    instance.currentMode = instance.modes["analysis"];
    if (instance.guidancePanel) {
      const guidanceContent = instance.currentMode.getGuidanceText();
      updateGuidancePanel(instance.guidancePanel, guidanceContent);
    }
  }
  function createUnifiedLayoutStructure(instance) {
    createUnifiedLayout(instance);
    instance.readoutPanel.appendChild(instance.unifiedLayoutContainer);
    instance.modeCell.appendChild(instance.readoutPanel);
  }
  function setupPersistentContainers(instance) {
    const tempContainer = document.createElement("div");
    const modeUI = createModeSwitchingUI(tempContainer, instance.state, (mode) => instance._switchMode(mode));
    instance.modesContainer = modeUI.modesContainer;
    instance.modeButtons = modeUI.modeButtons;
    instance.commandButtons = modeUI.commandButtons;
    instance.guidancePanel = modeUI.guidancePanel;
    instance.modeColumn.appendChild(instance.modesContainer);
    instance.guidanceColumn.appendChild(instance.guidancePanel);
  }
  function updateModeUIWithCommands(instance) {
    instance.modeColumn.removeChild(instance.modesContainer);
    instance.guidanceColumn.removeChild(instance.guidancePanel);
    const tempContainer2 = document.createElement("div");
    const modeUIWithButtons = createModeSwitchingUI(tempContainer2, instance.state, (mode) => instance._switchMode(mode), instance.modes);
    instance.modesContainer = modeUIWithButtons.modesContainer;
    instance.modeButtons = modeUIWithButtons.modeButtons;
    instance.commandButtons = modeUIWithButtons.commandButtons;
    instance.guidancePanel = modeUIWithButtons.guidancePanel;
    instance.modeColumn.appendChild(instance.modesContainer);
    instance.guidanceColumn.appendChild(instance.guidancePanel);
    if (instance.currentMode && instance.guidancePanel) {
      const guidanceContent = instance.currentMode.getGuidanceText();
      updateGuidancePanel(instance.guidancePanel, guidanceContent);
    }
  }
  function setupSpectrogramIfAvailable(instance) {
    if (instance.state.imageDetails.url) {
      setupSpectrogramImage(instance, instance.state.imageDetails.url);
    }
  }
  function zoomIn(instance) {
    const currentLevel = instance.state.zoom.level;
    const newLevel = Math.min(currentLevel * 1.5, 10);
    setZoom(instance, newLevel, instance.state.zoom.centerX, instance.state.zoom.centerY);
  }
  function zoomOut(instance) {
    const currentLevel = instance.state.zoom.level;
    const newLevel = Math.max(currentLevel / 1.5, 1);
    setZoom(instance, newLevel, instance.state.zoom.centerX, instance.state.zoom.centerY);
  }
  function zoomReset(instance) {
    setZoom(instance, 1, 0.5, 0.5);
  }
  function setZoom(instance, level, centerX, centerY) {
    instance.state.zoom.level = level;
    instance.state.zoom.centerX = centerX;
    instance.state.zoom.centerY = centerY;
    if (instance.svg) {
      applyZoomTransform(instance);
    }
    updateZoomControlStates(instance);
    notifyStateListeners(instance.state, instance.stateListeners);
  }
  function updateZoomControlStates(instance) {
    if (instance.commandButtons && instance.modes) {
      updateCommandButtonStates(instance.commandButtons, instance.modes);
    }
    if (instance.modeButtons && instance.modes) {
      updateModeButtonStates(instance.modeButtons, instance.modes);
      if (instance.state.mode === "pan" && instance.modes.pan && !instance.modes.pan.isEnabled() && instance.state.previousMode) {
        instance._switchMode(instance.state.previousMode);
      }
    }
  }
  function handleResize(instance) {
    if (instance.svg) {
      updateSVGLayout(instance);
      renderAxes(instance);
    }
  }
  function updateAxes(instance) {
    if (instance.axesGroup) {
      renderAxes(instance);
    }
  }
  function createGramFrameAPI(GramFrame2) {
    return {
      /**
       * Initialize all config tables on the page
       * @returns {GramFrame[]} Array of GramFrame instances
       */
      init() {
        return this.detectAndReplaceConfigTables(document);
      },
      /**
       * Detect and replace all config tables with interactive GramFrame components
       * @param {Document|HTMLElement} [container=document] - Container to search within
       * @returns {GramFrame[]} Array of GramFrame instances created
       */
      detectAndReplaceConfigTables(container = document) {
        const configTables = container.querySelectorAll("table.gram-config");
        const instances = [];
        configTables.forEach((table, index) => {
          try {
            const instanceId = `gramframe-${Date.now()}-${index}`;
            const instance = new GramFrame2(
              /** @type {HTMLTableElement} */
              table
            );
            instance.instanceId = instanceId;
            instance.state.instanceId = instanceId;
            instances.push(instance);
          } catch (error) {
            const errorMsg = `Failed to initialize GramFrame for table ${index + 1}: ${error instanceof Error ? error.message : String(error)}`;
            console.error("GramFrame Error:", errorMsg, error);
            this._addErrorIndicator(
              /** @type {HTMLTableElement} */
              table,
              errorMsg
            );
          }
        });
        this._instances = instances;
        return instances;
      },
      /**
       * Add a state listener that will be called whenever the component state changes
       * @param {Function} callback - Function to be called with the current state
       * @returns {Function} - Returns the callback function for chaining
       * @example
       * // Basic usage
       * GramFrame.addStateListener(state => {
       *   // State updated: state
       * })
       * 
       * // With error handling
       * GramFrame.addStateListener(state => {
       *   try {
       *     // Process state
       *     updateUI(state.cursorPosition)
       *   } catch (err) {
       *     console.error('Error processing state:', err)
       *   }
       * })
       */
      /**
       * Add a state listener that will be called whenever the component state changes
       * @param {StateListener} callback - Function to be called with the current state
       * @returns {StateListener} Returns the callback function for chaining
       */
      addStateListener(callback) {
        if (typeof callback !== "function") {
          throw new Error("State listener must be a function");
        }
        addGlobalStateListener(callback);
        const instances = document.querySelectorAll(".gram-frame-container");
        instances.forEach((container) => {
          const instance = container.__gramFrameInstance;
          if (instance && !instance.stateListeners.includes(callback)) {
            instance.stateListeners.push(callback);
            if (instance.state) {
              try {
                const stateCopy = JSON.parse(JSON.stringify(instance.state));
                callback(stateCopy);
              } catch (error) {
                console.error("Error calling state listener with initial state:", error);
              }
            }
          }
        });
        return callback;
      },
      /**
       * Remove a previously added state listener
       * @param {Function} callback - The callback function to remove
       * @returns {boolean} - Returns true if the listener was found and removed, false otherwise
       * @example
       * // Add a listener and store the reference
       * const myListener = GramFrame.addStateListener(state => {
       *   // State updated: state
       * })
       * 
       * // Later, remove the listener
       * GramFrame.removeStateListener(myListener)
       */
      /**
       * Remove a previously added state listener
       * @param {StateListener} callback - The callback function to remove
       * @returns {boolean} Returns true if the listener was found and removed, false otherwise
       */
      removeStateListener(callback) {
        if (typeof callback !== "function") {
          throw new Error("Callback must be a function");
        }
        let removed = false;
        const wasRemoved = removeGlobalStateListener(callback);
        if (wasRemoved) {
          removed = true;
        }
        const instances = document.querySelectorAll(".gram-frame-container");
        instances.forEach((container) => {
          const instance = container.__gramFrameInstance;
          if (instance) {
            const index = instance.stateListeners.indexOf(callback);
            if (index !== -1) {
              instance.stateListeners.splice(index, 1);
              removed = true;
            }
          }
        });
        return removed;
      },
      // Debug and visualization API methods removed - implement when needed
      /**
       * Force update of the component state
       * @__test__ This method is only used for testing purposes
       */
      __test__forceUpdate() {
        const instances = document.querySelectorAll(".gram-frame-container");
        instances.forEach((container) => {
          const instance = container.__gramFrameInstance;
          if (instance) {
            notifyStateListeners(instance.state, instance.stateListeners);
          }
        });
      },
      /**
       * Get all active GramFrame instances
       * @__test__ This method is only used for testing purposes
       * @returns {GramFrame[]} Array of active instances
       */
      __test__getInstances() {
        return this._instances || [];
      },
      /**
       * Get instance by ID
       * @__test__ This method is only used for testing purposes
       * @param {string} instanceId - Instance ID to find
       * @returns {GramFrame|null} Instance or null if not found
       */
      __test__getInstance(instanceId) {
        if (!this._instances) return null;
        return this._instances.find((instance) => instance.instanceId === instanceId) || null;
      },
      /**
       * Add error indicator to a table that failed to initialize
       * @private
       * @param {HTMLTableElement} table - Table that failed
       * @param {string} errorMsg - Error message to display
       */
      _addErrorIndicator(table, errorMsg) {
        try {
          const errorDiv = document.createElement("div");
          errorDiv.className = "gramframe-error-indicator";
          errorDiv.style.cssText = `
          position: relative;
          background-color: #ffe6e6;
          border: 2px solid #ff6b6b;
          border-radius: 4px;
          padding: 10px;
          margin: 10px 0;
          color: #d32f2f;
          font-family: monospace;
          font-size: 14px;
        `;
          const strongElement = document.createElement("strong");
          strongElement.textContent = "GramFrame Initialization Error:";
          const errorText = document.createElement("div");
          errorText.textContent = errorMsg;
          const smallElement = document.createElement("small");
          smallElement.textContent = "Check the browser console for detailed error information.";
          errorDiv.appendChild(strongElement);
          errorDiv.appendChild(document.createElement("br"));
          errorDiv.appendChild(errorText);
          errorDiv.appendChild(document.createElement("br"));
          errorDiv.appendChild(smallElement);
          if (table.parentNode) {
            table.parentNode.insertBefore(errorDiv, table.nextSibling);
          }
        } catch (e) {
          console.error("GramFrame: Failed to add error indicator:", e);
        }
      }
    };
  }
  class GramFrame {
    /**
     * Creates a new GramFrame instance
     * @param {HTMLTableElement} configTable - Configuration table element to replace
     */
    constructor(configTable) {
      // Core properties
      __publicField(this, "state");
      __publicField(this, "configTable");
      __publicField(this, "stateListeners");
      __publicField(this, "instanceId");
      // DOM element properties
      __publicField(this, "container");
      __publicField(this, "readoutPanel");
      __publicField(this, "modeCell");
      __publicField(this, "mainCell");
      __publicField(this, "modeLED");
      __publicField(this, "rateLED");
      __publicField(this, "colorPicker");
      __publicField(this, "svg");
      __publicField(this, "cursorGroup");
      __publicField(this, "axesGroup");
      __publicField(this, "imageClipRect");
      __publicField(this, "cursorClipRect");
      // Unified layout containers
      __publicField(this, "leftColumn");
      __publicField(this, "middleColumn");
      __publicField(this, "rightColumn");
      __publicField(this, "modeColumn");
      __publicField(this, "guidanceColumn");
      __publicField(this, "controlsColumn");
      __publicField(this, "unifiedLayoutContainer");
      __publicField(this, "timeLED");
      __publicField(this, "freqLED");
      __publicField(this, "speedLED");
      __publicField(this, "markersContainer");
      __publicField(this, "harmonicsContainer");
      // Spectrogram image
      __publicField(this, "spectrogramImage");
      // Mode switching UI
      __publicField(this, "modesContainer");
      __publicField(this, "modeButtons");
      __publicField(this, "commandButtons");
      __publicField(this, "guidancePanel");
      // Mode system
      __publicField(this, "modes");
      __publicField(this, "currentMode");
      __publicField(this, "featureRenderer");
      // Keyboard control functions
      __publicField(this, "setSelection");
      __publicField(this, "clearSelection");
      __publicField(this, "updateSelectionVisuals");
      // ResizeObserver
      __publicField(this, "resizeObserver");
      // Bound event handlers
      __publicField(this, "_boundHandleResize");
      this.state = createInitialState();
      this.configTable = configTable;
      this.stateListeners = [];
      this.instanceId = "";
      initializeDOMProperties(this);
      setupSpectrogramComponents(this);
      createUnifiedLayoutStructure(this);
      setupPersistentContainers(this);
      setupSpectrogramIfAvailable(this);
      initializeModeInfrastructure(this);
      setupModeUI(this);
      updateModeUIWithCommands(this);
      setupAllEventListeners(this);
      setupStateListeners(this);
      notifyStateListeners(this.state, this.stateListeners);
    }
    /**
     * Creates LED display elements for showing measurement values
     */
    // Zoom controls removed - now handled by pan mode command buttons
    /**
     * Zoom in by increasing zoom level
     */
    _zoomIn() {
      zoomIn(this);
    }
    /**
     * Zoom out by decreasing zoom level
     */
    _zoomOut() {
      zoomOut(this);
    }
    /**
     * Reset zoom to 1x
     */
    _zoomReset() {
      zoomReset(this);
    }
    /**
     * Set zoom level and center point
     * @param {number} level - Zoom level (1.0 = no zoom)
     * @param {number} centerX - Center X (0-1 normalized)
     * @param {number} centerY - Center Y (0-1 normalized)
     */
    _setZoom(level, centerX, centerY) {
      setZoom(this, level, centerX, centerY);
    }
    /**
     * Update zoom control button states based on current zoom level
     */
    _updateZoomControlStates() {
      updateZoomControlStates(this);
    }
    /**
     * Update axes when rate changes
     */
    _updateAxes() {
      updateAxes(this);
    }
    /**
     * Handle resize events
     */
    _handleResize() {
      handleResize(this);
    }
    /**
     * Destroy the component and clean up resources
     */
    destroy() {
      cleanupEventListeners(this);
      cleanupKeyboardControl(this);
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }
    /**
     * Draw axes with tick marks and labels
     */
    /**
     * Switch between analysis modes
     * @param {ModeType} mode - Target mode
     */
    _switchMode(mode) {
      if (mode === "pan" && this.state.zoom.level <= 1) {
        console.warn("Cannot switch to pan mode when zoom level is 1:1 or less");
        return;
      }
      this.state.previousMode = this.state.mode;
      this.state.mode = mode;
      this.state.dragState.isDragging = false;
      this.state.dragState.dragStartPosition = null;
      this.state.dragState.draggedHarmonicSetId = null;
      this.state.dragState.originalSpacing = null;
      this.state.dragState.originalAnchorTime = null;
      this.state.dragState.clickedHarmonicNumber = null;
      if (this.modeButtons) {
        Object.keys(this.modeButtons).forEach((m) => {
          const button = this.modeButtons[m];
          if (button) {
            if (m === mode) {
              button.classList.add("active");
            } else {
              button.classList.remove("active");
            }
          }
        });
      }
      if (this.container) {
        this.container.classList.remove("gram-frame-analysis-mode", "gram-frame-harmonics-mode");
        this.container.classList.add(`gram-frame-${mode}-mode`);
      }
      if (this.currentMode) {
        this.currentMode.cleanup();
        this.currentMode.deactivate();
      }
      this.currentMode = this.modes[mode];
      this.currentMode.activate();
      if (this.guidancePanel) {
        const guidanceContent = this.currentMode.getGuidanceText();
        updateGuidancePanel(this.guidancePanel, guidanceContent);
      }
      this.currentMode.updateLEDs(this.state.cursorPosition);
      updateLEDDisplays(this, this.state);
      if (this.modeLED) {
        this.modeLED.querySelector(".gram-frame-led-value").textContent = getModeDisplayName(mode);
      }
      updatePersistentPanels(this);
      if (this.featureRenderer) {
        this.featureRenderer.renderAllPersistentFeatures();
      }
      notifyStateListeners(this.state, this.stateListeners);
    }
    /**
     * Set the rate value for frequency calculations
     * @param {number} rate - Rate value in Hz/s
     */
    _setRate(rate) {
      this.state.rate = rate;
      this._updateAxes();
      notifyStateListeners(this.state, this.stateListeners);
    }
    // Zoom functionality removed - no display element
  }
  const GramFrameAPI = createGramFrameAPI(GramFrame);
  document.addEventListener("DOMContentLoaded", () => {
    window.GramFrame = GramFrameAPI;
    GramFrameAPI.init();
    const stateDisplay = document.getElementById("state-display");
    if (stateDisplay) {
      GramFrameAPI.addStateListener(
        /** @param {any} state */
        (state) => {
          stateDisplay.textContent = JSON.stringify(state, null, 2);
        }
      );
    }
  });
  window.GramFrame = GramFrameAPI;
})();
