import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class SaveButton extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
  }
}

registerPlugins({
  name: "saveButton",
  Constructor: SaveButton,
  selector: ".save-button"
});
