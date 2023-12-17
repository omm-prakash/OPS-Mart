import router from './router.js'
import navbar from './components/navbar.js'

const allowedNavigations = ['login', 'register', 'home', 'privacy']
router.beforeEach((to,from,next)=>{
        if(!allowedNavigations.includes(to.name) && !localStorage.getItem('auth-token')?true:false) next({name:'login'})
        else next()
})

var app = new Vue({
        el: "#app",
        template: `
        <div> 
                <navbar :key='has_changed'></navbar>
                <router-view></router-view>
        </div>
        `,
        data(){
                return{
                        has_changed: true
                }
        },
        watch: {
                $route(to,from){
                        this.has_changed = !this.has_changed;
                }
        },
        router: router,
        components: {
                navbar,
        }
})