

class UnderpostSW {
  constructor(){
    window.addEventListener('load', () => {

      if('serviceWorker' in navigator) {
        navigator.serviceWorker
                .register('/sw.js')
                .then( () => {

                   console.warn('Service Worker Registered');

                })
                .catch( error => {

                    console.error('Service Worker Error');
                    console.error(error);

                })
                .finally( () => {
                    console.warn('Service Worker Finally Load');

                });
      }else{
        console.warn('Disabled Service Worker');
      }

    });
    
  }
}

export { UnderpostSW };
