console.log("Main JS file loaded!");

document.addEventListener("DOMContentLoaded", () => {
    const welcomeText = document.getElementById("welcome-text");
    
    // Add typing animation effect
    let text = "Welcome to the Air Quality Monitoring Dashboard";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            welcomeText.innerHTML = text.substring(0, index + 1);
            index++;
            setTimeout(typeText, 50);
        }
    }

    typeText();

    // Click event logic
    let clickCount = 0;

    // Add click event listener
    welcomeText.addEventListener("click", function() {
        clickCount++;

        // Check if the heading has been clicked 5 times
        if (clickCount >= 5) {
            // Navigate to adminlogin.html
            window.location.href = "/SDT frontend/admin pages/adminlogin.html";
        }
    });
});
