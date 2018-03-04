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
var train
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
        train = $("#trainName").val()
        console.log("trainName =" + train)
        destination = $("#destination").val()
        firstTrain = $("#firstTrain").val()
        frequency = $("#frequency").val()

//Log the user's submission to the database

        database.ref().push({
            train: train,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        })
    })
})


database.ref().on('child_added', function(childsnapshot) {
    console.log(childsnapshot.val())
    $("#addTrain").append("<div>"+childsnapshot.val().train+"</div>")
    $("#addDest").append("<div>"+childsnapshot.val().destination+"</div>")
    $("#addFreq").append("<div>"+childsnapshot.val().frequency+"</div>")
    // $("#addNextArr").append("<div>"+snapshot.firstTrain+"</div>")
    // $("#addMinAway").append("<div>"+snapshot.firstTrain+"</div>")
})

// database.ref().orderByChild('number').limitToLast(1).on('child_added', function(snapshot) {
//     console.log('hi')
//     console.log(snapshot.val())
// })



