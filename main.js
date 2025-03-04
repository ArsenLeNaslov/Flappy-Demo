import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSprite("flappyno", "sprites/flappyno.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("pop", "sounds/pop.mp3");
loadSound("le nou", "sounds/le nou.mp3");
loadSound("Powerup! - Jeremy Blake", "sounds/Powerup! - Jeremy Blake.mp3");
const music = play("Powerup! - Jeremy Blake", { loop: true, volume: 0.5 });

let highScore = 0;

scene("game", () => {
  const PIPE_GAP = 120;
  let score = 0;

  add([
    sprite("bg", { width: width(), height: height() })
  ]);

  const scoreText = add([
    text(score, { size: 50 })
  ]);

  // add a game object to screen
  const player = add([
    // list of components
    sprite("flappyno"),
    scale(2),
    pos(80, 40),
    area(),
    body(),
  ]);

  function producePipes() {
    const offset = rand(-50, 50);

    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      "pipe",
      area(),
      { passed: false }
    ]);

    add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - PIPE_GAP / 2),
      origin("botleft"),
      "pipe",
      area()
    ]);
  }

  loop(1.5, () => {
    producePipes();
  });

  action("pipe", (pipe) => {
    pipe.move(-160, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      play("pop");
      score += 1;
      scoreText.text = score;
    }
  });

  player.collides("pipe", () => {
    go("gameover", score);
  });

  player.action(() => {
    if (player.pos.y > height() + 30 || player.pos.y < -30) {
      go("gameover", score);
    }
  });

  keyPress("space", () => {
    play("wooosh");
    player.jump(400);
  });
});

action("bg", (bg) => {
  bg.move(-40 * SPEED, 0);
  if (bg.pos.x < -4 * width()) {
    destroy(bg);
  }
  if (bg.pos.x < -2 * width() && !bg.passed) {
    bg.passed = true;
    add([
      sprite("bg", { width: width() * 4, height: height() }),
      pos(width(), 0),
      "bg",
      layer("bg")
    ])
  }
})

scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score;

    add([
      sprite("bg", { width: width(), height: height() })
    ]);

    add([
      text(
        "gameover!\n"
        + "score: " + score
        + "\nhigh score: " + highScore,
        { size: 30 }
        + play("le nou", { volume: 0.2 })
      )
    ]);

    const textSize = 1
    add([
      text("press space", textSize),
      pos(4, height() - 60 - textSize)
    ]);

    keyPress("space", () => {
      go("game");
    });
  }
});

go("game");