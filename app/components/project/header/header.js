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
    .on('quiz-activated', function(){
      let $headerBack = $('.header__back', $element);
      $headerBack.addClass('header__back_active');
      $('.header__score', $element).addClass('header__score_active');
      gsap.from($headerBack,  TIME_FADING, {
        x: 230
      })
    })
    .on('end-screen:deactivated', function(){
      $('.header__back', $element).removeClass('header__back_active');
      $('.header__score', $element).removeClass('header__score_active');
    })
    .on('score-change', function() {
      let score = getScore();
      $('.header__score-num', $element).html( score );
    })
    .on('end-screen:activated', function() {
      $('.header__score-inner', $element).addClass('header__score-inner_end');
    })
    .on('end-screen:deactivated', function() {
      $('.header__score-inner', $element).removeClass('header__score-inner_end');
    })
    .on('page-reset',function(){
      $(eventBus).trigger('score-change');
    });

    $('.header__back', $element).on('click', function(e, data){
      $(eventBus).trigger('reset-page');
    });

  }
}

registerPlugins({
  name: "header",
  Constructor: Header,
  selector: ".header"
});
