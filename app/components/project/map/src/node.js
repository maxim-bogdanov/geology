import data from '../../custom-data/custom-data'
import { eventBus } from '../../utils/shared';
// import { eventBus } from '../../utils/shared';
const {Container, Graphics, Text} = global.PIXI;

export default class Node {



  constructor({title, id, children, content}, coord, width, height, contentContainer, style, center) {
    this.center = center;
    this.coord = coord;
    this.width = width;
    this.height = height;
    this.title = title;
    this.children = children;
    this.content = content;
    this.style = style;
    this.id = id;
    this.contentContainer = contentContainer;

    this.nodeContainer = new Container();

    this.draw();
  }

  draw() {
    const graphics = new Graphics();
    // Rectangle
    graphics.beginFill(0xDE3249);
    graphics.drawRect(this.coord.x, this.coord.y, this.width, this.height);
    graphics.endFill();

    const text = new Text(this.title);
    text.x = this.coord.x;
    text.y = this.coord.y;

    this.nodeContainer.addChild(graphics);
    this.nodeContainer.addChild(text);

    this.nodeContainer.buttonMode = true;
    this.nodeContainer.interactive = true;

    this.nodeContainer.on('pointerdown', () => {
      const coordPoint = {
        x: this.center.x - this.coord.x - this.width / 2,
        y: this.center.y - this.coord.y - this.height / 2
      }
      console.log(this.coord);
      $(eventBus).trigger('change-focus', coordPoint);
    });
    // this.contentContainer.addChild(this.nodeContainer);


  }

}