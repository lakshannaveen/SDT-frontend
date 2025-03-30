const apiBaseUrl = "https://localhost:7073/api/airquality";
let currentData = []; // For real-time data
let historicalCurrentData = []; // For historical data

// Real-time data functions (unchanged)
function fetchAirQualityData() {
    const loadingSpinner = document.getElementById("loadingSpinner");
    const dataTable = document.getElementById("dataTable");

    loadingSpinner.style.display = "block";
    dataTable.style.opacity = "0.5";

    fetch(apiBaseUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(apiResponse => {
            console.log("Full API Response:", apiResponse);
            
            if (apiResponse.status !== "ok") throw new Error("API response status not ok");

            dataTable.innerHTML = "";
            currentData = [];

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
        .catch(error => console.error("Error fetching data:", error))
        .finally(() => {
            loadingSpinner.style.display = "none";
            dataTable.style.opacity = "1";
        });
}

// Historical data functions
async function loadHistoricalData() {
    const tableBody = document.getElementById('historicalDataTable');
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading data...</td></tr>';

    try {
        const response = await fetch('https://localhost:7073/api/stationdata/historical');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        historicalCurrentData = data || [];
        
        if (historicalCurrentData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No historical data available</td></tr>';
            return;
        }

        tableBody.innerHTML = '';
        
        historicalCurrentData.forEach(station => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${station.stationName}</td>
                <td>${new Date(station.timestamp).toLocaleString()}</td>
                <td>${station.aqi}</td>
                <td>${getPm25Value(station)}</td>
                <td>${station.co}</td>
                <td>${station.temperature}</td>
                <td>${station.humidity}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading historical data:', error);
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading data: ${error.message}</td></tr>`;
    }
}
function getPm25Value(station) {
    
    return station.pm25 || station.PM25 || station.pM25 || station.Pm25 || "N/A";
}
// PDF Download functions
function downloadAsPDF() {
    // Real-time data PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.text("Real-time Air Quality Data", 10, 10);
    
    // Prepare data
    const headers = [["Location", "CO2", "PM2.5", "Temp", "Humidity", "Last Updated"]];
    const data = currentData.map(item => [
        item.location,
        item.co2,
        item.pm25,
        item.temperature,
        item.humidity,
        item.lastUpdated
    ]);
    
    // Add table
    doc.autoTable({
        head: headers,
        body: data,
        startY: 20
    });
    
    doc.save('real-time-air-quality.pdf');
}

function downloadHistoricalAsPDF() {
    // Historical data PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.text("Historical Air Quality Data", 10, 10);
    
    // Prepare data
    const headers = [["Station", "Timestamp", "AQI", "PM25", "CO", "Temp", "Humidity"]];
    const data = historicalCurrentData.map(item => [
        item.stationName,
        new Date(item.timestamp).toLocaleString(),
        item.aqi,
        item.pm25,
        item.co,
        item.temperature,
        item.humidity
    ]);
    
    // Add table
    doc.autoTable({
        head: headers,
        body: data,
        startY: 20
    });
    
    doc.save('historical-air-quality.pdf');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load data
    fetchAirQualityData();
    loadHistoricalData();
    
    // Set up refresh for real-time data
    setInterval(fetchAirQualityData, 10000);
    
    // Set up PDF buttons
    document.getElementById('downloadPdf')?.addEventListener('click', downloadAsPDF);
    document.getElementById('downloadHistoricalPdf')?.addEventListener('click', downloadHistoricalAsPDF);
});