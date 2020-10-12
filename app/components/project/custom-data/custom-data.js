import { eventBus, setData } from '../../../components/project/utils/shared';
import {
  registerPlugins,
  Plugin
} from "../../framework/jquery/plugins/plugins";

class CustomData  {

  constructor() {
    const countX = {
      left: 0,
      right: 0
    };
  
    const countY = {
      left: [0],
      right: [0]
    };
  
    let newData = {};
  
    $.getJSON('data/data.json', (data) => {
  
      upgradeData(data);
      calcCountY(newData);
  
      let dataKeys = Object.keys(newData);
      dataKeys.sort(sortData);
  
      addPointsToDataBoth(dataKeys);
      this.setData(newData);
      // setData(newData);
  
      console.log(newData);
      // console.log(newData);
      // for (let elem of dataKeys){
      //   console.log(elem + ' ' + ' x: ' + newData[elem].x + ' y: ' + newData[elem].y);
      // }

    });
  
  
    function sortData(a, b) {
      if ( 
        (b !== '0')
        && ((a[0] !== '-') && (b[0] === '-')
        || (a.length > b.length) && (a[0] === b[0]) && (a[0] === '-')
        || (a.length == b.length) && (a > b) && (a[0] === b[0]) 
        || (a.length > b.length) && (b[0] !== '-') && (a[0] !== '-')
        || (a.length == b.length) && (a > b) && (b[0] !== '-') && (a[0] !== '-')
        )
      ) return 1;
      else return -1;
    }
  
    function addPointsToDataBoth(dataKeys) {
      let k = 0;
  
      addPointToData('left');
      addPointToData('right');
  
      newData[0].x = 0;
      newData[0].y = 0;
  
      function addPointToData(side) {
        for (let i = 1; i <= countY[side].length; i++) {
          let yStep = 1 / countY[side][i];
          let xStep = 0.5 / countX[side];
  
          let centerY = 0;
          let centerX = 0;
  
          for (let item = 1; item <= countY[side][i]; item++) {
            if (item > countY[side][i] / 2) centerY = 1;
            centerX = (side == 'left') ? -1 : 1;
  
            newData[dataKeys[k]].y = 0.5 - (item - 1 + centerY) * yStep;
            
            if (!newData[dataKeys[k]].children) {
              const style = newData[dataKeys[k]].y > 0 ? 'childDown' : 'childUp'; 
              newData[dataKeys[k]].style = style;
            } else {
              newData[dataKeys[k]].style = 'parent';
            }
            newData[dataKeys[k]].x = i * xStep * centerX;
            k++;
          }
        }
      }
    }
  
  
    function calcCountY(data) {
  
      for (const key in data) {
        if (key[0] === '-') {
          if (countY.left[key.length - 1] == null)
            countY.left[key.length - 1] = 0;
  
          countY.left[key.length - 1]++;
        } else if (key[0] !== '0') {
          if (countY.right[key.length] == null)
            countY.right[key.length] = 0;
  
          countY.right[key.length]++;
        }
      }
    }
  
    function upgradeData(data) {
      data = JSON.parse((JSON.stringify(data)));
      let parentId;

      getProp(data);


      function getProp(o) {
        for (let prop in o) {
            if (o[prop].children) {
              let id = o[prop].id;
              if (!newData[id]) {
                newData[id] = {};
                newData[id].children = [];
              }
              
              for (let item of o[prop].children) {
                newData[id].children.push(item.id);
              }
            }
            if (typeof(o[prop]) === 'object') {
              getProp(o[prop]);
            } else {
              let id = o["id"];
  
              calcDepthX(id);
  
              if (!newData[id]) newData[id] = {};
              newData[id][prop] = o[prop];
            }
        }
      }
  
      function calcDepthX(id) {
        if (id[0] === '-') {
          if (id.length - 1 > countX.left) {
            countX.left = id.length - 1;
          }
        }
        else if (id[0] !== '0' && id.length > countX.right) {
          countX.right = id.length;
        }
      }
    }
  }

  setData(data) {
    this.newData = data;
  }

  getData() {
    return this.newData;
  }

}

const data = new CustomData();

export default data;
