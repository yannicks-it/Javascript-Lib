# YK Library: Complete Implementation Guide

## Quick Start Checklist

- [ ] Include jQuery in your project (required)
- [ ] Download and include YK CSS framework
- [ ] Download and include YK JavaScript library
- [ ] Initialize the library with `YK.init()`
- [ ] Implement desired components with proper HTML attributes

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [AJAX Implementation](#ajax-implementation)
5. [Tab System Implementation](#tab-system-implementation)
6. [Menu System Implementation](#menu-system-implementation)
7. [Modal Windows Implementation](#modal-windows-implementation)
8. [Scroll System Implementation](#scroll-system-implementation)
9. [UI Components Implementation](#ui-components-implementation)
10. [Theme Customization](#theme-customization)
11. [Responsive Design](#responsive-design)
12. [Common Patterns & Examples](#common-patterns--examples)
13. [Migration Guide](#migration-guide)
14. [Troubleshooting](#troubleshooting)

## Introduction

The YK Library is a comprehensive JavaScript utility library for web UI interactions that provides a structured approach to common front-end tasks. This guide will walk you through implementation steps for each component.

### Key Features

- **Tab Management**: Create and control tabbed interfaces
- **Menu Systems**: Implement dropdown and context menus
- **Modal Windows**: Create, open, and manage modal dialogs
- **AJAX Operations**: Simplify data exchange with servers
- **Scroll Behaviors**: Implement smooth and auto-scrolling
- **UI Components**: Ready-to-use checkboxes, toasts, and more

## Installation

### Step 1: Download Required Files

Download the following files:
- `yk-library.js` - The main JavaScript library
- `yk-framework.css` - The CSS framework

### Step 2: Include in Your HTML

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Required: jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- YK CSS Framework -->
    <link rel="stylesheet" href="path/to/yk-framework.css">
    
    <!-- Optional: Font Awesome or other icon libraries if you use icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Your content here -->
    
    <!-- YK JavaScript Library (at the end of body) -->
    <script src="path/to/yk-library.js"></script>
    
    <!-- Your initialization script -->
    <script>
        $(document).ready(function() {
            YK.init({
                debug: true,                  // Set to false in production
                animationDuration: 300,       // Animation duration in ms
                useLocalStorage: true,        // Remember states between page loads
                defaultTransition: 'fade'     // 'fade', 'slide', or 'none'
            });
        });
    </script>
</body>
</html>
```

## Basic Setup

### Configuration Options

Configure the library using these options:

```javascript
YK.init({
    debug: false,                // Enable debug messages (false in production)
    animationDuration: 300,      // Duration of animations in milliseconds
    scrollBehavior: 'smooth',    // Scroll behavior ('smooth' or 'auto')
    defaultTransition: 'fade',   // Default transition ('fade', 'slide', or 'none')
    useLocalStorage: false,      // Remember state in localStorage
    ajaxTimeout: 30000,          // AJAX request timeout in milliseconds
    enableResponsive: true       // Enable responsive behaviors
});
```

### Library Structure

Understanding the library structure helps with implementation:

```
YK
├── Config          // Configuration settings
├── Web             // AJAX and content loading
│   └── Ajax        // AJAX operations
├── Tab             // Tab management
├── Menu            // Menu systems
├── Modal           // Modal windows
├── Scroll          // Scroll behaviors
└── UI              // UI components
```

## AJAX Implementation

### Step 1: Set Up AJAX Request

```javascript
// Basic POST request
YK.Web.Ajax.postAsJson(
    '/api/endpoint',           // URL endpoint
    { id: 123, name: 'Test' }, // Data to send
    function(response) {        // Success callback
        console.log('Success:', response);
        // Handle response here
    },
    function(jqXHR, textStatus, errorThrown) { // Error callback
        console.error('Error:', textStatus);
        // Handle error here
    }
);
```

### Step 2: Implement Form Submission

```html
<!-- HTML Form -->
<form id="contactForm">
    <input type="text" name="name" placeholder="Your Name">
    <input type="email" name="email" placeholder="Your Email">
    <textarea name="message" placeholder="Your Message"></textarea>
    <button type="button" id="submitContact">Send Message</button>
</form>

<script>
    // Submit form via AJAX
    $('#submitContact').on('click', function() {
        YK.Web.Ajax.submitForm(
            '#contactForm',
            function(response) {
                YK.UI.showToast('Message sent successfully!', 'success');
            },
            function() {
                YK.UI.showToast('Failed to send message', 'error');
            }
        );
    });
</script>
```

### Step 3: Create Declarative AJAX UI

```html
<!-- Declarative AJAX UI -->
<div class="user-form">
    <!-- Parameters -->
    <input type="text" yk-type="ajax" yk-option="parameter" yk-group="user-save" yk-arg="username" placeholder="Username">
    <input type="email" yk-type="ajax" yk-option="parameter" yk-group="user-save" yk-arg="email" placeholder="Email">
    
    <!-- Endpoint (hidden) -->
    <div yk-type="ajax" yk-option="post" yk-group="user-save" yk-link="/api/save-user" style="display:none;"></div>
    
    <!-- Submit button -->
    <button yk-type="ajax" yk-option="click" yk-group="user-save" class="yk-btn yk-btn-primary">Save User</button>
</div>
```

### Step 4: Performance-Focused AJAX Helpers

Use the enhanced `requestJson` helper to add response caching, custom headers, and abortable requests without rewriting existing code:

```javascript
// Fetch data with a 5s cache window and a custom trace header
const request = YK.Web.Ajax.requestJson({
    url: '/api/profile',
    method: 'get',
    cacheMs: 5000,
    headers: { 'X-Trace': 'dashboard' },
    onSuccess: function (data) {
        renderProfile(data);
    },
    onError: function (status) {
        console.warn('Request failed', status);
    }
});

// Optionally abort long-running calls
// request.abort();

// Clear cached responses when underlying data changes
YK.Web.Ajax.clearCache();
```

You can also continue to call `YK.Web.Ajax.PostAsJson()`; it now delegates to `requestJson` so you inherit the caching and header options while keeping legacy code intact.

## Tab System Implementation

### Step 1: Create HTML Structure

```html
<!-- Tab Container -->
<div class="yk-tabs-horizontal">
    <!-- Tab Navigation -->
    <div yk-type="tab" yk-option="menu-container">
        <div yk-type="tab" yk-option="menu" yk-link="tab1" yk-group="main-tabs" yk-state="visible">
            Home
        </div>
        <div yk-type="tab" yk-option="menu" yk-link="tab2" yk-group="main-tabs">
            Profile
        </div>
        <div yk-type="tab" yk-option="menu" yk-link="tab3" yk-group="main-tabs">
            Settings
        </div>
    </div>
    
    <!-- Tab Content -->
    <div yk-type="tab" yk-option="content-container">
        <div yk-type="tab" yk-option="content" yk-link="tab1" yk-group="main-tabs" yk-state="visible">
            <h2>Home Content</h2>
            <p>Welcome to the home tab.</p>
        </div>
        <div yk-type="tab" yk-option="content" yk-link="tab2" yk-group="main-tabs">
            <h2>Profile Content</h2>
            <p>User profile information goes here.</p>
        </div>
        <div yk-type="tab" yk-option="content" yk-link="tab3" yk-group="main-tabs">
            <h2>Settings Content</h2>
            <p>User settings go here.</p>
        </div>
    </div>
</div>
```

### Step 2: Set Up Event Handlers

```javascript
// Set up tab event callbacks
YK.Tab.Events.beforeChange = function(group, link) {
    console.log(`Tab changing from ${link} in group ${group}`);
    
    // Validate or save form data before changing tabs
    if (link === 'tab2') {
        const formData = collectFormData();
        if (!validateForm(formData)) {
            return false; // Prevent tab change
        }
    }
};

YK.Tab.Events.afterChange = function(group, link) {
    console.log(`Tab changed to ${link} in group ${group}`);
    
    // Load content dynamically if needed
    if (link === 'tab3') {
        YK.Web.loadContent('/api/settings', '#settingsContainer');
    }
};
```

### Step 3: Control Tabs Programmatically

```javascript
// Activate a specific tab
document.getElementById('goToProfile').addEventListener('click', function() {
    YK.Tab.activateTab('main-tabs', 'tab2');
});

// Create dynamic tabs
function addNewTab(title, content) {
    // Create tab menu item
    const tabMenu = document.createElement('div');
    tabMenu.setAttribute('yk-type', 'tab');
    tabMenu.setAttribute('yk-option', 'menu');
    tabMenu.setAttribute('yk-link', `dynamic-${Date.now()}`);
    tabMenu.setAttribute('yk-group', 'main-tabs');
    tabMenu.textContent = title;
    
    // Create tab content
    const tabContent = document.createElement('div');
    tabContent.setAttribute('yk-type', 'tab');
    tabContent.setAttribute('yk-option', 'content');
    tabContent.setAttribute('yk-link', tabMenu.getAttribute('yk-link'));
    tabContent.setAttribute('yk-group', 'main-tabs');
    tabContent.innerHTML = content;
    
    // Append to DOM
    document.querySelector('[yk-type="tab"][yk-option="menu-container"]').appendChild(tabMenu);
    document.querySelector('[yk-type="tab"][yk-option="content-container"]').appendChild(tabContent);
    
    // Activate the new tab
    YK.Tab.activateTab('main-tabs', tabMenu.getAttribute('yk-link'));
}
```

### Step 4: Create Vertical Tabs (Alternative Layout)

```html
<div class="yk-tabs-vertical">
    <div yk-type="tab" yk-option="menu-container">
        <!-- Tab menu items -->
        <div yk-type="tab" yk-option="menu" yk-link="section1" yk-group="side-tabs" yk-state="visible">
            Section 1
        </div>
        <div yk-type="tab" yk-option="menu" yk-link="section2" yk-group="side-tabs">
            Section 2
        </div>
    </div>
    
    <div yk-type="tab" yk-option="content-container">
        <!-- Tab content panels -->
        <div yk-type="tab" yk-option="content" yk-link="section1" yk-group="side-tabs" yk-state="visible">
            Content for Section 1
        </div>
        <div yk-type="tab" yk-option="content" yk-link="section2" yk-group="side-tabs">
            Content for Section 2
        </div>
    </div>
</div>
```

## Menu System Implementation

### Step 1: Create Basic Dropdown Menu

```html
<!-- Menu Trigger -->
<button yk-type="menu" yk-option="menu" yk-link="user-options" yk-group="top-nav" class="yk-btn">
    User Options <i class="fa fa-caret-down"></i>
</button>

<!-- Menu Content -->
<div yk-type="menu" yk-option="content" yk-link="user-options" class="yk-shadow">
    <div class="yk-menu-item" id="viewProfile">View Profile</div>
    <div class="yk-menu-item" id="editAccount">Account Settings</div>
    <div class="yk-menu-divider"></div>
    <div class="yk-menu-item" id="logoutBtn">Logout</div>
</div>

<script>
    // Add event listeners to menu items
    document.getElementById('logoutBtn').addEventListener('click', function() {
        // Close the menu and perform logout
        YK.Menu.closeMenu('user-options');
        performLogout();
    });
</script>
```

### Step 2: Set Up Menu Events

```javascript
// Set up menu event callbacks
YK.Menu.Events.beforeOpen = function(link, group) {
    console.log(`Opening menu ${link} in group ${group}`);
    
    // Load dynamic content if needed
    if (link === 'notifications-menu') {
        loadNotifications();
    }
};

YK.Menu.Events.afterClose = function(link, group) {
    console.log(`Closed menu ${link} in group ${group}`);
    
    // Clean up or save state if needed
    if (link === 'user-options') {
        saveUserPreferences();
    }
};
```

### Step 3: Control Menus Programmatically

```javascript
// Open a menu when an element is clicked
document.getElementById('userAvatar').addEventListener('click', function() {
    YK.Menu.openMenu('user-options');
});

// Close all menus on a specific action
document.getElementById('mainContent').addEventListener('click', function() {
    YK.Menu.closeAll();
});
```

### Step 4: Create Nested Menu (Advanced)

```html
<div yk-type="menu" yk-option="menu" yk-link="main-menu" class="yk-btn">
    Main Menu
</div>

<div yk-type="menu" yk-option="content" yk-link="main-menu" class="yk-shadow">
    <div class="yk-menu-item">Option 1</div>
    <div class="yk-menu-item">Option 2</div>
    <div class="yk-menu-item" id="subMenuTrigger">
        Submenu <i class="fa fa-caret-right"></i>
    </div>
</div>

<div id="subMenu" class="yk-shadow" style="display:none; position:absolute;">
    <div class="yk-menu-item">Sub Option 1</div>
    <div class="yk-menu-item">Sub Option 2</div>
</div>

<script>
    // Handle submenu display
    document.getElementById('subMenuTrigger').addEventListener('mouseover', function(e) {
        const subMenu = document.getElementById('subMenu');
        const rect = this.getBoundingClientRect();
        
        subMenu.style.top = rect.top + 'px';
        subMenu.style.left = (rect.right + 5) + 'px';
        subMenu.style.display = 'block';
    });
    
    // Handle mouseleave
    document.getElementById('subMenu').addEventListener('mouseleave', function() {
        this.style.display = 'none';
    });
</script>
```

## Modal Windows Implementation

### Step 1: Create Basic Modal

```html
<!-- Modal Trigger -->
<button yk-type="modal" yk-option="onClick" yk-link="simple-modal" class="yk-btn yk-btn-primary">
    Open Modal
</button>

<!-- Modal Content -->
<div yk-type="modal" yk-option="content" yk-link="simple-modal" class="yk-modal-fade">
    <div class="yk-modal-backdrop"></div>
    <div class="yk-modal-dialog">
        <div class="yk-modal-header">
            <h5 class="yk-modal-title">Modal Title</h5>
            <button yk-type="modal" yk-option="exit" yk-link="simple-modal" class="yk-modal-close">&times;</button>
        </div>
        <div class="yk-modal-body">
            <p>This is a simple modal dialog.</p>
        </div>
        <div class="yk-modal-footer">
            <button class="yk-btn yk-btn-secondary" yk-type="modal" yk-option="exit" yk-link="simple-modal">
                Close
            </button>
            <button class="yk-btn yk-btn-primary" id="saveChanges">
                Save Changes
            </button>
        </div>
    </div>
</div>
```

### Step 2: Create Form Modal with Validation

```html
<!-- Form Modal Trigger -->
<button yk-type="modal" yk-option="onClick" yk-link="form-modal" class="yk-btn yk-btn-primary">
    Open Form
</button>

<!-- Form Modal Content -->
<div yk-type="modal" yk-option="content" yk-link="form-modal">
    <div class="yk-modal-backdrop"></div>
    <div class="yk-modal-dialog">
        <div class="yk-modal-header">
            <h5 class="yk-modal-title">User Information</h5>
            <button yk-type="modal" yk-option="exit" yk-link="form-modal" class="yk-modal-close">&times;</button>
        </div>
        <div class="yk-modal-body">
            <form id="userForm">
                <div class="form-group yk-mb-2">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" name="fullName" class="form-control">
                    <div class="error-message" id="nameError"></div>
                </div>
                <div class="form-group yk-mb-2">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" class="form-control">
                    <div class="error-message" id="emailError"></div>
                </div>
            </form>
        </div>
        <div class="yk-modal-footer">
            <button class="yk-btn yk-btn-secondary" yk-type="modal" yk-option="exit" yk-link="form-modal">
                Cancel
            </button>
            <button class="yk-btn yk-btn-primary" id="saveUserInfo">
                Save
            </button>
        </div>
    </div>
</div>

<script>
    // Form validation and submission
    document.getElementById('saveUserInfo').addEventListener('click', function() {
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        let isValid = true;
        
        // Clear previous errors
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        
        // Validate name
        if (!name.trim()) {
            document.getElementById('nameError').textContent = 'Name is required';
            isValid = false;
        }
        
        // Validate email
        if (!email.trim() || !email.includes('@')) {
            document.getElementById('emailError').textContent = 'Valid email is required';
            isValid = false;
        }
        
        if (isValid) {
            // Submit form via AJAX
            YK.Web.Ajax.submitForm('#userForm', function(response) {
                YK.Modal.closeModal('form-modal');
                YK.UI.showToast('User information saved', 'success');
            });
        }
    });
</script>
```

### Step 3: Set Up Modal Events

```javascript
// Set up modal event callbacks
YK.Modal.Events.beforeOpen = function(link, data) {
    console.log(`Opening modal ${link} with data:`, data);
    
    // Pre-populate form fields if data is provided
    if (link === 'form-modal' && data && data.userId) {
        // Load user data
        YK.Web.Ajax.getAsJson(`/api/users/${data.userId}`, {}, function(userData) {
            document.getElementById('fullName').value = userData.name;
            document.getElementById('email').value = userData.email;
        });
    }
};

YK.Modal.Events.afterClose = function(link) {
    console.log(`Closed modal ${link}`);
    
    // Reset form when modal is closed
    if (link === 'form-modal') {
        document.getElementById('userForm').reset();
    }
};
```

### Step 4: Create Different Size Modals

```html
<!-- Small Modal -->
<button yk-type="modal" yk-option="onClick" yk-link="small-modal" class="yk-btn">
    Small Modal
</button>
<div yk-type="modal" yk-option="content" yk-link="small-modal">
    <div class="yk-modal-backdrop"></div>
    <div class="yk-modal-dialog yk-modal-sm">
        <!-- Modal content -->
    </div>
</div>

<!-- Large Modal -->
<button yk-type="modal" yk-option="onClick" yk-link="large-modal" class="yk-btn">
    Large Modal
</button>
<div yk-type="modal" yk-option="content" yk-link="large-modal">
    <div class="yk-modal-backdrop"></div>
    <div class="yk-modal-dialog yk-modal-lg">
        <!-- Modal content -->
    </div>
</div>

<!-- Full Screen Modal -->
<button yk-type="modal" yk-option="onClick" yk-link="fullscreen-modal" class="yk-btn">
    Fullscreen Modal
</button>
<div yk-type="modal" yk-option="content" yk-link="fullscreen-modal">
    <div class="yk-modal-backdrop"></div>
    <div class="yk-modal-dialog yk-modal-fullscreen">
        <!-- Modal content -->
    </div>
</div>
```

### Step 5: Enhance Modal Behavior (Advanced)

Use lifecycle hooks and configuration flags to provide richer modal experiences such as focus trapping, scroll locking, stacked dialogs, and async content hydration.

```javascript
// Open a wizard modal with accessibility and animation helpers
document.getElementById('launchWizard').addEventListener('click', function() {
    YK.Modal.openModal('wizard-modal', {
        trapFocus: true,       // Keep keyboard focus inside the modal
        lockScroll: true,      // Prevent background scrolling while open
        animation: 'slide-up'  // Apply a custom transition class
    });
});

// Load content the first time the modal opens, then cache it
let wizardLoaded = false;
YK.Modal.Events.beforeOpen = function(link) {
    if (link === 'wizard-modal' && !wizardLoaded) {
        YK.Web.Ajax.getAsJson('/api/wizard/steps', {}, function(steps) {
            const list = document.querySelector('#wizardSteps');
            list.innerHTML = steps.map(step => `<li>${step.title}</li>`).join('');
            wizardLoaded = true;
        });
    }
};

// Allow stacking by opening a confirmation modal from inside the wizard
document.getElementById('wizardFinish').addEventListener('click', function() {
    YK.Modal.openModal('confirm-finish', { trapFocus: true });
});

// Close all open modals with ESC while keeping the top-most state consistent
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        YK.Modal.closeTop();
    }
});
```

## Scroll System Implementation

### Step 1: Create Smooth Scroll Navigation

```html
<!-- Scroll Navigation -->
<nav class="scroll-nav yk-mb-3">
    <a href="#section1" yk-type="onClick" yk-option="scroll" yk-arg="menu" yk-state="visible" yk-group="main-nav">
        Section 1
    </a>
    <a href="#section2" yk-type="onClick" yk-option="scroll" yk-arg="menu" yk-group="main-nav">
        Section 2
    </a>
    <a href="#section3" yk-type="onClick" yk-option="scroll" yk-arg="menu" yk-group="main-nav">
        Section 3
    </a>
</nav>

<!-- Sections -->
<section id="section1" class="yk-mb-3">
    <h2>Section 1</h2>
    <p>Content for section 1...</p>
</section>

<section id="section2" class="yk-mb-3">
    <h2>Section 2</h2>
    <p>Content for section 2...</p>
</section>

<section id="section3" class="yk-mb-3">
    <h2>Section 3</h2>
    <p>Content for section 3...</p>
</section>
```

### Step 2: Create Auto-Scrolling Container

```html
<div yk-type="scroll" yk-option="auto" class="auto-scroll-container yk-custom-scrollbar" style="height: 300px; overflow-y: auto;">
    <div class="scroll-item yk-p-2">
        <h3>Item 1</h3>
        <p>Content for item 1...</p>
    </div>
    <div class="scroll-item yk-p-2">
        <h3>Item 2</h3>
        <p>Content for item 2...</p>
    </div>
    <div class="scroll-item yk-p-2">
        <h3>Item 3</h3>
        <p>Content for item 3...</p>
    </div>
</div>
```

### Step 3: Control Scrolling Programmatically

```javascript
// Scroll to an element with offset and callback
document.getElementById('scrollToSection2').addEventListener('click', function() {
    YK.Scroll.scrollTo('#section2', {
        offset: 80,           // Offset from top (e.g., for fixed headers)
        duration: 800,        // Longer animation
        updateUrl: true,      // Update URL hash
        callback: function() {
            // Highlight the section
            document.querySelector('#section2').classList.add('yk-bg-light');
            setTimeout(() => {
                document.querySelector('#section2').classList.remove('yk-bg-light');
            }, 1000);
        }
    });
});

// Enable/disable auto-scroll
document.getElementById('toggleAutoScroll').addEventListener('click', function() {
    const isEnabled = this.getAttribute('data-enabled') === 'true';
    
    YK.Scroll.setAutoScroll(!isEnabled);
    this.setAttribute('data-enabled', String(!isEnabled));
    this.textContent = isEnabled ? 'Enable Auto-Scroll' : 'Disable Auto-Scroll';
});
```

### Step 4: Implement Infinite Scroll (Advanced)

```html
<div id="infiniteContainer" class="yk-custom-scrollbar" style="height: 500px; overflow-y: auto;">
    <div id="contentList">
        <!-- Initial content will be loaded here -->
    </div>
    <div id="loadingIndicator" class="yk-text-center yk-p-3" style="display: none;">
        Loading more content...
    </div>
</div>

<script>
    let page = 1;
    let isLoading = false;
    
    // Initial load
    loadContent(page);
    
    // Add scroll event listener
    document.getElementById('infiniteContainer').addEventListener('scroll', function() {
        const { scrollTop, scrollHeight, clientHeight } = this;
        
        // Check if scrolled near bottom
        if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoading) {
            loadMoreContent();
        }
    });
    
    function loadMoreContent() {
        if (isLoading) return;
        
        isLoading = true;
        page++;
        
        // Show loading indicator
        document.getElementById('loadingIndicator').style.display = 'block';
        
        // Simulate AJAX request
        setTimeout(() => {
            YK.Web.Ajax.getAsJson('/api/content', { page: page }, function(response) {
                // Append new content
                appendContent(response.items);
                
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';
                isLoading = false;
                
                // Check if no more content
                if (response.isLastPage) {
                    document.getElementById('loadingIndicator').textContent = 'No more content';
                }
            });
        }, 1000); // Simulated delay
    }
    
    function appendContent(items) {
        const contentList = document.getElementById('contentList');
        
        items.forEach(item => {
            const element = document.createElement('div');
            element.className = 'content-item yk-p-2 yk-mb-2 yk-bg-light yk-rounded';
            element.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            contentList.appendChild(element);
        });
    }
</script>
```

## UI Components Implementation

### Step 1: Implement Checkboxes and Switches

```html
<!-- Checkbox Group -->
<div class="settings-group yk-mb-3">
    <h3>Notification Settings</h3>
    
    <div class="setting-item yk-d-flex yk-align-items-center yk-justify-content-between yk-mb-2">
        <label>Email Notifications</label>
        <div yk-type="checkbox" yk-variant="switch" yk-state="visible" id="emailNotifs"></div>
    </div>
    
    <div class="setting-item yk-d-flex yk-align-items-center yk-justify-content-between yk-mb-2">
        <label>SMS Notifications</label>
        <div yk-type="checkbox" yk-variant="switch" id="smsNotifs"></div>
    </div>
    
    <div class="setting-item yk-d-flex yk-align-items-center yk-justify-content-between">
        <label>Push Notifications</label>
        <div yk-type="checkbox" yk-variant="switch" id="pushNotifs"></div>
    </div>
</div>

<!-- Checkbox List -->
<div class="options-group yk-mb-3">
    <h3>Select Categories</h3>
    
    <div class="option-item yk-d-flex yk-align-items-center yk-mb-2">
        <div yk-type="checkbox" id="catNews"></div>
        <label class="yk-mb-0 yk-ml-2">News</label>
    </div>
    
    <div class="option-item yk-d-flex yk-align-items-center yk-mb-2">
        <div yk-type="checkbox" yk-state="visible" id="catSports"></div>
        <label class="yk-mb-0 yk-ml-2">Sports</label>
    </div>
    
    <div class="option-item yk-d-flex yk-align-items-center">
        <div yk-type="checkbox" id="catTech"></div>
        <label class="yk-mb-0 yk-ml-2">Technology</label>
    </div>
</div>

<script>
    // Handle checkbox changes
    document.getElementById('emailNotifs').addEventListener('yk:change', function(e, isChecked) {
        console.log('Email notifications:', isChecked);
        saveUserPreference('emailNotifications', isChecked);
    });
    
    // Get checkbox state programmatically
    function getNotificationSettings() {
        return {
            email: YK.UI.isCheckboxChecked('#emailNotifs'),
            sms: YK.UI.isCheckboxChecked('#smsNotifs'),
            push: YK.UI.isCheckboxChecked('#pushNotifs')
        };
    }
    
    // Set checkbox state programmatically
    function loadUserPreferences(preferences) {
        YK.UI.toggleCheckbox('#emailNotifs', preferences.emailNotifications);
        YK.UI.toggleCheckbox('#smsNotifs', preferences.smsNotifications);
        YK.UI.toggleCheckbox('#pushNotifs', preferences.pushNotifications);
    }
</script>
```

### Step 2: Implement Toast Notifications

```javascript
// Show success toast
function showSuccessToast(message) {
    YK.UI.showToast(message, 'success', {
        duration: 4000,
        position: 'top-right',
        closable: true
    });
}

// Show error toast
function showErrorToast(message) {
    YK.UI.showToast(message, 'error', {
        duration: 5000,
        position: 'top-center',
        closable: true
    });
}

// Show info toast with custom callback
function showInfoToast(message) {
    const toast = YK.UI.showToast(message, 'info', {
        position: 'bottom-right',
        duration: 0, // Won't auto-close
        closable: true,
        onClose: function() {
            console.log('Info toast closed');
        }
    });
    
    // Close programmatically after user action
    document.getElementById('acknowledgeBtn').addEventListener('click', function() {
        YK.UI.closeToast(toast);
    });
}

// Quick toast buttons
document.getElementById('successBtn').addEventListener('click', function() {
    showSuccessToast('Operation completed successfully!');
});

document.getElementById('errorBtn').addEventListener('click', function() {
    showErrorToast('An error occurred. Please try again.');
});

document.getElementById('infoBtn').addEventListener('click', function() {
    showInfoToast('Please review the changes before continuing.');
});
```

### Step 3: Create Custom Loading Indicators

```html
<!-- Button with loading state -->
<button id="submitButton" class="yk-btn yk-btn-primary">
    Submit Form
</button>

<script>
    document.getElementById('submitButton').addEventListener('click', function() {
        const button = this;
        
        // Add loading state
        button.classList.add('yk-loading');
        button.disabled = true;
        
        // Simulate AJAX request
        setTimeout(() => {
            // Remove loading state
            button.classList.remove('yk-loading');
            button.disabled = false;
            
            // Show success message
            YK.UI.showToast('Form submitted successfully', 'success');
        }, 2000);
    });
</script>
```

## Theme Customization

### Step 1: Create Custom Theme Variables

```html
<style>
    /* Custom theme colors */
    :root {
        /* Override primary color */
        --yk-primary: #6200ee;
        --yk-primary-dark: #3700b3;
        
        /* Override other colors */
        --yk-secondary: #03dac6;
        --yk-secondary-dark: #018786;
        --yk-danger: #cf6679;
        
        /* Custom spacing */
        --yk-spacing-md: 1.25rem;
    }
    
    /* Create a custom dark theme class */
    .custom-dark-theme {
        --yk-text: #ffffff;
        --yk-background: #121212;
        --yk-border: #333333;
        --yk-light: #333333;
        --yk-dark: #000000;
    }
</style>
```

### Step 2: Implement Theme Switcher

```html
<div class="theme-switcher yk-mb-3">
    <button id="lightTheme" class="yk-btn yk-btn-light">Light Theme</button>
    <button id="darkTheme" class="yk-btn yk-btn-dark">Dark Theme</button>
    <button id="blueTheme" class="yk-btn" style="background-color: #1e88e5; color: white;">Blue Theme</button>
</div>

<script>
    // Theme switcher functionality
    document.getElementById('lightTheme').addEventListener('click', function() {
        document.body.classList.remove('yk-theme-dark', 'yk-theme-blue', 'custom-dark-theme');
    });
    
    document.getElementById('darkTheme').addEventListener('click', function() {
        document.body.classList.remove('yk-theme-blue');
        document.body.classList.add('yk-theme-dark');
    });
    
    document.getElementById('blueTheme').addEventListener('click', function() {
        document.body.classList.remove('yk-theme-dark', 'custom-dark-theme');
        document.body.classList.add('yk-theme-blue');
    });
    
    // Save theme preference
    function saveThemePreference(theme) {
        if (YK.Config.useLocalStorage) {
            localStorage.setItem('yk-theme', theme);
        }
    }
    
    // Load theme preference
    function loadThemePreference() {
        if (YK.Config.useLocalStorage) {
            const theme = localStorage.getItem('yk-theme');
            if (theme) {
                document.body.className = theme;
            }
        }
    }
    
    // Load theme on page load
    loadThemePreference();
</script>
```

## Responsive Design

### Step 1: Use Responsive Utility Classes

```html
<div class="dashboard-container">
    <!-- Sidebar (hidden on small screens) -->
    <div class="sidebar yk-d-none-sm">
        <!-- Sidebar content -->
    </div>
    
    <!-- Mobile menu (visible only on small screens) -->
    <div class="mobile-menu yk-d-none yk-d-block-sm">
        <!-- Mobile menu content -->
    </div>
    
    <!-- Main content -->
    <div class="main-content">
        <!-- Content adapts to screen size -->
    </div>
</div>
```

### Step 2: Create Responsive Modals

```html
<!-- Responsive Modal -->
<div yk-type="modal" yk-option="content" yk-link="responsive-modal">
    <div class="yk-modal-backdrop"></div>
    <div class="yk-modal-dialog">
        <!-- Full width on mobile, normal width on desktop -->
        <div class="yk-modal-header">
            <h5 class="yk-modal-title">Responsive Modal</h5>
            <button yk-type="modal" yk-option="exit" yk-link="responsive-modal" class="yk-modal-close">&times;</button>
        </div>
        <div class="yk-modal-body">
            <!-- Content adapts to screen width -->
            <div class="yk-d-none-sm">
                <!-- Desktop-only content -->
                <p>This content only shows on desktop</p>
            </div>
            <div class="yk-d-none yk-d-block-sm">
                <!-- Mobile-only content -->
                <p>This content only shows on mobile</p>
            </div>
            <!-- Content for all devices -->
            <p>This content shows on all devices</p>
        </div>
    </div>
</div>
```

### Step 3: Keyboard and Programmatic Control

Modals now expose a small API for scripted flows and keyboard accessibility:

```javascript
// Open or close a modal programmatically
YK.Modal.open('simple-modal');
YK.Modal.close('simple-modal');

// Close any open modal and dismiss active menus when the user presses Escape (built-in)
// The library wires this up automatically, but you can trigger it manually:
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        YK.Modal.closeAll();
    }
});
```

This behavior also improves UX on touch devices by letting you clear overlays without reaching for the close button.

## Common Patterns & Examples

### Complete Dashboard Layout

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YK Dashboard Example</title>
    
    <!-- Required: jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- YK CSS Framework -->
    <link rel="stylesheet" href="path/to/yk-framework.css">
    
    <!-- Custom styles -->
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        
        .dashboard {
            display: flex;
            height: 100vh;
        }
        
        .sidebar {
            width: 250px;
            background-color: var(--yk-dark);
            color: var(--yk-text-light);
            padding: 1rem;
        }
        
        .content {
            flex-grow: 1;
            padding: 1rem;
            overflow-y: auto;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--yk-border);
        }
        
        .card {
            background-color: var(--yk-background);
            border: 1px solid var(--yk-border);
            border-radius: 4px;
            padding: 1rem;
            margin-bottom: 1rem;
            box-shadow: var(--yk-shadow-sm);
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .dashboard {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                height: auto;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <!-- Sidebar -->
        <div class="sidebar yk-d-none-sm">
            <h2>Dashboard</h2>
            
            <nav class="yk-mt-3">
                <div yk-type="tab" yk-option="menu" yk-link="dashboard" yk-group="main-view" yk-state="visible">
                    Dashboard
                </div>
                <div yk-type="tab" yk-option="menu" yk-link="profile" yk-group="main-view">
                    Profile
                </div>
                <div yk-type="tab" yk-option="menu" yk-link="settings" yk-group="main-view">
                    Settings
                </div>
            </nav>
        </div>
        
        <!-- Mobile sidebar (dropdown) -->
        <div class="mobile-sidebar yk-d-none yk-d-block-sm">
            <div class="header">
                <h2>Dashboard</h2>
                <button yk-type="menu" yk-option="menu" yk-link="mobile-nav" class="yk-btn">
                    Menu
                </button>
            </div>
            
            <div yk-type="menu" yk-option="content" yk-link="mobile-nav" class="yk-shadow">
                <div class="yk-menu-item" id="navDashboard">Dashboard</div>
                <div class="yk-menu-item" id="navProfile">Profile</div>
                <div class="yk-menu-item" id="navSettings">Settings</div>
            </div>
        </div>
        
        <!-- Main content -->
        <div class="content">
            <div class="header">
                <h1>Welcome, User</h1>
                
                <div>
                    <button yk-type="menu" yk-option="menu" yk-link="user-menu" class="yk-btn">
                        Account
                    </button>
                    
                    <div yk-type="menu" yk-option="content" yk-link="user-menu" class="yk-shadow">
                        <div class="yk-menu-item" id="viewProfile">View Profile</div>
                        <div class="yk-menu-item" id="editAccount">Account Settings</div>
                        <div class="yk-menu-divider"></div>
                        <div class="yk-menu-item" id="logoutBtn">Logout</div>
                    </div>
                </div>
            </div>
            
            <!-- Tab content -->
            <div yk-type="tab" yk-option="content" yk-link="dashboard" yk-group="main-view" yk-state="visible">
                <div class="dashboard-summary">
                    <div class="yk-d-flex yk-justify-content-between">
                        <div class="card" style="flex: 1; margin-right: 1rem;">
                            <h3>Total Users</h3>
                            <p class="yk-text-primary" style="font-size: 2rem;">1,234</p>
                        </div>
                        <div class="card" style="flex: 1; margin-right: 1rem;">
                            <h3>Revenue</h3>
                            <p class="yk-text-success" style="font-size: 2rem;">$45,678</p>
                        </div>
                        <div class="card" style="flex: 1;">
                            <h3>New Orders</h3>
                            <p class="yk-text-info" style="font-size: 2rem;">256</p>
                        </div>
                    </div>
                    
                    <div class="card yk-mt-3">
                        <h3>Recent Activity</h3>
                        <div yk-type="tab" yk-option="menu-container" class="yk-d-flex">
                            <div yk-type="tab" yk-option="menu" yk-link="orders" yk-group="activity" yk-state="visible">
                                Orders
                            </div>
                            <div yk-type="tab" yk-option="menu" yk-link="users" yk-group="activity">
                                Users
                            </div>
                            <div yk-type="tab" yk-option="menu" yk-link="comments" yk-group="activity">
                                Comments
                            </div>
                        </div>
                        
                        <div yk-type="tab" yk-option="content-container">
                            <div yk-type="tab" yk-option="content" yk-link="orders" yk-group="activity" yk-state="visible">
                                <table style="width: 100%;">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>#1234</td>
                                            <td>John Doe</td>
                                            <td>$123.45</td>
                                            <td>Completed</td>
                                        </tr>
                                        <tr>
                                            <td>#1235</td>
                                            <td>Jane Smith</td>
                                            <td>$67.89</td>
                                            <td>Processing</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div yk-type="tab" yk-option="content" yk-link="users" yk-group="activity">
                                <p>User activity content goes here</p>
                            </div>
                            <div yk-type="tab" yk-option="content" yk-link="comments" yk-group="activity">
                                <p>Comments content goes here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div yk-type="tab" yk-option="content" yk-link="profile" yk-group="main-view">
                <div class="card">
                    <h2>User Profile</h2>
                    <p>Profile content goes here</p>
                </div>
            </div>
            
            <div yk-type="tab" yk-option="content" yk-link="settings" yk-group="main-view">
                <div class="card">
                    <h2>Settings</h2>
                    <div class="settings-group">
                        <h3>Notification Settings</h3>
                        <div class="setting-item yk-d-flex yk-align-items-center yk-justify-content-between yk-mb-2">
                            <label>Email Notifications</label>
                            <div yk-type="checkbox" yk-variant="switch" yk-state="visible" id="emailNotifs"></div>
                        </div>
                        <div class="setting-item yk-d-flex yk-align-items-center yk-justify-content-between yk-mb-2">
                            <label>SMS Notifications</label>
                            <div yk-type="checkbox" yk-variant="switch" id="smsNotifs"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- YK JavaScript Library -->
    <script src="path/to/yk-library.js"></script>
    
    <script>
        $(document).ready(function() {
            // Initialize YK Library
            YK.init({
                debug: true,
                animationDuration: 300,
                useLocalStorage: true
            });
            
            // Mobile navigation handlers
            document.getElementById('navDashboard').addEventListener('click', function() {
                YK.Tab.activateTab('main-view', 'dashboard');
                YK.Menu.closeMenu('mobile-nav');
            });
            
            document.getElementById('navProfile').addEventListener('click', function() {
                YK.Tab.activateTab('main-view', 'profile');
                YK.Menu.closeMenu('mobile-nav');
            });
            
            document.getElementById('navSettings').addEventListener('click', function() {
                YK.Tab.activateTab('main-view', 'settings');
                YK.Menu.closeMenu('mobile-nav');
            });
            
            // Logout button handler
            document.getElementById('logoutBtn').addEventListener('click', function() {
                YK.UI.showToast('Logging out...', 'info');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            });
        });
    </script>
</body>
</html>
```

## Migration Guide

### From Version 1.x to 2.0

For projects using the previous version of YK Library, follow these steps to migrate:

1. **Replace Files**: 
   - Replace the old JS file with the new `yk-library.js`
   - Add the new `yk-framework.css` file (this is new in v2.0)

2. **Initialize the Library**:
   ```javascript
   $(document).ready(function() {
       YK.init();
   });
   ```

3. **Update Function Names**:
   - All function names now use camelCase instead of PascalCase
   - For example, use `YK.Web.Ajax.postAsJson()` instead of `YK.Web.Ajax.PostAsJson()`

4. **Event Handlers**:
   - The old direct function assignments still work for backward compatibility
   - Example: `YK.Tab.AfterChange = function() {}`
   - But we recommend using the new event system: `YK.Tab.Events.afterChange = function() {}`

5. **Global Functions**:
   - Global functions like `UpdateTabs()` and `UpdateMenu()` are now deprecated
   - Use their YK namespace equivalents: `YK.Tab.init()` and `YK.Menu.init()`

### Backward Compatibility Tips

If you can't update all code at once, you can enable compatibility mode:

```javascript
// Enable compatibility mode - creates aliases for all deprecated functions
YK.init({
    enableCompatibility: true
});

// This allows old code to still work:
UpdateTabs(); // Will call YK.Tab.init() internally
YK.Web.Ajax.PostAsJson(); // Will call YK.Web.Ajax.postAsJson() internally
```

## Troubleshooting

### Common Issues and Solutions

1. **Components Not Working**
   - **Problem**: UI components don't respond to clicks or actions
   - **Solution**: 
     - Ensure jQuery is loaded before YK Library
     - Check that `YK.init()` is called after DOM is ready
     - Verify HTML attributes are correct (check for typos in `yk-type`, `yk-option`, etc.)

2. **AJAX Requests Failing**
   - **Problem**: AJAX requests are not completing or returning errors
   - **Solution**:
     - Check browser console for error messages
     - Verify endpoint URLs are correct
     - Ensure proper CORS settings if making cross-origin requests
     - Try increasing timeout value: `YK.Config.ajaxTimeout = 60000;`

3. **Visual Glitches**
   - **Problem**: Components look incorrect or animations glitch
   - **Solution**:
     - Ensure `yk-framework.css` is properly loaded
     - Check for CSS conflicts with other frameworks
     - Try using the browser inspector to identify CSS issues

4. **Performance Issues**
   - **Problem**: Sluggish performance, especially with many components
   - **Solution**:
     - Reduce animation duration: `YK.Config.animationDuration = 150;`
     - Wrap frequent handlers with `YK.Utils.throttle(fn, wait)` to avoid excessive DOM reads
     - Cache predictable API calls with `YK.Web.Ajax.requestJson({ cacheMs: 2000, ... })` to cut down on duplicate network traffic
     - Disable transitions if not needed: `YK.Config.defaultTransition = 'none';`
     - Use event delegation instead of direct event binding for dynamic elements

### Debug Mode

Enable debug mode to see detailed log messages:

```javascript
YK.init({
    debug: true
});
```

This will log all component interactions, AJAX requests, and potential errors to the console.

### Support Resources

If you encounter issues not covered here:

1. Check the browser console for errors
2. Verify HTML markup follows the examples exactly
3. Try creating a minimal test case to isolate the issue
4. Contact support with a detailed description and the test case