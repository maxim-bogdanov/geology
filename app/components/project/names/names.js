import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
// import { eventBus } from '../components/project/utils/shared';

class Names extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    // $($element).append()

  }
}

registerPlugins({
  name: "names",
  Constructor: Names,
  selector: ".names"
});
