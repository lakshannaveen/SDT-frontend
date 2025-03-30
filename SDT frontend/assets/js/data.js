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
    dataForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // Get the timestamp input
            const timestampInput = document.getElementById('timestamp');
            let timestampValue = timestampInput.value;
            
            // If empty, use current time in UTC
            if (!timestampValue) {
                timestampValue = new Date().toISOString().slice(0, 16);
            }
            
            // Create data object with proper number types
            const formData = {
                stationName: document.getElementById('stationName').value,
                latitude: parseFloat(latitudeInput.value),
                longitude: parseFloat(longitudeInput.value),
                timestamp: new Date(timestampValue).toISOString(), // Convert to ISO string (UTC)
                aqi: parseInt(document.getElementById('aqi').value),
                pm25: parseFloat(document.getElementById('pm25').value),
                co: parseFloat(document.getElementById('co').value),
                temperature: parseFloat(document.getElementById('temperature').value),
                humidity: parseFloat(humidityInput.value)
            };
            
            // Send data to backend
            const response = await fetch('https://localhost:7073/api/StationData/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                throw new Error(errorData.message || errorData.error || 'Failed to submit data');
            }

            const result = await response.json();
            alert('Station data submitted successfully!');
            dataForm.reset();
            
            // Reset AQI status
            aqiStatus.textContent = '';
            aqiStatus.className = '';
            
            // Set current datetime in local time for display
            const now = new Date();
            const timezoneOffset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
            document.getElementById('timestamp').value = localISOTime;
            
        } catch (error) {
            console.error('Full error:', error);
            alert(`Error submitting data: ${error.message}`);
        }
    });

    // Set current datetime as default (in local time for display)
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    document.getElementById('timestamp').value = localISOTime;
});
