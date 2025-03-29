const apiBaseUrl = "https://localhost:7073/api/airquality"; // ✅ Your backend endpoint

function fetchAirQualityData() {
    fetch(apiBaseUrl)
        .then(response => response.json())
        .then(apiResponse => {
            if (apiResponse.status !== "ok") {
                throw new Error("Invalid API response");
            }

            const dataTable = document.getElementById("dataTable");
            dataTable.innerHTML = "";

            const data = apiResponse.data;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.city.name}</td>
                <td>${data.iaqi.co?.v ?? "N/A"}</td>
                <td>${data.iaqi.pm25?.v ?? "N/A"}</td>
                <td>${data.iaqi.t?.v ?? "N/A"}</td>
                <td>${data.iaqi.h?.v ?? "N/A"}</td>
                <td>${new Date(data.time.s).toLocaleString()}</td>
            `;
            dataTable.appendChild(row);
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Fetch data every 10 seconds
setInterval(fetchAirQualityData, 10000);
fetchAirQualityData();
