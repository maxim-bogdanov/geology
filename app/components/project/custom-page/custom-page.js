/* eslint-disable */
import { registerPlugins } from "../../framework/jquery/plugins/plugins.js";

class CustomPage {
  constructor($element) {}

  init(action, ...args) {
    if (action && typeof this[action] === "function") {
      return this[action].apply(this, args);
    }
  }

  destroy() {}
}
registerPlugins({
  name: "customPage",
  Constructor: CustomPage,
  selector: ".custom-page"
});
