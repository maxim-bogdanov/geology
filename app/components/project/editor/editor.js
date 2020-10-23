import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import data from '../custom-data/custom-data';
import '../../framework/template-engine/template-engine';



class Editor extends Plugin {

  static width = 1920;
  static height = 1080;

  static contentWidth = 1920;
  static contentHeight = 1080;

  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    this.$element = $element;

    $(window).on('load resize', this.resize);

    this.center = {
      x: Editor.width / 2,
      y: Editor.height / 2
    };
    
    this.data = data.newData;
    this.createNodes();

    const $node = $('.squareNode', $element);
    
    // $node.on('click', () => {
    //   this.dragElement(this);
    // });
  }
  

  createNodes() {
    const {data, $element, center} = this;

    for (let nodeId in data) {
      const node = data[nodeId];

      const nodeInfo = {
        text: node.title,
        left: 50 + node.x*100 +'%',
        top: 50 + node.y*100 +'%'
      }

      const $template = $('.template-node', $element);
      $template.templateEngine(nodeInfo);

      const $node = $('.squareNode', $element).first();
    };
  }

  // var ball = document.getElementById('ball');

  // ball.onmousedown = function(e) { // 1. отследить нажатие

  //   // подготовить к перемещению
  //   // 2. разместить на том же месте, но в абсолютных координатах
  //   ball.style.position = 'absolute';
  //   moveAt(e);
  //   // переместим в body, чтобы мяч был точно не внутри position:relative
  //   document.body.appendChild(ball);

  //   ball.style.zIndex = 1000; // показывать мяч над другими элементами

  //   // передвинуть мяч под координаты курсора
  //   // и сдвинуть на половину ширины/высоты для центрирования
  //   function moveAt(e) {
  //     ball.style.left = e.pageX - ball.offsetWidth / 2 + 'px';
  //     ball.style.top = e.pageY - ball.offsetHeight / 2 + 'px';
  //   }

  //   // 3, перемещать по экрану
  //   document.onmousemove = function(e) {
  //     moveAt(e);
  //   }

  //   // 4. отследить окончание переноса
  //   ball.onmouseup = function() {
  //     document.onmousemove = null;
  //     ball.onmouseup = null;
  //   }
  resize() {
    console.log('hi')
  }


}



registerPlugins({
  name: "editor",
  Constructor: Editor,
  selector: ".editor"
});
