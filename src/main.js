// mySketch.jsの概要:
// このスクリプトは、動物を描画し、ユーザーのインタラクションに応じて動物をキャプチャするシンプルなゲームを実装します。
// ユーザーは画面上の動物をクリックすることでそれらをキャプチャし、キャプチャされた動物のリストを表示・非表示することができます。
// main.js
import GameManager from './gameManager.js';

let game;

function setup() {
  game = new GameManager();
  game.setup();
}

function draw() {
  game.draw();
}



// グローバルスコープに setup と draw を定義
window.setup = setup;
window.draw = draw;