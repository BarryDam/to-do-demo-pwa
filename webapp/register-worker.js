

if ("serviceWorker" in navigator) {
	window.addEventListener("load", function () { // eslint-disable-line sap-forbidden-window-property
		navigator.serviceWorker // eslint-disable-line sap-no-navigator
			.register("./service-worker.js")
			.then(function() {
				console.log("Service worker registered"); // eslint-disable-line no-console
			})
			.catch(function (err) {
				console.log("Service Worker Failed to Register", err); // eslint-disable-line no-console
			});
		var refreshing;
		navigator.serviceWorker.addEventListener("controllerchange", function () { // eslint-disable-line sap-no-navigator
			if (refreshing) {return;}
			window.location.reload(); // eslint-disable-line sap-no-location-reload
			refreshing = true;
		});
	});
}