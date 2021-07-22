(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

document.getElementById("playGame").addEventListener('click', enterGame)

function enterGame() {
    document.getElementById('welcome').style.display = "none"
}

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = document.body.clientWidth,
    height = document.body.clientHeight,
    player = {
        x: 50,
        y: height - 200,
        width: 50,
        height: 50,
        speed: 3,
        velX: 0,
        velY: 0,
        jumping: false,
        grounded: false,
        color: '#E6AC27',
        image: document.getElementById('character')
    },
    level = 1,
    keys = [],
    friction = 0.8,
    gravity = 0.4,
    boxes = [],
    boxes2 = [],
    powerup = [],
    lava = [];

powerup.push({
    x: 490,
    y: height - 195,
    width: 20,
    height: 20,
    color: '#BF4D28',
    effect: 'shrink'
});
/*
powerup.push({
    x: 400,
    y: 150,
    width: 20,
    height: 20,
    color: '#BF4D28',
    effect: 'gravity'
});
powerup.push({
    x: -15,
    y: 88,
    width: 20,
    height: 20,
    color: '#222',
    effect: 'tele',
    rotate: 20,
    px: 20,
    py: 370,
    stay: true
});
*/
powerup.push({
    x: 60,
    y: 415,
    width: 20,
    height: 20,
    color: '#2A5D77',
    effect: 'win',
});


boxes.push({
    x: 0,
    y: 0,
    width: 10,
    height: height,
    color: '#a08f73',
});
boxes.push({
    x: 0,
    y: height - 50,
    width: 300,
    height: 50,
    color: '#a08f73',
});
boxes.push({
    x: width - 10,
    y: 0,
    width: 50,
    height: height,
    color: '#a08f73',
});
boxes.push({
    x: 0,
    y: 0,
    width: width,
    height: 10,
    color: '#a08f73',
})

boxes.push({
    x: 300,
    y: height - 115,
    width: 100,
    height: 10,
    color: '#a08f73',
});

boxes.push({
    x: 450,
    y: height - 155,
    width: 100,
    height: 10,
    color: '#a08f73',
});

boxes.push({
    x: 700,
    y: height - 155,
    width: 100,
    height: 10,
    color: '#a08f73',
});

boxes.push({
    x: 780,
    y: height - 300,
    width: 100,
    height: 10,
    color: '#a08f73',
});

boxes.push({
    x: 1180,
    y: height - 200,
    width: 100,
    height: 10,
    color: '#a08f73',
});

lava.push({
    x: 300,
    y: height - 50,
    width: width - 310,
    height: 50,
    color: '#F76806'
})


canvas.width = width;
canvas.height = height;

function update() {

    if (keys['ArrowUp'] || keys['Space'] || keys['KeyW']) {

        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2.5;
        }
    }
    if (keys['ArrowRight'] || keys['KeyD']) {

        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys['ArrowLeft'] || keys['KeyA']) {

        if (player.velX > -player.speed) {
            player.velX--;
        }
    }



    player.velX *= friction;
    player.velY += gravity;

    ctx.clearRect(0, 0, width, height);


    player.grounded = false;
    ctx.beginPath();

    if (level == 1) {

        ctx.font = 'normal 40px Montserrat';
        ctx.fillText('Level 1', canvas.width / 2 - 50, canvas.height / 2 - 200)


        for (var i = 0; i < boxes.length; i++) {
            ctx.fillStyle = boxes[i].color;
            ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

            var dir = collisionCheck(player, boxes[i]);

            if (dir === "l" || dir === "r") {
                player.velX = 0;
                player.jumping = false;
            } else if (dir === "b") {
                player.grounded = true;
                player.jumping = false;
            } else if (dir === "t") {
                player.velY *= -1;
            }

        }

        for (var k = 0; k < lava.length; k++) {
            ctx.fillStyle = lava[k].color;
            ctx.fillRect(lava[k].x, lava[k].y, lava[k].width, lava[k].height)


            var dir = collisionCheck(player, lava[k])
            if (dir) {
                console.log('touched')
                player.x = 50
                player.y = height - 200
                alert('You Died!')
                document.location.reload()
            }
        }

        if (player.grounded) {
            player.velY = 0;
        }

        player.x += player.velX;
        player.y += player.velY;

        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);


        for (var j = 0; j < powerup.length; j++) {
            ctx.save();
            var cx = powerup[j].x + 0.5 * powerup[j].width,
                cy = powerup[j].y + 0.5 * powerup[j].height;
            ctx.translate(cx, cy);
            ctx.rotate((Math.PI / 180) * 45);
            if (powerup[j].effect === 'tele') {
                ctx.rotate((Math.PI / 180) * powerup[j].rotate);
                powerup[j].rotate = (Math.PI / 180) * powerup[j].rotate;
            }
            ctx.translate(-cx, -cy);
            ctx.fillStyle = powerup[j].color;
            ctx.fillRect(powerup[j].x, powerup[j].y, powerup[j].width, powerup[j].height);
            ctx.restore();


            if (collisionCheck(player, powerup[j]) !== null) {
                if (powerup[j].effect === 'gravity') {
                    gravity = 0.4;
                    player.speed = 4;
                    player.color = 'white';
                } else if (powerup[j].effect === 'shrink') {
                    player.width = 10;
                    player.height = 10;
                    player.speed = 5;
                } else if (powerup[j].effect === 'tele') {
                    player.x = powerup[j].px;
                    player.y = powerup[j].py;
                } else if (powerup[j].effect === 'win') {
                    var r = alert(`You beat level 1!`);
                    r;
                    player.x = 50
                    player.y = height - 200
                    player.width = 50;
                    player.height = 50;
                    player.speed = 3;
                    player.velX = 0;
                    player.velY = 0;
                    //level = 2;

                }
                if (powerup[j].stay !== true)
                    powerup[j].width = 0;
                powerup[j].height = 0;
            }
        }


        requestAnimationFrame(update);
    }

