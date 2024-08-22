
class Echo extends Character{
    constructor(width, height, position, speed, color, direction) {
      super(width, height, position, speed, color, direction);
      this.fillet = 15;
      this.newPos = createVector(0,0);
      this.headCenter = createVector(this.position.x,this.position.y-(this.height-this.width/2));
      this.bodySize = (this.height-this.width*2.5/4);
      this.bodySizeOffset = 0;
      this.bodyCenter = createVector(this.position.x,(this.position.y-this.bodySize/2));
      this.bodyCorner0 = createVector(this.bodyCenter.x+this.width/2*-1,this.bodyCenter.y+this.bodySize/2);   // 1------2
      this.bodyCorner1 = createVector(this.bodyCenter.x+this.width/2*-1,this.bodyCenter.y+this.bodySize/2*-1);// | body |
      this.bodyCorner2 = createVector(this.bodyCenter.x+this.width/2,this.bodyCenter.y+this.bodySize/2*-1);   // |      |
      this.bodyCorner3 = createVector(this.bodyCenter.x+this.width/2,this.bodyCenter.y+this.bodySize/2);      // 0------3

      this.twoEyesBool = false;
      this.eyeCount = 1;

      this.collisionCount = 0;
      this.ctx = canvas.getContext("2d");

      this.id = null;
      this.activeLevel = int(random(0, 100));
      this.count = 0;
      this.position = position;
      this.startTime = Date.now(); // 開始時間を保存

    }


    updateAnimalDirection() {
      console.log("Before update direction:", this.direction);
      const time = int((Date.now() - this.startTime) / 100);
      if ((this.activeLevel + time) % 60 === 0) {
        this.direction = random(-3, 3);
        this.startTime = 0;
      }
      console.log("After update direction:", this.direction);
    }

  drawAnimal() {



    //線の太さを設定
    this.setStrokeWeight();
    stroke("black");

    this.updateAnimalDirection();
    this.position.x += this.direction;
    push();
    //新しい位置を設定
    this.setDisplacement(this.position.x);

    // 新しい位置に平行移動
    translate(createVector(this.position.x,0));

    // 頂点の初期化
    this.vertices = [];

    //移動の振幅と関数
    this.calculateMovingFunctions();

    //目の数に応じた身体のサイズの調整
    if(this.eyeCount == 2 && this.twoEyesBool == false){
      this.bodySizeOffset += this.width;
      this.twoEyesBool = true;
    }

    if (this.direction <0) {
        this.vertices.push({ x: this.bodyCorner0.x -this.bodySizeOffset + this.movingCosFunc, y: this.bodyCorner0.y });
        this.vertices.push({ x: this.bodyCorner1.x -this.bodySizeOffset + this.movingSinFunc, y: this.bodyCorner1.y });
        this.vertices.push({ x: this.bodyCorner2.x +this.bodySizeOffset + this.movingSinFunc, y: this.bodyCorner2.y });
        this.vertices.push({ x: this.bodyCorner3.x +this.bodySizeOffset + 40 + this.movingCosFunc, y: this.bodyCorner3.y });
        this.ctx.beginPath();
        fill(this.color);
        roundedPoly(this.ctx, this.vertices, this.fillet);
        this.ctx.stroke();
        this.ctx.fill();
        this.generateEye(this.headCenter.x,this.headCenter.y,this.movingSinFunc,this.width,this.eyeCount,this.direction);
        
    } else {
        this.vertices.push({ x: this.bodyCorner0.x -this.bodySizeOffset - 40 - this.movingSinFunc, y: this.bodyCorner0.y });
        this.vertices.push({ x: this.bodyCorner1.x -this.bodySizeOffset - this.movingCosFunc, y: this.bodyCorner1.y });
        this.vertices.push({ x: this.bodyCorner2.x +this.bodySizeOffset - this.movingCosFunc, y: this.bodyCorner2.y });
        this.vertices.push({ x: this.bodyCorner3.x +this.bodySizeOffset - 10 - this.movingSinFunc, y: this.bodyCorner3.y });

        this.ctx.beginPath();
        fill(this.color);
        roundedPoly(this.ctx, this.vertices, this.fillet);
        this.ctx.stroke();
        this.ctx.fill();

        this.generateEye(this.headCenter.x,this.headCenter.y,this.movingCosFunc,this.width,this.eyeCount,this.direction);
      }

      textSize(20);
      text(this.newPos.x,this.headCenter.x,this.headCenter.y,1);
      this.newPos = createVector(this.position.x + this.displacement.x - this.width / 2, this.position.y - this.height / 2);

      pop();
      // 新しい位置を設定


      }
      
