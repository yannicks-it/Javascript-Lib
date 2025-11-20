# JavaScript-Lib (YK)

A lightweight set of declarative UI helpers built on jQuery. Components are configured with `yk-*` attributes so you can enable tabs, menus, modals, scrolling behavior, AJAX helpers, and input filters without writing boilerplate JavaScript.

## Table of Contents
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Module Guide](#module-guide)
  - [Web.Ajax](#webajax)
  - [Checkbox Toggle](#checkbox-toggle)
  - [Ratio Buttons](#ratio-buttons)
  - [Tabs](#tabs)
  - [Menus](#menus)
  - [Modals](#modals)
  - [Click Actions](#click-actions)
  - [AJAX Click Flow](#ajax-click-flow)
  - [Auto Scroll Containers](#auto-scroll-containers)
  - [Input Filters](#input-filters)
  - [Validation Hook](#validation-hook)
- [Development Notes](#development-notes)

## Getting Started
Include jQuery and `script.js`, then add `yk-*` attributes to your markup. No manual initialization is required; the library registers delegated listeners on `document` and `body`.

```html
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="/path/to/script.js"></script>

<!-- Example tab setup -->
<button yk-type="tab" yk-option="menu" yk-group="main" yk-link="home">Home</button>
<button yk-type="tab" yk-option="menu" yk-group="main" yk-link="about">About</button>

<div yk-type="tab" yk-option="content" yk-group="main" yk-link="home">Home content</div>
<div yk-type="tab" yk-option="content" yk-group="main" yk-link="about" style="display:none;">About content</div>
```

## Architecture
`script.js` exposes a single global `YK` namespace. Modules are plain objects with optional lifecycle hooks. Everything is initialized via delegated jQuery listeners, which keeps dynamically injected DOM nodes working automatically.

```
YK
├── Validation           // Optional: external validator shim
├── Web.Ajax             // JSON POST helper
├── Ratio                // Radio-style buttons
├── Tab                  // Tab controller with hooks
├── Menu                 // Accordion/dropdown menus
├── Modal                // Simple modal open/close
├── Event.Input.Filter   // Input filtering class
└── onClick / scroll     // Redirect and smooth scroll helpers
```

## Module Guide

### Web.Ajax
**File section:** `YK.Web.Ajax.PostAsJson` near the top of `script.js`.

- Performs a POST request and parses the JSON response before calling `onSuccess(parsed, raw)`.
- Errors forward `textStatus` and `errorThrown` to the `onError` callback.
- Usage: `YK.Web.Ajax.PostAsJson('/api/user', { id: 1 }, successFn, errorFn);`

### Checkbox Toggle
**Selector:** `[yk-type=checkbox]`

- Clicking toggles `yk-state="visible"` on the element. Use the attribute in your CSS to style the checked state.

### Ratio Buttons
**Selector:** `[yk-type=ratio]`

- Mimics radio groups using `yk-group` and `yk-link`.
- The currently selected element owns `yk-state="selected"` and the previous selection has the attribute removed.
- Hooks: `YK.Ratio.OnBeforeChange(group, previousElement)` fires before deselecting; `YK.Ratio.OnChange(group, newElement)` fires after selection.

```html
<button yk-type="ratio" yk-group="color" yk-link="red">Red</button>
<button yk-type="ratio" yk-group="color" yk-link="blue">Blue</button>
```

### Tabs
**Selectors:**
- Menus: `[yk-type=tab][yk-option=menu]`
- Content panels: `[yk-type=tab][yk-option=content]`
- Info targets: `[yk-type=tab][yk-option=info]`

**Behavior**
- `YK.Tab.UpdateTabs()` runs on load to hide non-active content and set initial state per `yk-group`.
- Clicking a menu button shows the linked content (`yk-link`) within the same `yk-group`, hides the previously visible panel, and updates any `info` element’s `yk-state` to the active link.
- Programmatic change: `YK.Tab.ChangeToActive(link, [group])` mirrors the click behavior. If `group` is omitted, the last active group is used.
- Hooks: `YK.Tab.BeforeChange(group, previousLink, newLink)` and `YK.Tab.AfterChange(group, link)` run around transitions.

### Menus
**Selectors:** `[yk-type=menu][yk-option=menu|content]`

- Tracks the open menu in `YK.Menu.Active`.
- Clicking toggles visibility of the matching content (`yk-link` pairs menu and content). Only one menu stays open; opening a new one closes the previous.
- A body-level click handler closes the active menu when clicking outside.

### Modals
**Selectors:** `[yk-type=modal][yk-option=onClick|content|exit]`

- Content blocks start hidden.
- Clicking an `onClick` element shows the matching modal content (`yk-link` pairs trigger and content). Optional attributes `yk-before` and `yk-before-type="js"` allow running inline JavaScript before opening.
- Clicking an `exit` element hides the associated modal content.

### Click Actions
#### Redirect
**Selector:** `[yk-type=onClick][yk-option=redirect]`

- Navigates to the URL in `yk-link` when different from the current page (ignores query/hash for comparison).

#### Smooth Scroll
**Selector:** `[yk-type=onClick][yk-option=scroll]`

- Scrolls to the element referenced in `yk-link` with smooth behavior.
- When `yk-arg="menu"`, the clicked item receives `yk-state="visible"` and other items in the same `yk-group` are cleared; an optional auto-tracking mode can switch active menu items when their targets are hidden.
- `EnableAutoSmoothScroll` (global flag) controls whether scroll events auto-correct the active menu item.

### AJAX Click Flow
**Selectors:**
- Trigger: `[yk-type=ajax][yk-option=click]`
- Endpoint holder: `[yk-type=ajax][yk-option=post]`
- Parameters: `[yk-type=ajax][yk-option=parameter]`

**Behavior**
- Clicking a trigger collects parameters by `yk-group`, reading input values or text content.
- Sends a POST to the URL from the `post` element’s `yk-link`.
- Expects JSON that contains `{ isOk: boolean, redirectToUrl: string }`; on success with `isOk`, the browser redirects to `redirectToUrl`.

### Auto Scroll Containers
**Selector:** `[yk-type=scroll][yk-option=auto]`

- For scrollable containers (optionally grouped via `yk-group`).
- Tracks scroll direction to move the viewport to the next/previous child element. Children are all direct children or those matching the same `yk-group` when provided.
- Animates to the calculated target and prevents overlapping animations with an `activeS` guard.

### Input Filters
**Class:** `YK.Event.Input.Filter`

- Wraps inputs to enforce inline filtering. Supports construction with an element, jQuery object, or selector string.
- Static helpers:
  - `CreateNumberFilter(element)` – allows only integers without leading zeros.
  - `CreateNumberFloatFilter(element)` – allows signed decimal numbers with one separator.
  - `CreateNumberRangeFilter(element, min, max)` – composes a number filter with range checking.
  - `CreateRegexFilter(element, regex)` – allows values that satisfy a custom regex.
  - `CreateCustomFilter(element, func)` – accepts a boolean-returning function to validate the full value.
- Instance API highlights: `setFilterFunction(func)`, `register()`, `unregister()`, `enable()`, `disable()`, `isEnabled()`, `isCharAllowed(char)`, `setAllowedBypassFilterFuncForControlKeys(flag)`.
- Internally stores the last valid value per element to revert invalid input on `input` events and respects common control keys on `keydown` when allowed.

### Validation Hook
`YK.Validation` simply exposes an external validator (`window.YannickValidator`) when present. The library itself does not ship validation logic but can defer to that object if loaded.

## Development Notes
- The code relies on jQuery event delegation; adding `yk-*` attributes to newly inserted elements is enough for them to behave correctly.
- Avoid wrapping imports in `try/catch`; modules assume jQuery is already available on the page.
- File structure is flat (single `script.js` plus this README). No build step is required.
