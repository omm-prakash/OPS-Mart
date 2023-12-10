import router from './router.js'
import navbar from './components/navbar.js'

var app = new Vue({
        el: "#app",
        // template: `<div> 
        //         <navbar />
        //         <router-view /> 
        // </div>`,
        router: router,
        components: {
                navbar,
        }
})