      generateEye(x, y, movingFunc, eyeSize, eyeCount, direction) {
        //console.log(eyeCount);
        if (eyeCount === 1) {
          if (direction < 0) {
            fill(EYE_COLOR);
            ellipse(x + movingFunc, y, eyeSize);
            fill(0, 0, 0);
            ellipse(x + movingFunc, y, eyeSize / 2);
          } else {
            fill(EYE_COLOR);
            ellipse(x - movingFunc, y, eyeSize);
            fill(0, 0, 0);
            ellipse(x - movingFunc, y, eyeSize / 2);
          }
        } else if (eyeCount === 2) {
          if(direction <0){
            fill(EYE_COLOR);
            ellipse(x + movingFunc - eyeSize, y, eyeSize); // 左の目
            fill(0, 0, 0);
            ellipse(x + movingFunc - eyeSize, y, eyeSize / 2);
            
            fill(EYE_COLOR);
            ellipse(x + movingFunc + eyeSize, y, eyeSize); // 右の目
            fill(0, 0, 0);
            ellipse(x + movingFunc + eyeSize, y, eyeSize / 2);
          }else{
            fill(EYE_COLOR);
            ellipse(x - movingFunc - eyeSize, y, eyeSize); // 左の目
            fill(0, 0, 0);
            ellipse(x - movingFunc - eyeSize, y, eyeSize / 2);
            
            fill(EYE_COLOR);
            ellipse(x - movingFunc + eyeSize, y, eyeSize); // 右の目
            fill(0, 0, 0);
            ellipse(x - movingFunc + eyeSize, y, eyeSize / 2);
          }

          if(this.collisionCount < this.collisionDisplayFrames){
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (let i = 0; i < 10; i++) {
              let angle = i * Math.PI / 5;
              let radius = (i % 2 === 0) ? 100 : 50;
              ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
            }
            ctx.closePath(); // パスを閉じる
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.stroke();
            this.collisionCount++;
          }
      }
    }
      
      onCollision(otherAnimal) {
        // 衝突時に体の形状を更新
        this.bodySize *= 1.1; // 修正: 100倍ではなく10%増加に変更
        this.height = (this.height + otherAnimal.height) / 2 + (Math.random() - 0.5) * 10;
        this.eyeCount = 2;
      }

      // 色を混ぜ合わせる関数
      mixColors(color1, color2) {
        const r = Math.floor((color1.r + color2.r) / 2);
        const g = Math.floor((color1.g + color2.g) / 2);
        const b = Math.floor((color1.b + color2.b) / 2);
        return { r, g, b };
      }
}



class Deco extends Character {
  constructor(width, height, position, speed, color, direction, size) {
      super(width, height, position, speed, color, direction);
      this.size = size; // サイズを追加
      this.initialPosition = { ...position }; // 初期位置を保存
      this.controlPoints = [
          { x: position.x, y: position.y }, // 地面の位置
          { x: position.x - 0, y: position.y - 50 }, // 少し左に傾いた位置
          { x: position.x - 0, y: position.y - 100 }, // さらに左に傾いた位置
          { x: position.x, y: position.y - 150 } // すすきの上部の位置
      ];

      this.baseEllipseSize = { width: 60, height: 130}; // サイズに基づいて共通のサイズを設定
      this.sizeMultiplier = [1.15, 1.15, 1.1, 1.05, 1, 0.9, 0.8, 0.7, 1.9]; // 乗数
      this.startTime = Date.now(); // 開始時間を保存
      this.newPos = createVector(0,0);
  }

