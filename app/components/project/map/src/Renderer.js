import data from '../../custom-data/custom-data';
import Node from "./node";
// import { eventBus } from '../../utils/shared';
const {Container, Graphics} = global.PIXI;
export default class Renderer {

  square;
  isFirst = true;
  constructor(map) {

    this.width = map._width;
    this.height = map._height;
    this.contentWidth = map.contentWidth;
    this.contentHeight = map.contentHeight;
    this.contentContainer = map.contentContainer;

    this.center = {
      x: this.width / 2,
      y: this.height / 2
    }

    this.box = {
      width: 200,
      height: 100
    }

    this.draw(this.isFirst);

    // this.square.on('pointerdown', (e) => console.log('click', e));

    console.log(data);
  }

  draw(isFirst) {

    const center = this.center;
    const box = this.box;

    for (let id in data.newData) {
      let dataTitle = data.newData[id];
      let coord = {
        x: center.x - box.width/2 + this.contentWidth * dataTitle.x,
        y: center.y - box.height/2  + this.contentHeight * dataTitle.y
      };
      let node = new Node(dataTitle, coord, box.width, box.height, this.contentContainer, 'style', center);

      this.contentContainer.addChild(node.nodeContainer);
    }

  }

  
}