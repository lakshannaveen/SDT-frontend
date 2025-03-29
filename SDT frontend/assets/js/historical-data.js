const apiBaseUrl = "https://localhost:7073/api/airquality";

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

            apiResponse.stations.forEach(station => {
                // Extract the nested data correctly
                const stationData = station.data;
                const airQualityData = stationData.data; // The actual AQI data
                const iaqi = airQualityData.iaqi || {};
                const timeInfo = airQualityData.time || {};

                const row = document.createElement("tr");
                
                row.innerHTML = `
                    <td>${station.location}</td>
                    <td>${iaqi.co?.v ?? "N/A"}</td>
                    <td>${iaqi.pm25?.v ?? "N/A"}</td>
                    <td>${iaqi.t?.v ?? "N/A"}</td>
                    <td>${iaqi.h?.v ?? "N/A"}</td>
                    <td>${timeInfo.s ? new Date(timeInfo.s).toLocaleString() : "N/A"}</td>
                `;
                dataTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            const dataTable = document.getElementById("dataTable");
            dataTable.innerHTML = `
                <tr>
                    <td colspan="6" class="text-danger">
                        Error loading data: ${error.message}
                    </td>
                </tr>
            `;
        });
}

// Initial fetch
fetchAirQualityData();
// Refresh every 10 seconds
setInterval(fetchAirQualityData, 10000);