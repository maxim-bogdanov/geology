import { eventBus, data } from "../../utils/shared";
const { Container, Graphics } = global.PIXI;

export default class MapContainer extends Container {
  constructor({ width, height, contentWidth, contentHeight }) {
    super();

    this.width = width;
    this.height = height;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;

    const contentContainer = new Container();
    this.contentContainer = contentContainer;

    this.addChild(contentContainer);

    // if (DEBUG)
    // this.addTest();

    $(eventBus).on("focus-changed", (e, coord, activeNode) => {
      console.log("offset", coord);
      this.setOffset(coord, {
        ease: "power1.out",
      });
    });

    // this.setOffset({x: -600, y: -100}, {ease: "power1.out"});
  }

  destroy(options) {
    super.destroy(options);
    this.contentContainer = null;
  }

  // addTest() {
  //   const graphics = new Graphics();

  //   const {width, height} = this;

  //   // Rectangle
  //   graphics.beginFill(0xDE3249);
  //   graphics.drawRect(1000, 700, 700, 200);
  //   graphics.endFill();

  //   this.contentContainer.addChild(graphics);
  // }

  setOffset({ x: offsetX, y: offsetY }, options) {
    console.log(offsetX, offsetY);
    gsap.to(this, {
      offsetX,
      offsetY,
      duration: 2,
      ...options,
    });
    console.log(offsetX, offsetY);
  }

  get offsetX() {
    return this._offsetX;
  }

  set offsetX(offsetX) {
    const { width, contentWidth, contentContainer } = this;
    // offsetX = Math.min(0, Math.max(offsetX, width - contentWidth));

    this._offsetX = offsetX;
    console.log(offsetX);
    contentContainer.position.x = offsetX;
  }

  get offsetY() {
    return this._offsetY;
  }

  set offsetY(offsetY) {
    const { height, contentHeight, contentContainer } = this;
    // offsetY = Math.min(0, Math.max(offsetY, height - contentHeight));

    this._offsetY = offsetY;
    contentContainer.position.y = offsetY;
  }
}
