

class UnderpostSW {
  constructor(){
    window.addEventListener('load', () => {

      if('serviceWorker' in navigator) {
        navigator.serviceWorker
                .register('/sw.js')
                .then( () => {

                    console.warn('[Service Worker] Already Registered');

                    navigator.serviceWorker.addEventListener('message', event => {
                      console.log('serviceWorker  msg ->');
                      console.log(event.data);
                    });

                })
                .catch( error => {

                    console.error('[Service Worker] Error');
                    console.error(error);

                })
                .finally( () => {
                    console.warn('[Service Worker] Finally Load');

                });
      }else{
        console.warn('[Service Worker] Disabled');
      }

    });

  }

  uninstall(){
    navigator.serviceWorker.getRegistrations().then((registrations) => {
     for(let registration of registrations) {
      console.warn('[Service Worker] Uninstall');
      registration.unregister()
    } })
  }
}

export { UnderpostSW };
