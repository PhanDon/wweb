// Plane Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const planeFromInput = document.getElementById('planeFrom');
    const planeToInput = document.getElementById('planeTo');
    const swapPlaneLocationsBtn = document.getElementById('swapPlaneLocations');
    const planeDepartDate = document.getElementById('planeDepartDate');
    const planeReturnDate = document.getElementById('planeReturnDate');
    const planePassengerSelector = document.getElementById('planePassengerSelector');
    const planePassengerDisplay = document.getElementById('planePassengerCount');
    const planeAdultCount = document.getElementById('planeAdultCount');
    const planeChildCount = document.getElementById('planeChildCount');
    const planeInfantCount = document.getElementById('planeInfantCount');
    const applyPlanePassengersBtn = document.getElementById('applyPlanePassengers');
    const planeSearchForm = document.getElementById('planeSearchForm');
    
    const flightTypeRadios = document.querySelectorAll('input[name="flightType"]');
    const selectFlightBtns = document.querySelectorAll('.select-flight-btn');
    const seatSelectBtns = document.querySelectorAll('.seat-select-btn');
    const seatSelectionSection = document.getElementById('seatSelectionSection');
    
    const cabinTabs = document.querySelectorAll('.cabin-tab');
    const planeCabins = document.querySelectorAll('.plane-cabin');
    const planeSeats = document.querySelectorAll('.plane-cabin .seat:not(.unavailable)');
    const planeSelectedCount = document.getElementById('planeSelectedCount');
    const planeSelectedList = document.getElementById('planeSelectedList');
    const planeSeatsSummary = document.getElementById('planeSeatsSummary');
    const planePassengersSummary = document.getElementById('planePassengersSummary');
    const planeTicketPrice = document.getElementById('planeTicketPrice');
    const planeTotalPrice = document.getElementById('planeTotalPrice');
    const planeContinueBtn = document.getElementById('planeContinueBtn');
    
    const paymentModal = document.getElementById('paymentModal');
    const qrModal = document.getElementById('qrModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const qrAmount = document.getElementById('qrAmount');
    const qrContent = document.getElementById('qrContent');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    
    // Initialize variables
    let selectedFlight = null;
    let selectedSeats = [];
    let totalPassengers = 1;
    let adultCount = 1;
    let childCount = 0;
    let infantCount = 0;
    const basePrice = 2150000;
    const taxFee = 500000;
    const serviceFee = 50000;
    
    // Initialize date pickers
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    planeDepartDate.min = today.toISOString().split('T')[0];
    planeReturnDate.min = today.toISOString().split('T')[0];
    
    planeDepartDate.value = tomorrow.toISOString().split('T')[0];
    planeReturnDate.value = nextWeek.toISOString().split('T')[0];
    
    // Flight type toggle
    flightTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'oneway') {
                planeReturnDate.disabled = true;
                planeReturnDate.style.opacity = '0.5';
            } else {
                planeReturnDate.disabled = false;
                planeReturnDate.style.opacity = '1';
            }
        });
    });
    
    // Initialize flight type
    document.querySelector('input[name="flightType"][value="oneway"]').dispatchEvent(new Event('change'));
    
    // Swap locations function
    swapPlaneLocationsBtn.addEventListener('click', function() {
        const fromValue = planeFromInput.value;
        planeFromInput.value = planeToInput.value;
        planeToInput.value = fromValue;
    });
    
    // Passenger selector functionality
    let planePassengerDropdown = null;
    
    planePassengerSelector.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (planePassengerDropdown && planePassengerDropdown.style.display === 'block') {
            planePassengerDropdown.style.display = 'none';
            return;
        }
        
        // Create or show dropdown
        if (!planePassengerDropdown) {
            planePassengerDropdown = planePassengerSelector.querySelector('.passenger-dropdown');
        }
        
        planePassengerDropdown.style.display = 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (planePassengerDropdown && !planePassengerSelector.contains(e.target)) {
            planePassengerDropdown.style.display = 'none';
        }
    });
    
    // Passenger controls
    document.querySelectorAll('#planePassengerSelector .passenger-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const countElement = document.getElementById(`plane${type.charAt(0).toUpperCase() + type.slice(1)}Count`);
            let count = parseInt(countElement.textContent);
            
            if (this.classList.contains('plus')) {
                if (type === 'adult' && adultCount < 9) {
                    adultCount++;
                    countElement.textContent = adultCount;
                } else if (type === 'child' && childCount < 9) {
                    childCount++;
                    countElement.textContent = childCount;
                } else if (type === 'infant' && infantCount < adultCount) {
                    infantCount++;
                    countElement.textContent = infantCount;
                }
            } else if (this.classList.contains('minus')) {
                if (type === 'adult' && adultCount > 1) {
                    adultCount--;
                    countElement.textContent = adultCount;
                    
                    // Ensure infants don't exceed adults
                    if (infantCount > adultCount) {
                        infantCount = adultCount;
                        document.getElementById('planeInfantCount').textContent = infantCount;
                    }
                } else if (type === 'child' && childCount > 0) {
                    childCount--;
                    countElement.textContent = childCount;
                } else if (type === 'infant' && infantCount > 0) {
                    infantCount--;
                    countElement.textContent = infantCount;
                }
            }
            
            totalPassengers = adultCount + childCount + infantCount;
        });
    });
    
    // Apply passengers
    applyPlanePassengersBtn.addEventListener('click', function() {
        planePassengerDisplay.textContent = totalPassengers;
        planePassengersSummary.textContent = totalPassengers;
        updateBookingSummary();
        
        if (planePassengerDropdown) {
            planePassengerDropdown.style.display = 'none';
        }
    });
    
    // Select flight
    selectFlightBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const flightCard = this.closest('.flight-card');
            
            // Remove selected class from all flights
            document.querySelectorAll('.flight-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to clicked flight
            flightCard.classList.add('selected');
            selectedFlight = flightCard;
            
            // Update flight count
            document.getElementById('selectedFlightCount').textContent = '1';
            
            // Show seat selection section
            seatSelectionSection.style.display = 'block';
            
            // Generate plane seats
            generatePlaneSeats();
        });
    });
    
    // Seat selection
    seatSelectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const flightCard = this.closest('.flight-card');
            
            // Select the flight first
            document.querySelectorAll('.flight-card').forEach(card => {
                card.classList.remove('selected');
            });
            flightCard.classList.add('selected');
            selectedFlight = flightCard;
            
            // Update flight count
            document.getElementById('selectedFlightCount').textContent = '1';
            
            // Show seat selection section
            seatSelectionSection.style.display = 'block';
            
            // Scroll to seat selection
            seatSelectionSection.scrollIntoView({ behavior: 'smooth' });
            
            // Generate plane seats
            generatePlaneSeats();
        });
    });
    
    // Cabin class tabs
    cabinTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const cabin = this.getAttribute('data-cabin');
            
            // Update active tab
            cabinTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected cabin
            planeCabins.forEach(cabinElement => {
                cabinElement.classList.remove('active');
            });
            document.getElementById(`${cabin}Cabin`).classList.add('active');
        });
    });
    
    // Generate plane seats
    function generatePlaneSeats() {
        const economyCabin = document.getElementById('economyCabin');
        const seatsGrid = economyCabin.querySelector('.seats-grid');
        
        // Clear existing seats (except first sample row)
        const sampleRow = seatsGrid.querySelector('.seat-row');
        seatsGrid.innerHTML = '';
        seatsGrid.appendChild(sampleRow);
        
        // Generate rows 11-39
        for (let row = 11; row <= 39; row++) {
            const seatRow = document.createElement('div');
            seatRow.className = 'seat-row';
            
            // Row number
            const rowNumber = document.createElement('div');
            rowNumber.className = 'row-number';
            rowNumber.textContent = row;
            seatRow.appendChild(rowNumber);
            
            // Left side seats (A, B, C)
            const leftGroup = document.createElement('div');
            leftGroup.className = 'seat-group';
            
            ['A', 'B', 'C'].forEach(letter => {
                const seat = createSeatElement(`${row}${letter}`);
                leftGroup.appendChild(seat);
            });
            seatRow.appendChild(leftGroup);
            
            // Aisle
            const aisle1 = document.createElement('div');
            aisle1.className = 'aisle';
            aisle1.textContent = 'LỐI ĐI';
            seatRow.appendChild(aisle1);
            
            // Middle seats (D, E, F, G)
            const middleGroup = document.createElement('div');
            middleGroup.className = 'seat-group';
            
            ['D', 'E', 'F', 'G'].forEach(letter => {
                const seat = createSeatElement(`${row}${letter}`);
                middleGroup.appendChild(seat);
            });
            seatRow.appendChild(middleGroup);
            
            // Aisle
            const aisle2 = document.createElement('div');
            aisle2.className = 'aisle';
            aisle2.textContent = 'LỐI ĐI';
            seatRow.appendChild(aisle2);
            
            // Right side seats (H, J, K)
            const rightGroup = document.createElement('div');
            rightGroup.className = 'seat-group';
            
            ['H', 'J', 'K'].forEach(letter => {
                const seat = createSeatElement(`${row}${letter}`);
                rightGroup.appendChild(seat);
            });
            seatRow.appendChild(rightGroup);
            
            seatsGrid.appendChild(seatRow);
        }
        
        // Add event listeners to all seats
        addSeatEventListeners();
    }
    
    // Create seat element
    function createSeatElement(seatNumber) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.setAttribute('data-seat', seatNumber);
        seat.textContent = seatNumber;
        
        // Mark some seats as unavailable (randomly)
        if (Math.random() < 0.2) {
            seat.classList.add('unavailable');
        }
        
        // Mark exit rows
        const row = parseInt(seatNumber.match(/\d+/)[0]);
        if (row === 15 || row === 16 || row === 25 || row === 26) {
            seat.setAttribute('data-row', row);
        }
        
        return seat;
    }
    
    // Add seat event listeners
    function addSeatEventListeners() {
        const allSeats = document.querySelectorAll('.plane-cabin .seat:not(.unavailable)');
        
        allSeats.forEach(seat => {
            seat.addEventListener('click', function() {
                const seatNumber = this.getAttribute('data-seat');
                
                if (this.classList.contains('selected')) {
                    // Deselect seat
                    this.classList.remove('selected');
                    selectedSeats = selectedSeats.filter(s => s !== seatNumber);
                } else {
                    // Check if max seats reached
                    if (selectedSeats.length >= totalPassengers) {
                        alert(`Bạn chỉ có thể chọn tối đa ${totalPassengers} ghế cho ${totalPassengers} hành khách.`);
                        return;
                    }
                    
                    // Select seat
                    this.classList.add('selected');
                    selectedSeats.push(seatNumber);
                }
                
                updateSelectedSeatsDisplay();
                updateBookingSummary();
            });
        });
    }
    
    // Update selected seats display
    function updateSelectedSeatsDisplay() {
        planeSelectedCount.textContent = selectedSeats.length;
        
        if (selectedSeats.length > 0) {
            planeSelectedList.textContent = `: ${selectedSeats.join(', ')}`;
            planeSeatsSummary.textContent = selectedSeats.join(', ');
        } else {
            planeSelectedList.textContent = '';
            planeSeatsSummary.textContent = '--';
        }
        
        // Enable/disable continue button
        planeContinueBtn.disabled = selectedSeats.length === 0;
        planeContinueBtn.classList.toggle('disabled', selectedSeats.length === 0);
    }
    
    // Update booking summary
    function updateBookingSummary() {
        const totalSeatPrice = selectedSeats.length * basePrice;
        const totalTax = selectedSeats.length * taxFee;
        const totalServiceFee = selectedSeats.length * serviceFee;
        
        const total = totalSeatPrice + totalTax + totalServiceFee;
        
        planeTicketPrice.textContent = formatCurrency(totalSeatPrice);
        planeTotalPrice.textContent = formatCurrency(total);
        
        // Update QR amount
        qrAmount.textContent = formatCurrency(total);
        qrContent.textContent = `THPLANE${Date.now().toString().slice(-6)}`;
    }
    
    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
    
    // Continue to payment
    planeContinueBtn.addEventListener('click', function() {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế để tiếp tục.');
            return;
        }
        
        if (!selectedFlight) {
            alert('Vui lòng chọn một chuyến bay trước.');
            return;
        }
        
        // Show payment modal
        paymentModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const paymentMethod = this.getAttribute('data-method');
            
            if (paymentMethod === 'transfer') {
                // Show QR modal for bank transfer
                paymentModal.classList.remove('active');
                qrModal.classList.add('active');
                
                // Start countdown for QR payment
                startQRCountdown();
            } else if (paymentMethod === 'cash') {
                alert('Bạn đã chọn thanh toán tiền mặt. Vui lòng đến văn phòng TravelHub trong vòng 30 phút để hoàn tất thanh toán.');
                paymentModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            } else {
                alert(`Phương thức ${paymentMethod} đang được phát triển. Vui lòng chọn phương thức khác.`);
            }
        });
    });
    
    // Close modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close modals when clicking overlay
    [paymentModal, qrModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Confirm payment
    confirmPaymentBtn.addEventListener('click', function() {
        alert('Thanh toán thành công! Vé máy bay đã được gửi đến email của bạn.');
        qrModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset selection
        selectedFlight = null;
        selectedSeats.forEach(seatNumber => {
            const seat = document.querySelector(`.seat[data-seat="${seatNumber}"]`);
            if (seat) {
                seat.classList.remove('selected');
            }
        });
        selectedSeats = [];
        
        document.querySelectorAll('.flight-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        seatSelectionSection.style.display = 'none';
        updateSelectedSeatsDisplay();
        updateBookingSummary();
    });
    
    // QR countdown timer
    function startQRCountdown() {
        let timeLeft = 15 * 60; // 15 minutes in seconds
        const timeoutElement = document.getElementById('qrTimeout');
        
        const countdown = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timeoutElement.textContent = 'Đã hết hạn';
                timeoutElement.style.color = '#ff6b6b';
                
                // Auto close modal after expiration
                setTimeout(() => {
                    if (qrModal.classList.contains('active')) {
                        qrModal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                        alert('Mã QR đã hết hạn. Vui lòng thử lại.');
                    }
                }, 2000);
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeoutElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            timeLeft--;
        }, 1000);
    }
    
    // Form submission
    planeSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const flightType = document.querySelector('input[name="flightType"]:checked').value;
        let message = `Tìm kiếm chuyến bay ${flightType === 'oneway' ? 'một chiều' : flightType === 'roundtrip' ? 'khứ hồi' : 'nhiều chặng'} từ ${planeFromInput.value} đến ${planeToInput.value} vào ngày ${planeDepartDate.value}`;
        
        if (flightType === 'roundtrip' && planeReturnDate.value) {
            message += `, về ngày ${planeReturnDate.value}`;
        }
        
        message += ` cho ${totalPassengers} hành khách.`;
        
        alert(message);
    });
    
    // Initialize booking summary
    updateBookingSummary();
    
    // Initial seat generation for sample row
    addSeatEventListeners();
});