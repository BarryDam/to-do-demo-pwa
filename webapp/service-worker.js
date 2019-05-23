var CACHE_NAME = "nl.newitera.to-do-demo-pwa_V0.01";


// Preload all the sources of the app.
// When you see the error "Uncaught (in promise) TypeError: Request failed" in the console,
// you probably made a typ0 in one of these files. Check for 404s.
var RESOURCES_TO_PRELOAD = [
	"index.html",
	// Component-preload contains all files in controller, i18n, view directories.
	"Component-preload.js",
	"register-worker.js",
	"css/style.css",
	"manifest.json",
	"icons/favicon-16x16.png",
	"icons/favicon-32x32.png",
	"icons/favicon.ico",
	"icons/icon-128x128.png",
	"icons/icon-144x144.png",
	"icons/icon-152x152.png",
	"icons/icon-192x192.png",
	"icons/icon-512x512.png",
	"icons/mstile-150x150.png",
	"icons/safari-pinned-tab.svg",
	"images/cancel.svg"
];

// Preload all SAPUI5 sources
RESOURCES_TO_PRELOAD = RESOURCES_TO_PRELOAD.concat([
	"resources/sap-ui-core.js",
	"resources/sap/ui/core/library-preload.js",
	"resources/sap/ui/core/messagebundle.properties",
	"resources/sap/ui/core/messagebundle_de.properties",
	"resources/sap/ui/core/messagebundle_en.properties",
	"resources/sap/ui/core/themes/sap_belize/library.css",
	"resources/sap/ui/core/themes/base/fonts/SAP-icons.woff2",
	"resources/sap/ui/core/themes/sap_belize/fonts/72-Bold.woff2",
	"resources/sap/ui/core/themes/sap_belize/fonts/72-Regular.woff2",
	"resources/sap/m/library-preload.js",
	"resources/sap/m/messagebundle_de.properties",
	"resources/sap/m/messagebundle_en.properties",
	"resources/sap/m/themes/sap_belize/library.css",
	"resources/sap/ui/layout/messagebundle.properties",
	"resources/sap/ui/layout/messagebundle_de.properties",
	"resources/sap/ui/layout/messagebundle_en.properties",
	"resources/sap/ui/layout/library-preload.js",
	"resources/sap/ui/layout/themes/sap_belize/library.css",
	"resources/sap/uxap/library-preload.js",
	"resources/sap/uxap/themes/sap_belize/library.css"
]);

// Preload resources during install.
self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function (cache) {
			return cache.addAll(RESOURCES_TO_PRELOAD);
		})
		.catch(function (oError) {
			console.log("Error while caching the relevant files: " + oError); // eslint-disable-line no-console
		})
	);
});

self.addEventListener("message", function (event) {
	console.log("SW Received Message: " + event.data); // eslint-disable-line no-console
	if (event.data.action === "skipWaiting") {
		self.skipWaiting();
	}
});

// Delete obsolete cache
self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (key !== CACHE_NAME) {
					return caches.delete(key);
				}
			}));
		})
	);
});

// During runtime, get files from cache or fetch, then save to cache.
self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response;
			}

			var requestCopy = event.request.clone();
			return fetch(requestCopy).then(function (fetchResponse) {
				if (!fetchResponse) {
					return fetchResponse;
				}
				if (fetchResponse.status === 200 || fetchResponse.type === " opaque") {
					if (!event.request.url.startsWith("chrome-extension://")) {
						var responseCopy = fetchResponse.clone();
						caches.open(CACHE_NAME).then(function (cache) {
							cache.put(event.request, responseCopy);
						});
					}
				}
				return fetchResponse;
			});
		}).catch(function () {
			return caches.match("/images/cancel.svg");
		})
	);

});