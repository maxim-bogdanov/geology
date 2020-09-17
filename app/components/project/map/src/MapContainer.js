const {Container, Graphics} = global.PIXI;
export default class MapContainer extends Container {
  constructor({width, height, contentWidth, contentHeight} = {}) {
    super();
    
    this.width = width;
    this.height = height;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;

    const contentContainer = new Container();
    this.contentContainer = contentContainer;

    this.addChild(contentContainer);


    if (DEBUG)
      this.addTest();
        

  }

  destroy(options) {
    super.destroy(options);
    this.contentContainer = null;
  }

  addTest() {
    const graphics = new Graphics();

    const {width, height} = this;

    // Rectangle
    graphics.beginFill(0xDE3249);
    graphics.drawRect(500, 500, 300, 550);
    graphics.endFill();

    this.contentContainer.addChild(graphics);
  }

  get offsetX() {
    return this._offsetX;
  }

  set offsetX(offsetX) {
    const {width, contentWidth} = this;
    offsetX = Math.max(0, Math.min(offsetX, width - contentWidth));

    this._offsetX = offsetX;
  }

  get offsetY() {
    return this._offsetY;
  }

  set offsetY(offsetY) {
    const {height, contentHeight} = this;
    offsetY = Math.max(0, Math.min(offsetY, height - contentHeight));

    this._offsetY = offsetY;
  }
}