console.log("Main JS file loaded!");

document.addEventListener("DOMContentLoaded", () => {
    const welcomeText = document.getElementById("welcome-text");

    // Typing Animation Effect
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

    // Click Event Logic for Secret Admin Page
    let clickCount = 0;

    welcomeText.addEventListener("click", function() {
        clickCount++;
        if (clickCount >= 5) {
            window.location.href = "/SDT frontend/admin pages/adminlogin.html";
        }
    });
});
