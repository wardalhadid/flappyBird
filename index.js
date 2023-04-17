const canvas = document.getElementById("flappy");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = window.innerWidth);
const CANVAS_HEIGHT = (canvas.height = window.innerHeight);
const BASE_HEIGHT = 112;
const GAME_SPEED = 2;
const pipeInterval = 3500;
let timeSinceLastPipe = 0;
const birdJump = 100;
const fallSpeed = 3.4;
let gameStart = false;

const background = new Image();
background.src = "./assets/gameObjects/background-day.png";
const gameover = new Image();
gameover.src = "./assets/UI/gameover.png";

let timeToNextFlap = 0;
let birdInterval = 500;
let lastTime = 0;
let score = 0;
let gameOver = false;

class Base {
  constructor() {
    this.width = 336;
    this.height = BASE_HEIGHT;
    this.image = new Image();
    this.image.src = "./assets/gameObjects/base.png";
    this.x = 0;
    this.y = window.innerHeight - this.height;
  }
  draw() {
    if (this.x <= -this.width) {
      this.x = 0;
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 2,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 3,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 4,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 5,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 6,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 7,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 8,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 9,
      this.y,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width * 10,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    this.x -= GAME_SPEED;
  }
}

class Bird {
  constructor() {
    this.width = 34;
    this.height = 34;
    this.image = new Image();
    this.image.src = "./assets/gameObjects/yellowbird-midflap.png";
    this.x = 50;
    this.y = window.innerHeight / 2 - this.height / 2;
    this.frame = 0;
    this.timeSinceLastFlap = 0;
    this.flapInterval = 500;
  }
  draw() {
    return ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  update(deltaTime) {
    if (gameStart) {
      if (this.y < CANVAS_HEIGHT - BASE_HEIGHT - this.height && this.y !== 0) {
        this.y += fallSpeed;
        this.timeSinceLastFlap += deltaTime;
        if (this.timeSinceLastFlap > this.flapInterval) {
          this.frame++;
        }
        this.timeSinceLastFlap = 0;
      } else {
        gameOver = true;
      }
    }
  }
  fly(deltaTime) {
    if (this.y - birdJump > 0) {
      this.y -= birdJump;
      this.timeSinceLastFlap += deltaTime;
      if (this.timeSinceLastFlap > this.flapInterval) {
        this.frame++;
      }
      this.timeSinceLastFlap = 0;
    }
  }
}

class Pipe {
  constructor() {
    this.image = new Image();
    this.image.src = "./assets/gameObjects/pipe-green.png";
    this.image2 = new Image();
    this.image2.src = "./assets/gameObjects/pipe-green2.png";
    this.width = 52;
    this.height = Math.min(Math.random() * 500 + 80, CANVAS_HEIGHT * 0.6);
    this.x = CANVAS_WIDTH;
    this.gap = Math.random() * 80 + birdJump + 20;
    this.y1 = CANVAS_HEIGHT - BASE_HEIGHT - this.height;
    this.y2 = CANVAS_HEIGHT - this.height - BASE_HEIGHT - this.gap;
    this.markedForDeletion = false;
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y1, this.width, this.height);
    ctx.drawImage(this.image2, this.x, 0, this.width, this.y2);
  }
  update() {
    if (gameStart) {
      this.x -= GAME_SPEED;
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
      }
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code == "Space") {
    bird.fly();
    if (!gameStart) {
      gameOver = false;
      gameStart = true;
    }
  }
});

addEventListener("touchstart", (event) => {
  bird.fly();
  if (!gameStart) {
    gameOver = false;
    gameStart = true;
  }
});

let pipes = [];
const base = new Base();
const bird = new Bird();

function drawScore() {
  ctx.font = "40px Impact";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 55, 80);
}

function drawGameStart() {
  ctx.font = "35px Impact";
  ctx.fillStyle = "white";
  ctx.fillText(
    "Press Space or Tap to start",
    CANVAS_WIDTH / 2 - 190,
    CANVAS_HEIGHT / 2 - 10
  );
}

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  base.draw();
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextFlap += deltaTime;
  timeSinceLastPipe += deltaTime;
  if (timeSinceLastPipe > pipeInterval) {
    pipes.push(new Pipe());
    timeSinceLastPipe = 0;
  }
  bird.draw();

  if (!gameStart) drawGameStart();

  bird.update(deltaTime);
  base.update();
  [...pipes].forEach((pipe) => pipe.draw());
  [...pipes].forEach((pipe) => pipe.update());
  [...pipes].forEach((pipe) => {
    if (pipe.x == bird.x) {
      if (bird.y + bird.height < pipe.y1 && bird.y > pipe.y2) {
        score += 1;
      } else {
        gameOver = true;
      }
    }
    drawScore();
  });

  pipes = pipes.filter((pipe) => !pipe.markedForDeletion);

  if (!gameOver) requestAnimationFrame(animate);
  else {
    ctx.drawImage(
      gameover,
      CANVAS_WIDTH / 2 - 96,
      CANVAS_HEIGHT / 2 - 200,
      192,
      142
    );
    gameStart = false;
    drawGameStart();
    bird.y = CANVAS_HEIGHT / 2;
    pipes = [];
    score = 0;
    setTimeout(() => {
    requestAnimationFrame(animate);
    }, "700")
  }
}

animate(0);
