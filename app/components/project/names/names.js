import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Names extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "names",
  Constructor: Names,
  selector: ".names"
});
