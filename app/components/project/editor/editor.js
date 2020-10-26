import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import data from '../custom-data/custom-data';
import '../../framework/template-engine/template-engine';
import settings from './editor-settings'


class Editor extends Plugin {

  constructor($element) {
    super($element);

    this.$element = $element;
    const {eventMove, eventLeave, width,height} = settings;

    this.center = {
      x: width / 2,
      y: height / 2
    };

    this.data = data.newData;
    this.$template = $element.find('.template-node');
    this.createNodes();

    $element.on(eventMove, this.moveMouse);
    $element.on(eventLeave, this.upMouse);

    const $saveButton = $element.find('.save-button');
    $saveButton.on('click', () => this.saveButtonClicked());
  }

  saveButtonClicked() {
    console.log(JSON.stringify(this.data));
  }
  

  createNodes() {
    const {data, $template} = this;
    const {eventStart, procentHeight, procentWidth} = settings;

    for (let nodeId in data) {
      const node = data[nodeId];

      const nodeInfo = {
        text: node.title,
        left: `${50 + node.x*procentWidth}%`,
        top: `${50 + node.y*procentHeight}%`,
        id: node.id
      }


      const $node = $template.templateEngine(nodeInfo);
      $node.get(0).nodeInfo = nodeInfo;

      $node.on(eventStart, this.downMouse);

      
      $node.on('dragstart', () => false);
    };
  }

  downMouse=(e)=> {
    const { $element} = this;

    const {eventFinish} = settings;

    console.log('down mouse')
    const $node = $(e.target.closest('.squareNode'));
    this.$node = $node;

    this.pageX = e.pageX ? e.pageX : (e.changedTouches[0].pageX ? e.changedTouches[0].pageX : null);
    this.pageY = e.pageY ? e.pageY : (e.changedTouches[0].pageY ? e.changedTouches[0].pageY : null);

    // console.log(this.pageX, this.pageY, 'pageX pageY')

    const {width, height, left, top} =  $node.get(0).getBoundingClientRect();

    const nodeCenter = {
      x: left + width/2,
      y: top + height/2
    }
    
    this.offsetX = this.pageX - nodeCenter.x;
    this.offsetY = this.pageY - nodeCenter.y; 
    
    console.log(this.offsetX,this.offsetY);

    $node.addClass('squareNode_active');

    $node.on(eventFinish, this.upMouse);
    // $element.on('mouseleave touchcancel', this.upMouse);


  }

  upMouse = (e) => {
    // const $node = $(e.target.closest('.squareNode'));
    const {$node} = this;
    if (!$node) return;

    const {procentHeight, procentWidth} = settings;
    const nodeInfo = $node.get(0).nodeInfo;
    console.log('mouse up');

    this.destroyMouse(e);

    this.data[nodeInfo.id].newX = (parseFloat($node.css("left") ) * 100 / (window.innerWidth ) - 50)/procentWidth ;
    this.data[nodeInfo.id].newy = (parseFloat($node.css("top") ) * 100 / (window.innerHeight ) - 50)/procentHeight ;
  }

  moveMouse = (e) => {
    const {$node} = this;
    if (!$node) return;

    this.pageX = e.pageX ? e.pageX : (e.changedTouches[0].pageX ? e.changedTouches[0].pageX : null);
    this.pageY = e.pageY ? e.pageY : (e.changedTouches[0].pageY ? e.changedTouches[0].pageY : null);

    const {pageX, pageY, offsetX, offsetY} = this;

    $node.css({left: `${100 * (pageX - offsetX) / window.innerWidth}%`,
              top: `${100 * (pageY - offsetY) / window.innerHeight}%`})
  }


  destroyMouse(e) {
    const {$element, $node} = this;
    const {eventFinish} = settings;

    $node.off(eventFinish, this.upMouse);
    $node.removeClass('squareNode_active');
    this.$node = null;
  }

  destroy(){
    super.destroy();


  }

}



registerPlugins({
  name: "editor",
  Constructor: Editor,
  selector: ".editor"
});
