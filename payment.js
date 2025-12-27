// Payment Logic
const paymentMethodCards = document.querySelectorAll('.method-card');
const methodDetails = document.querySelectorAll('.method-details');
const paymentFeeElement = document.getElementById('paymentFee');
const totalPaymentElement = document.getElementById('totalPayment');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
const copyBankInfoBtn = document.getElementById('copyBankInfo');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoCodeInput = document.getElementById('promoCode');
const paymentTimer = document.getElementById('paymentTimer');

// Payment methods configuration
const paymentMethods = {
    qr: { fee: 0, name: 'QR Code' },
    bank: { fee: 0, name: 'Chuyển khoản' },
    card: { fee: 0.015, name: 'Thẻ tín dụng' },
    wallet: { fee: 0, name: 'Ví điện tử' },
    cash: { fee: 10000, name: 'Tiền mặt' }
};

// Promo codes
const promoCodes = {
    'TET2025': { discount: 50000, minAmount: 500000 },
    'FIRSTBOOK': { discount: 100000, minAmount: 1000000 },
    'TRAVELHUB10': { discount: 0.1, type: 'percentage' }
};

let selectedMethod = 'qr';
let appliedPromo = null;
let baseAmount = 910000; // Ticket price + service fee

// Initialize payment page
function initializePayment() {
    // Load booking data
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    if (!bookingData) {
        alert('Không tìm thấy thông tin đặt vé. Vui lòng đặt lại.');
        window.location.href = 'bus.html';
        return;
    }
    
    baseAmount = bookingData.totalPrice || 910000;
    updatePaymentSummary();
    
    // Generate QR code for payment
    generatePaymentQR();
    
    // Start payment timer
    startPaymentTimer();
}

