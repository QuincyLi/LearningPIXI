import * as PIXI from 'pixi.js'
import keyboard from './keyboardListener/index';
import { init } from './character/explorer';

//Aliases
let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  TextureCache = PIXI.utils.TextureCache,
  Rectangle = PIXI.Rectangle,
  Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
  width: 512,
  height: 512,
  antialias: true,
  transparent: false,
  resolution: 1
});

const left = keyboard(37);
const up = keyboard(38);
const right = keyboard(39);
const down = keyboard(40);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

loader.add("assets\\images\\treasureHunter.json").load(setup);

function setup() {
  const sprites = resources["assets\\images\\treasureHunter.json"].textures;
  const dungeon = new Sprite(sprites["dungeon.png"]);
  app.stage.addChild(dungeon);

  const explorer = init(app);
  explorer.x = 68;
  explorer.position.set(68, app.stage.height / 2 - explorer.height / 2);
  app.stage.addChild(explorer);

  const treasure = new Sprite(sprites["treasure.png"]);
  treasure.position.set(app.stage.width - treasure.width - 48, app.stage.height / 2 - treasure.height / 2);
  app.stage.addChild(treasure);

  const door = new Sprite(sprites["door.png"]);
  door.position.set(32, 0);
  app.stage.addChild(door);

  const numbersOfBlob = 6;
  const spacing = 48;
  const xOffset = 150;

  for (let i = 0; i < numbersOfBlob; i++) {
    const blob = new Sprite(sprites["blob.png"]);
    const x = spacing * i + xOffset;

    const y = randomInt(32, app.stage.height - 32 - blob.height);

    blob.position.set(x, y);

    app.stage.addChild(blob);
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}