import { eventBus } from "../../utils/shared";
import data from "../../custom-data/custom-data";
import Node from "./node";
// import { eventBus } from '../../utils/shared';
const { Container, Graphics } = global.PIXI;
export default class Tree extends Container {
  constructor({ width, height, contentWidth, contentHeight }) {
    super();

    this.width = width;
    this.height = height;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;

    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    };

    this.draw();

    $(eventBus).on("focus-changed", (e, coord, activeNode) => {
      this.selectedNode = activeNode;
    });

    this.selectedNode = this.children[0];
  }

  set selectedNode(node) {
    this.children.forEach((_node) => {
      if (_node === node) {
        _node.buttonMode = false;
        _node.interactive = false;
      } else {
        _node.buttonMode = true;
        _node.interactive = true;
      }
    });
  }

  draw() {
    const center = this.center;

    for (let id in data.newData) {
      let dataTitle = data.newData[id];

      let coord = {
        x: center.x + this.contentWidth * dataTitle.x,
        y: center.y + this.contentHeight * dataTitle.y,
      };

      let node = new Node(dataTitle, coord, "main", center);
      this.addChild(node);
    }
    // this.children[0].buttonMode = false;
    // this.children[0].interactive = false;
  }
}
