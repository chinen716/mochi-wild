
// 地面を描画する関数
function drawGround(seed) {
    fill(139, 69, 19); // 茶色
    stroke(0);
    strokeWeight(3);
    
    // コロッケの形を描画
    let groundWidth = 1900;
    let groundHeight = 850;
    let groundX = 511;
    let groundY = 511;
    
    // ギザギザの縁を描画
    let numPoints = 20; // 頂点の数を増やす
    let angleStep = TWO_PI / numPoints;
    let radiusX = groundWidth / 2;
    let radiusY = groundHeight / 2;
    
    beginShape();
    let vertices = [];
    for (let i = 0; i < numPoints; i++) {
      let angle = i * angleStep;
      let r = seededRandom(seed + i) * 200 - 100; // ランダムな変動
      let x = groundX + cos(angle) * (radiusX + r);
      let y = groundY + sin(angle) * (radiusY + r);
      vertex(x, y);
      vertices.push({x: x, y: y});
    }
    endShape(CLOSE);
    
    // 水玉模様を描画
    drawPolkaDots(vertices, groundX, groundY, seed);
  }
  
  // シード値に基づいてランダムな数値を生成する関数
  function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  
  // 水玉模様を描画する関数
  function drawPolkaDots(vertices, centerX, centerY, seed) {
    let dotRadius = 1; // 水玉の半径
    let spacing = 35; // 水玉の間隔
    fill(0); // 黒色の水玉
    noStroke();
    
    // グリッドに基づいて水玉を配置
    let minX = Math.min(...vertices.map(v => v.x));
    let maxX = Math.max(...vertices.map(v => v.x));
    let minY = Math.min(...vertices.map(v => v.y));
    let maxY = Math.max(...vertices.map(v => v.y));
    
    for (let x = minX; x <= maxX; x += spacing) {
      for (let y = minY; y <= maxY; y += spacing) {
        // 斜め45度のグリッドに基づいて水玉を配置
        let offsetX = (y - minY) / spacing % 2 === 0 ? 0 : spacing / 2;
        let posX = x + offsetX;
        let posY = y;
        
        // 点が石の内側にあるか確認
        if (isPointInsidePolygon(posX, posY, vertices)) {
          ellipse(posX, posY, dotRadius * 2, dotRadius * 2);
        }
      }
    }
  }
  
  // 点が多角形の内側にあるか確認する関数
  function isPointInsidePolygon(x, y, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      let xi = vertices[i].x, yi = vertices[i].y;
      let xj = vertices[j].x, yj = vertices[j].y;
      
      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }