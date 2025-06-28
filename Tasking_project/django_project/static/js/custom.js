// Custom JavaScript for Employee Task Management System

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide messages after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);

    // Add fade-in animation to cards
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card, index) {
        setTimeout(function() {
            card.classList.add('fade-in');
        }, index * 100);
    });

    // Real-time clock for dashboard
    updateClock();
    setInterval(updateClock, 1000);

    // Confirm dialogs for dangerous actions
    var deleteButtons = document.querySelectorAll('[data-confirm]');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            var message = this.getAttribute('data-confirm');
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });

    // Auto-refresh for attendance dashboard
    if (window.location.pathname.includes('/attendance/')) {
        setInterval(function() {
            // Auto-refresh every 5 minutes
            if (document.hidden === false) {
                location.reload();
            }
        }, 300000);
    }

    // Initialize admin dashboard features
    initializeAdminDashboard();
    
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize notifications
    initializeNotifications();
    
    // Initialize progress animations
    initializeProgressAnimations();
});

// Update clock function
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        clockElement.innerHTML = `${timeString}<br><small class="text-muted">${dateString}</small>`;
    }
}

// Progress bar animation
function animateProgressBar(element, targetValue) {
    var currentValue = 0;
    var increment = targetValue / 100;
    
    var timer = setInterval(function() {
        currentValue += increment;
        element.style.width = currentValue + '%';
        element.setAttribute('aria-valuenow', currentValue);
        
        if (currentValue >= targetValue) {
            clearInterval(timer);
            element.style.width = targetValue + '%';
            element.setAttribute('aria-valuenow', targetValue);
        }
    }, 20);
}

// Initialize progress bars on page load
window.addEventListener('load', function() {
    var progressBars = document.querySelectorAll('.progress-bar[data-animate]');
    progressBars.forEach(function(bar) {
        var targetValue = parseFloat(bar.getAttribute('aria-valuenow'));
        bar.style.width = '0%';
        setTimeout(function() {
            animateProgressBar(bar, targetValue);
        }, 500);
    });
});

// Form validation helpers
function validateForm(formId) {
    var form = document.getElementById(formId);
    var isValid = true;
    
    // Check required fields
    var requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// AJAX helpers for dynamic content
function ajaxPost(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                callback(response);
            } else {
                console.error('AJAX request failed:', xhr.status);
            }
        }
    };
    
    xhr.send(JSON.stringify(data));
}

// Get CSRF token from cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Show loading spinner
function showLoading(element) {
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    element.disabled = true;
}

// Hide loading spinner
function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

// Notification helper
function showNotification(message, type = 'info') {
    var alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    var container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            var bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }
}

// Dark mode toggle (if needed in future)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Admin Dashboard Features
function initializeAdminDashboard() {
    // Animate counters
    animateCounters();
    
    // Auto-refresh data every 5 minutes
    setInterval(function() {
        if (window.location.pathname === '/') {
            refreshDashboardData();
        }
    }, 300000); // 5 minutes
    
    // Initialize charts if admin dashboard
    if (document.querySelector('.bg-gradient-primary')) {
        initializeCharts();
    }
}

// Animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.display-4, .stats-number, h3, h4');
    
    counters.forEach(counter => {
        const target = parseInt(counter.innerText.replace(/[^0-9]/g, ''));
        if (target && target > 0) {
            animateValue(counter, 0, target, 1500);
        }
    });
}

function animateValue(element, start, end, duration) {
    const startTimestamp = performance.now();
    const step = (timestamp) => {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        // Keep non-numeric parts of the original text
        const originalText = element.dataset.originalText || element.innerText;
        element.dataset.originalText = originalText;
        
        if (originalText.includes('/')) {
            // Handle cases like "5/10"
            const parts = originalText.split('/');
            const newText = value + '/' + parts[1];
            element.innerText = newText;
        } else {
            element.innerText = value;
        }
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize notifications
function initializeNotifications() {
    // Mark notifications as read when clicked
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.opacity = '0.7';
        });
    });
    
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
}

// Initialize progress bar animations
function initializeProgressAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    // Intersection Observer for animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-in-out';
                    progressBar.style.width = width;
                }, 100);
            }
        });
    });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Refresh dashboard data (AJAX)
function refreshDashboardData() {
    // Only refresh if user is active (not idle)
    if (document.hasFocus()) {
        fetch(window.location.href, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            updateDashboardElements(data);
        })
        .catch(error => {
            console.log('Failed to refresh dashboard data:', error);
        });
    }
}

// Update dashboard elements with new data
function updateDashboardElements(data) {
    // Update system stats
    if (data.system_stats) {
        updateElement('.total-users', data.system_stats.total_users);
        updateElement('.total-projects', data.system_stats.total_projects);
        updateElement('.total-tasks', data.system_stats.total_tasks);
    }
    
    // Update attendance overview
    if (data.attendance_overview) {
        updateElement('.checked-in-count', data.attendance_overview.checked_in);
        updateElement('.late-count', data.attendance_overview.late_arrivals);
        updateElement('.absent-count', data.attendance_overview.absent);
    }
    
    // Show update indicator
    showUpdateIndicator();
}

function updateElement(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
        element.classList.add('updated');
        setTimeout(() => element.classList.remove('updated'), 1000);
    }
}

function showUpdateIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'update-indicator';
    indicator.innerHTML = '<i class="fas fa-sync-alt"></i> Updated';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        z-index: 1050;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
    setTimeout(() => {
        indicator.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => indicator.remove(), 300);
    }, 2000);
}

// Initialize charts for admin dashboard
function initializeCharts() {
    // Check if Chart.js is available
    if (typeof Chart !== 'undefined') {
        createTaskStatusChart();
        createAttendanceChart();
        createPerformanceChart();
    }
}

// Task Status Pie Chart
function createTaskStatusChart() {
    const ctx = document.getElementById('taskStatusChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['New', 'In Progress', 'Completed', 'On Hold'],
            datasets: [{
                data: [12, 19, 23, 5],
                backgroundColor: [
                    '#6c757d',
                    '#007bff',
                    '#28a745',
                    '#ffc107'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Attendance Chart
function createAttendanceChart() {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Present',
                data: [18, 20, 19, 17, 16],
                backgroundColor: '#28a745'
            }, {
                label: 'Late',
                data: [2, 1, 3, 2, 4],
                backgroundColor: '#ffc107'
            }, {
                label: 'Absent',
                data: [0, 1, 0, 1, 2],
                backgroundColor: '#dc3545'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Performance Chart
function createPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Tasks Completed',
                data: [25, 32, 28, 35],
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Utility functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container-fluid') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Form enhancements
function enhanceForms() {
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
            }
        });
    });
    
    // Auto-save for textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        let timeout;
        textarea.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // Auto-save logic here
                console.log('Auto-saving...', this.value);
            }, 2000);
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Admin shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'u':
                e.preventDefault();
                window.location.href = '/users/';
                break;
            case 't':
                e.preventDefault();
                window.location.href = '/tasks/';
                break;
            case 'p':
                e.preventDefault();
                window.location.href = '/projects/';
                break;
            case 'a':
                e.preventDefault();
                window.location.href = '/attendance/';
                break;
        }
    }
});

// Search functionality enhancement
function enhanceSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input');
    searchInputs.forEach(input => {
        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                // Implement live search
                performLiveSearch(this.value);
            }, 300);
        });
    });
}

function performLiveSearch(query) {
    // Live search implementation
    console.log('Searching for:', query);
}

// Export functions for global access
window.TaskingProject = {
    showAlert,
    toggleDarkMode,
    refreshDashboardData,
    animateCounters
}; 