document.addEventListener("DOMContentLoaded", function () {
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
                        const popupContent = `
                            <b>${station.location}</b><br>
                            AQI: ${station.aqi}<br>
                            ${station.pm25 ? `PM2.5: ${station.pm25} µg/m³<br>` : ''}
                            ${station.co ? `CO: ${station.co} ppm<br>` : ''}
                            ${station.temperature ? `Temp: ${station.temperature}°C<br>` : ''}
                            ${station.humidity ? `Humidity: ${station.humidity}%<br>` : ''}
                            Updated: ${new Date(station.lastUpdated).toLocaleString()}
                        `;
                        
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
});