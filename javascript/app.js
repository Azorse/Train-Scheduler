$(document).ready(function() {
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

  $("#add-train").on("click", function(event) {
    event.preventDefault();
    name = $("#trainName")
      .val()
      .trim();
    destination = $("#trainDestination")
      .val()
      .trim();
    firstTrain = $("#trainTime")
      .val()
      .trim();
    frequency = parseInt(
      $("#trainFrequency")
        .val()
        .trim()
    );

    database.ref().push({
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    });

    database.ref().on(
      "child_added",
      function(childSnapshot) {
        var trainInput = childSnapshot.val();

        var initalTrain = moment(trainInput.firstTrain, "HH:mm");
        var presentTime = moment();
        var nextArrival;
        var minutesAway;

        if (presentTime < initalTrain) {
          nextArrival = initalTrain.format("HH:mm");
          minutesAway = moment(initalTrain).fromNow("m");

        } else {
          var a = moment(presentTime, "HH:mm");
          var b = moment(initalTrain, "HH:mm");

          var timePassed = a.diff(b, "minutes");
          var missedTrains = Math.round(timePassed / trainInput.frequency);

          nextArrival = moment(b).add(
            (missedTrains + 1) * trainInput.frequency,
            "minutes"
          );
          var minutesPast = timePassed % trainInput.frequency;
          minutesAway = trainInput.frequency - minutesPast;
        }

        $("#new-trains").append(
          `<tr>
            <td>${trainInput.name}</td>
            <td>${trainInput.destination}</td>
            <td>${trainInput.frequency}</td>
            <td>${nextArrival}</td>
            <td>${minutesAway}</td>
          </tr>`
        );
      },
      function(errorObject) {
        console.log("Child added failed: " + errorObject.code);
      }
    );
  });
});
