import { eventBus } from "../../utils/shared";
import { randomNumber } from "../../utils/helpers";
import data from "../../custom-data/custom-data";
import Node from "./node";
import Line from "./Line";
import { find } from "lodash";
import { child } from "event-stream";
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


    this.createNodes();
    this.createLines();

    this.currentNode = this.children[0];
    this.selectedNode = this.children[0];
    this.draw();

    $(eventBus).on("focus-activated", (e, coord, activeNode) => {
      this.selectedNode = activeNode;
      this.draw();
    });
    
    $(eventBus).on('focus-back', (e) => {
      const parentNode = this.selectedNode.childLine.parentNode;
      console.log(parentNode)
      $(eventBus).trigger('activate-focus', [parentNode.coordOffest, parentNode])
    });

 
  }

  draw() {
    const node = this.selectedNode;
    const main = this.children[0];

    let isParent = node.childs.length;

    this.children
      .filter( child => {
        if (child instanceof Line) return;
        child.hide();

        if (isParent) {
          // дети мейна
          const foundChildofMain = main.parentLines.some( line => line.childNode === child );
          if (foundChildofMain) return true;

          // дети родителя 
          const foundChild = node.parentLines.some( line => line.childNode === child );
          if (foundChild) return true;

          return false;
          
        } else { // ребенок 
          if (child === node) {
            node.styleType = 'opened';
            
            // node.draw();

            return true;
          } else return false;
        }        
      })
      .forEach( child => child.show());
  }

  

  set selectedNode(node) {
    if (node == this._selectedNode) return;
    
    const currentNode = this.children[0];
    // if (node !== currentNode) this.clearDraw();
    this._selectedNode = node;
    // this.draw(currentNode);

    this.children.forEach((_node) => {
      const isSame = _node === node;
      if (_node instanceof Node)
        _node.activateClick(isSame);      
    });
  }

  get selectedNode() {
    return this._selectedNode;
  }


  createNodes() {
    const center = this.center;

    for (let id in data.newData) {
      const dataTitle = data.newData[id];

      const coord = {
        x: center.x + this.contentWidth * dataTitle.x,
        y: center.y + this.contentHeight * dataTitle.y,
      }
      const node = new Node(dataTitle, coord, dataTitle.style, center);

      // if (id !== '0')
      node.alpha = 0;
      // node.hide();

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
          parentNode.addParentLines(line);
          childNode.addChildLine(line);
          // line.alpha = 0;
          // line.hide();
          this.addChild(line);
        });
      }
    });
    console.log(this);
  }

}
