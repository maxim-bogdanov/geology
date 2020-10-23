import { nodeName } from "jquery";
import data from "../../custom-data/custom-data";
import { eventBus } from "../../utils/shared";
import { buttonStyle } from "./nodeSettings";
import { drawdash } from "../../utils/helpers";
import gsap from "gsap";
// import gsap from "gsap/gsap-core";
// import { eventBus } from '../../utils/shared';
const { Container, Graphics, Text, BitmapText } = global.PIXI;

export default class Node extends Container {

  static color = 0xce0203;

  constructor({ title, id, children = [], content, style, img, info, sign }, coord, styleType, center) {
    super();

    this.center = center;
    this.title = title;
    this.childs = children;
    this.content = content;
    this.styleType = styleType;
    this.style = style;
    this.id = id;
    this.img = img;
    this.info = info;
    this.sign = sign;
    this.defaultPosition = coord;
    this.parentLines = [];
    this.childLine;
    this.isHidden = true;
    this.graphics = new Graphics();
    this.graphicsFirst = new Graphics();
    this.firstMask = new Graphics();
    this.firstPoint = new Graphics();
    this.secondPoint = new Graphics();
    this.dottedGraphicsContainer = new Container();
    
    this.setCoord();


    this.animationShowComplete = true;
    this.animationHideComplete = true;

    this.promiseData = {
      show: {},
      hide: {},
    };

    // this.radius = 50;

    this.firstMaskContainer = new Container();
    this.secondMaskContainer = new Container();
    this.mainContainer = new Container();

    this.position.set(coord.x, coord.y);

    this.draw();
  }

  setTextStyle(styleType) {
    const styleText = new PIXI.TextStyle(buttonStyle[styleType].text);
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;
    this.text = new Text(this.title, styleText);

    this.widthRect = this.text.width + buttonStyle[styleType].rect.left * 2;
    this.heightRect = this.text.height + buttonStyle[styleType].rect.top * 2;

    if (buttonStyle[this.styleType].outer) {
      this.widthOuter = this.text.width + buttonStyle[styleType].outer.left * 2 ;
      this.heightOuter =
        this.text.height + buttonStyle[styleType].outer.top * 2;
    }

    this.radius = this.heightRect / 2;

    this.text.x = -this.widthRect / 2 + buttonStyle[styleType].rect.left;
    this.text.y = -this.heightRect / 2 + buttonStyle[styleType].rect.top;
  }


  hide() {
    if (this.isHidden) return;

    this.isHidden = true;

    this.promiseData.hide.promise = new Promise( (resolve, reject) => {

      this.promiseData.hide.resolve = resolve;
      this.promiseData.hide.reject = reject;
    });

   

    if (!this.animationShowComplete) {
      this.promiseData.show.reject(false);
      gsap.killTweensOf(this, "alpha");
      this.animationShowComplete = true;
    }

    this.parentLines.forEach( line => {
      line.hide();
    });

    this.promiseLines = [];
    this.promiseLines = this.parentLines.map( line => line.promiseData.hide.promise);

    this.animationHideComplete = false;
    // if (this.title === 'Динамическая геология')
    //   console.log('lines promisses hidden started');
    Promise.all(this.promiseLines).then(
      () => {
        // if (this.title === 'Динамическая геология')
        //   console.log('lines promisses hidden ok');
        this.animateHide();
      }
    );

    if (this.childLine && !this.childLine.isHidden) 
      this.childLine.hide();

    return this.promiseData.hide.promise;
  }

  animateHide() {
    if (!this.isHidden) return;
    gsap.killTweensOf(this, "alpha");
    gsap.to(this, {
      duration: this.alpha,
      alpha: 0,
      onComplete: this.onHideComplete,
      callbackScope: this,
      onCompleteParams: [this.promiseData.hide.resolve]
    });
  }
  
  onHideComplete(resolve) {
    this.animationHideComplete = true;
    // this.interactive = false;
    // if (this.title === 'Динамическая геология')
    //   console.log('hide complete')
    // this.buttonMode = false;
    resolve(true);
  }

