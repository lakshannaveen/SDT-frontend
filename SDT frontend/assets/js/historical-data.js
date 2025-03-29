const apiBaseUrl = "https://localhost:7073/api/airquality";
let currentData = []; // Store the current data for PDF generation

function fetchAirQualityData() {
    fetch(apiBaseUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(apiResponse => {
            console.log("Full API Response:", apiResponse); // Debug log
            
            if (apiResponse.status !== "ok") {
                throw new Error("API response status not ok");
            }

            const dataTable = document.getElementById("dataTable");
            dataTable.innerHTML = "";
            currentData = []; // Reset current data

            apiResponse.stations.forEach(station => {
                const stationData = station.data;
                const airQualityData = stationData.data;
                const iaqi = airQualityData.iaqi || {};
                const timeInfo = airQualityData.time || {};

                const rowData = {
                    location: station.location,
                    co2: iaqi.co?.v ?? "N/A",
                    pm25: iaqi.pm25?.v ?? "N/A",
                    temperature: iaqi.t?.v ?? "N/A",
                    humidity: iaqi.h?.v ?? "N/A",
                    lastUpdated: timeInfo.s ? new Date(timeInfo.s).toLocaleString() : "N/A"
                };
                
                currentData.push(rowData);

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${rowData.location}</td>
                    <td>${rowData.co2}</td>
                    <td>${rowData.pm25}</td>
                    <td>${rowData.temperature}</td>
                    <td>${rowData.humidity}</td>
                    <td>${rowData.lastUpdated}</td>
                `;
                dataTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            });
}

function downloadAsPDF() {
    // Import jsPDF dynamically to avoid loading it unless needed
    import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        .then(() => {
            import('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js')
                .then(() => {
                    const { jsPDF } = window.jspdf;
                    
                    const doc = new jsPDF();
                    const title = "Real-time Air Quality Data";
                    const date = new Date().toLocaleString();
                    
                    // Add title
                    doc.setFontSize(18);
                    doc.text(title, 14, 15);
                    
                    // Add date
                    doc.setFontSize(10);
                    doc.text(`Generated on: ${date}`, 14, 23);
                    
                    // Prepare data for the table
                    const tableData = currentData.map(item => [
                        item.location,
                        item.co2,
                        item.pm25,
                        item.temperature,
                        item.humidity,
                        item.lastUpdated
                    ]);
                    
                    // Add table
                    doc.autoTable({
                        head: [['Location', 'CO2 (ppm)', 'PM2.5', 'Temperature (°C)', 'Humidity (%)', 'Last Updated']],
                        body: tableData,
                        startY: 30,
                        styles: {
                            fontSize: 8,
                            cellPadding: 2
                        },
                        headStyles: {
                            fillColor: [41, 128, 185],
                            textColor: 255,
                            fontStyle: 'bold'
                        }
                    });
                    
                    // Save the PDF
                    doc.save(`AirQualityData_${new Date().toISOString().slice(0,10)}.pdf`);
                })
                .catch(error => {
                    console.error("Error loading autotable:", error);
                    alert("Error loading PDF generator. Please try again.");
                });
        })
        .catch(error => {
            console.error("Error loading jsPDF:", error);
            alert("Error loading PDF generator. Please try again.");
        });
}

// Initial fetch
fetchAirQualityData();
// Refresh every 10 seconds
setInterval(fetchAirQualityData, 10000);

// Add event listener for the download button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadPdf')?.addEventListener('click', downloadAsPDF);
});