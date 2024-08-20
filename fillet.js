const roundedPoly = (ctx, points, radiusAll) => {
    radius = radiusAll;
    len = points.length;
    p1 = points[len - 1];
  
    for (i = 0; i < len; i++) {
      p2 = points[i % len];
      p3 = points[(i + 1) % len];
  
      A = createVector(p1.x, p1.y);
      B = createVector(p2.x, p2.y);
      C = createVector(p3.x, p3.y);
  
      (BA = A.sub(B)), (BC = C.sub(B));
  
      (BAnorm = BA.copy().normalize()), (BCnorm = BC.copy().normalize());
  
      sinA = -BAnorm.dot(BCnorm.copy().rotate(PI / 2));
      sinA90 = BAnorm.dot(BCnorm);
      angle = asin(sinA);
  
      (radDirection = 1), (drawDirection = false);
      if (sinA90 < 0) {
        angle < 0 ? (angle += PI) : ((angle += PI), (radDirection = -1), (drawDirection = true));
      } else {
        angle > 0 ? ((radDirection = -1), (drawDirection = true)) : 0;
      }
      
      p2.radius ? (radius = p2.radius) : (radius = radiusAll);
  
      halfAngle = angle / 2;
      lenOut = abs((cos(halfAngle) * radius) / sin(halfAngle));
  
      // Special part A
      if (lenOut > min(BA.mag() / 2, BC.mag() / 2)) {
        lenOut = min(BA.mag() / 2, BC.mag() / 2);
        cRadius = abs((lenOut * sin(halfAngle)) / cos(halfAngle));
      } else {
        cRadius = radius;
      }
  
      x =
        B.x +
        BC.normalize().x * lenOut -
        BC.normalize().y * cRadius * radDirection;
      y =
        B.y +
        BC.normalize().y * lenOut +
        BC.normalize().x * cRadius * radDirection;
  
      ctx.arc(
        x,
        y,
        cRadius,
        BA.heading() + (PI / 2) * radDirection,
        BC.heading() - (PI / 2) * radDirection,
        drawDirection
      );
  
      p1 = p2;
      p2 = p3;
    }
    ctx.closePath();
  }