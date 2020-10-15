import { eventBus } from "../../utils/shared";
import { randomNumber } from "../../utils/helpers";
import data from "../../custom-data/custom-data";
import Node from "./node";
import Line from "./Line";
import { active } from "browser-sync";
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

    this.deletedNodes = [];

    this.center = {
      x: this._width / 2,
      y: this._height / 2,
    };


    this.drawFirst();
    this.selectedNode = this.children[0];
    this.draw();
    // this.createLines();

    $(eventBus).on("focus-changed", (e, coord, activeNode) => {

      if (!activeNode.childs.length) {
        console.log(activeNode.childs);
        this.deleteLines(this.selectedNode);
      }
        
      this.deleteNodes(this.selectedNode);
      this.selectedNode = activeNode;

      if (this.selectedNode.id !== '0') {
        this.draw();
      }
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


  deleteNodes(deletedNode) {
    this.deletedNodes = [];
    if (deletedNode.id === '0') return;

    this.children.forEach( (child) => {
      if (child === deletedNode) {

        child.childs.forEach( (deletedChild) => {
          this.children.forEach( (child) => {

            if (child.id == deletedChild) {
              this.deletedNodes.push(child);
              this.removeChild(child);
            }
            return;
          });
        })

      }
    });
    console.log(this.deletedNodes);
  }

  deleteLines(deletedNode) {
    if (deletedNode.id === '0') return;

    this.deletedNodes.forEach( node => {
      this.children.forEach( child => {
        if ( child instanceof Line && child.childNode == node) {
          this.removeChild(child);
        }
      })
    });
  }

  createNodes() {
    
  }

  drawFirst() {
    const { center } = this;    
    const dataTitle = data.newData['0'];

    const coord = {
      x: center.x + this.contentWidth * dataTitle.x,
      y: center.y + this.contentHeight * dataTitle.y,
    };

    const node = (this.node = new Node(dataTitle, coord, 'main', center));
    this.addChild(node);
  }

  draw() {

    const { center, selectedNode } = this;
    const dataTitle = selectedNode;

    if (!dataTitle.childs) return;

    dataTitle.childs.forEach( (childId) => {
      const child = data.newData[childId];

      const coord = {
        x: center.x + this.contentWidth * child.x,
        y: center.y + this.contentHeight * child.y,
      };

      const node = (this.node = new Node(child, coord, child.style, center));
      this.addChild(node);
      this.animateNode(node);
    });

    console.log(this);
    this.createLines();
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
    // console.log(this);
    // console.log(t.target[0]);
    // console.log("update");
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

  // createLines() {
  //   this.children.forEach((parentNode) => {
  //     if (parentNode.childs.length) {
  //       parentNode.childs.forEach((IdChildNode) => {
  //         const childNode = this.children.find(
  //           (elem) => elem.id === IdChildNode
  //         );

  //         const line = new Line(parentNode, childNode);
  //         this.addChild(line);
  //       });
  //     }
  //   });
  //   console.log(this);
  // }


  createLines() {
    this.children.forEach((parentNode) => {
      if ( (parentNode instanceof Node) && (parentNode.childs.length)) {
        parentNode.childs.forEach((IdChildNode) => {
          const childNode = this.children.find(
            (elem) => elem.id === IdChildNode
          );

          if (childNode) {
            const line = new Line(parentNode, childNode);
            this.addChild(line);
          }

          return;
        });
      }
    });
  }
}
