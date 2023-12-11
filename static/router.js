import home from "./components/home.js"
import login from "./components/login.js"
import register from "./components/register.js"
import admin_managers from "./components/admin/managers.js" 
import admin_customers from "./components/admin/customers.js" 
import admin_category from "./components/admin/category.js" 


const routes = [{
        path: '/',
        component: home,
        name: 'home',
}, {
        path: '/login',
        component: login,
        name: 'login'
}, {
        path: '/register',
        component: register,
        name: 'register'
}, {
        path: '/admin/managers',
        component: admin_managers,
        name: 'admin/managers'
}, {
        path: '/admin/customers',
        component: admin_customers,
        name: 'admin/customers'
}, {
        path: '/admin/category',
        component: admin_category,
        name: 'admin/category'
}
]
export default new VueRouter({
        routes,
})


// export default router