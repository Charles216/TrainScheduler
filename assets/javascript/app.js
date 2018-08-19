// Initialize Firebase
var config = {
    apiKey: "AIzaSyCBu9Xf4R2HhlnauOXmXbjochD209rDUNI",
    authDomain: "trainscheduler-81249.firebaseapp.com",
    databaseURL: "https://trainscheduler-81249.firebaseio.com",
    projectId: "trainscheduler-81249",
    storageBucket: "trainscheduler-81249.appspot.com",
    messagingSenderId: "500552173128"
};
firebase.initializeApp(config);

var database = firebase.database();

//control submit button...
$("#add-train-btn").on('click', function (event) {
    event.preventDefault();

    //create vars to pull data from form...
    var trainName = $("#train-name-input").val().trim();
    var destName = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    //create local "temporary" object for holding data...
    var newTrain = {
        name: trainName,
        destination: destName,
        initialTrain: firstTrain,
        time: frequency,
    };

    //upload train info to database...
    database.ref().push(newTrain);

    //log to console
     console.log(newTrain.name);
     console.log(newTrain.destination);
     console.log(newTrain.initialTrain);
     console.log(newTrain.time);

    alert("New Train Route Successfully Added");

    //clear the text boxes...
    $("#train-name-input").val('');
    $("#destination-input").val('');
    $("#first-train-input").val('');
    $("#frequency-input").val('');
});

//create firebase event  for adding train dest create row in html
database.ref().on('child_added', function (childSnapShot) {
    console.log(childSnapShot.val());

    //store all info in vars...
    var trainName = childSnapShot.val().name;
    var destName = childSnapShot.val().destination;
    var firstTrain = childSnapShot.val().initialTrain;
    var frequency = childSnapShot.val().time;


    //moments stuff here.....
var tFrequency = frequency;

var baseTime = firstTrain;

var baseTimeConverted = moment(baseTime, "HH:mm")
.subtract(1, "years");
console.log(baseTimeConverted);

//current time...
var currentTime = moment();
console.log("Current Time: " + moment(currentTime).format("hh:mm"));

//difference between the times...
var diffTime = moment().diff(moment(baseTimeConverted), 'minutes');

//find the remainder...
var remainder = diffTime % tFrequency;
console.log("remainder = " + remainder);

//Minutes until train...
var timeToTrain = tFrequency - remainder;

//next train arrives at...
var ttTrain = moment().add(timeToTrain, 'minutes');

//mins away...
var minsAway = tFrequency - remainder;

    //create new row for table...
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destName),
        $("<td>").text(frequency),
        $("<td>").text(ttTrain.format("hh:mm")),
        $('<td>').text(minsAway),
        
    );

    //append new row to table...
    $('#trainTable > tbody').append(newRow);

});

