
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
    this.activeLevel = null;
    this.count = 0;
  }



  
  static updateAnimalDirection(animal, activeLevel, count) {
    if ((activeLevel + count) % 80 === 0) {
      animal.direction = random(-3, 3);
    }
  }

  static updateAnimalPosition(animal, position) {
    position += animal.direction;
    animal.emergentAnimal(position, animal.direction);
    return position;
  }

  static calculateDistanceFromMouse(animal, mouseX, mouseY, scrollX) {
  const distance = Math.sqrt(Math.pow(animal.position.x - mouseX + scrollX, 2) + Math.pow(animal.position.y - mouseY, 2));
  return distance;

}

  static findClosestAnimalIndex(distances) {
    return distances.indexOf(Math.min(...distances));
  }

  static calculateDistancesFromOthers(animals, index) {
    if (!animals || animals.length === 0) {
        console.error("animalsが未定義または空です");
        return [];
    }
    return animals.map((a, i) => ({
        index: i,
        distance: dist(a.newPos.x, a.newPos.y, animals[index].newPos.x, animals[index].newPos.y)
    })).sort((a, b) => a.distance - b.distance);
}



  // setContext(ctx) {
  //   this.ctx = ctx; // ctxを初期化
  // }
  emergentAnimal(new_relative, direction,eyeCount) {
    
    push();

    //線の太さを設定
    this.setStrokeWeight();
    stroke("black");

    //新しい位置を設定
    this.setDisplacement(new_relative);

    // 新しい位置に平行移動
    translate(this.displacement);

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

      pop();
      // 新しい位置を設定
      this.newPos = createVector(this.position.x + this.displacement.x - this.width / 2, this.position.y - this.height / 2);
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