document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const alertsList = document.getElementById('alerts-list');
    const noAlerts = document.getElementById('no-alerts');

    // Initialize the page
    showLoadingState();
    fetchAlerts();

    // Main function to fetch alerts
    async function fetchAlerts() {
        try {
            const response = await fetch('https://localhost:7073/api/dashboard/aqi');

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!data) {
                throw new Error('No data received from server');
            }

            if (data.status !== 'ok') {
                throw new Error(data.message || 'Server returned error status');
            }

            processAqiData(data);
        } catch (error) {
            console.error('Failed to load AQI data:', error);
            showErrorState(error.message);
        }
    }

    // Process the AQI data
    function processAqiData(apiResponse) {
        alertsList.innerHTML = '';

        if (!apiResponse.data || !Array.isArray(apiResponse.data)) {
            showNoDataState();
            return;
        }

        // Filter for unhealthy stations (AQI > 100)
        const unhealthyStations = apiResponse.data.filter(station => 
            station.aqi && station.aqi > 100
        );

        if (unhealthyStations.length > 0) {
            showAlerts(unhealthyStations);
        } else {
            showNoAlertsState();
        }
    }

    // UI State Functions
    function showLoadingState() {
        alertsList.innerHTML = `
            <div class="status-message loading">
                <i class="fas fa-spinner fa-spin"></i> Loading air quality data...
            </div>
        `;
        noAlerts.style.display = 'none';
    }

    function showAlerts(stations) {
        alertsList.innerHTML = '';
        noAlerts.style.display = 'none';

        // Sort stations by AQI (highest first)
        stations.sort((a, b) => b.aqi - a.aqi);

        stations.forEach(station => {
            const alertItem = createAlertItem(station);
            alertsList.appendChild(alertItem);
        });
    }

    function showNoAlertsState() {
        alertsList.innerHTML = '';
        noAlerts.style.display = 'flex';
    }

    function showErrorState(message) {
        alertsList.innerHTML = `
            <div class="status-message error">
                <i class="fas fa-exclamation-triangle"></i>
                ${message || 'Failed to load air quality data'}
                <button onclick="window.location.reload()">Retry</button>
            </div>
        `;
        noAlerts.style.display = 'none';
    }

    function showNoDataState() {
        alertsList.innerHTML = `
            <div class="status-message warning">
                <i class="fas fa-info-circle"></i>
                No air quality data available
            </div>
        `;
        noAlerts.style.display = 'none';
    }

    // Create an alert item
    function createAlertItem(station) {
        const item = document.createElement('div');
        item.className = 'alert-item';

        const aqiLevelClass = getAqiLevelClass(station.aqi);
        const lastUpdated = formatDate(station.lastUpdated || station.updated || station.time);

        item.innerHTML = `
            <div class="alert-location">${station.location || 'Unknown'}</div>
            <div class="alert-aqi">${station.aqi || 'N/A'}</div>
            <div class="alert-level ${aqiLevelClass}">${getAlertLevel(station.aqi)}</div>
            <div class="alert-pollutant">${station.mainPollutant || 'N/A'}</div>
            <div class="alert-time">${lastUpdated}</div>
        `;

        return item;
    }

    // Helper functions
    function getAqiLevelClass(aqi) {
        if (!aqi) return '';
        if (aqi > 200) return 'level-hazardous';
        if (aqi > 150) return 'level-veryunhealthy';
        if (aqi > 100) return 'level-unhealthy';
        return '';
    }

    function getAlertLevel(aqi) {
        if (!aqi) return 'N/A';
        if (aqi > 200) return 'Hazardous';
        if (aqi > 150) return 'Very Unhealthy';
        if (aqi > 100) return 'Unhealthy';
        return 'Good';
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleString();
        } catch (e) {
            return dateString;
        }
    }
});