  show() {
    if (!this.isHidden) return;
    this.isHidden = false;

    // this.interactive = true;
    // this.buttonMode = true;

    this.promiseData.show.promise = new Promise((resolve, reject) => {
      this.promiseData.show.resolve = resolve;
      this.promiseData.show.reject = reject;
    });



    if (!this.animationHideComplete) {
      // if (this.title === 'Динамическая геология')
      //   console.log('hide не закончилась ', this.animationHideComplete);
      gsap.killTweensOf(this, "alpha");

      // this.parentLines.forEach( line => {
      //   line.promiseData.hide.reject(false);
      // });

      this.promiseData.hide.reject(false);
      this.animationHideComplete = true;
    }

    // this.parentLines.forEach( line => {
    //   if (line.isHidden)
    //     line.show();
    // });
    
    this.animationShowComplete = false;

    if (this.childLine && this.childLine.isHidden) {
      this.childLine.show();
      this.childLine.promiseData.show.promise.then(
        () => {
          // if (this.title === 'Динамическая геология')
          //   console.log('lines promises show ok');
          this.animateShow();
        }
      );
    } else {
      this.animateShow();
    }

    return this.promiseData.show.promise;
  }

  animateShow() {
    if (this.isHidden) return;
    gsap.killTweensOf(this, "alpha");
    gsap.to(this, {
      duration: 1 - this.alpha,
      alpha: 1,
      onComplete: this.onShowComplete,
      callbackScope: this,
      onCompleteParams: [this.promiseData.show.resolve]
    });
  }
  
  onShowComplete(resolve) {
    this.animationShowComplete = true;
    // if (this.title === 'Динамическая геология')
    //   console.log('show complete')
    resolve(true);
  }

  setPoints() {
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;
    const {
      position: { x, y },
      widthRect,
    } = this;

    this.points = {
      first: {
        x: widthRect / 2 + lineWidth / 2,
        y: 0,
      },
      second: {
        x: -widthRect / 2 - lineWidth / 2,
        y: 0,
      },
    };
  }

  getPointCoord() {
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;
    const {
      position: { x, y },
      widthRect,
    } = this;

    return {
      left: {
        x: x + widthRect / 2 + lineWidth / 2,
        y,
      },
      right: {
        x: x - widthRect / 2 - lineWidth / 2,
        y,
      },
    };
  }

  addParentLines(line) {
    this.parentLines.push(line);
  }
  addChildLine(line) {
    this.childLine = line;
  }

  drawPoints() {

    // const firstPoint = new Graphics();
    const {firstPoint, secondPoint} = this;
    firstPoint.lineStyle(
      2, Node.color
    );
    firstPoint.beginFill(0x15171c);
    firstPoint.drawCircle(this.points.first.x, this.points.first.y, 4);
    firstPoint.endFill();
    this.addChild(firstPoint);

    // const secondPoint = new Graphics();
    secondPoint.lineStyle(
      2, Node.color
    );
    secondPoint.beginFill(0x15171c);
    secondPoint.drawCircle(this.points.second.x, this.points.second.y, 4);
    secondPoint.endFill();
    this.addChild(secondPoint);
  }



  drawDotted(options) {
    let point1, point2;

    this.graph = this.getGraph(options);

    this.addChild(this.dottedGraphicsContainer);

    const step = 0.016;

    for (let i = 0; i <= 0.99; i+=step) {
      const dottedGraphics = new Graphics();

      
      const index1 = this.getIndexOfLine(i);
      const index2 = this.getIndexOfLine(i + step);

      const localProgress1 = this.getLocalProgress(i, index1);
      const localProgress2 = this.getLocalProgress(i + 0.01, index2);

      point1 = this.getPoint(localProgress1, index1, options);
      point2 = this.getPoint(localProgress2, index2, options);

      dottedGraphics.lineStyle(3, Node.color);
      dottedGraphics.moveTo(point1.x, point1.y);
      dottedGraphics.lineTo(point2.x, point2.y);

      this.dottedGraphicsContainer.addChild(dottedGraphics);
    }

  }

