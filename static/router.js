import home from "./components/home.js"
import login from "./components/login.js"
import register from "./components/register.js"


const routes = [{
        path: '/',
        component: home,
}, {
        path: '/login',
        component: login,
}, {
        path: '/register',
        component: register,
}
]
export default new VueRouter({
        routes,
})


// export default router