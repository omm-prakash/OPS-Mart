import router from './router.js'
import navbar from './components/navbar.js'

const allowedNavigations = ['login', 'register', 'home']
router.beforeEach((to,from,next)=>{
        // if(to.name!='login' && !localStorage.getItem('auth-token')?true:false) next({name:'login'})
        if(!allowedNavigations.includes(to.name) && !localStorage.getItem('auth-token')?true:false) next({name:'login'})
        else next()
})

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