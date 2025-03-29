document.addEventListener("DOMContentLoaded", function () {
    // Load Navbar
    fetch("../assets/components/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading navbar:", error));

    // Load Footer
    fetch("../assets/components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));

    // Add any additional home page specific JavaScript here
    console.log("Home page loaded successfully");
    
    // Example: Add click animation to buttons
    const buttons = document.querySelectorAll('.access-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__pulse');
            }, 500);
        });
    });
});