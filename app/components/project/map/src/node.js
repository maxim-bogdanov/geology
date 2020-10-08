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

    const test = new Graphics();
    test.beginFill(0xff0000);
    test.drawCircle(0, 0, 5);
    test.endFill();
    this.addChild(test);

    this.position.set(coord.x, coord.y);

    // this.nodeContainer = new Container();
    this.draw();
  }

  setTextStyle(styleType) {
    const styleText = new PIXI.TextStyle(buttonStyle[styleType].text);
    this.text = new Text(this.title, styleText);

    this.widthRect = this.text.width + buttonStyle[styleType].rect.top * 2;
    this.heightRect = this.text.height + buttonStyle[styleType].rect.left * 2;

    this.text.x = buttonStyle[styleType].rect.left;
    this.text.y = buttonStyle[styleType].rect.top;

    this.addChild(this.text);
  }

  findSizeRect(styleType) {
    this.widthRect = this.text.width + buttonStyle[styleType].rect.top * 2;
    this.heightRect = this.text.height + buttonStyle[styleType].rect.left * 2;
  }

  draw() {
    const graphics = new Graphics();

    this.setTextStyle(this.styleType);
    this.findSizeRect(this.styleType);

    graphics.lineStyle(9, buttonStyle.color);
    graphics.beginFill(buttonStyle.color, 0);
    graphics.drawRoundedRect(0, 0, this.widthRect, this.heightRect, 40);
    graphics.endFill();

    this.addChild(graphics);

    this.buttonMode = true;
    this.interactive = true;

    this.on("pointerdown", () => {
      const coordPoint = {
        x: this.center.x - this.coord.x - this.width / 2,
        y: this.center.y - this.coord.y - this.height / 2,
      };

      console.log(coordPoint);
      $(eventBus).trigger("change-focus", [coordPoint, this]);
    });
  }

  enableButton(nodeContainer) {
    console.log("enable", nodeContainer);
    nodeContainer.buttonMode = false;
    nodeContainer.interactive = false;
  }
}
