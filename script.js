// Define the game canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreRed = document.querySelector(".red");
const scoreBlue = document.querySelector(".blue");
const container = document.querySelector(".container");

// Define the dimensions of the game world
const WORLD_WIDTH = 800;
const WORLD_HEIGHT = 600;

let up = false;
let down = false;
let w = false;
let s = false;
let dt = 1;
let scoreB = 0;
let scoreR = 0;
let interval;
let time1;
let btn;

// Define the ball object
const ball = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    radius: 10,
    speed: 250,
    direction: {
        x: -1,
        y: 1,
    },
};

// Define the paddles
const leftPaddle = {
    x: 10,
    width: 10,
    height: 75,
    y: WORLD_HEIGHT / 2 - 75 / 2,
    speed: 300,
};
const rightPaddle = {
    x: WORLD_WIDTH - 20,
    width: 10,
    height: 75,
    y: WORLD_HEIGHT / 2 - 75 / 2,
    speed: 300,
};
let prevPos = {
    x: ball.x,
    y: ball.y,
};

function checkCollision() {
    prevPos = {
        x: ball.x,
        y: ball.y,
    };
    if (
        ball.x >= rightPaddle.x &&
        ball.x <= rightPaddle.x + rightPaddle.width &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.x = prevPos.x - 15;
        ball.direction.x *= -1;
    }
    if (
        ball.x >= leftPaddle.x &&
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.y >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.x = prevPos.x + 15;
        ball.direction.x *= -1;
    }

    if (ball.x + ball.radius >= WORLD_WIDTH) {
        // ball.x *= -1;
        scoreB++;
        ball.x = WORLD_WIDTH / 2;
        ball.y = WORLD_HEIGHT / 2;
        leftPaddle.y = WORLD_HEIGHT / 2 - 75 / 2;
        rightPaddle.y = WORLD_HEIGHT / 2 - 75 / 2;

        scoreBlue.innerText = `${scoreB}`;
    }

    if (ball.x - ball.radius <= 0) {
        scoreR++;
        ball.x = WORLD_WIDTH / 2;
        ball.y = WORLD_HEIGHT / 2;
        leftPaddle.y = WORLD_HEIGHT / 2 - 75 / 2;
        rightPaddle.y = WORLD_HEIGHT / 2 - 75 / 2;
        scoreRed.innerText = `${scoreR}`;
    }

    if (ball.y + ball.radius >= WORLD_HEIGHT) {
        ball.y = prevPos.y - 3;
        ball.direction.y *= -1;
    }
    if (ball.y - ball.radius <= 0) {
        ball.y = prevPos.y + 3;
        ball.direction.y = ball.direction.y * -1;
    }
}

window.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key === "ArrowUp") {
        up = true;
    }
    if (e.key === "ArrowDown") {
        down = true;
    }
    if (e.key === "w") {
        w = true;
    }
    if (e.key === "s") {
        s = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") {
        up = false;
    }
    if (e.key === "ArrowDown") {
        down = false;
    }
    if (e.key === "w") {
        w = false;
    }
    if (e.key === "s") {
        s = false;
    }
});

function movePaddle() {
    if (up && rightPaddle.y > 0) {
        rightPaddle.y -= rightPaddle.speed * dt;
    }
    if (down && rightPaddle.y + rightPaddle.height < WORLD_HEIGHT) {
        rightPaddle.y += rightPaddle.speed * dt;
    }
    if (w && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.speed * dt;
    }
    if (s && leftPaddle.y + leftPaddle.height < WORLD_HEIGHT) {
        leftPaddle.y += leftPaddle.speed * dt;
    }
}

function restart() {
    scoreB = 0;
    scoreBlue.textContent = "0";
    scoreR = 0;
    scoreRed.textContent = "0";
    ball.x = WORLD_WIDTH / 2;
    ball.y = WORLD_HEIGHT / 2;
    leftPaddle.y = WORLD_HEIGHT / 2 - 75 / 2;
    rightPaddle.y = WORLD_HEIGHT / 2 - 75 / 2;
    btn.remove();
    interval = setInterval(() => {
        mainLoop();
    }, 16.66);
}

function win(color) {
    if (color === "blue") {
        scoreBlue.textContent = "Won";
        scoreRed.textContent = "Lost";
    }
    if (color === "red") {
        scoreRed.textContent = "Won";
        scoreBlue.textContent = "Lost";
    }
    btn = document.createElement("button");
    btn.textContent = "Restart";
    container.appendChild(btn);
    btn.addEventListener("click", restart);
}

function mainLoop() {
    let time2 = new Date().getTime();
    dt = (time2 - time1) / 1000;
    time1 = new Date().getTime();
    ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    // ctx.fillStyle = "#000";
    // ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    if (scoreB === 5) {
        win("blue");
        return clearInterval(interval);
    }
    if (scoreR === 5) {
        win("red");
        return clearInterval(interval);
    }
    ctx.fillStyle = "#00afdb";
    movePaddle();
    checkCollision();
    ctx.fillRect(
        leftPaddle.x,
        leftPaddle.y,
        leftPaddle.width,
        leftPaddle.height
    );
    ctx.fillStyle = "#db0033";
    ctx.fillRect(
        rightPaddle.x,
        rightPaddle.y,
        rightPaddle.width,
        rightPaddle.height
    );
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Update the ball position
    ball.x += ball.speed * ball.direction.x * dt;
    ball.y += ball.speed * ball.direction.y * dt;
}

// Define the game loop
function gameLoop() {
    time1 = new Date().getTime();
    interval = setInterval(() => {
        mainLoop();
    }, 16.66);
    // Clear the canvas
}
gameLoop();
