import { eventBus } from "../../utils/shared";
import data from "../../custom-data/custom-data";
import Node from "./node";
import Line from "./Line";
// import { eventBus } from '../../utils/shared';
const { Container, Graphics } = global.PIXI;
export default class Tree extends Container {
  constructor({ width, height, contentWidth, contentHeight }) {
    super();

    this.widthContainer = width;
    this.heightContainer = height;

    this.width = width;
    this.height = height;

    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;

    this.center = {
      x: this._width / 2,
      y: this._height / 2,
    };

    this.draw();
    this.createLines();

    $(eventBus).on("focus-changed", (e, coord, activeNode) => {
      this.selectedNode = activeNode;
    });

    this.selectedNode = this.children[0];
  }

  set selectedNode(node) {
    this.children.forEach((_node) => {
      const isSame = _node === node;
      _node.buttonMode = !isSame;
      _node.interactive = !isSame;
    });
  }

  draw() {
    const center = this.center;

    for (let id in data.newData) {
      const dataTitle = data.newData[id];

      const coord = {
        x: center.x + this.contentWidth * dataTitle.x,
        y: center.y + this.contentHeight * dataTitle.y,
      };

      const node = new Node(dataTitle, coord, "main", center);

      this.addChild(node);
    }
    console.log(this.children);
  }

  drawPoint(point) {
    let pointFirst = new Graphics();

    const color = 0x0000ff;
    pointFirst.beginFill(color);
    pointFirst.drawCircle(point.left.x, point.left.y, 4);
    pointFirst.drawCircle(point.right.x, point.right.y, 4);
    pointFirst.endFill();
    this.addChild(pointFirst);
  }

  createLines() {
    this.children.forEach((parentNode) => {
      if (parentNode.childs.length) {
        parentNode.childs.forEach((IdChildNode) => {
          const childNode = this.children.find(
            (elem) => elem.id === IdChildNode
          );

          const childPoints = childNode.getPointCoord();
          const parentPoints = parentNode.getPointCoord();

          this.drawPoint(parentPoints);
          this.drawPoint(childPoints);

          console.log(childPoints);

          const line = new Line(parentPoints, childPoints);
          this.addChild(line);
        });

        console.log(this);
      }
    });
  }
}
