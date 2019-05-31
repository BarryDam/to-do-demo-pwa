var version = "0.0.9";

var RESOURCES_TO_PRELOAD = [
	"index.html",
	"register-worker.js",
	"css/style.css",
	"manifest.json",
	"i18n/i18n.properties",
	"model/firestore-todo.js",
	"model/firestore.js",
	"model/models.js",
	"utils/FragmentDialog.js",
	"view/Main.view.xml"
];

RESOURCES_TO_PRELOAD = RESOURCES_TO_PRELOAD.concat([
	'../resources/sap-ui-core.js',
	'../resources/sap/ui/core/library-preload.js',
	'../resources/sap/ui/core/messagebundle_en.properties',
	'../resources/sap/ui/core/themes/sap_belize/library.css',
	'../resources/sap/ui/core/themes/base/fonts/SAP-icons.woff2',
	'../resources/sap/ui/core/themes/sap_belize/fonts/72-Bold.woff2',
	'../resources/sap/ui/core/themes/sap_belize/fonts/72-Regular.woff2',
	'../resources/sap/m/library-preload.js',
	'../resources/sap/m/messagebundle_en.properties',
	'../resources/sap/m/themes/sap_belize/library.css',
	'../resources/sap/ui/layout/messagebundle_en.properties',
	'../resources/sap/ui/layout/library-preload.js',
	'../resources/sap/ui/layout/themes/sap_belize/library.css'
]);

var CACHE_NAME = "PWA-TODO-APP-" + version;

self.addEventListener('install', function (event) {
	console.log("install");
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function (cache) {
			console.log("CACHING", RESOURCES_TO_PRELOAD);
			return cache.addAll(RESOURCES_TO_PRELOAD);
		})
		.catch(function (oError) {
			console.log("Error while caching the relevant files: " + oError);
			console.log(oError);
		})
	);
});

self.addEventListener('activate', function (event) {
	console.log("activate");
	event.waitUntil(
		caches.keys().then(function (keyList) {
			console.log(keyList);
			return Promise.all(keyList.map(function (key) {
				if (key !== CACHE_NAME) {
					console.log("delete cache "+key);
					return caches.delete(key);
				}
			}));
		}).catch(function(oError) {
			console.log(" Error while deleting cache" + oError);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response;
			}

			var requestCopy = event.request.clone();
			return fetch(requestCopy).then(function (response) {
				if (!response) {
					return response;
				}
				if (response.status === 200 || response.type === ' opaque') {
					if (!event.request.url.startsWith('chrome-extension://')) {
						var responseCopy = response.clone();
						caches.open(CACHE_NAME).then(function (cache) {
							cache.put(event.request, responseCopy);
						});
					}
				}
				return response;
			});
		}).catch(function () {
			var req = event.request;
			return caches.match('/images/cancel.svg');
		})
	);

});