// Select payment method
function selectPaymentMethod(method) {
    selectedMethod = method;
    
    // Update active card
    paymentMethodCards.forEach(card => {
        if (card.dataset.method === method) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    // Show corresponding details
    methodDetails.forEach(detail => {
        if (detail.id === `${method}Method`) {
            detail.classList.add('active');
        } else {
            detail.classList.remove('active');
        }
    });
    
    // Update payment fee and total
    updatePaymentSummary();
}

// Update payment summary
function updatePaymentSummary() {
    const method = paymentMethods[selectedMethod];
    const fee = method.fee === 0.015 ? Math.round(baseAmount * 0.015) : method.fee;
    
    // Calculate discount
    let discount = 0;
    if (appliedPromo) {
        if (appliedPromo.type === 'percentage') {
            discount = Math.round(baseAmount * appliedPromo.discount);
        } else {
            discount = appliedPromo.discount;
        }
    }
    
    const total = baseAmount + fee - discount;
    
    // Update display
    paymentFeeElement.textContent = fee.toLocaleString() + 'đ';
    totalPaymentElement.textContent = total.toLocaleString() + 'đ';
}

// Generate QR code for payment
function generatePaymentQR() {
    const qrContainer = document.getElementById('paymentQr');
    if (!qrContainer) return;
    
    const paymentData = {
        account: '0123456789',
        bank: 'Vietcombank',
        amount: baseAmount,
        content: `TH${Date.now()} TravelHub`
    };
    
    const qrText = JSON.stringify(paymentData);
    
    QRCode.toCanvas(qrText, { 
        width: 200,
        height: 200,
        color: {
            dark: '#0A1F3C',
            light: '#FFFFFF'
        }
    }, function(err, canvas) {
        if (err) {
            console.error(err);
            qrContainer.innerHTML = `
                <div class="qr-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Không thể tạo mã QR</p>
                </div>
            `;
            return;
        }
        
        qrContainer.innerHTML = '';
        qrContainer.appendChild(canvas);
    });
}

// Apply promo code
function applyPromoCode() {
    const code = promoCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        alert('Vui lòng nhập mã khuyến mãi');
        return;
    }
    
    if (!promoCodes[code]) {
        alert('Mã khuyến mãi không hợp lệ');
        promoCodeInput.value = '';
        return;
    }
    
    const promo = promoCodes[code];
    
    // Check minimum amount for fixed discount
    if (promo.minAmount && baseAmount < promo.minAmount) {
        alert(`Mã này chỉ áp dụng cho đơn hàng từ ${promo.minAmount.toLocaleString()}đ`);
        promoCodeInput.value = '';
        return;
    }
    
    appliedPromo = promo;
    updatePaymentSummary();
    
    // Show success message
    alert(`Áp dụng thành công mã ${code}! Bạn được giảm ${promo.type === 'percentage' ? (promo.discount * 100) + '%' : promo.discount.toLocaleString() + 'đ'}`);
    
    // Disable input and button
    promoCodeInput.disabled = true;
    applyPromoBtn.disabled = true;
    applyPromoBtn.textContent = 'Đã áp dụng';
}

// Copy bank info
function copyBankInfo() {
    const bankInfo = `Ngân hàng: Vietcombank\nSố tài khoản: 0123456789\nChủ tài khoản: CÔNG TY TRAVELHUB\nChi nhánh: HCM - Trần Hưng Đạo\nNội dung: TH ML789012 Nguyenvana`;
    
    navigator.clipboard.writeText(bankInfo).then(() => {
        // Show success feedback
        const originalText = copyBankInfoBtn.innerHTML;
        copyBankInfoBtn.innerHTML = '<i class="fas fa-check"></i> Đã sao chép';
        copyBankInfoBtn.classList.add('success');
        
        setTimeout(() => {
            copyBankInfoBtn.innerHTML = originalText;
            copyBankInfoBtn.classList.remove('success');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Không thể sao chép. Vui lòng thử lại.');
    });
}

// Confirm payment
function confirmPayment() {
    // Validate required fields based on method
    if (selectedMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVC = document.getElementById('cardCVC').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
            alert('Vui lòng điền đầy đủ thông tin thẻ');
            return;
        }
    }
    
    // Show loading
    confirmPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    confirmPaymentBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Save payment info
        const paymentInfo = {
            method: selectedMethod,
            amount: baseAmount + (paymentMethods[selectedMethod].fee === 0.015 ? Math.round(baseAmount * 0.015) : paymentMethods[selectedMethod].fee) - (appliedPromo ? (appliedPromo.type === 'percentage' ? Math.round(baseAmount * appliedPromo.discount) : appliedPromo.discount) : 0),
            promoCode: appliedPromo ? promoCodeInput.value : null,
            transactionId: 'TH' + Date.now(),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
        
        // Generate ticket
        generateTicket();
        
        // Show success modal
        showPaymentSuccess();
    }, 2000);
}

// Generate ticket after payment
function generateTicket() {
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo'));
    
    const ticket = {
        id: paymentInfo.transactionId,
        bookingDate: new Date().toLocaleString('vi-VN'),
        trip: {
            operator: 'Mai Linh Express',
            from: 'TP.HCM - Bến xe Miền Đông',
            to: 'HÀ NỘI - Bến xe Giáp Bát',
            departure: '31/12/2025 22:00',
            arrival: '01/01/2026 05:30'
        },
        passengers: bookingData.passengers,
        seats: bookingData.seats,
        contact: bookingData.contact,
        payment: paymentInfo,
        qrCode: paymentInfo.transactionId
    };
    
    // Save ticket
    let userTickets = JSON.parse(localStorage.getItem('userTickets')) || [];
    userTickets.push(ticket);
    localStorage.setItem('userTickets', JSON.stringify(userTickets));
    
    // Clear booking data
    localStorage.removeItem('bookingData');
}

// Show payment success modal
function showPaymentSuccess() {
    const modal = document.getElementById('paymentSuccessModal');
    if (modal) {
        modal.classList.add('active');
        
        // Close modal after 30 seconds
        setTimeout(() => {
            modal.classList.remove('active');
            window.location.href = 'my-tickets.html';
        }, 30000);
    }
}

// Start payment timer
function startPaymentTimer() {
    let timeLeft = 30 * 60; // 30 minutes in seconds
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('Thời gian thanh toán đã hết. Vui lòng đặt vé lại.');
            window.location.href = 'bus.html';
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        paymentTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
    }, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializePayment();
    
    // Payment method selection
    paymentMethodCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPaymentMethod(this.dataset.method);
        });
    });
    
    // Wallet selection
    document.querySelectorAll('.wallet-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.wallet-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Copy bank info button
    if (copyBankInfoBtn) {
        copyBankInfoBtn.addEventListener('click', copyBankInfo);
    }
    
    // Apply promo button
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Confirm payment button
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', confirmPayment);
    }
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
            window.location.href = 'my-tickets.html';
        });
    });
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                window.location.href = 'my-tickets.html';
            }
        });
    });
});