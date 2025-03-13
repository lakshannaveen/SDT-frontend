document.addEventListener("DOMContentLoaded", function () {
    // Load Navbar
    fetch("../assets/components/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading navbar:", error));

    // Initialize Leaflet Map centered on Sri Lanka
    var map = L.map('map').setView([7.8731, 80.7718], 7); // Sri Lanka coordinates

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
});
