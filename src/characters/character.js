class Character {
    constructor(width,height,startPos,speed,color,direction){
        this.width = width;
        this.height = height;
        this.startPos = startPos;
        this.speed = speed;
        this.color = color;
        this.direction = direction;

    }

    drawAnimal(){
        throw new Error('drawメソッドはサブクラスで実装する必要があります');
    }

    setStrokeWeight(){
        strokeWeight(1);
    }

    setDisplacement(new_relative) {
        this.displacement = createVector(new_relative, 0);
      }


    calculateMovingFunctions(staticBool) {
        if(staticBool ==false){
            this.movingAmp = 8;
            this.movingCosFunc = (1 + cos(millis() * 0.01 * this.direction)) * this.movingAmp;
            this.movingSinFunc = (1 + sin(millis() * 0.01 * this.direction)) * this.movingAmp;
        }else{
            this.movingAmp = 0;
            this.movingCosFunc = 0;
            this.movingSinFunc = 0;
        }
    }
    updateAnimalDirection(animal, activeLevel, count) {
        if ((activeLevel + count) % 80 === 0) {
            animal.direction = random(-3, 3);
        }
    }
    
    // updateAnimalPosition(animal) {
    //     this.startPos += animal.direction;
    //     animal.emergentAnimal(this.startPos, animal.direction);
    //     return this.startPos;
    // }
    
    static calculateDistanceFromMouse(animal, mouseX, mouseY, scrollX) {
        const distance = Math.sqrt(Math.pow(animal.newPos.x - mouseX + scrollX, 2) + Math.pow(animal.newPos.y - mouseY, 2));
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
    

}


// Characterクラスをエクスポート
export default Character;
