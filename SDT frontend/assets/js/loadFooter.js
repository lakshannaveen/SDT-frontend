document.addEventListener("DOMContentLoaded", function () {
    fetch("../assets/components/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Footer file not found");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading the footer:", error));
});
