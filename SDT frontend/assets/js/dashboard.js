// Initialize Leaflet map
document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([7.8731, 80.7718], 7); // Sri Lanka center

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Example marker
    L.marker([6.9271, 79.8612]).addTo(map) // Colombo coordinates
        .bindPopup("<b>Colombo</b><br>Air Quality Data Here")
        .openPopup();
});
