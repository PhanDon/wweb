// Sample trip data
const sampleTrips = [
    {
        id: 1,
        operator: {
            name: "Mai Linh",
            logo: "https://vexere.com/images/bus-operators/mai-linh.png",
            rating: 4.5,
            reviews: 2500,
            type: "Ghế ngồi"
        },
        departure: {
            time: "22:00",
            date: "31/12/2025",
            location: "Bến xe Miền Đông"
        },
        arrival: {
            time: "05:30",
            date: "01/01/2026",
            location: "Bến xe Giáp Bát"
        },
        duration: "7h30",
        distance: "1,650 km",
        price: 450000,
        seats: 12,
        features: ["wifi", "ac", "tv", "water"],
        featured: true
    },
    {
        id: 2,
        operator: {
            name: "Phương Trang",
            logo: "https://vexere.com/images/bus-operators/phuong-trang.png",
            rating: 5.0,
            reviews: 3100,
            type: "Giường nằm"
        },
        departure: {
            time: "20:30",
            date: "31/12/2025",
            location: "Bến xe Miền Đông"
        },
        arrival: {
            time: "04:00",
            date: "01/01/2026",
            location: "Bến xe Giáp Bát"
        },
        duration: "7h30",
        distance: "1,650 km",
        price: 520000,
        seats: 5,
        features: ["wifi", "ac", "blanket", "food"],
        featured: false
    },
    {
        id: 3,
        operator: {
            name: "Hoàng Long",
            logo: "https://vexere.com/images/bus-operators/hoang-long.png",
            rating: 5.0,
            reviews: 1800,
            type: "VIP Limousine"
        },
        departure: {
            time: "21:00",
            date: "31/12/2025",
            location: "VP Quận 1"
        },
        arrival: {
            time: "04:30",
            date: "01/01/2026",
            location: "VP Ba Đình"
        },
        duration: "7h30",
        distance: "1,650 km",
        price: 650000,
        seats: 3,
        features: ["wifi", "ac", "massage", "food", "water"],
        featured: true
    }
];

// Feature icons mapping
const featureIcons = {
    wifi: { icon: "fa-wifi", text: "WiFi" },
    ac: { icon: "fa-snowflake", text: "Điều hòa" },
    tv: { icon: "fa-tv", text: "TV" },
    water: { icon: "fa-wine-bottle", text: "Nước uống" },
    blanket: { icon: "fa-bed", text: "Chăn gối" },
    food: { icon: "fa-utensils", text: "Ăn uống" },
    massage: { icon: "fa-spa", text: "Massage" }
};

// Render trip cards
function renderTrips(trips) {
    const container = document.getElementById('tripResults');
    if (!container) return;
    
    if (trips.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Không tìm thấy chuyến đi</h3>
                <p>Không có chuyến đi nào phù hợp với bộ lọc của bạn</p>
                <button class="btn btn-primary" id="clearFiltersBtn">Xóa bộ lọc</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = trips.map(trip => `
        <div class="trip-card ${trip.featured ? 'featured' : ''}" data-id="${trip.id}">
            <div class="trip-header">
                <div class="operator-info">
                    <div class="operator-logo">
                        <img src="${trip.operator.logo}" alt="${trip.operator.name}">
                    </div>
                    <div class="operator-details">
                        <h4>${trip.operator.name}</h4>
                        <div class="operator-rating">
                            <div class="stars">
                                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(trip.operator.rating))}
                                ${trip.operator.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                            </div>
                            <span>${trip.operator.rating} (${trip.operator.reviews.toLocaleString()})</span>
                        </div>
                        <span class="operator-type">${trip.operator.type}</span>
                    </div>
                </div>
                <div class="trip-price">
                    <div class="price">${trip.price.toLocaleString()}đ</div>
                    <div class="price-note">Giá đã bao gồm thuế VAT</div>
                </div>
            </div>
            
            <div class="trip-details">
                <div class="departure-info">
                    <div class="time">${trip.departure.time}</div>
                    <div class="date">${trip.departure.date}</div>
                    <div class="location">${trip.departure.location}</div>
                </div>
                
                <div class="duration-info">
                    <div class="duration">${trip.duration}</div>
                    <div class="distance">${trip.distance}</div>
                    <div class="route-type">Trực tiếp</div>
                </div>
                
                <div class="arrival-info">
                    <div class="time">${trip.arrival.time}</div>
                    <div class="date">${trip.arrival.date}</div>
                    <div class="location">${trip.arrival.location}</div>
                </div>
            </div>
            
            <div class="trip-features">
                ${trip.features.map(feature => `
                    <div class="feature">
                        <i class="fas ${featureIcons[feature].icon}"></i>
                        <span>${featureIcons[feature].text}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="trip-footer">
                <div class="seats-available">
                    <span class="seat-count ${trip.seats < 5 ? 'critical' : trip.seats < 10 ? 'low' : ''}">
                        ${trip.seats} chỗ
                    </span>
                    <span class="seat-text">${trip.seats < 5 ? 'Sắp hết chỗ' : 'Còn chỗ'}</span>
                </div>
                <button class="btn btn-primary book-btn" data-id="${trip.id}">
                    <i class="fas fa-chair"></i> Chọn chỗ
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to book buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tripId = this.dataset.id;
            bookTrip(tripId);
        });
    });
}

