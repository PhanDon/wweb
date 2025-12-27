// Seat Selection Logic
const seatGrid = document.getElementById('seatGrid');
const selectedSeatsCount = document.getElementById('selectedSeatsCount');
const selectedSeatsList = document.getElementById('selectedSeatsList');
const continueToPaymentBtn = document.getElementById('continueToPaymentBtn');
const passengerForms = document.getElementById('passengerForms');
const summarySeats = document.getElementById('summarySeats');
const summaryPassengers = document.getElementById('summaryPassengers');
const summaryTicketPrice = document.getElementById('summaryTicketPrice');
const summaryTotalPrice = document.getElementById('summaryTotalPrice');

// Seat configuration
const seatConfig = {
    rows: 11,
    cols: 4,
    pricePerSeat: 450000,
    serviceFee: 10000,
    unavailableSeats: ['1A', '2B', '3C', '4D', '5A', '10B'],
    vipSeats: ['1D', '2D', '3D', '4D'],
    womenOnlySeats: ['1C', '2C', '3C', '4C', '5C']
};

let selectedSeats = [];

// Generate seat grid
function generateSeatGrid() {
    seatGrid.innerHTML = '';
    
    for (let row = 1; row <= seatConfig.rows; row++) {
        for (let col = 0; col < seatConfig.cols; col++) {
            const seatLetter = String.fromCharCode(65 + col); // A, B, C, D
            const seatNumber = row + seatLetter;
            const seatId = `seat-${seatNumber}`;
            
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.id = seatId;
            seat.dataset.seat = seatNumber;
            
            // Check seat status
            if (seatConfig.unavailableSeats.includes(seatNumber)) {
                seat.classList.add('unavailable');
            } else if (seatConfig.vipSeats.includes(seatNumber)) {
                seat.classList.add('vip');
            } else if (seatConfig.womenOnlySeats.includes(seatNumber)) {
                seat.classList.add('women');
            }
            
            seat.innerHTML = `
                <div class="seat-number">${seatNumber}</div>
                ${seatConfig.vipSeats.includes(seatNumber) ? '<div class="seat-vip">VIP</div>' : ''}
                ${seatConfig.womenOnlySeats.includes(seatNumber) ? '<div class="seat-women"><i class="fas fa-female"></i></div>' : ''}
            `;
            
            // Add click event
            if (!seatConfig.unavailableSeats.includes(seatNumber)) {
                seat.addEventListener('click', () => toggleSeatSelection(seatNumber));
            }
            
            seatGrid.appendChild(seat);
            
            // Add aisle after column B
            if (col === 1) {
                const aisle = document.createElement('div');
                aisle.className = 'aisle-spacer';
                seatGrid.appendChild(aisle);
            }
        }
    }
}

// Toggle seat selection
function toggleSeatSelection(seatNumber) {
    const seatIndex = selectedSeats.indexOf(seatNumber);
    const seatElement = document.getElementById(`seat-${seatNumber}`);
    
    if (seatIndex === -1) {
        // Select seat
        if (selectedSeats.length >= 4) {
            alert('Bạn chỉ có thể chọn tối đa 4 ghế');
            return;
        }
        selectedSeats.push(seatNumber);
        seatElement.classList.add('selected');
    } else {
        // Deselect seat
        selectedSeats.splice(seatIndex, 1);
        seatElement.classList.remove('selected');
        
        // Remove corresponding passenger form
        removePassengerForm(seatNumber);
    }
    
    updateSeatSelection();
    updatePassengerForms();
    updateBookingSummary();
}

// Update seat selection display
function updateSeatSelection() {
    selectedSeatsCount.textContent = selectedSeats.length;
    selectedSeatsList.textContent = selectedSeats.join(', ');
    
    // Enable/disable continue button
    continueToPaymentBtn.disabled = selectedSeats.length === 0;
    
    // Update summary
    summarySeats.textContent = selectedSeats.join(', ');
    summaryPassengers.textContent = selectedSeats.length;
}

// Update passenger forms
function updatePassengerForms() {
    // Clear existing forms except for already filled ones
    const existingForms = passengerForms.querySelectorAll('.passenger-form');
    existingForms.forEach(form => {
        const seatNum = form.querySelector('.seat-number').textContent;
        if (!selectedSeats.includes(seatNum)) {
            form.remove();
        }
    });
    
    // Add new forms for selected seats
    selectedSeats.forEach((seatNumber, index) => {
        const formId = `passengerForm-${seatNumber}`;
        let form = document.getElementById(formId);
        
        if (!form) {
            form = createPassengerForm(seatNumber, index + 1);
            passengerForms.appendChild(form);
        }
    });
}

