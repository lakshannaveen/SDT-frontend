document.addEventListener("DOMContentLoaded", function () {
    fetch("../assets/components/navbar.html") // Load the navbar
        .then(response => {
            if (!response.ok) {
                throw new Error("Navbar file not found");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            setActiveNavLink(); // Call function after inserting the navbar
        })
        .catch(error => console.error("Error loading the navbar:", error));
});

// Function to set active navbar link
function setActiveNavLink() {
    let currentPage = window.location.pathname.split("/").pop(); // Get current page filename

    let navLinks = document.querySelectorAll(".navbar-nav .nav-link"); // Select navbar links

    navLinks.forEach(link => {
        let linkPage = link.getAttribute("href").split("/").pop(); // Extract filename from href
        
        if (currentPage === linkPage) {
            link.classList.add("active"); // Add active class
        } else {
            link.classList.remove("active"); // Remove active class from others
        }
    });
}
