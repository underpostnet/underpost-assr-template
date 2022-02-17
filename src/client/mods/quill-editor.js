import '/quill/js/katex.min.js';
import '/quill/js/highlight.min.js';
import '/quill/js/quill.min.js';

class QuillEditor {

  constructor(){

      // tengo acceso a vanilla

      append('body', `
      <link rel='stylesheet' href='/quill/css/katex.css' />
      <link rel='stylesheet' href='/quill/css/monokai-sublime.min.css' />
      <link rel='stylesheet' href='/quill/css/quill.snow.css' />

      <style>

      tr, td {
        border: 1px solid black;
      }

      td {
        min-width: 100px;
      }

      </style>

      `);

      append('body', `




        <div id='standalone-container' style='background: #ebeceb; color: black;'>
          <div id='toolbar-container'>
            <span class='ql-formats'>
              <select class='ql-font'></select>
              <select class='ql-size'></select>
            </span>
            <span class='ql-formats'>
              <button class='ql-bold'></button>
              <button class='ql-italic'></button>
              <button class='ql-underline'></button>
              <button class='ql-strike'></button>
            </span>
            <span class='ql-formats'>
              <select class='ql-color'></select>
              <select class='ql-background'></select>
            </span>
            <span class='ql-formats'>
              <button class='ql-script' value='sub'></button>
              <button class='ql-script' value='super'></button>
            </span>
            <span class='ql-formats'>
              <button class='ql-header' value='1'></button>
              <button class='ql-header' value='2'></button>
              <button class='ql-blockquote'></button>
              <button class='ql-code-block'></button>
            </span>
            <span class='ql-formats'>
              <button class='ql-list' value='ordered'></button>
              <button class='ql-list' value='bullet'></button>
              <button class='ql-indent' value='-1'></button>
              <button class='ql-indent' value='+1'></button>
            </span>
            <span class='ql-formats'>
              <button class='ql-direction' value='rtl'></button>
              <select class='ql-align'></select>
            </span>
            <span class='ql-formats'>
              <button class='ql-link'></button>
              <button class='ql-image'></button>
              <button class='ql-video'></button>
              <button class='ql-formula'></button>
            </span>
            <span class='ql-formats'>
              <button class='ql-clean'></button>
            </span>
            <span class='ql-formats'>
              <button class='ql-table'></button>
            </span>
          </div>
          <div id='editor-container' >test</div>
        </div>


          <button id='insert-table'>Insert Table</button>
          <button id='insert-row-above'>Insert Row Above</button>
          <button id='insert-row-below'>Insert Row Below</button>
          <button id='insert-column-left'>Insert Column Left</button>
          <button id='insert-column-right'>Insert Column Right</button>
          <button id='delete-row'>Delete Row</button>
          <button id='delete-column'>Delete Column</button>
          <button id='delete-table'>Delete Table</button>

          <div class='inl get-content'
              style='
              cursor: pointer;
              color: red;
              padding: 5px;
              border: 2px solid yellow;
          '>
              GET CONTENT
           </div>




      `);


            const snow = new Quill('#editor-container', {
              modules: {
                syntax: true,
                toolbar: '#toolbar-container',
                /*imageResize: {
                  displaySize: true
                },*/
                table: true
              },
              placeholder: 'Compose an epic...',
              theme: 'snow'
              // theme: 'snow'
              // readOnly: true
            });




        const table = snow.getModule('table');


        s('#insert-table').onclick = () => {
          table.insertTable(2, 2);
        };
        s('#insert-row-above').onclick = () => {
          table.insertRowAbove();
        };
        s('#insert-row-below').onclick = () => {
          table.insertRowBelow();
        };
        s('#insert-column-left').onclick = () => {
          table.insertColumnLeft();
        };
        s('#insert-column-right').onclick = () => {
          table.insertColumnRight();
        };
        s('#delete-row').onclick = () => {
          table.deleteRow();
        };
        s('#delete-column').onclick = () => {
          table.deleteColumn();
        };
        s('#delete-table').onclick = () => {
          table.deleteTable();
        };

        s('.get-content').onclick = () => {
          /*
          s('.ql-editor').innerHTML
          console.log(" 1 ->");
          console.log(sa(".ql-editor")[0].innerHTML);
          console.log(" 2 ->");
          console.log(sa(".ql-editor")[1].innerHTML);
          */
          console.log(s('.ql-editor').innerHTML);
        }

  }

}

export { QuillEditor };
