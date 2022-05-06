

class Notifi {

  constructor(){


        notifi.load({
               divContent: 'render',
        			 AttrRender: {
        				 error: `

        							<i class="fas fa-times" style='font-size: `+window.underpost.theme.fontSize._h1+`; color: red;'></i>

        				 `,
        				 success: `

        						<i class="fas fa-check" style='font-size: `+window.underpost.theme.fontSize._h1+`; color: green;'></i>

        				 `
        			 },
        			 style: {
        				 notifiValidator: `
        				 border-radius: 10px;
        				 /* border: 2px solid yellow; */
        				 color: white;
        				 z-index: `+window.underpost.styles.zIndex.notifiValidator+`;
        				 height: 50px;
        				 transform: translate(-50%, 0);
                 bottom: 10px;
        				 left: 50%;
        				 width: 300px;
        				 `,
        				 notifiValidator_c1: `
        				 width: 80px;
        				 height: 100%;
        				 /* border: 2px solid blue; */
        				 top: 0%;
        				 left: 0%;
        				 `,
        				 notifiValidator_c2: `
        				 height: 100%;
        				 /* border: 2px solid blue; */
        				 top: 0%;
        				 left: 80px;
        				 width: 220px;
        				 `

        			 }
        		 });





  }
}


export { Notifi };
