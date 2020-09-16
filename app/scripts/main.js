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

  $.getJSON('data/data.json', function (data) {

    // console.log(JSON.parse((JSON.stringify(data))));
    let newData = upgradeData(data);
    console.log(newData);
  });

  function upgradeData(data) {
    data = JSON.parse((JSON.stringify(data)));
    let newData = {};

    getProp(data);
 
    return newData;

    	
    function getProp(o) {
      for (let prop in o) {
          if (typeof(o[prop]) === 'object') {
            getProp(o[prop]);
          } else {
            let id = o["id"];
            if (!newData[id]) newData[id] = {};
            newData[id][prop] = o[prop];
          }
      }
    }
  }
}


function isDocumentReady() {
  let def = $.Deferred();

  $(document).ready(()=>def.resolve());

  return def.promise();
}
