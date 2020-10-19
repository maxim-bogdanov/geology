import { reject } from "lodash";
import data from "../../custom-data/custom-data";
import { eventBus } from "../../utils/shared";
import { buttonStyle } from "./nodeSettings";
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
    console.log(this.animationShowComplete, this.animationHideComplete, 'hide')

    if (this.isHidden) return;

    this.isHidden = true;
  
    this.promiseData.hide.promise = new Promise( (resolve, reject) => {
      this.promiseData.hide.resolve = resolve;
      this.promiseData.hide.reject = reject;
    });

    if (!this.animationShowComplete) {
      this.promiseData.show.reject();
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
    console.log('hide line')
    gsap.to(this, {
      duration: 1,
      alpha: 0,
      onComplete: this.onHideComplete,
      callbackScope: this,
      onCompleteParams: [this.promiseData.hide.resolve]
    });
  }
  
  onHideComplete(resolve) {
    this.animationHideComplete = true;
    resolve();
  }

  show() {
    if (!this.isHidden) return;

    this.isHidden = false;

    this.promiseData.show.promise = new Promise((resolve, reject) => {
      this.promiseData.show.resolve = resolve;
      this.promiseData.show.reject = reject;
    });

    if (!this.animationHideComplete) {
      this.promiseData.hide.reject();
    }
    
    // if (this.parentNode.isHidden)
    this.parentNode.show();

    // console.log(this.parentNode.showPromise)

    this.animationShowComplete = false;

    this.parentNode.promiseData.show.promise.then( () => {
      this.animateShow();
      // () => this.animateHide()
      // this.childNode.show();
    });

    return this.promiseData.show.promise;
  }

  animateShow() {
    gsap.to(this, {
      duration: 1,
      alpha: 1,
      onComplete: this.onShowComplete,
      callbackScope: this,
      onCompleteParams: [this.promiseData.show.resolve]
    });
  }
  
  onShowComplete(resolve) {
    this.animationShowComplete = true;
    resolve();
  }

  setPoints() {
    const { parentNode, childNode } = this;

    const childPoints = parentNode.getPointCoord();
    const parentPoints = childNode.getPointCoord();

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
    const color = 0xff0000;
    const { graphics, points } = this;
    graphics.clear();
    points.clear();

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

    graphics
      .lineStyle(4, color, 1)
      .moveTo(0, 0)
      .bezierCurveTo(
        controls.bottom.x,
        controls.bottom.y,
        controls.top.x,
        controls.top.y,
        secondPoint.x,
        secondPoint.y
      );
    // .lineTo(secondPoint.x, secondPoint.y);
  }
}
