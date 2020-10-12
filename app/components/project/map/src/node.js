import { nodeName } from "jquery";
import data from "../../custom-data/custom-data";
import { eventBus } from "../../utils/shared";
import { buttonStyle } from "./nodeSettings";
import { drawdash } from "../../utils/helpers";
// import { eventBus } from '../../utils/shared';
const { Container, Graphics, Text, BitmapText } = global.PIXI;

export default class Node extends Container {
  constructor({ title, id, children = [], content }, coord, styleType, center) {
    super();

    this.center = center;
    this.title = title;
    this.childs = children;
    this.content = content;
    this.styleType = styleType;
    this.id = id;
    this.defaultPosition = coord;

    this.position.set(coord.x, coord.y);

    this.draw();
  }

  setTextStyle(styleType) {
    const styleText = new PIXI.TextStyle(buttonStyle[styleType].text);
    this.text = new Text(this.title, styleText);

    this.widthRect = this.text.width + buttonStyle[styleType].rect.left * 2;
    this.heightRect = this.text.height + buttonStyle[styleType].rect.top * 2;

    if (buttonStyle[this.styleType].outer) {
      this.widthOuter = this.text.width + buttonStyle[styleType].outer.left * 2;
      this.heightOuter =
        this.text.height + buttonStyle[styleType].outer.top * 2;
    }

    this.text.x = -this.widthRect / 2 + buttonStyle[styleType].rect.left;
    this.text.y = -this.heightRect / 2 + buttonStyle[styleType].rect.top;
  }

  setPoints() {
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;
    const {
      position: { x, y },
      widthRect,
    } = this;

    this.points = {
      first: {
        x: widthRect / 2 + lineWidth / 2,
        y: 0,
      },
      second: {
        x: -widthRect / 2 - lineWidth / 2,
        y: 0,
      },
    };
  }

  getPointCoord() {
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;
    const {
      position: { x, y },
      widthRect,
    } = this;

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

  drawPoints() {
    const color = 0xce0203;

    const firstPoint = new Graphics();
    firstPoint.lineStyle(
      2, color
    );
    firstPoint.beginFill(0x15171c);
    firstPoint.drawCircle(this.points.first.x, this.points.first.y, 4);
    firstPoint.endFill();
    this.addChild(firstPoint);

    const secondPoint = new Graphics();
    secondPoint.lineStyle(
      2, color
    );
    secondPoint.beginFill(0x15171c);
    secondPoint.drawCircle(this.points.second.x, this.points.second.y, 4);
    secondPoint.endFill();
    this.addChild(secondPoint);
  }

  drawMain() {
    const { graphics } = this;
    graphics.clear();

    const leftImg = new PIXI.Sprite.from('./images/+001.png');
    const rightImg = new PIXI.Sprite.from('./images/001+.png');
    // const leftImg = new PIXI.Texture.from('../../../../../app/images/+001.png');
    // const rightImg = new PIXI.Texture.from('../../../../../app/images/001+.png');

    rightImg.anchor.set(0.5);
    leftImg.anchor.set(0.5);

    rightImg.x = this.widthRect / 2 - buttonStyle[this.styleType].rect.left * 0.36;
    leftImg.x = - this.widthRect / 2 + buttonStyle[this.styleType].rect.left * 0.36;

    this.addChild(rightImg);
    this.addChild(leftImg);

    graphics.lineStyle(
      buttonStyle[this.styleType].rect.lineWidth,
      buttonStyle.color
    );

    graphics.beginFill(
      buttonStyle.color,
      buttonStyle[this.styleType].rect.fill
    );

    graphics.drawRoundedRect(
      -this.widthRect / 2,
      -this.heightRect / 2,
      this.widthRect,
      this.heightRect,
      40
    );
  }

  drawParent() {

  }
  

  drawRect() {
    const { graphics } = this;

    switch (this.styleType) {
      case 'main':

        this.drawMain();
        break;

      case 'parent': 
        const { graphics } = this;
        if (this.id === '0')
          this.drawMain();        

      case 'opened': 
          
        graphics.clear();
        graphics.lineStyle(
          buttonStyle[this.styleType].rect.lineWidth,
          buttonStyle.color
        );
        graphics.drawRoundedRect(
          -this.widthRect / 2,
          -this.heightRect / 2,
          this.widthRect,
          this.heightRect,
          40
        );

      case 'childUp':

        this.firstMaskContainer = new Container();
        this.secondMaskContainer = new Container();

        this.addChild(this.firstMaskContainer);
        this.addChild(this.secondMaskContainer);
        
        const graphicsFirst = new Graphics();
        const graphicsSecond = new Graphics();


        // Second Mask
        graphicsSecond.lineStyle(
          buttonStyle[this.styleType].rect.lineWidth,
          0xffffff
        );
    
        graphicsSecond.beginFill(
          buttonStyle.color,
          buttonStyle[this.styleType].rect.fill
        );
    
        graphicsSecond.drawRoundedRect(
          -this.widthRect / 2,
          -this.heightRect / 2,
          this.widthRect,
          this.heightRect,
          40
        );


        this.secondMaskContainer.addChild(graphicsSecond);
        const secondMask = new Graphics();
        secondMask.beginFill(0x000000);

        secondMask.drawRoundedRect(
          -this.widthRect / 2 - this.height / 2,
          0,
          this.widthRect + this.height,
          this.heightRect,
          40
        );

        secondMask.endFill();
        this.secondMaskContainer.addChild(secondMask);
        graphicsSecond.mask = secondMask;
 
        //First Mask
        graphicsFirst.lineStyle(
          buttonStyle[this.styleType].rect.lineWidth,
          buttonStyle.color
        );
    
        graphicsFirst.beginFill(
          buttonStyle.color,
          buttonStyle[this.styleType].rect.fill
        );
    
        graphicsFirst.drawRoundedRect(
          -this.widthRect / 2,
          -this.heightRect / 2,
          this.widthRect,
          this.heightRect,
          40
        );

        this.firstMaskContainer.addChild(graphicsFirst);
        const firstMask = new Graphics();
        firstMask.beginFill(0x000000);

        firstMask.drawRoundedRect(
          -this.widthRect / 2 - this.height / 2,
          -this.heightRect / 2,
          this.widthRect + this.height,
          this.heightRect / 2,
          40
        );

        firstMask.endFill();
        this.firstMaskContainer.addChild(firstMask);
        graphicsFirst.mask = firstMask;

        break;
    }

    // graphics.endFill();
  }

  drawOuter() {
    const { graphics } = this;

    graphics.lineStyle(
      buttonStyle[this.styleType].outer.lineWidth,
      buttonStyle.color
    );
    
    graphics.beginFill(
      buttonStyle.color,
      buttonStyle[this.styleType].outer.fill
    );

    graphics.drawRoundedRect(
      -this.widthOuter / 2,
      -this.heightOuter / 2,
      this.widthOuter,
      this.heightOuter,
      40
    );
    graphics.endFill();
  }


  draw() {
    this.graphics = new Graphics();
    const { graphics } = this;

    this.setTextStyle(this.styleType);

    this.drawRect();

    if (this.widthOuter) {
      this.drawOuter();
    }

    this.addChild(graphics);
    this.addChild(this.text);

    this.buttonMode = true;
    this.interactive = true;

    this.setPoints();
    this.drawPoints();

    this.on("pointerdown", () => {
      const coordPoint = {
        x: this.center.x - this.position.x,
        y: this.center.y - this.position.y,
      };

      $(eventBus).trigger("change-focus", [coordPoint, this]);
    });
  }
}
