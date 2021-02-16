const { Game } = require("@/game-engine.js");
const data = require("@/data.js");

const gameObj = new Game("app", data);
gameObj.build();
