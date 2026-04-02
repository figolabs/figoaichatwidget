# Figo AI Chat Widget

Embed the Figo AI Assistant in any website with either:

- A CDN script tag (best for plain HTML/CSS sites)
- An npm install flow (best for JS/TS projects)

This package exposes a global API on `window.FigoChatWidget`.

## What You Need Before Integration

From your Figo dashboard:

1. Go to **Assistants** and select your assistant.
2. Click **Manage**.
3. Copy your `x-client` and `assistantId`.

You will use both values when calling `window.FigoChatWidget.init(...)`.

## Integration Option 1: CDN (No Build Setup)

This is the fastest way for static websites.

```html
<script src="https://cdn.jsdelivr.net/gh/figolabs/figoaichatwidget@main/figo-ai-chat-widget.min.js"></script>
<script>
	window.FigoChatWidget.init({
		xClient: "your-x-client",
		assistantId: "your-assistant-id",
		position: "BOTTOM_RIGHT"
	});
</script>
```

## Integration Option 2: npm (Recommended for App Projects)

Install:

```bash
npm install figo-ai-chat-widget
```

Load once in your app entry file:

```ts
import "figo-ai-chat-widget";

window.FigoChatWidget.init({
	xClient: "your-x-client",
	assistantId: "your-assistant-id",
	position: "BOTTOM_RIGHT"
});
```

### TypeScript IntelliSense

Type definitions are bundled with the package via [figo-widget.d.ts](figo-widget.d.ts), so TypeScript-enabled editors can provide IntelliSense for:

- `FigoWidgetInitConfig`
- `window.FigoChatWidget` methods
- Widget state callback values (`"Active" | "Hidden" | "Unmounted"`)

## Initialization Examples

### Minimal

```js
window.FigoChatWidget.init({
	xClient: "x-client",
	assistantId: "assistant-id",
	position: "BOTTOM_RIGHT"
});
```

### With Custom Button Styling

```js
window.FigoChatWidget.init({
	xClient: "x-client",
	assistantId: "assistant-id",
	position: "CENTER",
	widgetButton: {
		backgroundColor: "#2563eb",
		textColor: "#ffffff",
		buttonText: "Chat with us",
		zIndex: 1000
	}
});
```

### With Your Own Existing Button

```html
<button id="ai-button">Talk to Assistant</button>
<script>
	window.FigoChatWidget.init({
		xClient: "x-client",
		assistantId: "assistant-id",
		position: "BOTTOM_RIGHT",
		widgetButton: { customButtonId: "ai-button" }
	});
</script>
```

### Pass User Information

```js
window.FigoChatWidget.init({
	xClient: "x-client",
	assistantId: "assistant-id",
	user: {
		name: "Jane Doe",
		email: "jane@company.com",
		phoneNumber: "+1234567890"
	}
});
```

## Configuration Reference

| Field | Type | Required | Description |
|---|---|---|---|
| `xClient` | `string` | Yes | Your Figo client key. |
| `assistantId` | `string` | Yes | Assistant identifier to load. |
| `position` | `"BOTTOM_RIGHT" \| "CENTER"` | No | Widget layout position. Default is bottom-right behavior. |
| `user` | `{ name: string; email: string; phoneNumber?: string }` | No | Optional user context passed to the chat URL. |
| `widgetButton` | `FigoWidgetButton` | No | Built-in button styling config or custom button binding. |

`widgetButton` supports either:

- Built-in button options: `backgroundColor`, `textColor`, `buttonText`, `zIndex`
- Custom button mode: `{ customButtonId: "your-element-id" }`

## Runtime API

After initialization, these methods are available on `window.FigoChatWidget`:

- `start()` opens the widget.
- `hide()` hides the widget without destroying it.
- `shutdown()` closes and unloads the iframe instance.
- `destroy()` fully removes widget elements from the DOM.
- `reinitialize(newConfig)` rebuilds with updated config.
- `onWidgetStateChange(callback)` listens for widget states.

Example:

```js
window.FigoChatWidget.onWidgetStateChange((state) => {
	console.log("Widget state:", state);
});
```

## CSP Requirement

If your site uses Content Security Policy, include:

```text
Content-Security-Policy: connect-src 'self' https://figolabs.ai https://*.figolabs.ai wss://*.figolabs.ai https://*.pusher.com wss://*.pusher.com;
```

## Permissions-Policy Requirement (Microphone)

If you see this browser error:

```text
[Violation] Permissions policy violation: microphone is not allowed in this document.
```

the host page is blocking microphone access via response headers.

The widget iframe already includes `allow="microphone"`, but the host page must also allow the widget origin in `Permissions-Policy`.

Use a header like:

```text
Permissions-Policy: microphone=(self "https://chat.figolabs.ai")
```

Notes:

- `microphone=()` blocks microphone everywhere.
- `microphone=(self)` only allows same-origin pages and blocks cross-origin iframes.
- If your app is loaded inside another iframe, every parent frame in the chain must allow microphone too.
- Microphone also requires HTTPS and browser site permission.

## npm Publish and jsDelivr Notes

- The package is configured so npm consumers get JS + types.
- jsDelivr field points to `figo-ai-chat-widget.min.js` for CDN delivery.
- After each npm release, versioned CDN URLs become available automatically.

Example versioned CDN URL pattern:

```text
https://cdn.jsdelivr.net/npm/figo-ai-chat-widget@1.0.0/figo-ai-chat-widget.min.js
```

## Official Documentation

For full product docs and dashboard workflow details:

- https://api-docs.figolabs.ai/website-javascript-plugin-970337m0