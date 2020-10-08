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
      // first: 100,
      top: 25,
      first: 30,
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
    // test.drawRect(0, 0, 100, 100);
    // test.endFill();
    // this.addChild(test);

    this.position.set(coord.x, coord.y);

    this.draw();
  }

  setTextStyle(styleType) {
    const styleText = new PIXI.TextStyle(buttonStyle[styleType].text);
    this.text = new Text(this.title, styleText);

    this.widthRect = this.text.width + buttonStyle[styleType].rect.top * 2;
    this.heightRect = this.text.height + buttonStyle[styleType].rect.first * 2;

    this.text.x = -this.widthRect / 2 + buttonStyle[styleType].rect.first;
    this.text.y = -this.heightRect / 2 + buttonStyle[styleType].rect.top;

    this.addChild(this.text);
  }

  // findSizeRect(styleType) {
  //   this.widthRect = this.text.width + buttonStyle[styleType].rect.top * 2;
  //   this.heightRect = this.text.height + buttonStyle[styleType].rect.first * 2;
  // }

  setPoints() {
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;

    this.points = {
      first: {
        x: -this.widthRect / 2 - lineWidth / 2,
        y: 0,
      },
      second: {
        x: this.widthRect / 2 + lineWidth / 2,
        y: 0,
      },
    };
  }

  getPointCoord() {
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;

    return {
      left: {
        x: this.coord.x + this.widthRect / 2 + lineWidth / 2,
        y: this.coord.y,
      },
      right: {
        x: this.coord.x - this.widthRect / 2 - lineWidth / 2,
        y: this.coord.y,
      },
    };
  }

  drawPoints() {
    const color = 0xffffff;

    const firstPoint = new Graphics();
    firstPoint.beginFill(color);
    firstPoint.drawCircle(this.points.first.x, this.points.first.y, 4);
    firstPoint.endFill();
    this.addChild(firstPoint);

    const secondPoint = new Graphics();
    secondPoint.beginFill(color);
    secondPoint.drawCircle(this.points.second.x, this.points.second.y, 4);
    secondPoint.endFill();
    this.addChild(secondPoint);
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
