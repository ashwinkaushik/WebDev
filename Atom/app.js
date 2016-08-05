// Firebase data
var database = firebase.database();
var userRef = database.ref("user");
var poopRef = database.ref("poop");

// Get the canvas width/height
var width = document.body.clientWidth;
var height = document.body.clientHeight;

// Push some data to firebase about ourselves
var myUser = userRef.push();
var myX = Math.random() * width;
var myY = Math.random() * height;
var mySize = 100;
myUser.set({
    name: 'Ashwin',
    x: myX,
    y: myY,
    size: mySize
});
myUser.onDisconnect().remove();

// Create an image element to load the emoji image
var poopImage = document.createElement("img");
poopImage.setAttribute("src", "poop.png");

// Create a canvas that fits the screen exactly
var canvas = document.createElement("canvas");
canvas.setAttribute('width', '' + width);
canvas.setAttribute('height', '' + height);
document.body.appendChild(canvas);

// Graphics context
var context = canvas.getContext('2d');

var player = {};
userRef.on('child_added', function(user) {
    player[user.key] = user.val();
});
userRef.on('child_changed', function(user) {
    player[user.key] = user.val();
});
userRef.on('child_removed', function(user) {
    delete player[user.key];
});

var poop = {};
poopRef.on('child_added', function(p) {
    poop[p.key] = p.val();
});
poopRef.on('child_changed', function(p) {
    poop[p.key] = p.val();
});
poopRef.on('child_removed', function(p) {
    delete poop[p.key];
});

// Get the mouse motion, and update two variables that store where it is
var mouseX = width / 2;
var mouseY = height / 2;
var mouseClick = false;
var canPoop = true;

document.onmousemove = function(m) {
    mouseX = m.clientX;
    mouseY = m.clientY;
};
document.onmousedown = function() {
    mouseClick = true;
};
document.onmouseup = function() {
    mouseClick = false;
}

function frame() {
    // Clear the background
    context.clearRect(0, 0, width, height);

    for (var playerId in player) {
        var playerData = player[playerId];
        context.drawImage(poopImage,
            playerData.x - playerData.size / 2,
            playerData.y - playerData.size / 2,
            playerData.size, playerData.size);
    }

    for (var poopId in poop) {
        var poopData = poop[poopId];
        context.drawImage(poopImage,
            poopData.x - 5,
            poopData.y - 5,
            10, 10);

        if (poopData.user == myUser.key) {
            poopRef.child(poopId).update({
              x: poopData.x + poopData.dx,
              y: poopData.y + poopData.dy
            })
        }

        if (poopData.user != myUser.key &&
            Math.abs(myX - poopData.x) < mySize / 2 &&
            Math.abs(myY - poopData.y) < mySize / 2) {

              mySize++;
              userRef.child('size').set(mySize);
              poopRef.child(poopId).remove();
        }
    }

    if (canPoop && mouseClick && mySize > 10) {
        var newPoop = poopRef.push({
            x: myX,
            y: myY,
            dx: Math.random() * 10 - 5,
            dy: Math.random() * 10 - 5,
            user: myUser.key
          });
        canPoop = false;
        setTimeout(function(){
          canPoop = true;
        }, 1000);

        mySize -=1;
        myUser.child('size').set(mySize);
        newPoop.onDisconnect().remove();
    }

    myX += (mouseX - myX) / 10;
    myY += (mouseY - myY) / 10;
    myUser.child("x").set(myX);
    myUser.child("y").set(myY);



    window.requestAnimationFrame(frame);
}

frame();
