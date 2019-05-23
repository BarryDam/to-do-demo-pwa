sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"nl/newitera/to-do-demo-pwa/model/models",
	"./model/firestore-todo"
], function (UIComponent, Device, models, firestoreTodo) {
	"use strict";

	return UIComponent.extend("nl.newitera.to-do-demo-pwa.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			this.setModel(firestoreTodo, "todo");
		}
	});
});