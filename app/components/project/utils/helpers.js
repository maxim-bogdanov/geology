// рандомное число
export function randomNumber(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

export function drawdash(x0,y0,x1,y1,linewidth){
  var dashed = new PIXI.Graphics();
  dashed.lineStyle(1, 0x59e3e8, 1); // linewidth,color,alpha
  dashed.moveTo(0, 0);
  dashed.lineTo(linewidth,0);
  dashed.moveTo(linewidth*1.5,0);
  dashed.lineTo(linewidth*2.5,0);
  var dashedtexture = dashed.generateCanvasTexture(1,1);
  var linelength=Math.pow(Math.pow(x1-x0,2) + Math.pow(y1-y0,2) , 0.5);
  var tilingSprite = new PIXI.extras.TilingSprite(dashedtexture, linelength, linewidth);
  tilingSprite.x=x0;
  tilingSprite.y=y0;
  tilingSprite.rotation = angle(x0,y0,x1,y1)*Math.PI/180;
  tilingSprite.pivot.set(linewidth/2, linewidth/2);
  return tilingSprite;
  function angle(x0,y0,x1,y1){
          var diff_x = Math.abs(x1 - x0),
              diff_y = Math.abs(y1 - y0);
          var cita;
         if(x1>x0){
              if(y1>y0){
                  cita= 360*Math.atan(diff_y/diff_x)/(2*Math.PI);
              }else
             {
                  if(y1<y0){ 
                      cita=-360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                  }else{  
                      cita=0;
                  }
              }
          }else
          {
              if(x1<x0){
                  if(y1>y0){
                      cita=180-360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                  }else
                  {
                      if(y1<y0){ 
                          cita=180+360*Math.atan(diff_y/diff_x)/(2*Math.PI);
                      }else{  
                          cita=180;
                      }
                  } 
              }else{ 
                  if(y1>y0){ 
                      cita=90;
                  }else
                  {
                      if(y1<y0){ 
                          cita=-90;
                      }else{  
                          cita=0;
                      }
                  }
              }
          }
          return cita;
  }
}