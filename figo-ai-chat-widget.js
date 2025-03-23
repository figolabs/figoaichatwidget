(function () {
	const BASE_URL = "https://chat.figolabs.ai";

	const DEFAULT_WIDGET_BUTTON = {
		widgetButton: {
			backgroundColor: "#7351dd",
			textColor: "#fff",
			zIndex: 10000,
			buttonText: "Ask AI",
		},
	};

	const ICON_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="#fff" d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/></svg>
    `;

	const CLOSE_ICON_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 12 12"><path fill="#0a0a0a" d="M2.22 4.47a.75.75 0 0 1 1.06 0L6 7.19l2.72-2.72a.75.75 0 0 1 1.06 1.06L6.53 8.78a.75.75 0 0 1-1.06 0L2.22 5.53a.75.75 0 0 1 0-1.06"/></svg>
    `;

	let button,
		iframeContainer,
		iframe,
		config = {};

	function emitState(state) {
		window.dispatchEvent(new CustomEvent("figoChatState", { detail: state }));
	}

	function createButton(config) {
		console.log(config);
		const btn = document.createElement("button");
		btn.className = "figo-chat-button";
		btn.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;">${ICON_SVG}<span>${config.buttonText}</span></div>`;
		btn.style = `position: fixed; bottom: 20px; right: 20px; background: ${config.backgroundColor}; color: ${config.textColor}; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; z-index: ${config.zIndex}; display: flex; align-items: center; justify-content: center;`;
		return btn;
	}

	function createCloseButton() {
		const closeBtn = document.createElement("button");
		closeBtn.innerHTML = CLOSE_ICON_SVG;
		closeBtn.className = "figo-chat-close-button";
		closeBtn.style = `position: absolute; top: 16px; right: 50%; left: 50%; background: #fff; border-radius: 50%; border: none; cursor: pointer; z-index: 1001; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;`;
		closeBtn.addEventListener("click", () => hideIframe());
		return closeBtn;
	}

	function createIframe() {
		const iframe = document.createElement("iframe");
		iframe.src = config.iframeUrl;
		iframe.id = "figochat-widget";
		iframe.className = "figo-chat-iframe";
		iframe.style = "width: 100%; height: 100%; border: none;";
		iframe.allow = "microphone; clipboard-write; clipboard-read";
		iframe.sandbox = "allow-scripts allow-forms allow-same-origin";

		setTimeout(() => {
			injectIframeStyles();
		}, 0);
		return iframe;
	}

	function initWidget(userConfig) {
		if (!userConfig?.xClient || !userConfig?.assistantId) {
			console.error("Missing required config: xClient or assistantId");
			return;
		}

		const baseUrl = userConfig.baseUrl || BASE_URL;

		config = {
			...DEFAULT_WIDGET_BUTTON,
			...userConfig,
			iframeUrl: `${baseUrl}/chat/${userConfig.xClient}/${userConfig.assistantId}`,
		};

		destroyWidget();

		if (config.widgetButton?.customButtonId) {
			button = document.getElementById(config.widgetButton.customButtonId);
			button.addEventListener("click", start);
		} else {
			button = createButton(config.widgetButton);
			button.addEventListener("click", start);
			document.body.appendChild(button);
		}

		iframeContainer = document.createElement("div");
		iframeContainer.style = `
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            width: 400px; 
            height: 600px; 
            background: white; 
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); 
            display: none; 
            z-index: 999; 
            border-radius: 12px;
        `;

		iframeContainer.appendChild(createCloseButton());
		document.body.appendChild(iframeContainer);
		window.addEventListener("message", handleIframeMessage);

		// Responsive adjustments
		function adjustForMobile() {
			if (window.innerWidth <= 475) {
				iframeContainer.style.width = "100vw";
				iframeContainer.style.background = "none";
				iframeContainer.style.height = "100vh";
				iframeContainer.style.bottom = "0px";
				iframeContainer.style.right = "0px";
				iframeContainer.style.borderRadius = "0";
			} else {
				iframeContainer.style.background = "none";
				iframeContainer.style.width = "400px";
				iframeContainer.style.height = "600px";
				iframeContainer.style.bottom = "20px";
				iframeContainer.style.right = "20px";
				iframeContainer.style.borderRadius = "12px";
			}
		}

		iframe = createIframe();
		iframeContainer.appendChild(iframe);

		// Run on load and window resize
		adjustForMobile();
		injectIframeStyles();
		window.addEventListener("resize", adjustForMobile);
	}

	function start() {
		if (!iframe) {
			iframe = createIframe();
			iframeContainer.appendChild(iframe);
		}
		iframeContainer.style.display = "block";
		if (!config.widgetButton.customButtonId) button.style.display = "none";
		emitState("Active");
	}

	function hideIframe() {
		iframeContainer.style.display = "none";
		button.style.display = "block";
		emitState("Hidden");
	}

	function shutdown() {
		iframeContainer.style.display = "none";
		if (iframe) {
			iframe.remove();
			iframe = null;
		}
		button.style.display = "block";
		emitState("Hidden");
	}

	function destroyWidget() {
		if (button) button.remove();
		if (iframeContainer) iframeContainer.remove();
		iframe = null;
		window.removeEventListener("message", handleIframeMessage);
		emitState("Unmounted");
	}

	function handleIframeMessage(event) {
		if (event.origin !== config.baseUrl || BASE_URL) return;
		if (event.data.type === "CHAT_CLOSED") shutdown();
		if (event.data.type === "CHAT_HIDE") hideIframe();
	}

	const injectIframeStyles = () => {
		const iframe = document.getElementById("figochat-widget");
		if (!iframe || !iframe.contentDocument) return;

		const style = document.createElement("style");
		style.textContent = `
          .chat-single-message {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        `;

		iframe.contentDocument.head.appendChild(style);
	};

	window.FigoChatWidget = {
		init: initWidget,
		shutdown,
		start,
		hide: hideIframe,
		destroy: destroyWidget,
		reinitialize: (newConfig) => initWidget({ ...config, ...newConfig }),
		onWidgetStateChange: (callback) => {
			window.addEventListener("figoChatState", (event) => callback(event.detail));
		},
	};
})();