  getGraph(options) {
    const {width, height, r} = options;

    const widthLine = width - r * 2;
    const widthGraph = widthLine + 2 * (Math.PI * r * 90 / 180);
    
    const graph = {
      width: widthGraph,
      lines: [
        {
          length: Math.PI * r * 90 / 180,
        },
        {
          length: widthLine,
        },
        {
          length: Math.PI * r * 90 / 180,
        }
      ]
    }

    graph.lines.forEach( (line, index) => {
      if (index === 0)
        line.start = 0;
      else line.start = graph.lines[index-1].finish;
      line.finish = line.start + line.length;
    });
    return graph;
  }

  getIndexOfLine(progress) {

    const {graph, width, height, r} = this;

    const x = graph.width * progress;

    const index = graph.lines.findIndex( line => (x <= line.finish) && (x >= line.start));  
    return index;
  }

  getLocalProgress(progress, index) {

    const {graph, width, height, r} = this;

    const x = graph.width * progress;
    const line = graph.lines[index];
    const localProgress = (x - line.start) / line.length;
    return localProgress;
  }

  getPointfromCircle(start, end, localProgress, r) {

    const rad = -(start + (end - start) * localProgress);
    
    return {
      x: Math.cos(rad) * r ,
      y: Math.sin(rad) * r 
    }

  }

  changeOffSet(point, offSet) {
    point.x += offSet.x;
    point.y += offSet.y;

    return point;
  }



  getPoint(localProgress, index, options) {

    const {graph} = this;
    const {width, height, r} = options;
    const line = graph.lines[index];

    // 0, 0 слева
    const center = {
      x: -this.widthRect / 2,
      y: 0
    }

    let coord = {};

    const sign = this.styleType == 'childDown' ? -1 : 1;

    const start = {
      left: sign == 1 ? Math.PI : Math.PI ,
      right: sign == 1 ? Math.PI * 1.5 : Math.PI / 2
    };

    const finish = {
      left: sign == 1 ? Math.PI * 1.5 : Math.PI / 2,
      right: sign == 1 ? Math.PI * 2 : 0
    };

    switch (index) {
      case 0:
        coord = this.getPointfromCircle(start.left, finish.left, localProgress, r);
        this.changeOffSet(coord, {x: r, y: 0});
        this.changeOffSet(coord, {x: center.x, y: 0});
        break;
    
      case 1:
        coord = {
          x: center.x + r + line.length * localProgress,
          y: r * sign
        }
        break;

      case 2:
        coord = this.getPointfromCircle(start.right, finish.right , localProgress, r,);
        this.changeOffSet(coord, {x: -r, y: 0});
        this.changeOffSet(coord, {x: -center.x, y: 0});
        break;
    }

    return coord;
  }



  drawMain() {
    const { graphics } = this;
    // graphics.clear();

    const leftImg = new PIXI.Sprite.from('./images/+001.png');
    const rightImg = new PIXI.Sprite.from('./images/001+.png');

    rightImg.anchor.set(0.5);
    leftImg.anchor.set(0.5);

    rightImg.x = this.widthRect / 2 - buttonStyle[this.styleType].rect.left * 0.36;
    leftImg.x = - this.widthRect / 2 + buttonStyle[this.styleType].rect.left * 0.36;

    this.addChild(rightImg);
    this.addChild(leftImg);

    graphics.lineStyle(
      buttonStyle[this.styleType].rect.lineWidth,
      buttonStyle.color
    );

    graphics.beginFill(
      buttonStyle.color,
      buttonStyle[this.styleType].rect.fill
    );

    graphics.drawRoundedRect(
      -this.widthRect / 2,
      -this.heightRect / 2,
      this.widthRect,
      this.heightRect,
      this.radius
    );
  }

  drawParent() {
    const { graphics } = this;
    // graphics.clear();

    graphics.lineStyle(
      buttonStyle[this.styleType].rect.lineWidth,
      buttonStyle.color
    );

    graphics.beginFill(
      buttonStyle.color,
      buttonStyle[this.styleType].rect.fill
    );

    graphics.drawRoundedRect(
      -this.widthRect / 2,
      -this.heightRect / 2,
      this.widthRect,
      this.heightRect,
      this.radius
    );
  }

