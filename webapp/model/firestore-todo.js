sap.ui.define([
	"./firestore",
	"sap/ui/model/json/JSONModel"
], function (FireStore, JSONModel) {

	var oTodoModel = JSONModel.extend("firestore-todo", {
	
		constructor: function() {
			JSONModel.apply(this, arguments);
			$.proxy(this.reload, this)();
		},
		
		reload: function(mParameters) {
			var that = this;
			FireStore.collection("todo").get().then(function(aSnapshot){
				var mModelData = {};
				aSnapshot.forEach(oDoc => {
					var mData = oDoc.data();
					mData.id = oDoc.id;
					mModelData[mData.id] = mData;
				});
				that.setData(mModelData);
			});
		},
		
		setSelected: function(sId, bSelected) {
			this.setProperty(`/${sId}/done`, (bSelected));
			FireStore.collection("todo").doc(sId).set({done: (bSelected)}, {merge:true});
		},
		           
		setTitle: function(sId, sTitle) {   
			this.setProperty(`/${sId}/title`, sTitle);
			FireStore.collection("todo").doc(sId).set({title: sTitle}, {merge:true});
		},
		
		setDescription: function(sId, sDescription) {   
			this.setProperty(`/${sId}/description`, sDescription);
			FireStore.collection("todo").doc(sId).set({description: sDescription}, {merge:true});
		},
		
		addItem: function(sTitle, sDescription, mParams) {
			var mData = {
				id			: Date.now().toString(),
			    title		: sTitle,
			    description	: sDescription,
			    done		: false
			};
			this.setProperty(`/${mData.id }`, mData);
			FireStore.collection("todo").doc(mData.id).set(mData);
		},
		
		deleteItem: function(sId, mParams) {
			var that = this;
			FireStore.collection("todo").doc(sId).delete().then(function() {
				var m = that.getProperty("/");
				delete m[sId];
				that.setProperty("/", m);
				if (typeof mParams === "object" && "success" in mParams && typeof mParams.success === "function") {
					mParams.success();
				}
			}).catch(function(error) {
			    if (typeof mParams === "object" && "error" in mParams && typeof mParams.success === "error") {
				   mParams.error(error);
				}
			});
		}
	})
	
	return new oTodoModel();
});