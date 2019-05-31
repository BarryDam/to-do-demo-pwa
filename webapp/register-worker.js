if ("serviceWorker" in navigator) {
	window.addEventListener("load", function () { // eslint-disable-line sap-forbidden-window-property
		navigator.serviceWorker // eslint-disable-line sap-no-navigator
			.register("./service-worker.js")
			.then(function (reg) {
				reg.addEventListener('updatefound', function () {
					var newWorker = reg.installing;
					newWorker.addEventListener('statechange', function () {
						console.log(newWorker.state);
						switch (newWorker.state) {
						case 'installed':
							showUpdateMessage(newWorker);
							break;
						}
					});
				});
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
function showUpdateMessage(newWorker) {
	var dialog = new sap.m.Dialog({
		title: 'Confirm',
		type: 'Message',
		content: new sap.m.Text({
			text: 'A new version of this app is available. The application will be refreshed'
		}),
		endButton: new sap.m.Button({
			text: 'Refresh',
			press: function () {
				newWorker.postMessage({
 					action: 'skipWaiting'
 				});
				dialog.close();
			}
		}),
		afterClose: function () {
			dialog.destroy();
		}
	});
	dialog.open();
}
