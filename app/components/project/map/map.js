import { eventBus } from "../../../components/project/utils/shared";
import { Container } from "pixi.js";
import '../../../components/framework/template-engine/template-engine';
import {
  registerPlugins,
  Plugin,
} from "../../framework/jquery/plugins/plugins";
import MapContainer from "./src/MapContainer";
import Tree from "./src/Tree"; 

class Map extends Plugin {
  static WIDTH = 1920;
  static HEIGHT = 1080;

  #app;
  constructor($element) {
    super($element);

    this.$element = $element;

    const app = (this.#app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
    }));

    const background = PIXI.Sprite.from("images/bg.png");
    app.stage.addChild(background);

    $(eventBus).on('focus-activated', (e, coord, node) => {
      this.selectedNode = node;
    });

    $(eventBus).on('map-container:focus-changed', () => {

      const node = this.selectedNode;
      if (node.childs.length) return;

      const nodeInfo = {
        content: node.content,
        img: node.img,
        sign: node.sign,
        info: node.info, 
        title: node.title
      }
      const $template = $('.map__content', $element);
      $template.templateEngine(nodeInfo);

      const $name = $('.name', $element);
      if (nodeInfo.sign === '-')
        $name.removeClass('name_right');
      else
        $name.addClass('name_right');

      gsap.killTweensOf($name);
      gsap.fromTo($name, 0.5, 
        {opacity: 0},{
        opacity: 1
      });

      $(eventBus).on('focus-back', () => {
        gsap.killTweensOf($name);
        gsap.fromTo($name, 0.5, 
          {opacity: 1},{
          opacity: 0,
          onComplete: fadeOutName,
        });

        function fadeOutName() {
          $name.remove();
        }
      });

      $name.on('click', () => {
        $(eventBus).trigger('focus-back');
      });
    });



    $(window).on("resize", this.resize.bind(this));

    const map = new MapContainer({
      width: Map.WIDTH, // контейнера
      height: Map.HEIGHT,
      contentWidth: 3000, // контента
      contentHeight: 1000,
    });

    const tree = new Tree({
      width: Map.WIDTH, // контейнера
      height: Map.HEIGHT,
      contentWidth: 3000, // контента
      contentHeight: 1000,
    });

    this.tree = tree;

    app.stage.addChild(map);
    map.contentContainer.addChild(tree);
    app.ticker.add(this.update, this);

    $element.append(app.view);

    this.resize();
  }


  update() {
    this.tree.update();
  }

  resize() {
    const { offsetWidth, offsetHeight } = this.$element.get(0);
    //TODO: scale contain
    this.#app.renderer.resize(window.innerWidth, window.innerHeight);

    const scale = {
      x: offsetWidth / Map.WIDTH,
      y: offsetHeight / Map.HEIGHT,
    };

    const { x, y } = scale;
    this.#app.stage.scale.set(x, y);
  }
}

registerPlugins({
  name: "map",
  Constructor: Map,
  selector: ".map",
});
