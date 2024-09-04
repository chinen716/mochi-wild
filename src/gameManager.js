
// src/gameManager.js
import { Echo,Deco } from './characters/animals.js';
import fieldManager from './fieldManager.js';

class GameManager {
  constructor() {
    this.count = 0;
    this.captureCount = 0;
    this.animals = [];
    this.capturedAnimals = [];
    this.showCapturedList = false;
    this.distFromMouseList = [];
    this.newMinIndex = null;
    this.minIndex = null;
    this.brightness = null;
    this.scrollX = 0;
    this.mouseWheel;
    this.targetScrollX = 0; // 目標スクロール位置を保持する変数
    this.collisionDisplayFrames = 10;
    this.ctx = null; // ctxをクラスのインスタンス変数として定義
    this.field = new fieldManager();
    this.oneDeco = null;
    this.numSectorsToDisplay = 11;
  }


  // setup関数
  setup() {
      createCanvas(windowWidth, windowHeight);
      this.ctx = canvas.getContext("2d"); // ctxを初期化
      background("#0C2DDE0F");

      //時間に応じて明るさを決定
      brightness = ("#484848ff");


      let animalCount  =60;


      for (let i = 0; i < animalCount; i++) {
      this.xpos = random(-9000, 9000);
      this.ypos = random(0, height);
      const pos= createVector(this.xpos, this.ypos);
      if(i % 2 == 0){
        const anim = new Echo(random(40, 50), random(50, 100),pos, 100, data[int(random(0, data.length))][1], Math.random() < 0.5 ? -1 : 1);
        this.animals.push(anim);
      }else{
        const anim = new Deco(random(40, 50), random(50, 100), pos, 1, data[int(random(0, data.length))][1], Math.random() < 0.5 ? -1 : 1);
        this.animals.push(anim);
      }

      }

      let toggleButton = document.getElementById('bag-icon');
      if (toggleButton) {
          toggleButton.addEventListener('click', this.toggleCaptureList.bind(this));
      } else {
          console.error("toggleButtonが見つかりません");
      }
  
      // マウスホイールイベントをキャプチャしてスクロール位置を更新
      window.addEventListener('wheel', this.calcMouseWheel.bind(this));
  }


  draw() {
      background(brightness);
      // スクロール位置に応じて描画の基準点を移動
      this.scrollX += (this.targetScrollX - this.scrollX) * 0.1;
      // フィールドの描画
      translate(this.scrollX, 0);

      // 1000px間隔で縦線を引く
      stroke(43);
      noFill();
      this.field.drawField(this.scrollX, this.numSectorsToDisplay);

      let distFromMouseList = [];


      
      for (let i = 0; i < this.animals.length; i++) {
        this.animals[i].drawAnimal(false);
        noFill();
        //ellipse(this.animals[i].newPos.x, this.animals[i].newPos.y, 111);
        text(i,this.animals[i].newPos.x, this.animals[i].newPos.y,1);
        let distFromMouse = Echo.calculateDistanceFromMouse(this.animals[i], mouseX, mouseY, this.scrollX);
        distFromMouseList.push(distFromMouse);
      }

      this.minIndex = Echo.findClosestAnimalIndex(distFromMouseList);
      //console.log(this.minIndex);
      if (this.newMinIndex != this.minIndex) {
        this.newMinIndex = this.minIndex;
        this.captureCount = 0;
      }
    
    
      for (let i = 0; i < this.animals.length; i++) {
        let minDistFromOthers = Echo.calculateDistancesFromOthers(this.animals, i); 
        if (minDistFromOthers[1].distance < 20) {

          //ellipse(this.animals[i].newPos.x, this.animals[i].newPos.y, 100);
          text("合体！", this.animals[i].newPos.x - this.animals[i].width, this.animals[i].newPos.y + this.animals[i].height / 2);
          this.collisionFrameCount = this.collisionDisplayFrames; // フレームカウントをリセット
    
          this.animals[i].onCollision(this.animals[minDistFromOthers[1].index]);
          this.animals.splice(minDistFromOthers[1].index, 1);
          this.animals[i].color = data[int(random(0, data.length))][1];
        }
      }
    
      if (this.minIndex < 80 && mouseIsPressed) 
        {
        fill(255, 255, 255, 0);
        noStroke();
        fill(255, 0, 0, 120);
        ellipse(this.animals[this.minIndex].newPos.x, this.animals[this.minIndex].newPos.y, this.captureCount);

        if (this.captureCount > 10) {
          this.capturedAnimals.push(this.animals[this.minIndex]);
          this.animals.splice(this.minIndex, 1);
          this.captureCount = 0;
          this.updateCaptureList();
        }
        this.captureCount += 0.5;
      } else if (!mouseIsPressed) {
          this.captureCount = 0;
      }
    
      this.count += 1;
    }

// マウスホイールイベントをキャプチャしてスクロール位置を更新
  calcMouseWheel(event) {
      this.targetScrollX += event.deltaY; // マウスホイールの動きに応じてscrollXを更新
      redraw();
  }



  
  //カバン内の表示状態切り替え
  toggleCaptureList() {
      //リストが表示されていれば非表示にし、非表示であれば表示に切り替え
      this.showCapturedList = !this.showCapturedList;
      //HTMLドキュメントから'captureList'というIDを持つ要素（キャプチャされた動物のリストを表示する部分）を取得
      let captureList = document.getElementById('captureList');
  
      //showCapturedList変数の値に応じて、captureList要素に'show'クラスを追加または削除
      //'show'クラスが追加されると、リストが表示されるようになり、削除されるとリストが非表示に
      //このクラスの追加や削除によって、CSSスタイルの変更を通じてリストの表示/非表示が切り替わる
      if (this.showCapturedList) {
      captureList.classList.add('show');
      } else {
      captureList.classList.remove('show');
      }
  }
  
