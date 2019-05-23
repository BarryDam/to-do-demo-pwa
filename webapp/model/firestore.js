sap.ui.define([
    "../privateConstants"
    ], function (privateConstants) {
	"use strict";
          // Your web app's Firebase configuration
          var firebaseConfig = privateConstants.firebaseConfig;
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
	return firebase.firestore();
});