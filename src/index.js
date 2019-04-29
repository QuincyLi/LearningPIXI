import * as PIXI from 'pixi.js'
import play from './utils/play';
import controller from './utils/controller';
// const application = PIXI.Application;
// const loader = PIXI.loader;
// const resources = PIXI.loader.resources;
// const sprite = PIXI.Sprite;
// const container = PIXI.Container;

const { Application, loader, Sprite, Container, TextStyle, Text } = PIXI;
const { resources } = loader;

const options = {
  width: 512,
  height: 512,
  antialias: true,
  transparent: false,
  resolution: 1
};
const app = new Application(options);

document.body.appendChild(app.view);

loader.add("assets\\images\\treasureHunter.json").load(setup);

function setup() {
  const { stage } = app;
  const gameScene = new Container();
  stage.addChild(gameScene);

  const gameOverScene = new Container();
  gameOverScene.visible = false;
  stage.addChild(gameOverScene);

  const sprites = resources["assets\\images\\treasureHunter.json"].textures;

  //Dungeon
  const dungeon = new Sprite(sprites["dungeon.png"]);
  gameScene.addChild(dungeon);

  //Door
  const door = new Sprite(sprites["door.png"]);
  door.position.set(32, 0);
  gameScene.addChild(door);

  //Explorer
  const explorer = new Sprite(sprites["explorer.png"]);
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);

  //Treasure
  const treasure = new Sprite(sprites["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  let numberOfBlobs = 6,
    spacing = 48,
    xOffset = 150,
    speed = 2,
    direction = 1;

  //An array to store all the blob monsters
  const blobs = [];

  //Make as many blobs as there are `numberOfBlobs`
  for (let i = 0; i < numberOfBlobs; i++) {

    //Make a blob
    let blob = new Sprite(sprites["blob.png"]);

    //Space each blob horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first blob should be added
    let x = spacing * i + xOffset;

    //Give the blob a random `y` position
    let y = randomInt(0, stage.height - blob.height);

    //Set the blob's position
    blob.x = x;
    blob.y = y;

    //Set the blob's vertical velocity. `direction` will be either `1` or
    //`-1`. `1` means the enemy will move down and `-1` means the blob will
    //move up. Multiplying `direction` by `speed` determines the blob's
    //vertical direction
    blob.vy = speed * direction;

    //Reverse the direction for the next blob
    direction *= -1;

    //Push the blob into the `blobs` array
    blobs.push(blob);

    //Add the blob to the `gameScene`
    gameScene.addChild(blob);
  }

  const healthBar = createHealthBar(gameScene, stage);
  const message = createGameOverFont(gameOverScene, stage);

  controller(explorer);

  function end() {
    gameScene.visible = false;
    gameOverScene.visible = true;
  }

  let state = null;
  const start = play(explorer, blobs, treasure, door, message, healthBar);
  state = start;
  function gameLoop(delta) {
    //Update the current game state:
    const result = state(delta);
    if (result === undefined) return;
    if (result == 1) {
      message.text = "You won!";
    } else {
      message.text = "You lost!";
    }
    if (result !== undefined) {
      state = end;
    }
  }
  app.ticker.add(delta => gameLoop(delta));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createHealthBar(gameScene, stage) {
  //Create the health bar
  const healthBar = new PIXI.DisplayObjectContainer();
  healthBar.position.set(stage.width - 170, 4)
  gameScene.addChild(healthBar);

  //Create the black background rectangle
  const innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  const outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;

  return healthBar;
}

function createGameOverFont(gameOverScene, stage) {
  const style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  });
  const message = new Text("The End!", style);
  message.x = 120;
  message.y = stage.height / 2 - 32;
  gameOverScene.addChild(message);

  return message;
}

