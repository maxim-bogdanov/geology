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

    this.isHidden = true;
    // this.hide();
  }

  updatePosition() {}

  
  hide() {
    if (this.isHidden) return;

    this.isHidden = true;

    this.hidePromise = new Promise( (resolve) => {
      this.hideResolve = resolve;
    });
    
    this.childNode.hide();

    this.childNode.hidePromise.then( () => {
      this.animateHide();
    });

    this.animationHideComplete = false;



    return this.hidePromise;
  }

  animateHide() {
    gsap.to(this, {
      duration: 1,
      alpha: 0,
      onComplete: this.onHideComplete,
      callbackScope: this,
      onCompleteParams: [this.hideResolve]
    });
  }
  
  onHideComplete(resolve) {
    this.animationHideComplete = true;
    resolve();
  }

  show() {
    
    if (!this.isHidden) return;

    this.isHidden = false;

    this.showPromise = new Promise((resolve) => {
      this.showResolve = resolve;
    });

    

    // if (this.parentNode.isHidden)
    // this.parentNode.show();

    console.log(this.parentNode.showPromise)

    this.parentNode.showPromise.then( () => {
      this.animateShow();
      // this.childNode.show();
    });

    this.animationShowComplete = false;


    return this.showPromise;
  }

  animateShow() {
    gsap.to(this, {
      duration: 1,
      alpha: 1,
      onComplete: this.onShowComplete,
      callbackScope: this,
      onCompleteParams: [this.showResolve]
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
