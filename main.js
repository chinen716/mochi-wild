// mySketch.jsの概要:
// このスクリプトは、動物を描画し、ユーザーのインタラクションに応じて動物をキャプチャするシンプルなゲームを実装します。
// ユーザーは画面上の動物をクリックすることでそれらをキャプチャし、キャプチャされた動物のリストを表示・非表示することができます。




function setup() {
  game = new GameManager();
  game.setup();
}

function draw() {
  game.draw();
}

