import data from '../components/project/custom-data/custom-data'
import { eventBus } from '../components/project/utils/shared';
import '../components/project/project';
import $ from 'jquery';

global.jQuery = global.$ = $;



$.when(isDocumentReady())
  .done(onDocumentReady);

function onDocumentReady() {
  if ($.fn.initPlugins) {
    $(document.body).initPlugins();
  }

  $(document.documentElement).trigger("document:ready");

  $(eventBus).on('change-focus', function(e, coord){
    $(eventBus).trigger('focus-changed', coord);
  })
  // console.log(data);
}


function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(()=>def.resolve());

  return def.promise();
}
