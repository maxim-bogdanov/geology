import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class SquareNode extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "squareNode",
  Constructor: SquareNode,
  selector: ".squareNode"
});
