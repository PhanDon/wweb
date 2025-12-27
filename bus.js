// Bus Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const busFromInput = document.getElementById('busFrom');
    const busToInput = document.getElementById('busTo');
    const swapBusLocationsBtn = document.getElementById('swapBusLocations');
    const busDepartDate = document.getElementById('busDepartDate');
    const busPassengerSelector = document.getElementById('busPassengerSelector');
    const busPassengerDisplay = document.getElementById('busPassengerCount');
    const busAdultCount = document.getElementById('busAdultCount');
    const busChildCount = document.getElementById('busChildCount');
    const applyBusPassengersBtn = document.getElementById('applyBusPassengers');
    const busSearchForm = document.getElementById('busSearchForm');
    
    const floorTabs = document.querySelectorAll('.floor-tab');
    const busFloors = document.querySelectorAll('.bus-floor');
    const seats = document.querySelectorAll('.seat:not(.unavailable)');
    const busSelectedCount = document.getElementById('busSelectedCount');
    const busSelectedList = document.getElementById('busSelectedList');
    const busSeatsSummary = document.getElementById('busSeatsSummary');
    const busPassengersSummary = document.getElementById('busPassengersSummary');
    const busTicketPrice = document.getElementById('busTicketPrice');
    const busTotalPrice = document.getElementById('busTotalPrice');
    const busContinueBtn = document.getElementById('busContinueBtn');
    
    const paymentModal = document.getElementById('paymentModal');
    const qrModal = document.getElementById('qrModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const qrAmount = document.getElementById('qrAmount');
    const qrContent = document.getElementById('qrContent');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    
    // Initialize variables
    let selectedSeats = [];
    let totalPassengers = 1;
    let adultCount = 1;
    let childCount = 0;
    const seatPrice = 450000;
    const serviceFee = 10000;
    
    // Initialize date picker to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    busDepartDate.min = tomorrow.toISOString().split('T')[0];
    if (!busDepartDate.value) {
        busDepartDate.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Swap locations function
    swapBusLocationsBtn.addEventListener('click', function() {
        const fromValue = busFromInput.value;
        busFromInput.value = busToInput.value;
        busToInput.value = fromValue;
    });
    
    // Passenger selector functionality
    let passengerDropdown = null;
    
    busPassengerSelector.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (passengerDropdown && passengerDropdown.style.display === 'block') {
            passengerDropdown.style.display = 'none';
            return;
        }
        
        // Create or show dropdown
        if (!passengerDropdown) {
            passengerDropdown = busPassengerSelector.querySelector('.passenger-dropdown');
        }
        
        passengerDropdown.style.display = 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (passengerDropdown && !busPassengerSelector.contains(e.target)) {
            passengerDropdown.style.display = 'none';
        }
    });
    
    // Passenger controls
    document.querySelectorAll('.passenger-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const countElement = document.getElementById(`bus${type.charAt(0).toUpperCase() + type.slice(1)}Count`);
            let count = parseInt(countElement.textContent);
            
            if (this.classList.contains('plus')) {
                if (type === 'adult' && adultCount < 10) {
                    adultCount++;
                    countElement.textContent = adultCount;
                } else if (type === 'child' && childCount < 10) {
                    childCount++;
                    countElement.textContent = childCount;
                }
            } else if (this.classList.contains('minus')) {
                if (type === 'adult' && adultCount > 1) {
                    adultCount--;
                    countElement.textContent = adultCount;
                } else if (type === 'child' && childCount > 0) {
                    childCount--;
                    countElement.textContent = childCount;
                }
            }
            
            totalPassengers = adultCount + childCount;
        });
    });
    
    // Apply passengers
    applyBusPassengersBtn.addEventListener('click', function() {
        busPassengerDisplay.textContent = totalPassengers;
        busPassengersSummary.textContent = totalPassengers;
        updateBookingSummary();
        
        if (passengerDropdown) {
            passengerDropdown.style.display = 'none';
        }
    });
    
    // Bus floor tabs
    floorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const floor = this.getAttribute('data-floor');
            
            // Update active tab
            floorTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected floor
            busFloors.forEach(floorElement => {
                floorElement.classList.remove('active');
            });
            document.getElementById(`${floor}Floor`).classList.add('active');
        });
    });
    
    // Seat selection
    seats.forEach(seat => {
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
    
    // Update selected seats display
    function updateSelectedSeatsDisplay() {
        busSelectedCount.textContent = selectedSeats.length;
        
        if (selectedSeats.length > 0) {
            busSelectedList.textContent = `: ${selectedSeats.join(', ')}`;
            busSeatsSummary.textContent = selectedSeats.join(', ');
        } else {
            busSelectedList.textContent = '';
            busSeatsSummary.textContent = '--';
        }
        
        // Enable/disable continue button
        busContinueBtn.disabled = selectedSeats.length === 0;
        busContinueBtn.classList.toggle('disabled', selectedSeats.length === 0);
    }
    
    // Update booking summary
    function updateBookingSummary() {
        const totalSeatPrice = selectedSeats.length * seatPrice;
        const vipSeats = selectedSeats.filter(seat => seat.startsWith('U1') || seat.startsWith('U2')).length;
        const vipSurcharge = vipSeats * 50000; // VIP seats cost 50,000 more
        
        const total = totalSeatPrice + vipSurcharge + serviceFee;
        
        busTicketPrice.textContent = formatCurrency(totalSeatPrice + vipSurcharge);
        busTotalPrice.textContent = formatCurrency(total);
        
        // Update QR amount
        qrAmount.textContent = formatCurrency(total);
        qrContent.textContent = `THBUS${Date.now().toString().slice(-6)}`;
    }
    
    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
    
    // Continue to payment
    busContinueBtn.addEventListener('click', function() {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế để tiếp tục.');
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
        alert('Thanh toán thành công! Vé đã được gửi đến email của bạn.');
        qrModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset selection
        selectedSeats.forEach(seatNumber => {
            const seat = document.querySelector(`.seat[data-seat="${seatNumber}"]`);
            if (seat) {
                seat.classList.remove('selected');
            }
        });
        selectedSeats = [];
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
    busSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, this would make an API call to search for buses
        alert(`Tìm kiếm chuyến xe từ ${busFromInput.value} đến ${busToInput.value} vào ngày ${busDepartDate.value} cho ${totalPassengers} hành khách.`);
    });
    
    // Initialize booking summary
    updateBookingSummary();
});