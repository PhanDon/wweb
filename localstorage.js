// LocalStorage Management for TravelHub
const STORAGE_KEYS = {
    BOOKINGS: 'travelhub_bookings',
    USER_PREFERENCES: 'travelhub_user_prefs',
    RECENT_SEARCHES: 'travelhub_recent_searches'
};

class LocalStorageManager {
    // Save booking
    static saveBooking(booking) {
        const bookings = this.getBookings();
        booking.id = Date.now().toString(); // Generate unique ID
        booking.createdAt = new Date().toISOString();
        bookings.push(booking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        return booking;
    }
    
    // Get all bookings
    static getBookings() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    }
    
    // Get booking by ID
    static getBookingById(id) {
        const bookings = this.getBookings();
        return bookings.find(booking => booking.id === id);
    }
    
    // Update booking status
    static updateBookingStatus(id, status) {
        const bookings = this.getBookings();
        const bookingIndex = bookings.findIndex(booking => booking.id === id);
        
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = status;
            bookings[bookingIndex].updatedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
            return true;
        }
        return false;
    }
    
    // Cancel booking
    static cancelBooking(id) {
        return this.updateBookingStatus(id, 'cancelled');
    }
    
    // Save user preferences
    static saveUserPreferences(prefs) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
    }
    
    // Get user preferences
    static getUserPreferences() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)) || {};
    }
    
    // Save recent search
    static saveRecentSearch(search) {
        const searches = this.getRecentSearches();
        search.timestamp = new Date().toISOString();
        searches.unshift(search);
        
        // Keep only last 10 searches
        if (searches.length > 10) {
            searches.pop();
        }
        
        localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
    }
    
    // Get recent searches
    static getRecentSearches() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)) || [];
    }
    
    // Clear all data (for logout)
    static clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalStorageManager;
}