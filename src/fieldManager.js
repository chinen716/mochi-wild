
class fieldManager {
    constructor() {
            this.sectors = {};
            this.sectorWidth = windowWidth;
            this.deco = null;
        
    }


    getSector(scrollX){
        // スクロール位置に基づいてセクションIDを取得
        
        return Math.floor(-scrollX / this.sectorWidth);
    }


    generateTerrain(sector) {
        // ランダムに地形を生成
        const terrainTypes = ['grass', 'dirt', 'rock'];
        return terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
    }

    ensureSectors(scrollX, numSectorsToDisplay) {
        // 現在のスクロール位置に基づいて必要なセクションを生成
        const currentSector = this.getSector(scrollX);
        
        for (let i = currentSector-2; i <= currentSector+2; i++) {
          const sector = currentSector + i;
          if (!this.sectors[sector]) {
            this.sectors[sector] = 
            {
            terrain: this.generateTerrain(sector), 
            objectId:random(1, 5),
            width:random(50, 100),
            height:random(50, 100),
            position:{x:random(width), y:random(height)},
            speed:random(100, 200),
            color:"red",
            direction:Math.random() < 0.5 ? -1 : 1
            };
          }
          //console.log(this.sectors[sector]);
        }

      }



    drawField(scrollX,numSectorsToDisplay){
        //必要なセクションを確認
        this.ensureSectors(scrollX, numSectorsToDisplay);

        //現在のセクションとその前後のセクションを描画
        const currentSector = this.getSector(scrollX);

        for(let i= currentSector-2; i <= currentSector+2; i++){
            this.drawSector(currentSector + i, scrollX);
            //console.log(i);
        }
    }


    drawSector(sector, scrollX){
        const terrain = this.sectors[sector].terrain;
        const xOffset = scrollX + sector * this.sectorWidth ;
        
        switch (terrain){
            case "grass":
                fill("#00ff00");
                break;
            case "dirt":
                fill("#8b4513");
                break;
            case "rock":
                fill("#a9a9a9");
                break;
            default:
                fill("#ffffff");
                break;
        }

        rect(xOffset, 0, this.sectorWidth, height); // セクションを描画
        // switch (terrain){
        //     case "grass":
        //         break;
        //     case "dirt":
        //         let position = { x: random(width), y: random(height) };
        //         this.oneDeco = new Deco(60, 130, position, 1, "white", 11, 0.5);
        //         this.oneDeco.drawAnimal();
        //         break;
        //     case "rock":
        //         break;
        //     default:
        //         break;
        // }
        textSize(42);
        //
        text(terrain, xOffset + 100, 200,100); // 地形名を表示
        text(sector, xOffset + 100, 300,100); // セクション番号を表示
        text(-scrollX, xOffset + 100, 400,100); // x座標を表示
        //ellipse(xOffset + 100, 500, 100); // デコレーションを描画
        
        //pop();
     }


    getSpawnProbability(terrain){
        //地形に基づいて動物のスポーン確率を返す
        if(terrain === "grassland"){
            return 0.7;
        }else if(terrain === "rocky"){
            return 0.3;
        }else{
            return 0.5;
        }
    }
}

export default fieldManager;