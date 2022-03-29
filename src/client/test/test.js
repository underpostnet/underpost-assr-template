
import '/lib/interact.min.js';

class Test {

  constructor(){

    window.dragMoveListener = function(event) {
     const target = event.target,
         // keep the dragged position in the data-x/data-y attributes
         x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
         y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

     // translate the element
     target.style.webkitTransform =
     target.style.transform =
       'translate(' + x + 'px, ' + y + 'px)';

     // update the posiion attributes
     target.setAttribute('data-x', x);
     target.setAttribute('data-y', y);
   };

        for(let i of range(1,2)){

          const over = 'over'+i;
          const obj = 'obj'+i;

          append('render', `

              <div class='in fll `+over+`'
              style='
              width: 300px;
              height: 300px;
              border: 2px solid gray;
              padding: 5px;
              '>

                    <div class='inl `+obj+`'
                    style='
                    cursor: pointer;
                    width: 50px;
                    height: 50px;
                    background: red;
                    z-index: 9999;'>


                    </div>

              </div>


              `);


              interact('.'+over)
                .dropzone({
                  ondrop: function (event) {

                    // s(event.dropzone.target)

                    console.log(' ondrop -> '+event.dropzone.target);
                    console.log(' obj -> '+event.draggable.target);

                    /*

                    const idOnDrop = parseInt(event.dropzone.target.split('over')[1]);
                    const idOnDropEnd = parseInt(event.draggable.target.split('obj')[1]);

                    console.log(' idOnDrop -> ');
                    console.log(idOnDrop);
                    console.log(' idOnDropEnd -> ');
                    console.log(idOnDropEnd);

                    if(idOnDrop != idOnDropEnd){
                      console.warn(' on intercambiable event -> ');
                      s('.obj'+idOnDrop).setAttribute('data-x', s('.over'+idOnDrop)['data-x']);
                      s('.obj'+idOnDrop).setAttribute('data-y', s('.over'+idOnDrop)['data-y']);
                    }

                    */

                  },
                })
                .on('dropactivate', function (event) {
                  event.target.classList.add('drop-activated')
                });



              interact('.'+obj).draggable({
                listeners: { move: window.dragMoveListener },
                inertia: true,
                modifiers: [
                  interact.modifiers.restrictRect({
                  //  restriction: 'parent',
                    endOnly: true
                  })
                ]
              }).on('dragend', () => {

                console.warn(' dragend -> '+obj);

              });

              s('.'+over).ondragover = () => console.log('drag over ->'+over);


        }



  }

}

new Test();
