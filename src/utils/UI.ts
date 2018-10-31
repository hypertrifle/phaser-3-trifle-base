import { Scene, GameObjects } from "phaser";
import { Corners } from "../models/UIModels";

export class CanvasTools {
  static rectangle(canvas: GameObjects.Graphics, config: any) {
    // default values
    let w = config.width;
    let h = config.height;
    let r = config.radius || 0;
    let x = config.x;
    let y = config.y;

    // if radius is greater than height / width lets set radius to max possible value
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;

    // start path
    canvas.beginPath();

    canvas.fillStyle(config.color, 1.0);

    canvas.moveTo(x + r, y);

    // //top side
    canvas.lineTo(x + w - r, y);

    // NE corner
    // arc: function (x, y, radius, startAngle, endAngle, anticlockwise, close)
    canvas.arc(
      x + w - r,
      y + r,
      r,
      Phaser.Math.DegToRad(270),
      Phaser.Math.DegToRad(360),
      false
    );

    // right side
    canvas.lineTo(x + w, y + h - r);

    // SE corner
    canvas.arc(
      x + w - r,
      y + h - r,
      r,
      Phaser.Math.DegToRad(0),
      Phaser.Math.DegToRad(90),
      false
    );

    // bottom
    canvas.lineTo(x, y + h);

    // SW corner
    canvas.arc(
      x + r,
      y + h - r,
      r,
      Phaser.Math.DegToRad(90),
      Phaser.Math.DegToRad(180),
      false
    );

    // left
    canvas.lineTo(x, y + r);

    // NW corner
    canvas.arc(
      x + r,
      y + r,
      r,
      Phaser.Math.DegToRad(180),
      Phaser.Math.DegToRad(270),
      false
    );

    canvas.closePath();
    canvas.fillPath();
  }
}
