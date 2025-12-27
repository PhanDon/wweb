// Tickets Logic
const filterTabs = document.querySelectorAll('.filter-tab');
const searchTicketsInput = document.getElementById('searchTickets');
const viewQrButtons = document.querySelectorAll('.view-qr-btn');
const detailsButtons = document.querySelectorAll('.details-btn');
const paymentButtons = document.querySelectorAll('.payment-btn');
const cancelHoldButtons = document.querySelectorAll('.cancel-hold-btn');
const qrModal = document.getElementById('qrModal');
const ticketDetailsModal = document.getElementById('ticketDetailsModal');
const paymentModal = document.getElementById('paymentModal');

// Sample tickets data (in real app, this would come from API)
let tickets = [
    {
        id: 'ML-789012',
        status: 'upcoming',
        operator: 'Mai Linh',
        from: { city: 'TP.HCM', station: 'Bến xe Miền Đông' },
        to: { city: 'HÀ NỘI', station: 'Bến xe Giáp Bát' },
        departure: { date: '31/12/2025', time: '22:00' },
        arrival: { date: '01/01/2026', time: '05:30' },
        duration: '7h30',
        seats: ['12', '13'],
        passengers: 2,
        price: 900000,
        paymentStatus: 'paid',
        bookingDate: '28/12/2025 14:30',
        qrCode: 'ML-789012'
    },
    {
        id: 'VN-456123',
        status: 'hold',
        operator: 'Vietnam Airlines',
        from: { city: 'TP.HCM', station: 'Sân bay TSN' },
        to: { city: 'HÀ NỘI', station: 'Sân bay Nội Bài' },
        departure: { date: '20/12/2025', time: '14:30' },
        arrival: { date: '20/12/2025', time: '16:30' },
        duration: '2h00',
        seats: ['15A'],
        passengers: 1,
        price: 2150000,
        paymentStatus: 'pending',
        bookingDate: '30/12/2025 09:15',
        qrCode: 'VN-456123',
        holdExpires: new Date(Date.now() + 25 * 60 * 1000) // 25 minutes from now
    },
    {
        id: 'PT-321654',
        status: 'completed',
        operator: 'Phương Trang',
        from: { city: 'ĐÀ NẴNG', station: 'Bến xe Đà Nẵng' },
        to: { city: 'NHA TRANG', station: 'Bến xe Nha Trang' },
        departure: { date: '05/01/2024', time: '08:00' },
        arrival: { date: '05/01/2024', time: '12:30' },
        duration: '4h30',
        seats: ['05'],
        passengers: 1,
        price: 450000,
        paymentStatus: 'paid',
        bookingDate: '30/12/2023 20:45',
        qrCode: 'PT-321654'
    }
];

// Filter tickets
function filterTickets(status) {
    if (status === 'all') {
        return tickets;
    }
    return tickets.filter(ticket => ticket.status === status);
}

// Search tickets
function searchTickets(query) {
    const lowerQuery = query.toLowerCase();
    return tickets.filter(ticket => 
        ticket.id.toLowerCase().includes(lowerQuery) ||
        ticket.from.city.toLowerCase().includes(lowerQuery) ||
        ticket.to.city.toLowerCase().includes(lowerQuery) ||
        ticket.operator.toLowerCase().includes(lowerQuery)
    );
}

// Show QR code
function showQRCode(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    // Update modal info
    document.getElementById('qrTicketCode').textContent = ticket.id;
    document.getElementById('qrTicketRoute').textContent = `${ticket.from.city} → ${ticket.to.city}`;
    document.getElementById('qrTicketTime').textContent = `${ticket.departure.date} • ${ticket.departure.time}`;
    
    // Generate QR code
    const qrContainer = document.getElementById('qrCodeDisplay');
    qrContainer.innerHTML = '';
    
    QRCode.toCanvas(ticket.qrCode, { 
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
        qrContainer.appendChild(canvas);
    });
    
    // Show modal
    qrModal.classList.add('active');
}

