// import gsap from "gsap/gsap-core";
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

    $(eventBus).on("focus-activated", (e, coord, activeNode) => {
      this.selectedNode = activeNode;
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

  getValidOffsetX(offsetX) {
    return Math.min(offsetX, this.contentWidth);
    // return offsetX;
  }

  getValidOffsetY(offsetY) {
    return Math.min(offsetY, this.contentHeight);
    // return offsetY;
  }


  setOffset({ x: offsetX, y: offsetY }, options) {
    gsap.killTweensOf(this);
    gsap.to(this, {
      offsetX: this.getValidOffsetX(offsetX),
      offsetY: this.getValidOffsetY(offsetY),
      onComplete: this.showChild,
      callbackScope: this,
      duration: 2,
      ...options,
    });
  }

  showChild() {
    $(eventBus).trigger('map-container:focus-changed');
  }

  get offsetX() {
    return this._offsetX;
  }

  set offsetX(offsetX) {
    const { width, contentWidth, contentContainer } = this;

    this._offsetX = this.getValidOffsetX(offsetX);
    this._offsetX = offsetX;
    contentContainer.position.x = offsetX;

  }

  get offsetY() {
    return this._offsetY;
  }

  set offsetY(offsetY) {
    const { height, contentHeight, contentContainer } = this;
    // offsetY = Math.min(0, Math.max(offsetY, height - contentHeight));

    this._offsetY = this.getValidOffsetY(offsetY);
    contentContainer.position.y = offsetY;
  }
}
