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
            console.log("API Response:", apiResponse); // Debug log
            
            if (apiResponse.status !== "ok") {
                throw new Error("API response status not ok");
            }

            const dataTable = document.getElementById("dataTable");
            dataTable.innerHTML = "";

            apiResponse.stations.forEach(station => {
                const data = station.data;
                const row = document.createElement("tr");
                
                // Safely extract values with fallbacks
                const co = data.iaqi?.co?.v ?? "N/A";
                const pm25 = data.iaqi?.pm25?.v ?? "N/A";
                const temp = data.iaqi?.t?.v ?? "N/A";
                const humidity = data.iaqi?.h?.v ?? "N/A";
                const time = data.time?.s ? new Date(data.time.s).toLocaleString() : "N/A";

                row.innerHTML = `
                    <td>${station.location}</td>
                    <td>${co}</td>
                    <td>${pm25}</td>
                    <td>${temp}</td>
                    <td>${humidity}</td>
                    <td>${time}</td>
                `;
                dataTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            // Optionally display error to user
            const dataTable = document.getElementById("dataTable");
            dataTable.innerHTML = `<tr><td colspan="6" class="text-danger">Error loading data: ${error.message}</td></tr>`;
        });
}

// Initial fetch
fetchAirQualityData();
// Refresh every 10 seconds
setInterval(fetchAirQualityData, 10000);