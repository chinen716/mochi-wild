class Character {
    constructor(width,height,position,speed,color,direction){
        this.width = width;
        this.height = height;
        this.position = position;
        this.speed = speed;
        this.color = color;
        this.direction = direction;

    }

    setStrokeWeight(){
        strokeWeight(1);
    }

    setDisplacement(new_relative) {
        this.displacement = createVector(new_relative, 0);
      }


    calculateMovingFunctions() {
        this.movingAmp = 8;
        this.movingCosFunc = (1 + cos(millis() * 0.01 * this.direction)) * this.movingAmp;
        this.movingSinFunc = (1 + sin(millis() * 0.01 * this.direction)) * this.movingAmp;
    }


}