// Create passenger form
function createPassengerForm(seatNumber, passengerNumber) {
    const form = document.createElement('div');
    form.className = 'passenger-form';
    form.id = `passengerForm-${seatNumber}`;
    
    form.innerHTML = `
        <h4>Hành khách ${passengerNumber} - Ghế <span class="seat-number">${seatNumber}</span></h4>
        <div class="form-grid">
            <div class="form-group">
                <label for="name-${seatNumber}">Họ và tên *</label>
                <input type="text" id="name-${seatNumber}" required class="passenger-input" data-field="name">
            </div>
            <div class="form-group">
                <label for="phone-${seatNumber}">Số điện thoại *</label>
                <input type="tel" id="phone-${seatNumber}" required class="passenger-input" data-field="phone">
            </div>
            <div class="form-group">
                <label for="email-${seatNumber}">Email</label>
                <input type="email" id="email-${seatNumber}" class="passenger-input" data-field="email">
            </div>
            <div class="form-group">
                <label for="gender-${seatNumber}">Giới tính</label>
                <select id="gender-${seatNumber}" class="passenger-input" data-field="gender">
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                </select>
            </div>
            <div class="form-group">
                <label for="type-${seatNumber}">Loại hành khách</label>
                <select id="type-${seatNumber}" class="passenger-input" data-field="type">
                    <option value="adult">Người lớn</option>
                    <option value="child">Trẻ em (6-11 tuổi)</option>
                    <option value="student">Sinh viên</option>
                    <option value="elderly">Người cao tuổi</option>
                </select>
            </div>
            <div class="form-group">
                <label for="id-${seatNumber}">CMND/CCCD</label>
                <input type="text" id="id-${seatNumber}" class="passenger-input" data-field="id">
            </div>
        </div>
    `;
    
    // Add input event listeners
    form.querySelectorAll('.passenger-input').forEach(input => {
        input.addEventListener('input', updateBookingSummary);
        input.addEventListener('change', updateBookingSummary);
    });
    
    return form;
}

// Remove passenger form
function removePassengerForm(seatNumber) {
    const form = document.getElementById(`passengerForm-${seatNumber}`);
    if (form) {
        form.remove();
    }
}

// Update booking summary
function updateBookingSummary() {
    const ticketPrice = selectedSeats.length * seatConfig.pricePerSeat;
    const totalPrice = ticketPrice + seatConfig.serviceFee;
    
    summaryTicketPrice.textContent = ticketPrice.toLocaleString() + 'đ';
    summaryTotalPrice.textContent = totalPrice.toLocaleString() + 'đ';
    
    // Check if all required fields are filled
    const allFilled = checkPassengerForms();
    continueToPaymentBtn.disabled = !allFilled || selectedSeats.length === 0;
}

// Check if all passenger forms are filled
function checkPassengerForms() {
    if (selectedSeats.length === 0) return false;
    
    let allValid = true;
    selectedSeats.forEach(seatNumber => {
        const form = document.getElementById(`passengerForm-${seatNumber}`);
        if (!form) {
            allValid = false;
            return;
        }
        
        const nameInput = form.querySelector(`#name-${seatNumber}`);
        const phoneInput = form.querySelector(`#phone-${seatNumber}`);
        
        if (!nameInput.value.trim() || !phoneInput.value.trim()) {
            allValid = false;
        }
    });
    
    return allValid;
}

// Timer for booking
function startBookingTimer() {
    let timeLeft = 30 * 60; // 30 minutes in seconds
    const timerElement = document.getElementById('bookingTimer');
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Thời gian giữ chỗ đã hết. Vui lòng đặt vé lại.');
            window.location.href = 'bus.html';
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
    }, 1000);
}

// Continue to payment
function continueToPayment() {
    if (!checkPassengerForms()) {
        alert('Vui lòng điền đầy đủ thông tin hành khách');
        return;
    }
    
    // Collect passenger data
    const passengers = [];
    selectedSeats.forEach(seatNumber => {
        const form = document.getElementById(`passengerForm-${seatNumber}`);
        if (form) {
            const passenger = {
                seat: seatNumber,
                name: form.querySelector(`#name-${seatNumber}`).value,
                phone: form.querySelector(`#phone-${seatNumber}`).value,
                email: form.querySelector(`#email-${seatNumber}`).value,
                gender: form.querySelector(`#gender-${seatNumber}`).value,
                type: form.querySelector(`#type-${seatNumber}`).value,
                id: form.querySelector(`#id-${seatNumber}`).value
            };
            passengers.push(passenger);
        }
    });
    
    // Collect contact info
    const contactInfo = {
        name: document.getElementById('contactName').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value,
        specialRequest: document.getElementById('specialRequest').value
    };
    
    // Save to localStorage for payment page
    localStorage.setItem('bookingData', JSON.stringify({
        seats: selectedSeats,
        passengers: passengers,
        contact: contactInfo,
        totalPrice: selectedSeats.length * seatConfig.pricePerSeat + seatConfig.serviceFee
    }));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    generateSeatGrid();
    startBookingTimer();
    
    // Continue button event
    continueToPaymentBtn.addEventListener('click', continueToPayment);
    
    // Change trip button
    const changeTripBtn = document.getElementById('changeTripBtn');
    if (changeTripBtn) {
        changeTripBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn đổi chuyến? Thông tin đặt vé hiện tại sẽ bị xóa.')) {
                window.location.href = 'search.html';
            }
        });
    }
    
    // Auto-fill sample data for demo
    setTimeout(() => {
        // Auto-select some seats
        toggleSeatSelection('6A');
        toggleSeatSelection('6B');
        
        // Auto-fill passenger forms
        if (document.getElementById('name-6A')) {
            document.getElementById('name-6A').value = 'Nguyễn Văn A';
            document.getElementById('phone-6A').value = '0912345678';
            document.getElementById('email-6A').value = 'nguyenvana@email.com';
            document.getElementById('gender-6A').value = 'male';
        }
        
        if (document.getElementById('name-6B')) {
            document.getElementById('name-6B').value = 'Trần Thị B';
            document.getElementById('phone-6B').value = '0987654321';
            document.getElementById('email-6B').value = 'tranthib@email.com';
            document.getElementById('gender-6B').value = 'female';
        }
        
        // Auto-fill contact info
        document.getElementById('contactName').value = 'Nguyễn Văn A';
        document.getElementById('contactPhone').value = '0912345678';
        document.getElementById('contactEmail').value = 'nguyenvana@email.com';
        
        updateBookingSummary();
    }, 500);
});