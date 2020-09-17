import { Container } from "pixi.js";
import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import MapContainer from "./src/MapContainer";


class Map extends Plugin {

  static WIDTH = 1920;
  static HEIGHT = 1080;

  #app;
  constructor($element) {
    super($element);

    this.$element = $element;

    const app = this.#app = new PIXI.Application({
      width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb
    });

    $(window).on('resize', this.resize.bind(this));

    const map = new MapContainer({
      width: Map.WIDTH, // контейнера
      height: Map.HEIGHT,
      contentWidth: 3000, // контента
      contentHeight: 3000
    });

    app.stage.addChild(map);

    $element.append(app.view);

    this.resize();
  }

  resize() {
    const {offsetWidth, offsetHeight} = this.$element.get(0);
    //TODO: scale contain
    this.#app.renderer.resize(window.innerWidth, window.innerHeight);

    const scale = {
      x: offsetWidth / Map.WIDTH,
      y: offsetHeight / Map.HEIGHT
    }

    const {x, y} = scale;
    this.#app.stage.scale.set(x, y);
  }
}

registerPlugins({
  name: "map",
  Constructor: Map,
  selector: ".map"
});
