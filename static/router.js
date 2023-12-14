import home from "./components/home.js"
import login from "./components/login.js"
import privacy from "./components/privacy.js"
import register from "./components/register.js"

// admin pages
import admin_managers from "./components/admin/managers.js" 
import admin_customers from "./components/admin/customers.js" 
import admin_category from "./components/admin/category.js" 
import admin_transaction from "./components/admin/transaction.js" 

// manager pages
import manager_products from "./components/manager/products.js" 
import manager_add_product from "./components/manager/add_product.js" 
import manager_category from "./components/manager/category.js" 
import manager_transaction from "./components/manager/transaction.js" 

// customer pages
import mart from "./components/customer/mart.js" 
import cart from "./components/customer/cart.js" 
import transaction from "./components/customer/transaction.js" 


const routes = [{
        path: '/',
        component: home,
        name: 'home',
}, {
        path: '/login',
        component: login,
        name: 'login'
}, {
        path: '/privacy',
        component: privacy,
        name: 'privacy'
}, {
        path: '/register',
        component: register,
        name: 'register'
}, {
        // admin
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
}, {
        path: '/admin/transaction',
        component: admin_transaction,
        name: 'admin/transaction'
}, {
        // manager
        path: '/manager/products',
        component: manager_products,
        name: 'manager/products'
}, {
        path: '/manager/add_product',
        component: manager_add_product,
        name: 'manager/add_product'
}, {
        path: '/manager/category',
        component: manager_category,
        name: 'manager/category'
},{
        path: '/manager/transaction',
        component: manager_transaction,
        name: 'manager/transaction'
},{
        // customer
        path: '/customer/mart',
        component: mart,
        name: 'customer/mart'
},{
        path: '/customer/cart',
        component: cart,
        name: 'customer/cart'
},{
        path: '/customer/transaction',
        component: transaction,
        name: 'customer/transaction'
}
]
export default new VueRouter({
        routes,
})


// export default router