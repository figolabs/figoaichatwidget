/**
 * Global declaration for the FigoChat widget.
 */
declare global {
	interface FigoWidgetInitConfig {
		xClient: string;
		assistantId: string;
		/** Configuration for the widget button */
		widgetButton?: FigoWidgetButton;
	}

	type FigoWidgetButton =
		| {
				backgroundColor?: string;
				textColor?: string;
				zIndex?: number;
				buttonText?: string;
				customButtonId?: never;
		  }
		| {
				/** Optional where you can create your own button, and have the implementation set on your button */
				/**
				 * Example:
				 * 1. Create a button tag: `<button id="ai-button">Chat with AI</button>`
				 * 2. Call widget.init({ ...config, widgetButton: { customButtonId: "ai-button" })
				 */
				customButtonId: string;
				backgroundColor?: never;
				textColor?: never;
				zIndex?: never;
				buttonText?: never;
		  };

	/**
	 * Represents the FigoChat widget available globally on the `window` object.
	 */
	interface Window {
		FigoChatWidget: {
			/**
			 * Initializes the FigoChat widget with the provided configuration.
			 *
			 * @param config - Configuration options for initializing the widget.
			 *
			 * @example
			 * ```typescript
			 * window.FigoChatWidget.init({
			 *   xClient: "your-client-id",
			 *   assistantId: "your-assistant-id",
			 *  widgetButton: { *optional configuration* }
			 * });
			 * ```
			 */
			init: (config: FigoWidgetInitConfig) => void;
			/**
			 * Shuts down (closes) the chat widget but does not remove it from the DOM.
			 *
			 * @example
			 * ```typescript
			 * window.FigoChatWidget.shutdown();
			 * ```
			 */
			shutdown: () => void;

			/**
			 * Starts (opens) the chat widget.
			 *
			 * @example
			 * ```typescript
			 * window.FigoChatWidget.start();
			 * ```
			 */
			start: () => void;

			/**
			 * Hides the chat widget without unmounting it.
			 * The widget remains in the DOM but is visually hidden.
			 *
			 * @example
			 * ```typescript
			 * window.FigoChatWidget.hide();
			 * ```
			 */
			hide: () => void;

			/**
			 * Completely removes (destroys) the chat widget from the DOM.
			 * If needed again, it must be reinitialized.
			 *
			 * @example
			 * ```typescript
			 * window.FigoChatWidget.destroy();
			 * ```
			 */
			destroy: () => void;

			/**
			 * Reinitializes the chat widget with new configuration options.
			 * This is useful if you need to change the assistant or other settings dynamically.
			 *
			 * @param newConfig - The new configuration for reinitialization.
			 *
			 * @example
			 * ```typescript
			 * window.FigoChatWidget.reinitialize({
			 *   xClient: "new-client-id",
			 *   assistantId: "new-assistant-id",
			 *   defaultButton: false
			 * });
			 * ```
			 */
			reinitialize: (newConfig: FigoWidgetInitConfig) => void;

			/**
			 * Registers a callback to listen for widget state changes.
			 *
			 * @param callback - A function that receives the widget's current state.
			 * The state can be `"Active"`, `"Hidden"`, or `"Unmounted"`.
			 *
			 * @example
			 * ```typescript
			 * window.FigoChatWidget.onWidgetStateChange((state) => {
			 *   console.log("Widget state changed:", state);
			 * });
			 * ```
			 */
			onWidgetStateChange: (callback: (state: "Active" | "Hidden" | "Unmounted") => void) => void;
		};
	}
}

export {}; // Ensures the file is treated as a module
