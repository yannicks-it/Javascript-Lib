JavaScript-Lib (YK)
A lightweight, modular UI and form utility library built on jQuery that provides declarative interactions and reusable components with minimal setup.
📋 Table of Contents
Overview
Features
Quick Start
Architecture
Modules
YK.Web.Ajax
YK.Tab
YK.Ratio
YK.Menu
YK.Modal
YK.Event.Input.Filter
YK.onClick Redirect
YK.onClick Scroll
YK.Ajax Click
YK.Checkbox
Attribute Reference
Development Guidelines
License
Overview
JavaScript-Lib (YK) is a collection of jQuery-powered helpers designed to rapidly wire up interactive UI components and form behaviors using HTML attributes. It follows a declarative pattern where yk-* attributes define behavior, reducing boilerplate JavaScript code while maintaining extensibility through lifecycle hooks and custom filter functions.
Features
AJAX Simplification: Declarative AJAX calls with automatic JSON handling
Declarative UI Controls: Tabs, menus, modals, and toggles via HTML attributes
Advanced Input Filtering: Reusable, extensible input validation with range support
Radio-Style Groups: Custom ratio button groups with selection callbacks
Smooth Scrolling: Intelligent scroll-to-section with active state management
Lifecycle Hooks: Extensible callback system for all major components
State Management: Built-in tracking of active elements and groups
Lightweight: Single file, no dependencies beyond jQuery
Quick Start
HTML
Preview
Copy
<!DOCTYPE html>
<html>
<head>
  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="/path/to/script.js"></script>
</head>
<body>
  <!-- Example: Tab Component -->
  <button yk-type="tab" yk-option="menu" yk-group="main" yk-link="home">Home</button>
  <button yk-type="tab" yk-option="menu" yk-group="main" yk-link="about">About</button>
  
  <div yk-type="tab" yk-option="content" yk-group="main" yk-link="home">Home Content</div>
  <div yk-type="tab" yk-option="content" yk-group="main" yk-link="about" style="display:none;">About Content</div>
</body>
</html>
Architecture
The library uses a centralized namespace pattern:
Copy
YK
├── Web.Ajax          # HTTP request utilities
├── Tab               # Tab navigation system
├── Ratio             # Radio-button groups
├── Menu              # Accordion/dropdown menus
├── Modal             # Modal dialogs
├── Event.Input.Filter # Input validation class
└── onClick           # Action handlers (redirect, scroll)
All components are initialized via jQuery event delegation and attribute selectors, enabling dynamic content support without re-initialization.
Modules
YK.Web.Ajax
Purpose: Simplified JSON POST requests with automatic parsing and error handling.
API:
JavaScript
Copy
YK.Web.Ajax.PostAsJson(url, data, onSuccess, onError)
url: Endpoint URL
data: Object to be sent
onSuccess: Callback (parsedResponse, originalResponse)
onError: Callback (textStatus, errorThrown)
Example:
JavaScript
Copy
YK.Web.Ajax.PostAsJson('/api/user', { id: 123 },
  function(response) {
    console.log('User:', response.data);
  },
  function(status, error) {
    console.error('Request failed:', status, error);
  }
);
YK.Tab
Purpose: Full-featured tab navigation with state persistence and lifecycle management.
Key Features:
Automatic content synchronization
Group-based isolation
Last active tab tracking
Before/after change hooks
Optional group parameter
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	tab	Identifies tab component
yk-option	`menu	content	info`	Role in tab system
yk-group	string	Tab group name
yk-link	string	Unique identifier within group
yk-state	visible	Active state indicator
State Structure:
JavaScript
Copy
YK.Tab.Active = {
  Last: { Link: string, Group: string },
  Groups: { [groupName]: { Active: boolean, Link: string } }
}
API Reference:
YK.Tab.UpdateTabs() - Initialize tab state from DOM
YK.Tab.ChangeToActive(link, [group]) - Programmatically switch tabs
YK.Tab.BeforeChange(group, oldLink, newLink) - Hook called before change
YK.Tab.AfterChange(group, link) - Hook called after change
HTML Structure:
HTML
Preview
Copy
<!-- Menu Buttons -->
<button yk-type="tab" yk-option="menu" yk-group="settings" yk-link="profile">Profile</button>
<button yk-type="tab" yk-option="menu" yk-group="settings" yk-link="security">Security</button>

