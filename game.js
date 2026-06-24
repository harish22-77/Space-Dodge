const game = document.getElementById("game");
const ship = document.getElementById("ship");
const scoreText = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const livesText = document.getElementById("lives");
const finalScore = document.getElementById("finalScore");
const directionText = document.getElementById("direction");

let shipX = window.innerWidth / 2;
let score = 0;
let lives = 3;
let playing = true;

// Initial ship position
ship.style.left = shipX + "px";

// Move Ship
function moveShip(x) {
    shipX = Math.max(
        30,
        Math.min(window.innerWidth - 80, x)
    );

    ship.style.left = shipX + "px";
}

// Mouse Control
document.addEventListener("mousemove", (e) => {

    if (!playing) return;

    moveShip(e.clientX);

    if (directionText) {
        if (e.clientX > ship.offsetLeft) {
            directionText.innerText = "🖐 RIGHT";
        } else {
            directionText.innerText = "🖐 LEFT";
        }
    }
});

// Touch Control
document.addEventListener("touchmove", (e) => {

    if (!playing) return;

    const x = e.touches[0].clientX;

    moveShip(x);

    if (directionText) {
        if (x > ship.offsetLeft) {
            directionText.innerText = "🖐 RIGHT";
        } else {
            directionText.innerText = "🖐 LEFT";
        }
    }
});

// Explosion
function explosion(x, y) {

    let boom = document.createElement("div");

    boom.innerHTML = "💥";
    boom.style.position = "absolute";
    boom.style.left = x + "px";
    boom.style.top = y + "px";
    boom.style.fontSize = "40px";
    boom.style.zIndex = "50";

    game.appendChild(boom);

    setTimeout(() => {
        boom.remove();
    }, 400);
}

// Lose Life
function loseLife() {

    lives--;

    livesText.innerText =
        "❤️".repeat(Math.max(lives, 0));

    if (lives <= 0) {

        playing = false;

        finalScore.innerText =
            "Final Score: " + score;

        gameOver.style.display = "block";
    }
}

// Meteor
function createMeteor() {

    if (!playing) return;

    let meteor = document.createElement("div");

    meteor.className = "meteor";
    meteor.innerHTML = "☄️";

    meteor.style.left =
        Math.random() *
        (window.innerWidth - 50) + "px";

    meteor.style.top = "-50px";

    game.appendChild(meteor);

    let fall = setInterval(() => {

        let y =
            parseInt(meteor.style.top) + 5;

        meteor.style.top = y + "px";

        if (
            meteor.offsetLeft < ship.offsetLeft + 50 &&
            meteor.offsetLeft + 40 > ship.offsetLeft &&
            meteor.offsetTop < ship.offsetTop + 50 &&
            meteor.offsetTop + 40 > ship.offsetTop
        ) {

            explosion(
                meteor.offsetLeft,
                meteor.offsetTop
            );

            meteor.remove();

            clearInterval(fall);

            loseLife();
        }

        if (y > window.innerHeight) {

            meteor.remove();

            clearInterval(fall);
        }

    }, 20);
}

// Laser
function shootLaser() {

    if (!playing) return;

    let laser =
        document.createElement("div");

    laser.className = "laser";
    laser.innerHTML = "⚡";

    laser.style.left =
        (ship.offsetLeft + 20) + "px";

    laser.style.top =
        ship.offsetTop + "px";

    game.appendChild(laser);

    let move = setInterval(() => {

        let y =
            parseInt(laser.style.top) - 10;

        laser.style.top = y + "px";

        document
            .querySelectorAll(".enemy")
            .forEach(enemy => {

                if (
                    laser.offsetLeft <
                        enemy.offsetLeft + 40 &&
                    laser.offsetLeft + 20 >
                        enemy.offsetLeft &&
                    laser.offsetTop <
                        enemy.offsetTop + 40 &&
                    laser.offsetTop + 20 >
                        enemy.offsetTop
                ) {

                    explosion(
                        enemy.offsetLeft,
                        enemy.offsetTop
                    );

                    score += 10;

                    scoreText.innerText =
                        "Score: " + score;

                    enemy.remove();
                    laser.remove();

                    clearInterval(move);
                }
            });

        if (y < -20) {

            laser.remove();

            clearInterval(move);
        }

    }, 20);
}

// Enemy Ship
function createEnemy() {

    if (!playing) return;

    let enemy =
        document.createElement("div");

    enemy.className = "enemy";
    enemy.innerHTML = "👾";

    enemy.style.left =
        Math.random() *
        (window.innerWidth - 50) + "px";

    enemy.style.top = "-50px";

    game.appendChild(enemy);

    let move = setInterval(() => {

        let y =
            parseInt(enemy.style.top) + 3;

        enemy.style.top = y + "px";

        if (
            enemy.offsetLeft < ship.offsetLeft + 50 &&
            enemy.offsetLeft + 40 > ship.offsetLeft &&
            enemy.offsetTop < ship.offsetTop + 50 &&
            enemy.offsetTop + 40 > ship.offsetTop
        ) {

            explosion(
                enemy.offsetLeft,
                enemy.offsetTop
            );

            enemy.remove();

            clearInterval(move);

            loseLife();
        }

        if (y > window.innerHeight) {

            enemy.remove();

            clearInterval(move);
        }

    }, 20);
}

// Score Counter
setInterval(() => {

    if (playing) {

        score++;

        scoreText.innerText =
            "Score: " + score;
    }

}, 1000);

// Spawn Objects
setInterval(createMeteor, 1000);
setInterval(createEnemy, 2500);
setInterval(shootLaser, 500);

// Restart
function restartGame() {
    location.reload();
}