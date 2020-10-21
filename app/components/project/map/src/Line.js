import { reject } from "lodash";
import data from "../../custom-data/custom-data";
import { eventBus } from "../../utils/shared";
import { buttonStyle } from "./nodeSettings";
import BezierLine from './Bezier';
// import { eventBus } from '../../utils/shared';
const { Container, Graphics, Text, BitmapText } = global.PIXI;

export default class Line extends Container {
  constructor(parentNode, childNode) {
    super();

    this.parentNode = parentNode;
    this.childNode = childNode;

    this.graphics = new Graphics();
    this.points = new Graphics();

    this.addChild(this.graphics);
    this.addChild(this.points);

    this.curve = new BezierLine();
    this.addChild(this.curve);
    this.countTicker = 0;

    this.setPoints();

    this.promiseData = {
      show: {},
      hide: {},
    };

    this.animationShowComplete = true;
    this.animationHideComplete = true;
    this.isHidden = true;


    // this.hide();
  }

  updatePosition() {}

  
  hide() {
    if (this.isHidden) return;

    this.isHidden = true;
  
    this.promiseData.hide.promise = new Promise( (resolve, reject) => {
      this.promiseData.hide.resolve = resolve;
      this.promiseData.hide.reject = reject;
    });



    if (!this.animationShowComplete) {
      this.promiseData.show.reject(false);
      this.animationShowComplete = true;
      // gsap.killTweensOf(this.curve);
    }

    this.childNode.hide();
    // this.parentNode.hide();

    this.animationHideComplete = false;

    this.childNode.promiseData.hide.promise.then( () => {
      this.animateHide();
    });

    return this.promiseData.hide.promise;
  }

  animateHide() {
    gsap.killTweensOf(this.curve);
    this.countTicker = 0;
    gsap.to(this.curve, {
      duration: this.curve.progress,
      progress: 0,
      onComplete: this.onHideComplete,
      callbackScope: this,
      onCompleteParams: [this.promiseData.hide.resolve]
    });
  }
  
  onHideComplete(resolve) {
    this.animationHideComplete = true;
    resolve(true);
  }

  show() {
    if (!this.isHidden) return;

    this.isHidden = false;

    this.promiseData.show.promise = new Promise((resolve, reject) => {
      this.promiseData.show.resolve = resolve;
      this.promiseData.show.reject = reject;
    });


    if (!this.animationHideComplete) {
      this.promiseData.hide.reject(false);
      // gsap.killTweensOf(this.curve);
      this.animationHideComplete = true;
    }
    
    this.parentNode.show();

    this.animationShowComplete = false;

    this.parentNode.promiseData.show.promise.then( () => {
      this.animateShow();
    });

    return this.promiseData.show.promise;
  }

  animateShow() {
    gsap.killTweensOf(this.curve);
    gsap.to(this.curve, {
      duration: 1 - this.curve.progress,
      progress: 1,
      onComplete: this.onShowComplete,
      callbackScope: this,
      onCompleteParams: [this.promiseData.show.resolve]
    });
  }

  
  onShowComplete(resolve) {
    this.animationShowComplete = true;
    resolve(true);
  }

  setPoints() {
    const { parentNode, childNode } = this;

    const childPoints = childNode.getPointCoord();
    const parentPoints = parentNode.getPointCoord();

    const isLeft =
      parentPoints.left.x + parentPoints.right.x <
      childPoints.left.x + childPoints.right.x;

    const choice = {
      first: isLeft ? "left" : "right",
      second: !isLeft ? "left" : "right",
    };

    this.position.copyFrom(parentPoints[choice.first]);

    const { x: sX, y: sY } = parentPoints[choice.first];
    const { x: eX, y: eY } = childPoints[choice.second];

    this.draw({
      x: eX - sX,
      y: eY - sY,
    });
  }

  draw(secondPoint) {

    if (!this.curve.progress && !this.curve.lastProgress) {
      return;
    } 

    const color = 0xff0000;
    const { graphics, points } = this;
    // graphics.clear();
    // points.clear();

    const controls = {
      bottom: {
        x: secondPoint.x,
        y: 0,
      },
      top: {
        x: 0,
        y: secondPoint.y,
      },
    };

    // points.beginFill(0x0000ff);
    // points.drawCircle(controls.bottom.x, controls.bottom.y, 10);
    // points.drawCircle(controls.top.x, controls.top.y, 10);
    // points.endFill();

    // var Bezier = require('bezier-js');
    // console.log(Bezier)

    const coordBezier = {
      x0: 0,
      y0: 0,
      x1: controls.bottom.x,
      y1: controls.bottom.y,
      x2: controls.top.x,
      y2: controls.top.y,
      x3: secondPoint.x,
      y3: secondPoint.y
    }
    this.coordBezier = coordBezier;
    this.curve.changeData(coordBezier);
    // this.curve.progress = 1;
    this.curve.draw();

    // if (!this.isHidden)
      // this.curve.draw(coordBezier);


    // curve.draw();
    // console.log(curve.length())
    // curve.draw();
    // console.log(curve.length());
    // curve.drawSkeleton(curve);
    // curve.drawCurve(curve);

    // graphics
    //   .lineStyle(4, color, 1)
    //   .moveTo(0, 0)
    //   .bezierCurveTo(
    //     controls.bottom.x,
    //     controls.bottom.y,
    //     controls.top.x,
    //     controls.top.y,
    //     secondPoint.x,
    //     secondPoint.y
    //   );
    // .lineTo(secondPoint.x, secondPoint.y);
  }
}
