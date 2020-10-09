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
    this.addChild(this.graphics);

    this.setPoints();
  }

  updatePosition() {}

  getPointCoord(node) {
    const lineWidth = buttonStyle[node.styleType].rect.lineWidth;
    const {
      position: { x, y },
      widthRect,
    } = node;

    return {
      left: {
        x: x + widthRect / 2 + lineWidth / 2,
        y,
      },
      right: {
        x: x - widthRect / 2 - lineWidth / 2,
        y,
      },
    };
  }

  setPoints() {
    const { parentNode, childNode } = this;

    const childPoints = this.getPointCoord(childNode);
    const parentPoints = this.getPointCoord(parentNode);

    const isLeft =
      parentPoints.left.x + parentPoints.right.x <
      childPoints.left.x + childPoints.right.x;

    const choice = {
      first: isLeft ? "left" : "right",
      second: !isLeft ? "left" : "right",
    };

    this.position.copyFrom(parentPoints[choice.first]);

    const p = new Graphics();

    p.beginFill(0xff0000);
    p.drawCircle(
      parentPoints[choice.first].x,
      parentPoints[choice.first].y,
      10
    );
    p.endFill();

    this.addChild(p);

    const { x: sX, y: sY } = parentPoints[choice.first];
    const { x: eX, y: eY } = childPoints[choice.second];

    this.draw({
      x: eX - sX,
      y: eY - sY,
    });
  }

  draw(secondPoint) {
    const color = 0xffffff;
    const { graphics } = this;

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
    // const p = new Graphics();

    // p.beginFill(0x0000ff);
    // p.drawCircle(controls.bottom.x, controls.bottom.y, 10);
    // p.drawCircle(controls.top.x, controls.top.y, 10);
    // p.endFill();

    // this.addChild(p);

    graphics
      .lineStyle(4, 0xffffff, 1)
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
