
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would typically send the form data to a server
    // For this example, we'll just show a success message
    
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('contactForm').reset();
    
    // Hide the success message after 5 seconds
    setTimeout(function() {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
});

// Smooth scroll for social media links (just for demo)
document.querySelectorAll('.social-icons a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        alert('This would link to your social media pages in a real implementation.');
    });
});
