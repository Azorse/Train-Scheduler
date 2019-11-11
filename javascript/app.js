$(document).ready(function(){
  var firebaseConfig = {
    apiKey: "AIzaSyBR4ER8Nlitz47jp6_48U3gkF6t-JrUkgE",
    authDomain: "timestampproject.firebaseapp.com",
    databaseURL: "https://timestampproject.firebaseio.com",
    projectId: "timestampproject",
    storageBucket: "timestampproject.appspot.com",
    messagingSenderId: "197124462889",
    appId: "1:197124462889:web:5840c651a8c7dcc7313f38"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  var database = firebase.database();

  $('#add-train').on('click', function(event) {
      event.preventDefault();
      name = $('#trainName').val().trim();
      destination = $('#trainDestination').val().trim();
      firstTrain = $('#trainTime').val().trim();
      frequency = $('#trainFrequency').val().trim();
                        
      database.ref().push({
          name: name,
          destination: destination,
          //firstTrain: firstTrain,//store as unix, large x
          frequency: frequency
      })

      // var startingDate = childSnapshot.val().startDate 

      database.ref().on('child_added', function(childSnapshot){
          var startingDate = childSnapshot.val().startDate;

          console.log(childSnapshot.val().name)
          console.log(childSnapshot.val().destination)
          console.log(childSnapshot.val().firstTrain)
          console.log(childSnapshot.val().frequency)
          //console.log(startingDate.diff(moment(), "months")); FIRST TRAIN

          $('#new-trains').append(`
          <tr>
              <td>${childSnapshot.val().name}</td>
              <td>${childSnapshot.val().destination}</td>
              <td>${childSnapshot.val().frequency}</td>

          </tr>`)
          //Need to add next arrival and minutes away

        }, function(errorObject){
          console.log("Child added failed: " + errorObject.code);
        });


    });



})