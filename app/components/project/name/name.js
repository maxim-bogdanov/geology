import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class Name extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "name",
  Constructor: Name,
  selector: ".name"
});
