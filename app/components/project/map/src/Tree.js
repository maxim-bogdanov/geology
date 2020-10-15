import { eventBus } from "../../utils/shared";
import { randomNumber } from "../../utils/helpers";
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

    this.selectedNode = this.children[0];
    this.draw();
    this.createLines();

    $(eventBus).on("focus-changed", (e, coord, activeNode) => {

      // if (!activeNode.childs.length) {
      //   console.log(activeNode.childs);
      //   this.deleteLines(this.selectedNode);
      // }
        
      // this.deleteNodes(this.selectedNode);
      this.selectedNode = activeNode;
      this.activateNodes();
      this.activateLines();

      // if (this.selectedNode.id !== '0') {
      //   this.draw();
      // }
    });

 
  }

  set selectedNode(node) {
    this._selectedNode = node;
    this.children.forEach((_node) => {
      const isSame = _node === node;
      _node.buttonMode = !isSame;
      _node.interactive = !isSame;
    });
  }

  get selectedNode() {
    return this._selectedNode;
  }


  activateNodes() {
    const node = this.selectedNode;
    this.activatedNodes = [];
    if (node.id === '0') return;

    this.children.forEach( (child) => {
      if (child === node) {

        child.childs.forEach( (activatedChild) => {
          this.children.forEach( (child) => {

            if (child.id == activatedChild) {
              this.activatedNodes.push(child);
              child.activate();
            }
            return;
          });
        })
      }
    });
  }



  activateLines() {
    const node = this.selectedNode;
    if (node.id === '0') return;

    this.activatedNodes.forEach( node => {
      this.children.forEach( child => {
        if ( child instanceof Line && child.childNode == node) {
          child.activate();
        }
      })
    });
  }

  createNodes() {
    
  }


  draw() {
    const center = this.center;

    for (let id in data.newData) {
      const dataTitle = data.newData[id];

      const coord = {
        x: center.x + this.contentWidth * dataTitle.x,
        y: center.y + this.contentHeight * dataTitle.y,
      }
      const node = new Node(dataTitle, coord, dataTitle.style, center);

      node.hide();
      this.addChild(node);
      this.animateNode(node);
    }
  }

  animateNode(node) {
    if (node.id === "0") return;

    const dx = 20;
    const dy = 20;

    this.tweenProperty(node, "x", -dx, dx);
    this.tweenProperty(node, "y", -dy, dy);
  }

  tweenProperty(target, prop, min, max) {
    gsap.to(target, {
      duration: randomNumber(2, 3),
      [prop]: target.defaultPosition[prop] + randomNumber(min, max),
      ease: "Power1.easeInOut",
      callbackScope: this,
      onComplete: this.tweenProperty,
      onCompleteParams: [target, prop, min, max],
    });
  }

  update = () => {
    this.children.forEach((child) => {
      if (child instanceof Line) {
        child.setPoints();
      }
    });
  };

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

    this.children.forEach( parentNode => {
      if (parentNode instanceof Node) {
        parentNode.childs.forEach( IdChildNode => {
          const childNode = this.children.find(
            (elem) => elem.id === IdChildNode
          );

          const line = new Line(parentNode, childNode);
          line.hide();
          this.addChild(line);
        });
      }
    });
  }


  // createLines() {
  //   this.children.forEach((parentNode) => {
  //     if ( (parentNode instanceof Node) && (parentNode.childs.length)) {
  //       parentNode.childs.forEach((IdChildNode) => {
  //         const childNode = this.children.find(
  //           (elem) => elem.id === IdChildNode
  //         );

  //         if (childNode) {
  //           const line = new Line(parentNode, childNode);
  //           this.addChild(line);
  //         }

  //         return;
  //       });
  //     }
  //   });
  // }
}