<!-- Content Panels -->
<div yk-type="tab" yk-option="content" yk-group="settings" yk-link="profile">
  Profile content here
</div>
<div yk-type="tab" yk-option="content" yk-group="settings" yk-link="security" style="display:none;">
  Security content here
</div>

<!-- Info Display (optional) -->
<div yk-type="tab" yk-option="info" yk-group="settings"></div>
JavaScript Hook Example:
JavaScript
Copy
YK.Tab.BeforeChange = function(group, oldLink, newLink) {
  console.log(`Leaving ${oldLink}, entering ${newLink}`);
  // Validate before allowing change
};

YK.Tab.AfterChange = function(group, link) {
  console.log(`Now on ${link} tab`);
  // Load dynamic content
};
YK.Ratio
Purpose: Radio-button alternative with selection callbacks.
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	ratio	Identifies ratio button
yk-group	string	Group name (mutually exclusive)
yk-link	string	Unique value for the button
yk-state	selected	Active state indicator
Hooks:
JavaScript
Copy
YK.Ratio.OnBeforeChange(group, previousElement) // Called before selection changes
YK.Ratio.OnChange(group, newElement)           // Called after selection changes
Example:
HTML
Preview
Copy
<button yk-type="ratio" yk-group="color" yk-link="red">Red</button>
<button yk-type="ratio" yk-group="color" yk-link="blue">Blue</button>
JavaScript
Copy
YK.Ratio.OnChange = function(group, element) {
  console.log(`Selected ${element.attr('yk-link')} in ${group}`);
  // Update UI, make AJAX calls, etc.
};
YK.Menu
Purpose: Accordion/dropdown menu system with auto-close behavior.
Key Features:
One-open-at-a-time behavior
Auto-closes when clicking outside
State tracking
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	menu	Identifies menu component
yk-option	`menu	content`	Toggle or panel
yk-link	string	Menu identifier
yk-group	string	Menu group
yk-state	visible	Open state indicator
Example:
HTML
Preview
Copy
<button yk-type="menu" yk-option="menu" yk-link="user-menu">User ▼</button>
<div yk-type="menu" yk-option="content" yk-link="user-menu" style="display:none;">
  <a href="/profile">Profile</a>
  <a href="/logout">Logout</a>
</div>
YK.Modal
Purpose: Simple modal dialog system with before-open callbacks.
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	modal	Identifies modal component
yk-option	`onClick	content	exit`	Trigger, panel, or close button
yk-link	string	Modal identifier
yk-before	string	JavaScript code to execute before opening
yk-before-type	js	Type of before callback
Example:
HTML
Preview
Copy
<!-- Trigger Button -->
<button yk-type="modal" yk-option="onClick" yk-link="confirm-modal">
  Delete Item
</button>

<!-- Modal Content -->
<div yk-type="modal" yk-option="content" yk-link="confirm-modal" style="display:none;">
  <h3>Confirm Deletion</h3>
  <button yk-type="modal" yk-option="exit" yk-link="confirm-modal">Cancel</button>
  <button onclick="deleteItem()">Confirm</button>
</div>
YK.Event.Input.Filter
Purpose: Sophisticated input filtering class with multiple validation strategies.
Key Features:
Validates entire input value (not just characters)
Preserves last valid value
Handles control keys intelligently
Supports CSS selector initialization
Chainable API
Factory Methods:
Table
Copy
Method	Description
CreateNumberFilter(el)	Integers only
CreateNumberFloatFilter(el)	Floating point numbers
CreateNumberFilterWithRange(el, min, max)	Integer with range
CreateNumberFloatFilterWithRange(el, min, max)	Float with range
Instance Methods:
JavaScript
Copy
const filter = new YK.Event.Input.Filter('#myInput');

// Set filter function
filter.setFilterFunction(function(newValue) {
  return newValue.length <= 10; // Max length 10
});

