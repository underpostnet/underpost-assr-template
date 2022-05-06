

class Footer {

  constructor(){

        append('render', `
                <br><br>
                `+spr(' ', 5)+`<a href='https://underpost.net' alt='underpost.net' >Powered By UNDERpost.net</a>
                <br><br>
        `);

        mod_scroll.init(s('html'), false, scroll => {
            //  all div display have should be a 'in' class
            getKeys(window.underpost.scroll).map( key => {
              window.underpost.scroll[key](scroll);
            })
        });

  }
}

export { Footer };
