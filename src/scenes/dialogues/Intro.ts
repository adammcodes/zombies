const debug = false;

// Add WebFont type declaration
declare const WebFont: {
  load: (config: {
    google?: { families: string[] };
    active?: () => void;
  }) => void;
};

const game_intro = `\n
\n
The Year 2099,  \n
Zombies have consumed most of humanity and few resources remain
as humankind struggles to survive. After many attempts, you have
finally found the antidote to the virus that has eliminated
most of the human population. Unfortunately, time is running out.
Zombies have begun to devour your colony and you'll need to produce 
more of the antidote quickly.

Collect 36 samples of the virus to produce enough of your  
antidote to save the survivors.

Beware of the zombies who have infiltrated your colony... 

Press ENTER to begin your nightmare......`;

const textStyle = {
  fontSize: 25,
  lineSpacing: 0,
  fontFamily: "VT323",
  color: "WHITE",
};

interface IntroOptions {
  avatar: string;
}

export default class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  preload() {
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
    );
  }

  create(options: IntroOptions) {
    // camera transition effect
    this.cameras.main.fadeIn(5000);
    this.add.image(0, 0, "title_bg").setOrigin(0, 0).setVisible(!debug);

    //load fonts
    let add = this.add;
    let tweens = this.tweens;
    let input = this.input;
    let renderer = this.renderer;
    let scene = this.scene;

    WebFont.load({
      google: {
        families: ["VT323"],
      },
      active: function () {
        add
          .text(32, 32, game_intro, textStyle)
          .setAlpha(0.25)
          .setVisible(debug);

        const text = add.text(32, 32, game_intro, textStyle);
        const { lineHeight, lineSpacing, lineWidths } =
          Phaser.GameObjects.GetTextSize(
            text,
            text.getTextMetrics(),
            game_intro.split("\n")
          );
        const totalLineHeight = lineHeight + lineSpacing;
        add
          .grid(
            text.x,
            text.y,
            text.width,
            text.height,
            lineHeight,
            totalLineHeight,
            0,
            0,
            0x00ffff,
            0.2
          )
          .setOrigin(0, 0)
          .setVisible(debug);
        const maskImage = add
          .graphics({
            fillStyle: { color: 0xff0000, alpha: 0.5 },
          })
          .setVisible(debug);
        const mask = maskImage.createGeometryMask();

        text.setMask(mask);

        const path = new Phaser.Curves.Path();

        for (let i = 0, len = lineWidths.length; i < len; i++) {
          const lineWidth = lineWidths[i];
          const y = text.y + i * totalLineHeight;

          path.moveTo(text.x, y).lineTo(text.x + lineWidth, y);
        }

        const pathDisplay = add
          .graphics({ lineStyle: { color: 0xffff00, alpha: 0.5, width: 2 } })
          .setVisible(debug);

        path.draw(pathDisplay);

        tweens.addCounter({
          from: 0,
          to: 1,
          duration: 20 * game_intro.length,
          onUpdate: (counter) => {
            const { x, y } = path.getPoint(counter.getValue());

            maskImage.clear();

            if (y > 0) {
              maskImage.fillRect(text.x, text.y, text.width, y - text.y);
            }

            maskImage.fillRect(text.x, y, x - text.x, totalLineHeight);
          },
        });

        // Handle keyboard input with null check
        if (input.keyboard) {
          input.keyboard.once(
            "keyup-ENTER",
            function () {
              // Handle WebGL texture with type check
              if ("blankTexture" in renderer) {
                // Cast the texture to any to avoid type mismatch
                (text as any).texture = (
                  renderer as Phaser.Renderer.WebGL.WebGLRenderer
                ).blankTexture;
              }

              // When starting the game fresh, we use this initial state
              const data = {
                comingFrom: "Intro",
                health: 500,
                inventory: [],
                avatar: options.avatar,
                sampleLocations: {
                  Dungeon: null,
                  Town: null,
                  Forest: null,
                },
              };

              scene.start("Town", data);
              scene.stop("Intro");
              scene.run("Timer");
            },
            this
          );
        }
      },
    });
  }
}
