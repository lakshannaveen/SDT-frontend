document.addEventListener("DOMContentLoaded", function () {
    fetch("../assets/components/navbar.html") // Correct relative path
        .then(response => {
            if (!response.ok) {
                throw new Error("Navbar file not found");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading the navbar:", error));
});