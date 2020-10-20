import { Container, Graphics } from 'pixi.js';

var Bezier = require('bezier-js');

export default class BezierLine extends Graphics {

  static STEP = 0.01;
  static DURATION = 1000;

  constructor() {
    super();
    this.lineStyle(4, 0xff0000, 1);
    this.progress = 0;
  }
  

  draw() {

    const {curveT} = this;
    this
      .clear()
      .lineStyle(4, 0xff0000, 1);

    for (let t1 = 0; t1 < this.progress; t1 += BezierLine.STEP) {
      const point1 = curveT.get(t1);     
      const point2 = curveT.get(Math.min(t1 + BezierLine.STEP, this.progress));

      this
        .moveTo(point1.x, point1.y)
        .lineTo(point2.x, point2.y);     
    }
    
  }

  set progress(_progress) {
    this._progress = _progress;
    // this.draw();
  }

  get progress() {
    return this._progress;
  }

  changeData({x0, y0, x1, y1, x2, y2, x3, y3}) {
    this.curve = new Bezier(x0, y0, x1, y1, x2, y2, x3, y3);
    // this.clear();
    // this
    //   .moveTo(x0, y0)
    //   .lineTo(x3, y3);
  }

}