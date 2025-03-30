document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    const addStationBtn = document.getElementById('addStationBtn');
    const stationsTableBody = document.getElementById('stationsTableBody');
    const stationModal = new bootstrap.Modal(document.getElementById('stationModal'));
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    const saveStationBtn = document.getElementById('saveStationBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const stationForm = document.getElementById('stationForm');
    
    // State variables
    let stations = [];
    let currentStationId = null;
    
    // Helper function to get PM25 value consistently
    function getPm25Value(station) {
        return station.pm25 || station.PM25 || station.pM25 || station.Pm25 || "N/A";
    }
    
    // Initialize the page
    init();
    
    function init() {
        loadStations();
        setupEventListeners();
    }
    
    function setupEventListeners() {
        backToDashboardBtn.addEventListener('click', () => {
            window.location.href = 'admin_dashboard.html';
        });
        
        addStationBtn.addEventListener('click', () => {
            showAddStationModal();
        });
        
        saveStationBtn.addEventListener('click', () => {
            saveStation();
        });
        
        confirmDeleteBtn.addEventListener('click', () => {
            deleteStation();
        });
    }
    
    async function loadStations() {
        try {
            const response = await fetch('https://localhost:7073/api/ManageStationData');
            if (!response.ok) throw new Error('Failed to fetch stations');
            
            stations = await response.json();
            renderStationsTable();
        } catch (error) {
            console.error('Error loading stations:', error);
            alert('Failed to load stations. Please try again.');
        }
    }
    
    function renderStationsTable() {
        stationsTableBody.innerHTML = '';
        
        stations.forEach(station => {
            const row = document.createElement('tr');
            
            // Format the timestamp
            const timestamp = new Date(station.timestamp);
            const formattedTimestamp = timestamp.toLocaleString();
            
            row.innerHTML = `
                <td>${station.id}</td>
                <td>${station.stationName}</td>
                <td>${station.latitude}</td>
                <td>${station.longitude}</td>
                <td>${station.aqi}</td>
                <td>${getPm25Value(station)}</td>
                <td>${station.co}</td>
                <td>${station.temperature}</td>
                <td>${station.humidity}%</td>
                <td>${formattedTimestamp}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${station.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${station.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            stationsTableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stationId = parseInt(e.currentTarget.getAttribute('data-id'));
                showEditStationModal(stationId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stationId = parseInt(e.currentTarget.getAttribute('data-id'));
                showDeleteConfirmation(stationId);
            });
        });
    }
    
    function showAddStationModal() {
        currentStationId = null;
        document.getElementById('modalTitle').textContent = 'Add New Station';
        stationForm.reset();
        stationModal.show();
    }
    
    function showEditStationModal(stationId) {
        const station = stations.find(s => s.id === stationId);
        if (!station) return;
        
        currentStationId = stationId;
        document.getElementById('modalTitle').textContent = 'Edit Station';
        
        // Populate form fields
        document.getElementById('stationId').value = station.id;
        document.getElementById('stationName').value = station.stationName;
        document.getElementById('latitude').value = station.latitude;
        document.getElementById('longitude').value = station.longitude;
        document.getElementById('aqi').value = station.aqi;
        document.getElementById('pm25').value = getPm25Value(station);
        document.getElementById('co').value = station.co;
        document.getElementById('temperature').value = station.temperature;
        document.getElementById('humidity').value = station.humidity;
        
        stationModal.show();
    }
    
    function showDeleteConfirmation(stationId) {
        currentStationId = stationId;
        confirmModal.show();
    }
    
    async function saveStation() {
        // Validate form
        if (!stationForm.checkValidity()) {
            stationForm.reportValidity();
            return;
        }
        
        const stationData = {
            id: currentStationId || 0,
            stationName: document.getElementById('stationName').value,
            latitude: parseFloat(document.getElementById('latitude').value),
            longitude: parseFloat(document.getElementById('longitude').value),
            aqi: parseInt(document.getElementById('aqi').value),
            pm25: parseFloat(document.getElementById('pm25').value),
            co: parseFloat(document.getElementById('co').value),
            temperature: parseFloat(document.getElementById('temperature').value),
            humidity: parseFloat(document.getElementById('humidity').value),
            timestamp: new Date().toISOString()
        };
        
        try {
            const url = currentStationId 
                ? `https://localhost:7073/api/ManageStationData/${currentStationId}`
                : 'https://localhost:7073/api/ManageStationData';
                
            const method = currentStationId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stationData)
            });
            
            if (!response.ok) throw new Error('Failed to save station');
            
            stationModal.hide();
            loadStations(); // Refresh the table
        } catch (error) {
            console.error('Error saving station:', error);
            alert('Failed to save station. Please try again.');
        }
    }
    
    async function deleteStation() {
        if (!currentStationId) return;
        
        try {
            const response = await fetch(`https://localhost:7073/api/ManageStationData/${currentStationId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete station');
            
            confirmModal.hide();
            loadStations(); // Refresh the table
        } catch (error) {
            console.error('Error deleting station:', error);
            alert('Failed to delete station. Please try again.');
        }
    }
});