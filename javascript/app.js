//Robbie helped with the higher order functions in this build

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

  function getFieldValues() {
    var name = $("#trainName")
      .val()
      .trim();
    var destination = $("#trainDestination")
      .val()
      .trim();
    var firstTrain = $("#trainTime")
      .val()
      .trim();
    var frequency = parseInt(
      $("#trainFrequency")
        .val()
        .trim()
    );
    return { name, destination, firstTrain, frequency };
  }

  database.ref().once("value", function(snapshot) {
    console.log(snapshot.val());
    $.each(snapshot.val(), function(index, value) {
      addTrainRow(value);
    });
  });

  function addTrainRow({ firstTrain, frequency, destination, name }) {
    var initalTrain = moment(firstTrain, "HH:mm");
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
      var missedTrains = Math.round(timePassed / frequency);

      nextArrival = moment(b)
        .add((missedTrains + 1) * frequency, "minutes")
        .format("HH:mm");
      var minutesPast = timePassed % frequency;
      minutesAway = frequency - minutesPast;
    }

    $("#new-trains").append(
      `<tr>
        <td>${name}</td>
        <td>${destination}</td>
        <td>${frequency}</td>
        <td>${nextArrival}</td>
        <td>${minutesAway}</td>
      </tr>`
    );
  }

  $("#add-train").on("click", function(event) {
    event.preventDefault();
    database.ref().push(getFieldValues());
    addTrainRow(getFieldValues());
  });
});
