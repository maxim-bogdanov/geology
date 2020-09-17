import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
// import { eventBus, data } from '../components/project/utils/shared';

class Name extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);

    // console.log(data);

    // $($element).
  }
}

registerPlugins({
  name: "name",
  Constructor: Name,
  selector: ".name"
});