// Show ticket details
function showTicketDetails(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    const modalContent = ticketDetailsModal.querySelector('.modal-body');
    modalContent.innerHTML = `
        <div class="ticket-details-content">
            <div class="detail-section">
                <h4>Thông tin vé</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="label">Mã vé:</span>
                        <span class="value">${ticket.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Nhà xe:</span>
                        <span class="value">${ticket.operator}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Trạng thái:</span>
                        <span class="value status-${ticket.status}">
                            ${ticket.status === 'upcoming' ? 'Sắp tới' : 
                              ticket.status === 'hold' ? 'Đang giữ' : 
                              ticket.status === 'completed' ? 'Đã sử dụng' : 'Đã hủy'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Thanh toán:</span>
                        <span class="value ${ticket.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}">
                            ${ticket.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Hành trình</h4>
                <div class="journey-details">
                    <div class="journey-point">
                        <div class="point-header">
                            <span class="city">${ticket.from.city}</span>
                            <span class="time">${ticket.departure.time}</span>
                        </div>
                        <div class="point-details">
                            <span class="date">${ticket.departure.date}</span>
                            <span class="station">${ticket.from.station}</span>
                        </div>
                    </div>
                    
                    <div class="journey-info">
                        <div class="duration">${ticket.duration}</div>
                        <div class="arrow">
                            <i class="fas fa-long-arrow-alt-right"></i>
                        </div>
                        <div class="distance">${ticket.from.city === 'TP.HCM' && ticket.to.city === 'HÀ NỘI' ? '1,650 km' : '500 km'}</div>
                    </div>
                    
                    <div class="journey-point">
                        <div class="point-header">
                            <span class="city">${ticket.to.city}</span>
                            <span class="time">${ticket.arrival.time}</span>
                        </div>
                        <div class="point-details">
                            <span class="date">${ticket.arrival.date}</span>
                            <span class="station">${ticket.to.station}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Thông tin hành khách</h4>
                <div class="passenger-details">
                    <div class="detail-item">
                        <span class="label">Số ghế:</span>
                        <span class="value">${ticket.seats.join(', ')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Số lượng:</span>
                        <span class="value">${ticket.passengers} người</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Thông tin thanh toán</h4>
                <div class="payment-details">
                    <div class="detail-item">
                        <span class="label">Tổng tiền:</span>
                        <span class="value price">${ticket.price.toLocaleString()}đ</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Ngày đặt:</span>
                        <span class="value">${ticket.bookingDate}</span>
                    </div>
                    ${ticket.holdExpires ? `
                    <div class="detail-item">
                        <span class="label">Hạn thanh toán:</span>
                        <span class="value deadline">${formatTimeRemaining(ticket.holdExpires)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="modal-actions">
                ${ticket.status === 'upcoming' || ticket.status === 'hold' ? `
                    <button class="btn btn-primary" onclick="showQRCode('${ticket.id}')">
                        <i class="fas fa-qrcode"></i> Xem QR Code
                    </button>
                ` : ''}
                ${ticket.status === 'hold' ? `
                    <button class="btn btn-secondary" onclick="proceedToPayment('${ticket.id}')">
                        <i class="fas fa-credit-card"></i> Thanh toán ngay
                    </button>
                ` : ''}
                <button class="btn btn-outline" onclick="printTicket('${ticket.id}')">
                    <i class="fas fa-print"></i> In vé
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    ticketDetailsModal.classList.add('active');
}

// Show payment modal
function showPaymentModal(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    // Update payment modal with ticket info
    // This would be filled with actual ticket data
    
    // Show modal
    paymentModal.classList.add('active');
}

// Proceed to payment
function proceedToPayment(ticketId) {
    // Close details modal if open
    ticketDetailsModal.classList.remove('active');
    
    // Show payment modal
    showPaymentModal(ticketId);
}

// Cancel hold
function cancelHold(ticketId) {
    if (confirm('Bạn có chắc chắn muốn hủy giữ vé này?')) {
        // In real app: API call to cancel hold
        alert('Đã hủy giữ vé thành công');
        
        // Update ticket status
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            tickets[ticketIndex].status = 'cancelled';
            updateTicketsDisplay();
        }
    }
}

