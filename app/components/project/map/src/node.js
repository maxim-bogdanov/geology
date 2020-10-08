import data from "../../custom-data/custom-data";
import { eventBus } from "../../utils/shared";
// import { eventBus } from '../../utils/shared';
const { Container, Graphics, Text, BitmapText } = global.PIXI;

const buttonStyle = {
  color: 0xff0000,
  main: {
    text: {
      fontFamily: "Cera Bold",
      fontSize: 42,
      fill: 0xffffff,
    },
    rect: {
      // top: 20,
      // left: 100,
      top: 25,
      left: 30,
      lineWidth: 9,
    },
  },
};

export default class Node extends Container {
  constructor({ title, id, children = [], content }, coord, styleType, center) {
    super();

    this.center = center;
    this.coord = coord;
    this.title = title;
    this.childs = children;
    this.content = content;
    this.styleType = styleType;
    this.id = id;

    // const test = new Graphics();
    // test.beginFill(0xff0000);
    // test.drawCircle(0, 0, 5);
    // test.endFill();
    // this.addChild(test);

    this.position.set(coord.x, coord.y);

    this.draw();
  }

  setTextStyle(styleType) {
    const styleText = new PIXI.TextStyle(buttonStyle[styleType].text);
    this.text = new Text(this.title, styleText);

    this.widthRect = this.text.width + buttonStyle[styleType].rect.top * 2;
    this.heightRect = this.text.height + buttonStyle[styleType].rect.left * 2;

    this.text.x = -this.widthRect / 2 + buttonStyle[styleType].rect.left;
    this.text.y = -this.heightRect / 2 + buttonStyle[styleType].rect.top;

    this.addChild(this.text);
  }

  // findSizeRect(styleType) {
  //   this.widthRect = this.text.width + buttonStyle[styleType].rect.top * 2;
  //   this.heightRect = this.text.height + buttonStyle[styleType].rect.left * 2;
  // }

  setPoints() {
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;

    this.points = {
      left: {
        x: -this.widthRect / 2 - lineWidth / 2,
        y: 0,
      },
      right: {
        x: this.widthRect / 2 + lineWidth / 2,
        y: 0,
      },
    };
  }

  drawPoints() {
    const leftPoint = new Graphics();
    leftPoint.beginFill(0xffffff);
    leftPoint.drawCircle(this.points.left.x, this.points.left.y, 4);
    leftPoint.endFill();
    this.addChild(leftPoint);

    const rightPoint = new Graphics();
    rightPoint.beginFill(0xffffff);
    rightPoint.drawCircle(this.points.right.x, this.points.right.y, 4);
    rightPoint.endFill();
    this.addChild(rightPoint);
  }

  draw() {
    const graphics = new Graphics();

    this.setTextStyle(this.styleType);
    // this.findSizeRect(this.styleType);

    graphics.lineStyle(
      buttonStyle[this.styleType].rect.lineWidth,
      buttonStyle.color
    );
    graphics.beginFill(buttonStyle.color, 0);
    graphics.drawRoundedRect(
      -this.widthRect / 2,
      -this.heightRect / 2,
      this.widthRect,
      this.heightRect,
      40
    );
    graphics.endFill();

    this.addChild(graphics);

    this.buttonMode = true;
    this.interactive = true;

    this.setPoints();
    this.drawPoints();

    this.on("pointerdown", () => {
      const coordPoint = {
        x: this.center.x - this.coord.x,
        y: this.center.y - this.coord.y,
      };

      $(eventBus).trigger("change-focus", [coordPoint, this]);
    });
  }
}
