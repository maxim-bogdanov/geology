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

    $(eventBus).on("focus-changed", (e, coord, activeNode) => {
      this.selectedNode = activeNode;
      this.draw();
    });

 
  }

  draw() {
    const node = this.selectedNode;
    const main = this.children[0];

    this.children.forEach( child => {
      if (child instanceof Line) return;
      
      // выбранный элемент
      if (child === node || child === this.children[0]) {
        node.show();
        return;
      }

      // ребенок 
      const foundChild = node.parentLines.find( line => line.childNode === child );

      if (foundChild) {
        foundChild.childNode.show();
        return;
      }

      // первые дети 
      const foundChildofMain = main.parentLines.find( line => line.childNode === child );

      if (foundChildofMain) {
        foundChildofMain.show();
        return;
      }

      child.hide();
      
    });
  }

  

  set selectedNode(node) {
    if (node == this._selectedNode) return;
    
    const currentNode = this.children[0];
    // if (node !== currentNode) this.clearDraw();
    this._selectedNode = node;
    // this.draw(currentNode);

    this.children.forEach((_node) => {
      const isSame = _node === node;
      _node.buttonMode = !isSame;
      _node.interactive = !isSame;
    });
  }

  get selectedNode() {
    return this._selectedNode;
  }

  show() {
    
    // this.activateNodes();
    // this.activateLines();
  }


  activateNodes() {
    // const node = this.selectedNode;
    // this.activatedNodes = [];

    // this.children.forEach( (child) => {
    //   if (child === node) {

    //     child.childs.forEach( (activatedChild) => {
    //       this.children.forEach( (child) => {

    //         if (child.id == activatedChild) {
    //           this.activatedNodes.push(child);
    //           child.show();
    //         }
    //         return;
    //       });
    //     })
    //   }
    // });

    const node = this.selectedNode; 
    node.lines.forEach( line => {
      line.childNode.show();
    });
  }



  activateLines() {
    // const node = this.selectedNode;
    // this.activatedLines = [];
    // // if (node.id === '0') return;

    // this.activatedNodes.forEach( node => {
    //   this.children.forEach( child => {
    //     if ( child instanceof Line && child.childNode == node) {
    //       this.activatedLines.push(child);
    //       child.show();
    //     }
    //   })
    // });
    const node = this.selectedNode; 
    node.lines.forEach( line => {
      line.show();
    });
  }

  hideNodes() {
    // const node = this.selectedNode;
    // if (node.id === '0') return;

    // this.activatedNodes.forEach( node => node.hide() );

    const node = this.selectedNode; 
    // if (node.id === '0') return;
    node.lines.forEach( line => {
      const node = line.childNode;
      node.hide();
    });
  }


  hideLines() {
    // const node = this.selectedNode;
    // if (node.id === '0') return;

    // this.activatedLines.forEach( line => line.hide() );
    const node = this.selectedNode;
    // if (node.id === '0') return;
    node.lines.forEach( line => {
      line.hide();
    });
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
