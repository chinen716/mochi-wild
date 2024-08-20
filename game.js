class Game {
    constructor() {
      this.xpos = 450;
      this.xpos1 = 600;
      this.direction = -100;
      this.direction1 = 1;
      this.count = 0;
      this.captureCount = 0;
      this.animals = [];
      this.decos = []; // decosをクラスのインスタンス変数として定義
      this.positions = [];
      this.capturedAnimals = [];
      this.showCapturedList = false;
      this.activeLevels = [];
      this.distFromMouseList = [];
      this.newMinIndex = null;
      this.minIndex = null;
      this.r = 255;
      this.g = 255;
      this.b = 255;
      this.brightness = null;
      this.scrollX = 0;
      this.mouseWheel;
      this.targetScrollX = 0; // 目標スクロール位置を保持する変数
      this.collisionDisplayFrames = 10;
      this.ctx = null; // ctxをクラスのインスタンス変数として定義
    }

    addAnimal(animal){
      this.animals.push(animal);
    }

    removeAnimalById(id){
      this.animals = this.animals.filter(animal => animal.id !== id);
    }
  
    // setup関数
    setup() {
        createCanvas(windowWidth, windowHeight);
        this.ctx = canvas.getContext("2d"); // ctxを初期化
        background("#0C2DDE0F");
    
        // 現在の日本時間を取得
        let now = new Date();
        let hours = now.getUTCHours() + 7; // 日本時間はUTC+1
        if (hours >= 24) hours -= 24; // 24時を超えた場合の調整
        //animalsの数を決定
        let animalCount;
        if (hours >= 6 && hours < 18) {
        animalCount = Math.floor(random(6,100)); // 日中は動物の数を半分に
        } else {
        animalCount = Math.floor(random(30,130));  // 夜間は全ての動物を表示
        }
        //時間に応じて明るさを決定
    
        if(hours >= 6 && hours < 18){
        brightness = ("#484848ff");
        } else {
        brightness = ("#484848ff");
        }
  
        // decoの数を決定
        let decoCount = 10; // 例として10個のdecoを生成
        for (let i = 0; i < decoCount; i++) {
        let size = random([0.5, 1, 1.5]); // 3種類のサイズからランダムに選択
        let position = { x: random(width), y: random(height) };
        let speed = random(1, 3);
        let decoColor =  data[int(random(0, data.length))][1]; // 変数名を変更
        let direction = random(TWO_PI);
        this.decos.push(new Deco(60, 130, position, speed, decoColor, direction, size));
        }

  
        for (let i = 0; i < animalCount; i++) {
        this.r = random(255);
        this.g = random(255);
        this.b = random(255);
        this.xpos = random(-3000, 4000);
        this.ypos = random(0, height);
        const pos= createVector(this.xpos, this.ypos);
        const anim = new Echo(random(40, 50), random(50, 100),pos, 100, data[int(random(0, data.length))][1], Math.random() < 0.5 ? -1 : 1);
        //anim.setContext(this.ctx); // Echoインスタンスにctxを設定
        this.animals.push(anim);
        this.positions.push(0);
        this.activeLevels.push(int(random(50, 200)));
    
        }
  
        let toggleButton = document.getElementById('toggleButton');
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
        //console.log(this.targetScrollX,this.scrollX);
        translate(this.scrollX, 0);
        drawGround(2);
        // 1000px間隔で縦線を引く
        stroke(43);
        noFill();
      
      
        // y座標でanimals配列をソート
        this.animals.sort((a, b) => a.position.y - b.position.y);
      
        // y座標でdecos配列をソート
        this.decos.sort((a, b) => (a.position.y - a.height * a.size) - (b.position.y - b.height * b.size));
      
        for (let deco of this.decos) {
          deco.draw();
        }
      
        let distFromMouseList = [];
      
      
      
        for (let i = 0; i < this.animals.length; i++) {
          Echo.updateAnimalDirection(this.animals[i], this.activeLevels[i], this.count);
          this.positions[i] = Echo.updateAnimalPosition(this.animals[i], this.positions[i]);

          let distFromMouse = Echo.calculateDistanceFromMouse(this.animals[i], mouseX, mouseY, this.scrollX);
          distFromMouseList.push(distFromMouse);
        }

        this.minIndex = Echo.findClosestAnimalIndex(distFromMouseList);
        if (this.newMinIndex != this.minIndex) {
          this.newMinIndex = this.minIndex;
          this.captureCount = 0;
        }
      
      
        for (let i = 0; i < this.animals.length; i++) {
          let minDistFromOthers = Echo.calculateDistancesFromOthers(this.animals, i); 
          if (minDistFromOthers[1].distance < 20) {

            ellipse(this.animals[i].newPos.x, this.animals[i].newPos.y, 100);
            text("合体！", this.animals[i].newPos.x - this.animals[i].width, this.animals[i].newPos.y + this.animals[i].height / 2);
            this.collisionFrameCount = this.collisionDisplayFrames; // フレームカウントをリセット
      
            this.animals[i].onCollision(this.animals[minDistFromOthers[1].index]);
            this.animals.splice(minDistFromOthers[1].index, 1);
            this.positions.splice(minDistFromOthers[1].index, 1);
            this.activeLevels.splice(minDistFromOthers[1].index, 1);
            this.animals[i].color = data[int(random(0, data.length))][1];
          }
        }
      
        if (this.minIndex < 80 && mouseIsPressed) {
          fill(255, 255, 255, 0);
          noStroke();
          fill(255, 0, 0, 120);
          ellipse(this.animals[this.minIndex].newPos.x, this.animals[this.minIndex].newPos.y, 10 + this.captureCount);
          console.log(this.captureCount);
          if (this.captureCount > 100) {
            this.capturedAnimals.push(this.animals[this.minIndex]);
            this.animals.splice(this.minIndex, 1);
            this.positions.splice(this.minIndex, 1);
            this.activeLevels.splice(this.minIndex, 1);
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
        let captureCountElement = document.getElementById('captureCount');
        animalList.innerHTML = ''; // リストをクリア
        for (let i = 0; i < this.capturedAnimals.length; i++) {
        let li = document.createElement('li');
        li.textContent = `動物 ${i + 1}: 色 ${this.capturedAnimals[i].color}`;
        animalList.appendChild(li);
        }
    
        if (this.capturedAnimals.length > 0) {
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
  
