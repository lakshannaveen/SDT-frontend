document.addEventListener("DOMContentLoaded", function () {
    const { jsPDF } = window.jspdf;
    const apiBaseUrl = "https://localhost:7073/api/dashboard/aqi";
    
    // Initialize map centered on Colombo
    var map = L.map('map').setView([6.9271, 79.8612], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Debug: Add a test marker to verify map works
    L.marker([6.9271, 79.8612])
        .addTo(map)
        .bindPopup("Test marker - Colombo center")
        .openPopup();

    // Fetch AQI data from our backend
    fetch(apiBaseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data); // Debug log
            
            if (data.status === "ok") {
                data.data.forEach(station => {
                    if (station.aqi >= 0) { // Only show stations with valid data
                        const popupContent = createPopupContent(station);
                        
                        const marker = L.marker(station.coordinates, {
                            icon: L.divIcon({
                                className: 'aqi-marker',
                                html: `<div style="background-color: ${getAqiColor(station.aqi)}; 
                                      width: 24px; height: 24px; border-radius: 50%; 
                                      border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
                                iconSize: [24, 24]
                            })
                        }).addTo(map).bindPopup(popupContent);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading AQI data:', error);
            // Show error on map
            L.marker([6.9271, 79.8612])
                .addTo(map)
                .bindPopup(`Error: ${error.message}`)
                .openPopup();
        });

    // AQI color scale function
    function getAqiColor(aqi) {
        if (aqi < 0) return "#AAAAAA";     // Gray for invalid data
        if (aqi <= 50) return "#00E400";  // Green
        if (aqi <= 100) return "#FFFF00"; // Yellow
        if (aqi <= 150) return "#FF7E00"; // Orange
        if (aqi <= 200) return "#FF0000"; // Red
        if (aqi <= 300) return "#8F3F97"; // Purple
        return "#7E0023";                 // Maroon
    }

    // Create popup content with table and download button
    function createPopupContent(station) {
        const timestamp = new Date(station.lastUpdated).toLocaleString();
        
        // Create table rows for all available data
        let tableRows = '';
        
        // Always include these fields
        tableRows += `
            <tr>
                <th>AQI</th>
                <td>${station.aqi} (${getAqiLevel(station.aqi)})</td>
            </tr>
        `;
        
        // Include other fields if they exist
        if (station.pm25 !== undefined) {
            tableRows += `
                <tr>
                    <th>PM2.5</th>
                    <td>${station.pm25} µg/m³</td>
                </tr>
            `;
        }
        
        if (station.co !== undefined) {
            tableRows += `
                <tr>
                    <th>CO</th>
                    <td>${station.co} ppm</td>
                </tr>
            `;
        }
        
        if (station.temperature !== undefined) {
            tableRows += `
                <tr>
                    <th>Temperature</th>
                    <td>${station.temperature}°C</td>
                </tr>
            `;
        }
        
        if (station.humidity !== undefined) {
            tableRows += `
                <tr>
                    <th>Humidity</th>
                    <td>${station.humidity}%</td>
                </tr>
            `;
        }
        
        // Add any additional fields here following the same pattern
        
        // Create download button with onclick handler
        const downloadButton = `
            <button class="download-pdf-btn" 
                    onclick="window.downloadAsPdf('${station.location}', ${station.aqi}, ${station.pm25 || 'null'}, 
                    ${station.co || 'null'}, ${station.temperature || 'null'}, ${station.humidity || 'null'}, 
                    '${timestamp}')">
                Download as PDF
            </button>
        `;
        
        // Combine all elements
        return `
            <div class="popup-content">
                <h3 class="popup-title">${station.location}</h3>
                <p class="popup-timestamp">Updated: ${timestamp}</p>
                <table class="aqi-popup-table">
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                ${downloadButton}
            </div>
        `;
    }

    // Get AQI level description
    function getAqiLevel(aqi) {
        if (aqi < 0) return "Invalid";
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy";
        if (aqi <= 200) return "Very Unhealthy";
        if (aqi <= 300) return "Hazardous";
        return "Hazardous";
    }

    // Make download function available globally
    window.downloadAsPdf = function(location, aqi, pm25, co, temperature, humidity, timestamp) {
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.text(`Air Quality Report - ${location}`, 105, 15, { align: 'center' });
        
        // Timestamp
        doc.setFontSize(10);
        doc.text(`Report generated on: ${new Date().toLocaleString()}`, 105, 22, { align: 'center' });
        doc.text(`Data timestamp: ${timestamp}`, 105, 27, { align: 'center' });
        
        // Table data
        const data = [
            ["Parameter", "Value"],
            ["AQI", `${aqi} (${getAqiLevel(aqi)})`]
        ];
        
        if (pm25 !== null) data.push(["PM2.5", `${pm25} µg/m³`]);
        if (co !== null) data.push(["CO", `${co} ppm`]);
        if (temperature !== null) data.push(["Temperature", `${temperature}°C`]);
        if (humidity !== null) data.push(["Humidity", `${humidity}%`]);
        
        // Add table
        doc.autoTable({
            startY: 35,
            head: [data[0]],
            body: data.slice(1),
            theme: 'grid',
            headStyles: {
                fillColor: [76, 175, 80],
                textColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            margin: { top: 35 }
        });
        
        // AQI scale info
        doc.setFontSize(10);
        doc.text("AQI Scale:", 14, doc.autoTable.previous.finalY + 15);
        
        const aqiScale = [
            ["0-50", "Good", "#00E400"],
            ["51-100", "Moderate", "#FFFF00"],
            ["101-150", "Unhealthy", "#FF7E00"],
            ["151-200", "Very Unhealthy", "#FF0000"],
            ["201-300", "Hazardous", "#8F3F97"],
            ["301+", "Hazardous", "#7E0023"]
        ];
        
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 20,
            body: aqiScale.map(row => [row[0], row[1]]),
            theme: 'grid',
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const color = aqiScale[data.row.index][2];
                    doc.setFillColor(color);
                    doc.rect(data.cell.x + 2, data.cell.y + 2, 10, 10, 'F');
                }
            },
            columnStyles: {
                2: { cellWidth: 15 }
            },
            margin: { left: 14 }
        });
        
        // Save the PDF
        doc.save(`AQI_Report_${location.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
    };
});