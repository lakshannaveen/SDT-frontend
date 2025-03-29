document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([7.8731, 80.7718], 7); // Sri Lanka center

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Function to get AQI color based on value
    function getAqiColor(aqi) {
        if (aqi <= 50) return "green";
        if (aqi <= 100) return "yellow";
        if (aqi <= 150) return "orange";
        if (aqi <= 200) return "red";
        if (aqi <= 300) return "purple";
        return "maroon";
    }

    // Placeholder for dynamic AQI data (could be fetched from an API or database)
    var aqiData = []; // Fill this array dynamically

    // Example dynamic fetch using an API
    fetch('/api/aqi') // Assume there's an endpoint that returns AQI data
        .then(response => response.json())
        .then(data => {
            aqiData = data; // Data fetched from API
            aqiData.forEach(function (data) {
                L.marker(data.location)
                    .addTo(map)
                    .bindPopup("<b>" + data.city + "</b><br>Air Quality: " + data.aqi)
                    .setIcon(L.divIcon({
                        className: 'leaflet-div-icon',
                        iconSize: [30, 30],
                        html: '<div style="background-color: ' + getAqiColor(data.aqi) + '; width: 100%; height: 100%; border-radius: 50%;"></div>'
                    }));
            });
        })
        .catch(error => {
            console.error('Error fetching AQI data:', error);
        });
});
