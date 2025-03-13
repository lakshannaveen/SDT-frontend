document.addEventListener("DOMContentLoaded", function () {
    fetch("../assets/components/navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Navbar file not found");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            setActiveNavLink();
            enableNavClickClose();
            reinitializeNavbar();
        })
        .catch(error => console.error("Error loading the navbar:", error));
});

// Function to highlight the active navbar link
function setActiveNavLink() {
    let currentPage = window.location.pathname.split("/").pop();
    let navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    navLinks.forEach(link => {
        let linkPage = link.getAttribute("href").split("/").pop();
        link.classList.toggle("active", currentPage === linkPage);
    });
}

// Function to close the navbar after clicking a link on small screens
function enableNavClickClose() {
    let navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    let navbarCollapse = document.querySelector(".navbar-collapse");

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            if (window.innerWidth < 992) { // Close only on small screens
                let bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// ✅ Function to manually reinitialize the Bootstrap navbar
function reinitializeNavbar() {
    let navbarToggler = document.querySelector(".navbar-toggler");
    let navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener("click", function () {
            navbarCollapse.classList.toggle("show"); // Toggle manually
        });
    }
}
