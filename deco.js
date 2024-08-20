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

  draw() {
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
  }
}