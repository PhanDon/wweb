// Train Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const trainFromInput = document.getElementById('trainFrom');
    const trainToInput = document.getElementById('trainTo');
    const swapTrainLocationsBtn = document.getElementById('swapTrainLocations');
    const trainDepartDate = document.getElementById('trainDepartDate');
    const trainTypeSelect = document.getElementById('trainType');
    const trainPassengerSelector = document.getElementById('trainPassengerSelector');
    const trainPassengerDisplay = document.getElementById('trainPassengerCount');
    const trainAdultCount = document.getElementById('trainAdultCount');
    const trainChildCount = document.getElementById('trainChildCount');
    const applyTrainPassengersBtn = document.getElementById('applyTrainPassengers');
    const trainSearchForm = document.getElementById('trainSearchForm');
    
    const selectTrainBtns = document.querySelectorAll('.select-train-btn');
    const seatSelectBtns = document.querySelectorAll('.seat-select-btn');
    const seatSelectionSection = document.getElementById('seatSelectionSection');
    
    const compartmentOptions = document.querySelectorAll('.compartment-option');
    const trainCompartments = document.querySelectorAll('.train-compartment');
    const trainBerths = document.querySelectorAll('.train-compartment .berth:not(.unavailable)');
    const trainSelectedCount = document.getElementById('trainSelectedCount');
    const trainSelectedList = document.getElementById('trainSelectedList');
    const trainSeatsSummary = document.getElementById('trainSeatsSummary');
    const trainPassengersSummary = document.getElementById('trainPassengersSummary');
    const trainTicketPrice = document.getElementById('trainTicketPrice');
    const trainTotalPrice = document.getElementById('trainTotalPrice');
    const trainContinueBtn = document.getElementById('trainContinueBtn');
    
    const paymentModal = document.getElementById('paymentModal');
    const qrModal = document.getElementById('qrModal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const qrAmount = document.getElementById('qrAmount');
    const qrContent = document.getElementById('qrContent');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    
    // Initialize variables
    let selectedTrain = null;
    let selectedBerths = [];
    let totalPassengers = 1;
    let adultCount = 1;
    let childCount = 0;
    const basePrice = 1250000;
    const serviceFee = 30000;
    
    // Initialize date picker to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    trainDepartDate.min = tomorrow.toISOString().split('T')[0];
    trainDepartDate.value = tomorrow.toISOString().split('T')[0];
    
    // Swap locations function
    swapTrainLocationsBtn.addEventListener('click', function() {
        const fromValue = trainFromInput.value;
        trainFromInput.value = trainToInput.value;
        trainToInput.value = fromValue;
    });
    
    // Passenger selector functionality
    let trainPassengerDropdown = null;
    
    trainPassengerSelector.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (trainPassengerDropdown && trainPassengerDropdown.style.display === 'block') {
            trainPassengerDropdown.style.display = 'none';
            return;
        }
        
        // Create or show dropdown
        if (!trainPassengerDropdown) {
            trainPassengerDropdown = trainPassengerSelector.querySelector('.passenger-dropdown');
        }
        
        trainPassengerDropdown.style.display = 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (trainPassengerDropdown && !trainPassengerSelector.contains(e.target)) {
            trainPassengerDropdown.style.display = 'none';
        }
    });
    
    // Passenger controls
    document.querySelectorAll('#trainPassengerSelector .passenger-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const countElement = document.getElementById(`train${type.charAt(0).toUpperCase() + type.slice(1)}Count`);
            let count = parseInt(countElement.textContent);
            
            if (this.classList.contains('plus')) {
                if (type === 'adult' && adultCount < 8) {
                    adultCount++;
                    countElement.textContent = adultCount;
                } else if (type === 'child' && childCount < 8) {
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
    applyTrainPassengersBtn.addEventListener('click', function() {
        trainPassengerDisplay.textContent = totalPassengers;
        trainPassengersSummary.textContent = totalPassengers;
        updateBookingSummary();
        
        if (trainPassengerDropdown) {
            trainPassengerDropdown.style.display = 'none';
        }
    });
    
    // Select train
    selectTrainBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const trainCard = this.closest('.train-card');
            
            // Remove selected class from all trains
            document.querySelectorAll('.train-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to clicked train
            trainCard.classList.add('selected');
            selectedTrain = trainCard;
            
            // Update train count
            document.getElementById('selectedTrainCount').textContent = '1';
            
            // Show seat selection section
            seatSelectionSection.style.display = 'block';
            
            // Generate train compartments
            generateTrainCompartments();
        });
    });
    
    // Seat selection
    seatSelectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const trainCard = this.closest('.train-card');
            
            // Select the train first
            document.querySelectorAll('.train-card').forEach(card => {
                card.classList.remove('selected');
            });
            trainCard.classList.add('selected');
            selectedTrain = trainCard;
            
            // Update train count
            document.getElementById('selectedTrainCount').textContent = '1';
            
            // Show seat selection section
            seatSelectionSection.style.display = 'block';
            
            // Scroll to seat selection
            seatSelectionSection.scrollIntoView({ behavior: 'smooth' });
            
            // Generate train compartments
            generateTrainCompartments();
        });
    });
    
    // Compartment selection
    compartmentOptions.forEach(option => {
        option.addEventListener('click', function() {
            const compartment = this.getAttribute('data-compartment');
            
            // Update active option
            compartmentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected compartment
            trainCompartments.forEach(comp => comp.classList.remove('active'));
            document.getElementById(`compartment${compartment}`).classList.add('active');
        });
    });
    
    // Generate train compartments (20 compartments, 4 berths each = 80 seats)
    function generateTrainCompartments() {
        const compartment1 = document.getElementById('compartment1');
        const compartmentsGrid = compartment1.querySelector('.compartments-grid');
        
        // Clear existing compartments (except first sample compartment)
        const sampleCompartment = compartmentsGrid.querySelector('.compartment-unit');
        compartmentsGrid.innerHTML = '';
        compartmentsGrid.appendChild(sampleCompartment);
        
        // Generate compartments 2-20
        for (let comp = 2; comp <= 20; comp++) {
            const compartmentUnit = document.createElement('div');
            compartmentUnit.className = 'compartment-unit';
            
            // Compartment number
            const compNumber = document.createElement('div');
            compNumber.className = 'compartment-number';
            compNumber.textContent = `Khoang ${comp}`;
            compartmentUnit.appendChild(compNumber);
            
            // Berth layout
            const berthLayout = document.createElement('div');
            berthLayout.className = 'berth-layout';
            
            // Upper berths
            const upperBerths = document.createElement('div');
            upperBerths.className = 'upper-berths';
            
            ['A', 'B'].forEach(letter => {
                const berth = createBerthElement(`${comp}${letter}`, 'upper');
                upperBerths.appendChild(berth);
            });
            berthLayout.appendChild(upperBerths);
            
            // Lower berths
            const lowerBerths = document.createElement('div');
            lowerBerths.className = 'lower-berths';
            
            ['C', 'D'].forEach(letter => {
                const berth = createBerthElement(`${comp}${letter}`, 'lower');
                lowerBerths.appendChild(berth);
            });
            berthLayout.appendChild(lowerBerths);
            
            compartmentUnit.appendChild(berthLayout);
            compartmentsGrid.appendChild(compartmentUnit);
        }
        
        // Add event listeners to all berths
        addBerthEventListeners();
    }
    
    // Create berth element
    function createBerthElement(berthNumber, type) {
        const berth = document.createElement('div');
        berth.className = `berth ${type}`;
        berth.setAttribute('data-berth', berthNumber);
        
        const berthNumSpan = document.createElement('span');
        berthNumSpan.className = 'berth-number';
        berthNumSpan.textContent = berthNumber;
        
        const berthTypeSpan = document.createElement('span');
        berthTypeSpan.className = 'berth-type';
        berthTypeSpan.textContent = type === 'upper' ? 'Trên' : 'Dưới';
        
        berth.appendChild(berthNumSpan);
        berth.appendChild(berthTypeSpan);
        
        // Mark some berths as unavailable (randomly)
        if (Math.random() < 0.15) {
            berth.classList.add('unavailable');
        }
        
        return berth;
    }
    
    // Add berth event listeners
    function addBerthEventListeners() {
        const allBerths = document.querySelectorAll('.train-compartment .berth:not(.unavailable)');
        
        allBerths.forEach(berth => {
            berth.addEventListener('click', function() {
                const berthNumber = this.getAttribute('data-berth');
                
                if (this.classList.contains('selected')) {
                    // Deselect berth
                    this.classList.remove('selected');
                    selectedBerths = selectedBerths.filter(b => b !== berthNumber);
                } else {
                    // Check if max berths reached
                    if (selectedBerths.length >= totalPassengers) {
                        alert(`Bạn chỉ có thể chọn tối đa ${totalPassengers} giường cho ${totalPassengers} hành khách.`);
                        return;
                    }
                    
                    // Select berth
                    this.classList.add('selected');
                    selectedBerths.push(berthNumber);
                }
                
                updateSelectedBerthsDisplay();
                updateBookingSummary();
            });
        });
    }
    
    // Update selected berths display
    function updateSelectedBerthsDisplay() {
        trainSelectedCount.textContent = selectedBerths.length;
        
        if (selectedBerths.length > 0) {
            trainSelectedList.textContent = `: ${selectedBerths.join(', ')}`;
            trainSeatsSummary.textContent = selectedBerths.join(', ');
        } else {
            trainSelectedList.textContent = '';
            trainSeatsSummary.textContent = '--';
        }
        
        // Enable/disable continue button
        trainContinueBtn.disabled = selectedBerths.length === 0;
        trainContinueBtn.classList.toggle('disabled', selectedBerths.length === 0);
    }
    
    // Update booking summary
    function updateBookingSummary() {
        const totalBerthPrice = selectedBerths.length * basePrice;
        const totalServiceFee = selectedBerths.length * serviceFee;
        
        const total = totalBerthPrice + totalServiceFee;
        
        trainTicketPrice.textContent = formatCurrency(totalBerthPrice);
        trainTotalPrice.textContent = formatCurrency(total);
        
        // Update QR amount
        qrAmount.textContent = formatCurrency(total);
        qrContent.textContent = `THTRAIN${Date.now().toString().slice(-6)}`;
    }
    
    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
    
    // Continue to payment
    trainContinueBtn.addEventListener('click', function() {
        if (selectedBerths.length === 0) {
            alert('Vui lòng chọn ít nhất một giường để tiếp tục.');
            return;
        }
        
        if (!selectedTrain) {
            alert('Vui lòng chọn một chuyến tàu trước.');
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
                alert('Bạn đã chọn thanh toán tiền mặt. Vui lòng đến văn phòng TravelHub hoặc ga tàu trong vòng 30 phút để hoàn tất thanh toán.');
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
        alert('Thanh toán thành công! Vé tàu hỏa đã được gửi đến email của bạn.');
        qrModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset selection
        selectedTrain = null;
        selectedBerths.forEach(berthNumber => {
            const berth = document.querySelector(`.berth[data-berth="${berthNumber}"]`);
            if (berth) {
                berth.classList.remove('selected');
            }
        });
        selectedBerths = [];
        
        document.querySelectorAll('.train-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        seatSelectionSection.style.display = 'none';
        updateSelectedBerthsDisplay();
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
    trainSearchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const trainType = trainTypeSelect.value;
        let typeName = '';
        switch(trainType) {
            case 'express': typeName = 'Thống nhất'; break;
            case 'fast': typeName = 'Nhanh'; break;
            case 'local': typeName = 'Địa phương'; break;
        }
        
        alert(`Tìm kiếm chuyến tàu ${typeName} từ ${trainFromInput.value} đến ${trainToInput.value} vào ngày ${trainDepartDate.value} cho ${totalPassengers} hành khách.`);
    });
    
    // Initialize booking summary
    updateBookingSummary();
    
    // Initial berth generation for sample compartment
    addBerthEventListeners();
});