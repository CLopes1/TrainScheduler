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
var tFrequency
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
            frequency: frequency
        })
    })

})





// database.ref().orderByChild('number').limitToLast(1).on('child_added', function(snapshot) {
    //     console.log('hi')
    //     console.log(snapshot.val())
    // })
    
    // To Do - figure out how to calculate next train and minutes away logic.
    // Where should this logic go? Within onclick event?
    
    //Next Train & Minutes Away Logic
    
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
    
    
    
        console.log(childsnapshot.val())
        $('#addTrain').append(`<div>${childsnapshot.val().trainName}</div>`)
        $('#addDest').append(`<div>${childsnapshot.val().destination}</div>`)
        $('#addFreq').append(`<div>${childsnapshot.val().frequency}</div>`)
        // $("#addNextArr").append(`<div>${childsnapshot.val().}</div>`)
        // $("#addMinAway").append(`<div>${childsnapshot.val().}</div>`)
    
        
    })
    
    
