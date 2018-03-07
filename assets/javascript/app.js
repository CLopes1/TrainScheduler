// Initialize firebase

var config = {
    apiKey: "AIzaSyC4jBdfuOLkFMuT3PkHWTspbqnY8AoBOHw",
    authDomain: "train-scheduler-b6367.firebaseapp.com",
    databaseURL: "https://train-scheduler-b6367.firebaseio.com",
    projectId: "train-scheduler-b6367",
    storageBucket: "",
    messagingSenderId: "202561550118"
};

firebase.initializeApp(config);

//  ^ Initialize firebase above ^

// Create a variable to reference the database
var database = firebase.database()


//Initial Values
var trainName
var destination
var firstTrain
var frequency
var nextArr
var minAway

//-------------------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.

database.ref().on("value", function (snapshot) {

    // Capture the user's input to the database when clicking on the submit button.

    $("#submit").on("click", function () {
        event.preventDefault()
        trainName = $("#trainName").val()
        destination = $("#destination").val()
        firstTrain = $("#firstTrain").val()
        frequency = $("#frequency").val()



        //Push user's input to the database

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            timeStamp: firebase.database.ServerValue.TIMESTAMP

        })
    })


    //Next Train & Minutes Away Logic
    // database.ref().orderByChild("timeStamp").limitToLast(100).on("child_added", function (childsnapshot) {
        database.ref().on('child_added', function (childsnapshot) {

        // Assumptions
        var tFrequency = childsnapshot.val().frequency

        // // Time is 3:30 AM
        var firstTime = childsnapshot.val().firstTrain

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
        console.log("first time converted =:" + firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
       

        //Append the data to the current train schedule table
        $('#addTrain').append(`<div>${childsnapshot.val().trainName}</div>`)
        $('#addDest').append(`<div>${childsnapshot.val().destination}</div>`)
        $('#addFreq').append(`<div>${childsnapshot.val().frequency}</div>`)
        $('#addMinAway').append(`<div>${tMinutesTillTrain}</div>`)
        $('#addNextArr').append(`<div>${nextTrain.format('hh:mm')}</div>`)


        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    //refreashes train data every minute
    setInterval(function () {
        location.reload();
    }, 60000)

})
