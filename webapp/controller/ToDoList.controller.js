sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/firestore-todo",
	"../utils/FragmentDialog",
	"../model/firestore"
], function (Controller, firestoreTodo, FragmentDialog, firestore) {
	"use strict";

	return Controller.extend("nl.newitera.to-do-demo-pwa.controller.ToDoList", {
	
		
		onPressTask: function(oEvent) {
			this.getOwnerComponent().getRouter().navTo(
				"RouteTask",
				{id: oEvent.getSource().getBindingContext("todo").sPath.split("/").pop()}
			);
		},
		
		onCheckItem: function(oEvent) {
		    var bSelected = oEvent.getParameter("selected");
		    var oContext = oEvent.getSource().getBindingContext("todo");
		    var selectedId = oContext.getModel().getProperty(oContext.getPath() + "/id");
		    firestoreTodo.setSelected(selectedId, bSelected);
		},
		
		addTask: {
			_dialog: null,
			openDialog: function() {
				var that = this;
				this.addTask._dialog = FragmentDialog.open("nl.newitera.to-do-demo-pwa.view.AddTodo", {
			    	dialogData: {
			    		title: "",
			    		description: ""
			    	},
			    	controller: {
			    		onAdd: function() {
			    			var m = that.addTask._dialog.getDialogData();
			    			that.addTask._dialog.setBusy(true);
			    			that.addTask._dialog.close();
			    			firestoreTodo.addItem(m.title, m.description, {
			    				success: function(){
			    					console.log("go");
			    					//hat.addTask._dialog.close();
			    				}
			    			});
			    		}
			    	},
			    	i18nModel: this.getOwnerComponent().getModel("i18n")
			    });
			}
		},
		
		onNetwork: function(e) {
			var sCurrent	= e.getSource().getText(),
				sNew		= (sCurrent === "offline" ) ? "online" : "offline";
			if (sCurrent === "offline") {
				firestore.disableNetwork();
			} else {
				firestore.enableNetwork();
			}
			e.getSource().setText(sNew);
		}
	});
});