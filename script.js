// Mobile Navigation
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile nav when clicking on links
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Passenger Selector
const passengerSelector = document.getElementById('passengerSelector');
const passengerCount = document.getElementById('passengerCount');
const adultCount = document.getElementById('adultCount');
const childCount = document.getElementById('childCount');
const infantCount = document.getElementById('infantCount');
const applyPassengers = document.getElementById('applyPassengers');

let passengers = {
    adult: 1,
    child: 0,
    infant: 0
};

function updatePassengerDisplay() {
    const total = passengers.adult + passengers.child + passengers.infant;
    passengerCount.textContent = total;
    
    let displayText = `${total} hành khách`;
    if (passengers.child > 0) displayText += ` (${passengers.child} trẻ em)`;
    if (passengers.infant > 0) displayText += ` (${passengers.infant} em bé)`;
    
    passengerCount.textContent = displayText;
}

document.querySelectorAll('.passenger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const isPlus = btn.classList.contains('plus');
        
        if (isPlus) {
            passengers[type]++;
        } else {
            if (passengers[type] > 0) {
                passengers[type]--;
                // Ensure at least 1 adult
                if (type === 'adult' && passengers.adult === 0) {
                    passengers.adult = 1;
                }
            }
        }
        
        // Update counts
        adultCount.textContent = passengers.adult;
        childCount.textContent = passengers.child;
        infantCount.textContent = passengers.infant;
        
        // Update display
        updatePassengerDisplay();
    });
});

if (applyPassengers) {
    applyPassengers.addEventListener('click', () => {
        passengerSelector.querySelector('.passenger-dropdown').style.display = 'none';
    });
}

// Swap Locations
const swapBtn = document.getElementById('swapLocations');
const fromInput = document.getElementById('fromLocation');
const toInput = document.getElementById('toLocation');

if (swapBtn && fromInput && toInput) {
    swapBtn.addEventListener('click', () => {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
        
        // Animation
        swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });
}

// Search Form Submission
const searchForm = document.getElementById('mainSearchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const from = fromInput.value.trim();
        const to = toInput.value.trim();
        const date = document.getElementById('departDate').value;
        
        if (!from || !to) {
            alert('Vui lòng nhập đầy đủ điểm đi và điểm đến');
            return;
        }
        
        // Redirect to search page with parameters
        const params = new URLSearchParams({
            from: from,
            to: to,
            date: date,
            passengers: JSON.stringify(passengers)
        });
        
        window.location.href = `search.html?${params.toString()}`;
    });
}

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(input => {
    input.min = today;
    if (!input.value) {
        input.value = today;
    }
});

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
const logoutBtnMobile = document.getElementById('logoutBtnMobile');

function handleLogout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // In real app: Clear session/token
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
    }
}

if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', handleLogout);

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePassengerDisplay();
    
    // Add active class to current page in nav
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.main-nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (linkPage === 'index.html' && currentPage === '')) {
            link.classList.add('active');
        }
    });
    // Common JavaScript for All Pages

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close mobile menu when clicking on a link
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutBtnMobile');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    alert('Đăng xuất thành công!');
                    window.location.href = 'index.html';
                }
            });
        }
    });
    
    // Notification badge click
    const notifications = document.querySelector('.notifications');
    if (notifications) {
        notifications.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Bạn có 3 thông báo mới!');
        });
    }
    
    // User profile dropdown for mobile
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = this.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (userProfile && !userProfile.contains(e.target)) {
                const dropdown = userProfile.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            }
        });
    }
    
    // Form validation helper
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--danger-color)';
                
                // Add error message
                let errorMsg = input.parentNode.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = 'var(--danger-color)';
                    errorMsg.style.fontSize = '0.8rem';
                    errorMsg.style.marginTop = '5px';
                    input.parentNode.appendChild(errorMsg);
                }
                errorMsg.textContent = 'Trường này là bắt buộc';
            } else {
                input.style.borderColor = 'var(--border-color)';
                
                // Remove error message
                const errorMsg = input.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        return isValid;
    }
    
    // Currency formatter
    window.formatCurrency = function(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    
    // Date formatter
    window.formatDate = function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    // Time formatter
    window.formatTime = function(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const title = this.getAttribute('title');
            if (title) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = title;
                tooltip.style.position = 'absolute';
                tooltip.style.background = 'var(--secondary-color)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '0.8rem';
                tooltip.style.zIndex = '1000';
                tooltip.style.whiteSpace = 'nowrap';
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
                
                this.setAttribute('data-tooltip', title);
                this.removeAttribute('title');
                
                this.addEventListener('mouseleave', function() {
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                    this.setAttribute('title', title);
                });
            }
        });
    });
    
    // Add loading animation
    window.showLoading = function(element) {
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>Đang tải...</p>
        `;
        loader.style.textAlign = 'center';
        loader.style.padding = '40px';
        
        const spinner = loader.querySelector('.spinner');
        spinner.style.width = '40px';
        spinner.style.height = '40px';
        spinner.style.border = '4px solid var(--border-color)';
        spinner.style.borderTop = '4px solid var(--primary-color)';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.margin = '0 auto 20px';
        
        element.innerHTML = '';
        element.appendChild(loader);
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Remove loading animation
    window.hideLoading = function(element) {
        const loader = element.querySelector('.loading-spinner');
        if (loader) {
            loader.remove();
        }
    };
    
    // Toast notification
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.background = type === 'success' ? 'var(--success-color)' : 
                                type === 'error' ? 'var(--danger-color)' : 
                                type === 'warning' ? 'var(--warning-color)' : 
                                'var(--secondary-color)';
        toast.style.color = 'white';
        toast.style.padding = '15px 25px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        toast.style.zIndex = '10000';
        toast.style.animation = 'slideIn 0.3s ease';
        
        document.body.appendChild(toast);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    };
});
});