  drawChild() {
    // this.graphicsFirst = new Graphics();
    // this.firstMask = new Graphics();
    const { graphicsFirst, firstMask} = this;
    // graphicsFirst.clear();
    // firstMask.clear();
    const lineWidth = buttonStyle[this.styleType].rect.lineWidth;

    this.graphicsFirst.clear();


    this.addChild(this.firstMaskContainer);        
       
    //First Mask
    graphicsFirst.lineStyle(
      buttonStyle[this.styleType].rect.lineWidth,
      buttonStyle.color
    );

    graphicsFirst.beginFill(
      buttonStyle.color,
      buttonStyle[this.styleType].rect.fill
    );

    graphicsFirst.drawRoundedRect(
      -this.widthRect / 2,
      -this.heightRect / 2,
      this.widthRect,
      this.heightRect,
      this.radius
    );

    this.firstMaskContainer.addChild(graphicsFirst);
    // const firstMask = new Graphics();
    firstMask.beginFill(0x000000);

    const sign = this.styleType == 'childUp' ? -1 : 0;

    firstMask.drawRoundedRect(
      -this.widthRect / 2 - lineWidth,
      this.heightRect / 2 * sign,
      this.widthRect + lineWidth * 2,
      this.heightRect / 2,
      this.radius
    );

    firstMask.endFill();
    this.firstMaskContainer.addChild(firstMask);
    graphicsFirst.mask = firstMask;

    this.options = {
      width: this.widthRect,
      height: this.heightRect,
      r: this.radius
    }

    this.drawDotted(this.options);

  }
  

  drawRect() {
    // this.graphicsFirst = new Graphics();
    // this.firstMask = new Graphics();
    // const { graphicsFirst, firstMask} = this;

    const { graphics, graphicsFirst, graphicsSecond, firstMask, secondMask } = this;

    switch (this.styleType) {
      case 'main':
        this.drawMain();
        break;

      case 'parent': 
        this.drawParent();      
        break;  

      case 'opened': 
        
        graphics.clear();
        graphics.lineStyle(
          buttonStyle[this.styleType].rect.lineWidth,
          buttonStyle.color
        );
        graphics.drawRoundedRect(
          -this.widthRect / 2,
          -this.heightRect / 2,
          this.widthRect,
          this.heightRect,
          this.radius
        );

        break;

      case 'childUp':

        this.drawChild();
        break;

      case 'childDown':

        this.drawChild();
        break;
    }

    // graphics.endFill();
  }

  drawOuter() {

    this.graphics.lineStyle(
      buttonStyle[this.styleType].outer.lineWidth,
      buttonStyle.color
    );
    
    this.graphics.beginFill(
      buttonStyle.color,
      buttonStyle[this.styleType].outer.fill
    );

    this.graphics.drawRoundedRect(
      -this.widthOuter / 2,
      -this.heightOuter / 2,
      this.widthOuter,
      this.heightOuter,
      this.radius
    );
    this.graphics.endFill();
    
  }

  setCoord() {
    let childOffset = {
      x: 0,
      y: 0
    };
    
    if (!this.childs.length) {
      const sign = this.id[0] === '-' ? -1 : 1;
      childOffset = {
        x: -200 * sign,
        y: -300,
      }
    }

    this.coordOffest = {
      x: this.center.x - this.defaultPosition.x + childOffset.x,
      y: this.center.y - this.defaultPosition.y + childOffset.y,
    };
  }


  draw() {
 
    const { graphics, graphicsFirst, dottedGraphicsContainer, firstPoint,
    secondPoint, firstMask} = this;
    graphics.clear();
    firstPoint.clear();
    secondPoint.clear();
    graphics.clear();
    graphicsFirst.clear();
    firstMask.clear();
    graphics.clear();

    dottedGraphicsContainer.removeChildren(0, dottedGraphicsContainer.length);
    // const textInd = this.children.findIndex( child => child instanceof Text);
    // if (textInd)
    //   this.removeChildAt(textInd);
    // this.removeChildren();

    this.setTextStyle(this.styleType);

    this.drawRect();

    if (this.widthOuter) {
      this.drawOuter();
    }

    this.addChild(graphics);
    this.addChild(this.text);

    // this.buttonMode = false;
    // this.interactive = false;

    this.setPoints();
    this.drawPoints();

    this.on("pointerdown", () => {

      this.buttonMode = false;
      this.interactive = false;
      
      $(eventBus).trigger("activate-focus", [this.coordOffest, this]);
    });
  }
}
