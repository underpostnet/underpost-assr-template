

class UnderpostSW {
  constructor(){
    window.addEventListener('load', () => {

      if('serviceWorker' in navigator) {
        navigator.serviceWorker
                .register('/sw.js')
                .then( () => {

                    console.warn('[Service Worker] Already Registered');

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
