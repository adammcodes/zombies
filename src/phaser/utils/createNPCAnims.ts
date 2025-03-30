const createNpcAnims = (anims: Phaser.Animations.AnimationManager) => {
  if (!anims.exists("walk1")) {
    anims.create({
      key: "walk1",
      frames: anims.generateFrameNames("boy1", {
        start: 0,
        end: 2,
        prefix: "0",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 10,
      yoyo: true,
    });
  }

  if (!anims.exists("left1")) {
    anims.create({
      key: "left1",
      frames: anims.generateFrameNames("boy1", {
        start: 3,
        end: 5,
        prefix: "0",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 10,
      yoyo: true,
    });
  }

  if (!anims.exists("right1")) {
    anims.create({
      key: "right1",
      frames: anims.generateFrameNames("boy1", {
        start: 6,
        end: 8,
        prefix: "0",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 10,
      yoyo: true,
    });
  }

  if (!anims.exists("back1")) {
    anims.create({
      key: "back1",
      frames: anims.generateFrameNames("boy1", {
        start: 9,
        end: 11,
        prefix: "0",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: 10,
      yoyo: true,
    });
  }
};

export { createNpcAnims };