/*
    if (level == 2) {
        ctx.font = 'Montserrat sans-serif'
        ctx.fillText('Level 2', canvas.width / 2, canvas.height / 2 - 100)

        for (var i = 0; i < boxes.length; i++) {
            ctx.fillStyle = boxes[i].color;
            ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

            var dir = collisionCheck(player, boxes[i]);

            if (dir === "l" || dir === "r") {
                player.velX = 0;
                player.jumping = false;
            } else if (dir === "b") {
                player.grounded = true;
                player.jumping = false;
            } else if (dir === "t") {
                player.velY *= -1;
            }

        }

        for (var k = 0; k < lava.length; k++) {
            ctx.fillStyle = lava[k].color;
            ctx.fillRect(lava[k].x, lava[k].y, lava[k].width, lava[k].height)


            var dir = collisionCheck(player, lava[k])
            if (dir) {
                player.x = 50
                player.y = height - 200
                alert('You Died!')
                document.location.reload()
            }
        }

        if (player.grounded) {
            player.velY = 0;
        }

        player.x += player.velX;
        player.y += player.velY;

        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);


        for (var j = 0; j < powerup.length; j++) {
            ctx.save();
            var cx = powerup[j].x + 0.5 * powerup[j].width,
                cy = powerup[j].y + 0.5 * powerup[j].height;
            ctx.translate(cx, cy);
            ctx.rotate((Math.PI / 180) * 45);
            if (powerup[j].effect === 'tele') {
                ctx.rotate((Math.PI / 180) * powerup[j].rotate);
                powerup[j].rotate = (Math.PI / 180) * powerup[j].rotate;
            }
            ctx.translate(-cx, -cy);
            ctx.fillStyle = powerup[j].color;
            ctx.fillRect(powerup[j].x, powerup[j].y, powerup[j].width, powerup[j].height);
            ctx.restore();


            if (collisionCheck(player, powerup[j]) !== null) {
                if (powerup[j].effect === 'gravity') {
                    gravity = 0.4;
                    player.speed = 4;
                    player.color = 'white';
                } else if (powerup[j].effect === 'shrink') {
                    player.width = 10;
                    player.height = 10;
                    player.speed = 5;
                } else if (powerup[j].effect === 'tele') {
                    player.x = powerup[j].px;
                    player.y = powerup[j].py;
                } else if (powerup[j].effect === 'win') {
                    var r = confirm("You beat the level! Would you like to play again?");
                    if (r == true) {
                        document.location.reload();
                    } else {
                        player.x = 50
                        player.y = height - 200
                    }
                }
                if (powerup[j].stay !== true)
                    powerup[j].width = 0;
                powerup[j].height = 0;
            }
        }


        requestAnimationFrame(update);
    }
    */
}

function collisionCheck(shapeA, shapeB) {

    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),

        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;


    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {

        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.code] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.code] = false;
});


window.addEventListener("load", function () {
    update();
});