// Book trip function
function bookTrip(tripId) {
    const trip = sampleTrips.find(t => t.id == tripId);
    if (!trip) return;
    
    // Save selected trip to localStorage
    localStorage.setItem('selectedTrip', JSON.stringify(trip));
    
    // Redirect to booking page
    window.location.href = `booking.html?trip=${tripId}`;
}

// Filter trips
function filterTrips() {
    const timeFilters = Array.from(document.querySelectorAll('.filter-section:nth-child(2) input:checked'))
        .map(cb => cb.parentElement.textContent.trim());
    
    const operatorFilters = Array.from(document.querySelectorAll('.filter-section:nth-child(3) input:checked'))
        .map(cb => cb.parentElement.textContent.trim());
    
    const typeFilters = Array.from(document.querySelectorAll('.filter-section:nth-child(4) input:checked'))
        .map(cb => cb.parentElement.textContent.trim());
    
    const priceFilter = parseInt(document.getElementById('priceSlider').value);
    
    let filteredTrips = sampleTrips.filter(trip => {
        // Filter by price
        if (trip.price > priceFilter) return false;
        
        // Filter by operator
        if (operatorFilters.length > 0 && !operatorFilters.includes(trip.operator.name)) {
            return false;
        }
        
        // Filter by type
        if (typeFilters.length > 0 && !typeFilters.includes(trip.operator.type)) {
            return false;
        }
        
        return true;
    });
    
    // Sort trips
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect ? sortSelect.value : 'price_asc';
    
    filteredTrips.sort((a, b) => {
        switch (sortValue) {
            case 'price_desc':
                return b.price - a.price;
            case 'time_asc':
                return a.departure.time.localeCompare(b.departure.time);
            case 'time_desc':
                return b.departure.time.localeCompare(a.departure.time);
            case 'rating_desc':
                return b.operator.rating - a.operator.rating;
            default: // price_asc
                return a.price - b.price;
        }
    });
    
    renderTrips(filteredTrips);
    
    // Update results count
    const countElement = document.querySelector('.results-count .count');
    if (countElement) {
        countElement.textContent = `${filteredTrips.length} chuyến xe được tìm thấy`;
    }
}

// Initialize search page
document.addEventListener('DOMContentLoaded', function() {
    // Load URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const date = urlParams.get('date');
    const passengers = urlParams.get('passengers');
    
    // Update search summary
    if (from && to) {
        const fromElement = document.querySelector('.search-summary .from');
        const toElement = document.querySelector('.search-summary .to');
        
        if (fromElement) fromElement.textContent = from;
        if (toElement) toElement.textContent = to;
    }
    
    // Initialize trips
    setTimeout(() => {
        renderTrips(sampleTrips);
        filterTrips();
    }, 1000); // Simulate loading
    
    // Add event listeners to filters
    const filterInputs = document.querySelectorAll('.filter-options input, #priceSlider, #sortSelect');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterTrips);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.querySelectorAll('.filter-options input').forEach(cb => {
                cb.checked = false;
            });
            document.getElementById('priceSlider').value = 1000000;
            filterTrips();
        });
    }
    
    // Modify search button
    const modifySearchBtn = document.getElementById('modifySearch');
    if (modifySearchBtn) {
        modifySearchBtn.addEventListener('click', function() {
            // Go back to home page with current search parameters
            window.location.href = 'index.html';
        });
    }
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterTrips);
    }
});