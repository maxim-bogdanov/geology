import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";
import { eventBus, getScore } from "../utils/shared";
import { get, data } from "jquery";

const TIME_FADING = 0.75; 

class Header extends Plugin {
  // eslint-disable-next-line no-useless-constructor
  constructor($element) {
    super($element);
    $(eventBus)
    .on('focus-activated', function(e, coord, node){
      if (node.childs.length) return;

      let $headerBack = $('.header__back', $element);
      $headerBack.addClass('header__back_active');
      gsap.killTweensOf($headerBack);
      gsap.fromTo($headerBack,  TIME_FADING, {
        x: 230
      }, {x : 0})
    })
    .on('focus-back', function() {
      let $headerBack = $('.header__back', $element);
      gsap.killTweensOf($headerBack);
      gsap.to($headerBack,  TIME_FADING, {
        x: 230,
        onComplete: removeHeader,
      });

      function removeHeader() {
        $headerBack.removeClass('header__back_active');
      }
    });

    $('.header__back', $element).on('click', function(e, data){
      $(eventBus).trigger('focus-back');
    });

  }
}

registerPlugins({
  name: "header",
  Constructor: Header,
  selector: ".header"
});
