/* global firebase */
sap.ui.define([
    "../privateConstants"
    ], function (privateConstants) {
	"use strict";
          // Your web app's Firebase configuration
          var firebaseConfig = privateConstants.firebaseConfig;
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
          
          firebase.firestore().enablePersistence()
		  .catch(function(err) {
		  	console.log(err);
		      if (err.code == 'failed-precondition') {
		          // Multiple tabs open, persistence can only be enabled
		          // in one tab at a a time.
		          // ...
		      } else if (err.code == 'unimplemented') {
		          // The current browser does not support all of the
		          // features required to enable persistence
		          // ...
		      }
		  });
		// Subsequent queries will use persistence, if it was enabled successfully
		  
          
          
	return firebase.firestore();
});