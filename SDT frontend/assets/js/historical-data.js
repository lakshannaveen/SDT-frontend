const apiBaseUrl = "https://localhost:7073/api/airquality";
let currentData = []; // Store the current data for PDF generation

function fetchAirQualityData() {
    const loadingSpinner = document.getElementById("loadingSpinner"); // Reference to the spinner
    const dataTable = document.getElementById("dataTable");

    // Show the loading spinner
    loadingSpinner.style.display = "block";
    dataTable.style.opacity = "0.5"; // Optional: Dim the table while loading

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
        })
        .finally(() => {
            // Hide the loading spinner
            loadingSpinner.style.display = "none";
            dataTable.style.opacity = "1"; // Restore table opacity
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