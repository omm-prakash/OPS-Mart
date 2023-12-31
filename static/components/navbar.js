export default {
        template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary sticky-top" data-bs-theme="dark">
                <div class="container-fluid">
                        <router-link to="/" class="navbar-brand" style="font-family: 'Prompt', sans-serif;">
                                <img src="../static/images/logo-rb.png" width="55" height="30" class="d-inline-block align-top" alt="">
                        </router-link>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                             <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li class="nav-item" v-if="!role"><router-link to="/" v-bind:class="$route.name=='home'?'nav-link active':'nav-link'"><i class="bi bi-house-heart"></i> Home</router-link></li>
                                        <li class="nav-item" v-if="!role"><router-link to="/privacy" :class="$route.name=='privacy'?'nav-link active':'nav-link'"><i class="bi bi-shield-check"></i> Privacy Policy</router-link></li>
                                        
                                        <li class="nav-item" v-if="role=='admin'"><router-link to="/admin/managers" v-bind:class="$route.name=='admin/managers'?'nav-link active':'nav-link'"><i class="bi bi-person-lines-fill"></i> Manager</router-link></li>
                                        <li class="nav-item" v-if="role=='admin'"><router-link to="/admin/customers" v-bind:class="$route.name=='admin/customers'?'nav-link active':'nav-link'"><i class="bi bi-people"></i> Customer</router-link></li>
                                        <li class="nav-item" v-if="role=='admin' "><router-link to="/admin/category" v-bind:class="$route.name=='admin/category'?'nav-link active':'nav-link'"><i class="bi bi-card-checklist"></i> Category</router-link></li>
                                        <li class="nav-item" v-if="role=='admin'"><router-link to="/admin/transaction" v-bind:class="$route.name=='admin/transaction'?'nav-link active':'nav-link'"><i class="bi bi-receipt-cutoff"></i> Transactions</router-link></li>

                                        <li class="nav-item" v-if="role=='manager'">
                                                <router-link to="/manager/products" v-bind:class="$route.name=='manager/products' || $route.name=='manager/add_product'  ?'nav-link active':'nav-link'"><i class="bi bi-list-check"></i> Product</router-link>
                                        </li>
                                        <li class="nav-item" v-if="role=='manager'"><router-link to="/manager/category" v-bind:class="$route.name=='manager/category'?'nav-link active':'nav-link'"><i class="bi bi-card-checklist"></i> Category</router-link></li>
                                        <li class="nav-item" v-if="role=='manager'"><router-link to="/manager/transaction" v-bind:class="$route.name=='manager/transaction'?'nav-link active':'nav-link'"><i class="bi bi-receipt-cutoff"></i> Transactions</router-link></li>

                                        <li class="nav-item" v-if="role=='customer'"><router-link to="/customer/mart" v-bind:class="$route.name=='customer/mart'?'nav-link active':'nav-link'"><i class="bi bi-shop-window"></i> Mart</router-link></li>
                                        <li class="nav-item" v-if="role=='customer'"><router-link to="/customer/cart" v-bind:class="$route.name=='customer/cart'?'nav-link active':'nav-link'"><i class="bi bi-cart"></i> Cart</router-link></li>
                                        <li class="nav-item" v-if="role=='customer'"><router-link to="/customer/transaction" v-bind:class="$route.name=='customer/transaction'?'nav-link active':'nav-link'"><i class="bi bi-receipt-cutoff"></i> Transactions</router-link></li>

                                </ul>

                                
                                <!-- Account Setup -->
                                <div class="nav-item mx-3" v-if="!is_login">
                                        <button class="btn btn-success" type="">
                                                <router-link to="/login" class="nav-link bright">Login</router-link>
                                        </button>
                                </div>
                                
                                <!-- Account Setup -->
                                <div class="nav-item" v-if="!is_login">
                                        <button class="btn btn-danger" type="">
                                                <router-link to="/register" class="nav-link bright">Register</router-link>
                                        </button>
                                </div>
                                <div class="nav-item" v-if="is_login">
                                        <button class="btn btn-outline-danger rounded" @click="logout"><i class="bi bi-power" style="font-size: 17px;"></i></button>
                                </div>
                        </div>
                </div>
        </nav>        
        `,
        data(){
                return{
                        role: localStorage.getItem("role"),
                }
                
        },
        computed: {
                is_login(){
                        return localStorage.getItem("auth-token")?true:false
                },
        },
        methods: {
                logout(){
                        localStorage.removeItem("role");
                        localStorage.removeItem("auth-token");
                        this.$router.push({path:"/login"});
                },
        },
}
