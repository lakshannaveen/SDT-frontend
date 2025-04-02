document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const wordCountElement = document.getElementById('wordCount');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Word count functionality
    messageInput.addEventListener('input', function() {
        const words = messageInput.value.trim().split(/\s+/);
        const wordCount = messageInput.value.trim() === '' ? 0 : words.length;
        wordCountElement.textContent = wordCount;
        
        if (wordCount > 100) {
            wordCountElement.style.color = 'red';
        } else {
            wordCountElement.style.color = 'inherit';
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate word count
        const words = messageInput.value.trim().split(/\s+/);
        const wordCount = messageInput.value.trim() === '' ? 0 : words.length;
        
        if (wordCount > 100) {
            alert('Message must be 100 words or less');
            return;
        }
        
        // Prepare form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            message: messageInput.value
        };
        
        try {
            // Send data to server
            const response = await fetch('https://localhost:7073/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit form');
            }
            
            // Show success message
            contactForm.style.display = 'none';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            
            // Reset form
            contactForm.reset();
            wordCountElement.textContent = '0';
        } catch (error) {
            console.error('Error:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'There was an error submitting your form. Please try again.';
        }
    });
});