sap.ui.define([
	"sap/ui/model/json/JSONModel"	
], function(JSONModel) {
	return {
		/**
		 * This method creates the new Dialog 
		 * - It adds an method .onClose which you can use in your fragment view to close the dialog 
		 * - It adds byId and getDialogData methods (described in the return description)
		 * - It determines if it is needed to use the compact class on the dialog and adds it
		 * - will add it's dependency to the view controller so that all models bound to the view can also be used
		 * 
		 * To add animations .. add animate.css to your css files
		 * 
		 * @param	{string}	strFragment			- name of the fragment 
		 * @param	{object}	mParams
		 * @param	{map}		mParams.dialogData	- this data is passed to a JSONModel which can be accessed as {Dialog>/} in the fragment
		 * @param	{object}	mParams.controller	- if oController is given, the methods referenced in the Fragment will be called on this controller
		 *												Note: by default a onClose method will be added which you can use in your view to close the dialog
		 * @param	{object}	mParams.i18nModel	- i18n model
		 * 
		 * @returns {object} oDialog - sap.m.Dialog with some extra functions:
		 *									- byId(sId)  Returns an Element of the connected view with the given local ID.
		 *									- getDialogData(sPath) [sPath="/"] returns the dialogData as a JSON object 
		 *									+ you can also get the Dialog sap.ui.model.json.JSONModel oDialog.getModel("Dialog")
		 */
		create: function(strFragment, mParams) {
			var mParameters 		=  $.extend(true, {}, ((typeof mParams === "object") ? mParams : {}) ),
				oController			= ("controller" in mParameters && typeof mParameters.controller === "object") ? $.extend(true, {}, mParameters.controller) : {};
			// add default close method which can be used in the view to close the dialog
			if (! ("onClose" in oController)) {
				oController.onClose = function() {
					oDialog.close();
				};
			}
			var sRandomFragmentId = strFragment + "-" + Math.random();
			var	oDialog 			= sap.ui.xmlfragment(sRandomFragmentId, strFragment, oController),
				oModel				= new JSONModel(((typeof mParameters.dialogData === "object") ? mParameters.dialogData : {})),
				oView				= (typeof oController.getView === "function") ? oController.getView() : null;
			//oDialog.applySettings(oController);
			if ("i18nModel" in mParameters) {
				oDialog.setModel(mParameters.i18nModel, "i18n");
			}
			// set sizelimit to higher nr: in case of a selectbox now all items are shown
			oModel.setSizeLimit("999999999");
			oDialog.setModel(oModel, 'Dialog');	
			//oDialog.setModel(I18n, "i18n");
			// if oController is a view controller, add the dependency so that all models of that view can be used in the fragment
			if (oView) { oView.addDependent(oDialog); }
			// destroy dialog after close
			oDialog.attachEvent('afterClose', function() {
				oDialog.destroy();
				oDialog = null;
			});
			// object selector
			// @param {string} sId - View local Id
			oDialog.byId = function(sId) {
				return sap.ui.getCore().byId(sap.ui.core.Fragment.createId(sRandomFragmentId, sId));
			};
			oDialog.$byId = function(sId) {
				return jQuery.sap.byId(oDialog.byId(sId).getId());
			};
			// return the dialog data (Dialog Model data)
			oDialog.getDialogData = function(sPath) {
				return oDialog.getModel("Dialog").getProperty(sPath || "/");
			};
			// add compact class
			if (oView && oView.$().closest(".sapUiSizeCompact").length > 0) {
				oDialog.addStyleClass("sapUiSizeCompact");
			}
			// animation (animate.css needed)
			oDialog.addStyleClass("animated");
			oDialog.addStyleClass("fadeIn");
			oDialog.addStyleClass("faster");
			// return
			return oDialog;
		},
		/**
		 * Creates and opens the dialog
		 */
		open: function() {
			var oDialog = this.create.apply(this, arguments); 
			oDialog.open();
			return oDialog;
		}	
	};
});