// Print ticket
function printTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Vé ${ticket.id} - TravelHub</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .ticket { border: 2px solid #333; padding: 20px; max-width: 600px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .route { display: flex; justify-content: space-between; margin: 20px 0; }
                    .details { margin: 20px 0; }
                    .qr-code { text-align: center; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="ticket">
                    <div class="header">
                        <h1>TravelHub</h1>
                        <h2>Vé xe khách</h2>
                    </div>
                    <div class="route">
                        <div>
                            <h3>${ticket.from.city}</h3>
                            <p>${ticket.from.station}</p>
                            <p>${ticket.departure.date} ${ticket.departure.time}</p>
                        </div>
                        <div>→</div>
                        <div>
                            <h3>${ticket.to.city}</h3>
                            <p>${ticket.to.station}</p>
                            <p>${ticket.arrival.date} ${ticket.arrival.time}</p>
                        </div>
                    </div>
                    <div class="details">
                        <p><strong>Mã vé:</strong> ${ticket.id}</p>
                        <p><strong>Nhà xe:</strong> ${ticket.operator}</p>
                        <p><strong>Ghế số:</strong> ${ticket.seats.join(', ')}</p>
                        <p><strong>Tổng tiền:</strong> ${ticket.price.toLocaleString()}đ</p>
                    </div>
                    <div class="qr-code">
                        <p>Quét mã QR để lên xe</p>
                        <div id="qr"></div>
                    </div>
                    <div class="footer">
                        <p>Vui lòng đến trước 30 phút giờ khởi hành</p>
                        <p>Mang theo CMND/CCCD khi lên xe</p>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js"></script>
                <script>
                    QRCode.toCanvas('${ticket.qrCode}', { width: 150 }, function(err, canvas) {
                        if (err) console.error(err);
                        document.getElementById('qr').appendChild(canvas);
                    });
                    window.print();
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Format time remaining
function formatTimeRemaining(expiryDate) {
    const now = new Date();
    const diff = expiryDate - now;
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `Còn ${hours} giờ ${minutes % 60} phút`;
    } else {
        return `Còn ${minutes} phút`;
    }
}

// Update hold timers
function updateHoldTimers() {
    const holdTickets = tickets.filter(t => t.status === 'hold' && t.holdExpires);
    
    holdTickets.forEach(ticket => {
        const timeRemaining = formatTimeRemaining(ticket.holdExpires);
        // Update display for this ticket
        const ticketElement = document.querySelector(`.ticket-card[data-id="${ticket.id}"] .deadline`);
        if (ticketElement) {
            ticketElement.textContent = timeRemaining;
        }
        
        // If expired, update status
        if (new Date() > ticket.holdExpires) {
            ticket.status = 'cancelled';
            updateTicketsDisplay();
        }
    });
}

// Update tickets display
function updateTicketsDisplay() {
    // This function would update the DOM with filtered tickets
    // For now, we'll just log the update
    console.log('Tickets updated:', tickets);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Load tickets from localStorage if available
    const savedTickets = localStorage.getItem('userTickets');
    if (savedTickets) {
        tickets = JSON.parse(savedTickets);
    }
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter tickets
            const filter = this.dataset.filter;
            const filteredTickets = filterTickets(filter);
            // Update display with filtered tickets
            console.log('Filtered tickets:', filteredTickets);
        });
    });
    
    // Search functionality
    if (searchTicketsInput) {
        searchTicketsInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query) {
                const results = searchTickets(query);
                console.log('Search results:', results);
            }
        });
    }
    
    // View QR buttons
    viewQrButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.closest('.ticket-card').querySelector('.ticket-code').textContent.replace('Mã vé: ', '');
            showQRCode(ticketId);
        });
    });
    
    // Details buttons
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.closest('.ticket-card').querySelector('.ticket-code').textContent.replace('Mã vé: ', '');
            showTicketDetails(ticketId);
        });
    });
    
    // Payment buttons
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.closest('.ticket-card').querySelector('.ticket-code').textContent.replace('Mã vé: ', '');
            showPaymentModal(ticketId);
        });
    });
    
    // Cancel hold buttons
    cancelHoldButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.closest('.ticket-card').querySelector('.ticket-code').textContent.replace('Mã vé: ', '');
            cancelHold(ticketId);
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Update hold timers every minute
    setInterval(updateHoldTimers, 60000);
    updateHoldTimers();
    
    // Print ticket button in QR modal
    const printTicketBtn = document.getElementById('printTicketBtn');
    if (printTicketBtn) {
        printTicketBtn.addEventListener('click', function() {
            const ticketId = document.getElementById('qrTicketCode').textContent;
            printTicket(ticketId);
        });
    }
    
    // Download ticket button
    const downloadTicketBtn = document.getElementById('downloadTicketBtn');
    if (downloadTicketBtn) {
        downloadTicketBtn.addEventListener('click', function() {
            alert('Đang tải vé xuống...');
            // In real app: Generate and download PDF
        });
    }
});