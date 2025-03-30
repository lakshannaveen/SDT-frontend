document.addEventListener('DOMContentLoaded', function () {
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    const dataForm = document.getElementById('dataForm');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const humidityInput = document.getElementById('humidity');
    const aqiInput = document.getElementById('aqi');
    const aqiStatus = document.createElement('div');
    aqiStatus.id = 'aqiStatus';
    aqiInput.parentNode.appendChild(aqiStatus);

    // Back to Dashboard button
    backToDashboardBtn.addEventListener('click', function () {
        window.location.href = 'admin_dashboard.html';
    });

    // Latitude validation (-90 to 90)
    latitudeInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (isNaN(value) || value < -90 || value > 90) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Longitude validation (-180 to 180)
    longitudeInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (isNaN(value) || value < -180 || value > 180) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Humidity validation (0-100%)
    humidityInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (isNaN(value) || value < 0 || value > 100) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // AQI classification
    aqiInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (isNaN(value)) return;
        
        let status = '', className = '';
        if (value <= 50) {
            status = 'Good';
            className = 'aqi-good';
        } else if (value <= 100) {
            status = 'Moderate';
            className = 'aqi-moderate';
        } else if (value <= 150) {
            status = 'Unhealthy';
            className = 'aqi-unhealthy';
        } else if (value <= 200) {
            status = 'Very Unhealthy';
            className = 'aqi-very-unhealthy';
        } else {
            status = 'Hazardous';
            className = 'aqi-hazardous';
        }
        
        aqiStatus.textContent = status;
        aqiStatus.className = className;
    });

    // Form submission
    dataForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        
        // Check latitude
        const latValue = parseFloat(latitudeInput.value);
        if (isNaN(latValue)) {
            latitudeInput.classList.add('is-invalid');
            isValid = false;
        } else if (latValue < -90 || latValue > 90) {
            latitudeInput.classList.add('is-invalid');
            isValid = false;
        } else {
            latitudeInput.classList.remove('is-invalid');
        }
        
        // Check longitude
        const lngValue = parseFloat(longitudeInput.value);
        if (isNaN(lngValue)) {
            longitudeInput.classList.add('is-invalid');
            isValid = false;
        } else if (lngValue < -180 || lngValue > 180) {
            longitudeInput.classList.add('is-invalid');
            isValid = false;
        } else {
            longitudeInput.classList.remove('is-invalid');
        }
        
        // Check humidity
        const humidityValue = parseFloat(humidityInput.value);
        if (isNaN(humidityValue)) {
            humidityInput.classList.add('is-invalid');
            isValid = false;
        } else if (humidityValue < 0 || humidityValue > 100) {
            humidityInput.classList.add('is-invalid');
            isValid = false;
        } else {
            humidityInput.classList.remove('is-invalid');
        }
        
        // If form is valid, proceed with submission
        if (isValid) {
            // Create data object
            const formData = {
                stationName: document.getElementById('stationName').value,
                latitude: latValue,
                longitude: lngValue,
                timestamp: document.getElementById('timestamp').value,
                aqi: parseInt(document.getElementById('aqi').value),
                pm25: parseFloat(document.getElementById('pm25').value),
                co: parseFloat(document.getElementById('co').value),
                temperature: parseFloat(document.getElementById('temperature').value),
                humidity: humidityValue
            };
            
            // Here you would typically send the data to your backend
            console.log('Station data to be submitted:', formData);
            
            // Show success message
            alert('Station data submitted successfully!');
            
            // Reset form
            dataForm.reset();
            
            // Reset AQI status
            aqiStatus.textContent = '';
            aqiStatus.className = '';
            
            // Set current datetime
            const now = new Date();
            const timezoneOffset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
            document.getElementById('timestamp').value = localISOTime;
            
            // Optionally redirect to dashboard
            // window.location.href = 'admindashboard.html';
        } else {
            // Scroll to first invalid field
            const firstInvalid = document.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Set current datetime as default
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    document.getElementById('timestamp').value = localISOTime;
});