# Javascript-Lib

Javascript-Lib is a lightweight collection of UI and form helpers built on top of jQuery. It bundles handy behaviours for checkboxes, radio-style ratio buttons, tab navigation, AJAX helpers, and flexible input filtering so you can wire up interactive forms with minimal code.

## Features
- **AJAX JSON helper** – `YK.Web.Ajax.PostAsJson` wraps jQuery's `$.ajax` to POST JSON data and handle success/error callbacks uniformly.
- **Checkbox visibility toggles** – elements marked with `yk-type="checkbox"` gain click-to-toggle visibility state handling.
- **Ratio (radio-like) controls** – `yk-type="ratio"` elements track selection within a group and expose hooks (`YK.Ratio.OnBeforeChange` and `YK.Ratio.OnChange`) to react to selection updates.
- **Tab navigation** – the `YK.Tab` namespace manages tab menu/content pairs, remembers the last active tab, and exposes lifecycle hooks for before/after tab changes.
- **Input filtering utilities** – the `YK.Event.Input.Filter` class adds reusable per-field filters (number-only, number-with-range, regex-based, or custom callbacks) while safely handling control keys.

## Getting started
1. Include jQuery in your page.
2. Load `script.js` after jQuery.
3. Add the appropriate `yk-*` attributes to your markup (examples below).

```
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="/path/to/script.js"></script>
```

## Usage examples
### AJAX JSON POST
```js
YK.Web.Ajax.PostAsJson('/api/save', { name: 'Yannick' },
  (response) => console.log('Saved', response),
  (status, error) => console.error('Save failed', status, error)
);
```

### Checkbox visibility toggle
```html
<div yk-type="checkbox" yk-state="visible">Toggle me</div>
```
Clicking the element toggles the `yk-state` attribute between visible/hidden states.

### Ratio selection group
```html
<button yk-type="ratio" yk-group="color" yk-link="red">Red</button>
<button yk-type="ratio" yk-group="color" yk-link="blue">Blue</button>
```
You can react to selection changes by assigning functions to `YK.Ratio.OnBeforeChange` and `YK.Ratio.OnChange`.

### Tabs
```html
<!-- Menu buttons -->
<button yk-type="tab" yk-option="menu" yk-group="settings" yk-link="profile">Profile</button>
<button yk-type="tab" yk-option="menu" yk-group="settings" yk-link="security">Security</button>

<!-- Content areas -->
<section yk-type="tab" yk-option="content" yk-link="profile">Profile content...</section>
<section yk-type="tab" yk-option="content" yk-link="security">Security content...</section>
```
Call `YK.Tab.UpdateTabs()` after your markup renders to sync the visible content to the current state.

### Input filters
```html
<input id="age" type="text">
<script>
  // Allow integers only
  YK.Event.Input.Filter.CreateNumberFilter(document.getElementById('age'));
</script>
```
Filters can also be configured for floats, numeric ranges, regex validation, or fully custom filter functions via `setFilterFunction`.

## Development
The project currently consists of a single `script.js` file. Contributions should:
- Keep modules under the `YK` namespace.
- Prefer small, focused helpers with clear hooks so consumers can customize behaviour.
- Avoid wrapping imports in try/catch blocks (per repository guidelines).

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