  // ベジェカーブの長さを計算する関数
  bezierLength() {
      let length = 0;
      let prevX = this.controlPoints[0].x;
      let prevY = this.controlPoints[0].y;
      for (let t = 0.01; t <= 1; t += 0.01) {
          let x = bezierPoint(
              this.controlPoints[0].x, this.controlPoints[1].x,
              this.controlPoints[2].x, this.controlPoints[3].x, t
          );
          let y = bezierPoint(
              this.controlPoints[0].y, this.controlPoints[1].y,
              this.controlPoints[2].y, this.controlPoints[3].y, t
          );
          length += dist(prevX, prevY, x, y);
          prevX = x;
          prevY = y;
      }
      return length;
  }

  // 制御点を時間に基づいて更新する関数
  updateControlPoints() {
      const amplitude = 60; // 振幅
      const frequency = 0.5; // 周波数
      const time = (Date.now() - this.startTime) / 1000; // 経過時間を秒単位で計算
      const offsetX = amplitude * Math.sin(frequency * time);

      // 上端部の制御点だけを左右に動かす
      this.controlPoints[3].x = this.initialPosition.x + offsetX;
  }

  drawAnimal() {
      noFill();
      stroke(255);
      strokeWeight(2);

      // 時間に基づいて制御点を更新
      this.updateControlPoints();

      // スケーリングを適用
      push();
      scale(this.size);

      // ベジェカーブの長さを計算
      let length = this.bezierLength();
      let numEllipses = this.sizeMultiplier.length; // 配置する楕円の数
      let interval = length / numEllipses;
      let accumulatedLength = 0;
      let prevX = this.controlPoints[0].x;
      let prevY = this.controlPoints[0].y;

      // 楕円の塗りと線の色を設定
      fill(this.color); // 緑色
      stroke(0); // 黒色

      // ベジェカーブに沿って楕円を配置
      let ellipseIndex = 0;
      let topEllipse = null;
      for (let t = 0.01; t <= 1; t += 0.01) {
        let x = bezierPoint(
          this.controlPoints[0].x, this.controlPoints[1].x,
          this.controlPoints[2].x, this.controlPoints[3].x, t
        );
        let y = bezierPoint(
          this.controlPoints[0].y, this.controlPoints[1].y,
          this.controlPoints[2].y, this.controlPoints[3].y, t
        );
        accumulatedLength += dist(prevX, prevY, x, y);
        prevX = x;
        prevY = y;
        
        if (accumulatedLength >= interval && ellipseIndex < numEllipses) {
          accumulatedLength = 0;
          
          // 接線の角度を計算
          let angle = atan2(
            bezierTangent(this.controlPoints[0].y, this.controlPoints[1].y,
                          this.controlPoints[2].y, this.controlPoints[3].y, t),
            bezierTangent(this.controlPoints[0].x, this.controlPoints[1].x,
                          this.controlPoints[2].x, this.controlPoints[3].x, t)
          );
          
          // 楕円のサイズを共通サイズと乗数から計算
          let multiplier = this.sizeMultiplier[ellipseIndex];
          let width = this.baseEllipseSize.width * multiplier;
          let height = this.baseEllipseSize.height * multiplier;
          
          // 楕円を描く前に回転を適用
          push();
          translate(x, y);
          rotate(angle);
          ellipse(0, 0, width, height); // 楕円を描く
          pop();
          ellipseIndex++;
          // 一番上の楕円の情報を保存
          if (ellipseIndex === numEllipses - 1) {
              topEllipse = { x, y, angle, width, height };
          }
        }
      }
      
      // 一番上の楕円の上に黒い楕円を描画
      if (topEllipse) {
          let blackEllipseScale = 0.8; // サイズを調整
          let blackEllipseWidth = topEllipse.width * blackEllipseScale; // サイズを調整
          let blackEllipseHeight = topEllipse.height * blackEllipseScale; // サイズを調整
          
          push();
          translate(topEllipse.x, topEllipse.y);
          rotate(topEllipse.angle);
          fill(0); // 黒色
          ellipse(8, 0, blackEllipseWidth, blackEllipseHeight); // 黒い楕円を描く
          pop();
      }

      // スケーリングを解除
      pop();
      this.newPos = createVector(this.position.x , this.position.y );
  }
}