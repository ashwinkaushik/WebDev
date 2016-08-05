$(document).ready(function() {
// My script goes in here

var database = firebase.database();
var auth = firebase.auth();

var codemirror = CodeMirror(document.getElementById("firepad"), {
    lineWrapping: true
});

auth.onAuthStateChanged(function(user) {
    if (user) {
        // Logged in
        $('.login').hide();
        $('.app').show();

        var firepad = Firepad.fromCodeMirror(database.ref(), codemirror, {});
    }
    else {
        // Logged out
        $('.app').hide();
        $('.login').show();
    }
});

// TODO
// - create account
var createAccount = false;

$(".login .signin").click(function() {
    var email = $(".login .email").val();
    var password = $(".login .password").val();

    if (createAccount) {
        auth.createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
                console.log(error);
            });
    }
    else {
        auth.signInWithEmailAndPassword(email, password)
            .catch(function(error) {
                console.log(error.code);

                // Set the error state
                $('.login .signin')
                    .text('invalid password')
                    .addClass('error');

                setTimeout(function() {
                    $('.login .signin')
                        .text('login')
                        .removeClass('error');
                }, 1000);
            });
    }
});

$('.login .signup').click(function() {
    createAccount = true;
    $('.login .signin').text('create account');
    $('.login .signup').hide();
});

$('.app .logout').click(function() {
    auth.signOut();
});

// End of document.ready
});