// Or use regex
filter.setFilterWithRegex(/^[a-zA-Z]+$/);

// Or allow specific characters
filter.setFilterWithKeys('abc', '1', '2', '3');

// Register/unregister
filter.register();   // Enable filtering
filter.unregister(); // Disable filtering
filter.enable();     // Re-enable
filter.disable();    // Temporarily disable

// Check state
filter.isEnabled();  // Returns boolean
filter.currentVal(); // Get current value
Advanced Example:
HTML
Preview
Copy
<input id="price" type="text" placeholder="0.00 - 1000.00">
<script>
  const priceFilter = YK.Event.Input.Filter
    .CreateNumberFloatFilterWithRange('#price', 0, 1000);
  
  priceFilter.setFilterFunction(function(value) {
    // Custom logic: allow empty, check range, max 2 decimals
    if (value === '') return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 1000;
  }).register();
</script>
YK.onClick Redirect
Purpose: Conditional navigation avoiding duplicate page loads.
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	onClick	Identifies action button
yk-option	redirect	Navigation behavior
yk-link	string	Target URL
Behavior: Only redirects if target URL is different from current page (ignoring query/hash).
Example:
HTML
Preview
Copy
<button yk-type="onClick" yk-option="redirect" yk-link="/dashboard">
  Go to Dashboard
</button>
YK.onClick Scroll
Purpose: Smooth scroll-to-section with active menu tracking.
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	onClick	Identifies scroll trigger
yk-option	scroll	Scroll behavior
yk-link	CSS selector	Target element
yk-arg	menu	Enable menu mode
yk-group	string	Menu group name
yk-state	visible	Active menu indicator
Features:
Smooth scrolling with behavior: "smooth"
Auto-updates active menu item on scroll
Supports grouped menus
Example:
HTML
Preview
Copy
<!-- Menu -->
<nav>
  <a yk-type="onClick" yk-option="scroll" yk-arg="menu" yk-link="#section1">Section 1</a>
  <a yk-type="onClick" yk-option="scroll" yk-arg="menu" yk-link="#section2">Section 2</a>
</nav>

<!-- Content -->
<section id="section1">...</section>
<section id="section2">...</section>
Configuration:
JavaScript
Copy
EnableAutoSmoothScroll = true; // Enable auto-updating active state
YK.Ajax Click
Purpose: Collect parameters from multiple elements and POST as JSON.
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	ajax	Identifies AJAX component
yk-option	`click	post	parameter`	Component role
yk-group	string	Group identifier
yk-link	string	POST URL (for post option)
yk-arg	string	Parameter name (for parameter option)
Workflow:
Click trigger (yk-option="click")
Collect parameters from inputs (yk-option="parameter")
POST to URL (yk-option="post")
Redirect on success (response.isOk && response.redirectToUrl)
Example:
HTML
Preview
Copy
<!-- Parameters -->
<input yk-type="ajax" yk-option="parameter" yk-group="login" yk-arg="username">
<input yk-type="ajax" yk-option="parameter" yk-group="login" yk-arg="password" type="password">

<!-- Submit URL -->
<div yk-type="ajax" yk-option="post" yk-group="login" yk-link="/api/login" style="display:none;"></div>

<!-- Trigger -->
<button yk-type="ajax" yk-option="click" yk-group="login">Login</button>
YK.Checkbox
Purpose: Simple toggle for visibility states.
Attributes:
Table
Copy
Attribute	Value	Description
yk-type	checkbox	Identifies checkbox toggle
yk-state	visible	Current state
Example:
HTML
Preview
Copy
<div yk-type="checkbox" yk-state="visible">Click to toggle state</div>
Attribute Reference
Table
Copy
Attribute	Applies To	Values	Description
yk-type	All components	Component name	Identifies component type
yk-option	Most components	Component-specific	Specifies component role
yk-group	Grouped components	string	Logical grouping key
yk-link	Most components	string/selector	Identifier or target
yk-state	Stateful components	`visible	selected`	Current state
yk-arg	Parameterized components	string	Parameter name or mode
yk-before	Modal triggers	JavaScript code	Pre-action callback
yk-before-type	Modal triggers	js	Callback type
