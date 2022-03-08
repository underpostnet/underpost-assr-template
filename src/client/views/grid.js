
import '/lib/interact.min.js';

class Test {

  constructor(){



    append('body', `



        <div class='in grid-content' style='margin: 5px; width: 300px; height: 300px; background: white;'

        </div>

    `);

        const xDim = 9;
        const yDim = 9;
        const long = s('.grid-content').clientHeight/xDim;

        for(let x of range(0, xDim)){
          for(let y of range (0, yDim)){
              append('.grid-content', `


                    <div class='in fll grid-`+x+`-`+y+`' style='
                    width: `+long+`px;
                    height: `+long+`px;
                    background: `+(y%2==0?'gray':'black')+`;
                    '>

                    </div>


              `);


          }
        }


        for(let x of range(0, xDim-1)){
          for(let y of range (0, yDim+1)){
            append('.grid-content', `

                    <div class='abs test-`+x+`-`+y+`'
                              style='
                                  width: `+long*0.8+`px;
                                  height: `+long*0.8+`px;
                                  top: `+(long*y)+`px;
                                  left: `+(long*x)+`px;
                                  background: red;
                                  cursor: pointer;
                                '>

                    </div>

            `);

            dragDrop('.test-'+x+'-'+y);

          }
        }




  }

}

new Test();