  updateCaptureList() {
      let animalList = document.getElementById('animalList');
      const captureCountElement = document.getElementById('captureCount');
      animalList.innerHTML = ''; // リストをクリア

      for (let i = 0; i < this.capturedAnimals.length; i++) {
      let div = document.createElement('div');
      //console.log(this.capturedAnimals[i].controlPoints[1],this.capturedAnimals[i].controlPoints[2]);
      div.className = 'capture-item';
      div.innerHTML = `
      <div class="capture-item-summary">動物 ${i + 1}: 頂点 ${this.capturedAnimals[i].bodyCenter}</div>
      <div class="capture-item-details">
          <div class = "details-container">
            <div id="p5-small-canvas-${i + 1}" class="p5-small-canvas"></div> 
            <div class ="details-text">
              <p>詳細情報1</p>
              <p>詳細情報2</p>
              <div id="p5-canvas-${i + 1}"></div>
                          <button class="purchase-button">購入</button>
            </div>

          </div>
      </div>
  `
      animalList.appendChild(div);
      //console.log(this.capturedAnimals[i].color);
      let animm = this.capturedAnimals[i];
      // p5.jsの描画
      new p5((p) => {
        p.animm = animm;
        p.setup = function() {

          let canvas = p.createCanvas(2000, 1500);
          canvas.parent(`p5-canvas-${i + 1}`);
          p.background(200);
          //p.rect(2,3, 20, 50);
          console.log("drawing");
          p.animm.drawAnimalAt(p,true,30,60);
          //p.ellipse(3,3, 111);
        };
      });
      

      

      // // 小さな四角形のp5.js描画
      // new p5((p) => {
      //   p.setup = function() {
      //     let smallCanvas = p.createCanvas(100, 100);
      //     smallCanvas.parent(`p5-small-canvas-${i + 1}`);
      //     animm.drawAnimal2(true,50,50);
      //     console.log("drawAnimal2");
      //     //p.background(animm.color);
      //     //p.rect(10, 10, 80, 80); // 四角形を描画
      //   };
      // });


      }
  
      if (this.capturedAnimals.length > 0) {
      console.log(this.capturedAnimals.length);
      captureCountElement.textContent = this.capturedAnimals.length;
      captureCountElement.classList.add('show');
      } else {
      captureCountElement.classList.remove('show');
      }
  }
  
  // 画面内のアニマルをクリックするとリストを閉じる
  mousePressed() {
      document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('toggleButton').addEventListener('click', function () {
          if (showCapturedList === true) {
          toggleCaptureList();
          }
      });
      });
  }
  
  
  
  
  // 16進数のカラーコードをRGBオブジェクトに変換する関数
  hexToRgb(hex) {
      let bigint = parseInt(hex.slice(1), 16);
      let r = (bigint >> 16) & 255;
      let g = (bigint >> 8) & 255;
      let b = bigint & 255;
      return { r, g, b };
  }
  
  // RGBオブジェクトを16進数のカラーコードに変換する関数
  rgbToHex(rgb) {
      let r = rgb.r.toString(16).padStart(2, '0');
      let g = rgb.g.toString(16).padStart(2, '0');
      let b = rgb.b.toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
  }
  
  // 色を混ぜ合わせる関数
  mixColors(color1, color2) {
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const mixedRgb = {
      r: Math.floor((rgb1.r + rgb2.r) / 2),
      g: Math.floor((rgb1.g + rgb2.g) / 2),
      b: Math.floor((rgb1.b + rgb2.b) / 2)
      };
      return rgbToHex(mixedRgb);
  }
}

export default GameManager;