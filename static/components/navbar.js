export default {
        template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary navbar-fixed-top" data-bs-theme="dark">
                <div class="container-fluid">
                        <router-link to="/" class="navbar-brand" style="font-family: 'Prompt', sans-serif;">
                                <img src="../static/images/logo-rb.png" width="55" height="30" class="d-inline-block align-top" alt="">
                        </router-link>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li class="nav-item"><router-link to="/" v-bind:class="$route.name=='home'?'nav-link active':'nav-link'">Home</router-link></li>
                                        <li class="nav-item" v-if="!role"><router-link to="/about" class="nav-link">About</router-link></li>
                                        <li class="nav-item" v-if="!role"><router-link to="/privacy-policy" class="nav-link active">Privacy Policy</router-link></li>
                                        <li class="nav-item" v-if="role=='admin'"><router-link to="/admin/managers" v-bind:class="$route.name=='admin/managers'?'nav-link active':'nav-link'">Managers</router-link></li>
                                        <li class="nav-item" v-if="role=='admin'"><router-link to="/admin/customers" v-bind:class="$route.name=='admin/customers'?'nav-link active':'nav-link'">Customers</router-link></li>
                                        <li class="nav-item" v-if="role=='admin'"><router-link to="/admin/category" v-bind:class="$route.name=='admin/category'?'nav-link active':'nav-link'">Category</router-link></li>
                                        </ul>
                                <!-- Search Bar -->
                                <form class="d-flex mx-auto" role="search" v-if="role=='customer'">
                                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                                        <button class="btn btn-outline-success" type="submit">Search</button>
                                </form>
                                
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
                                        <button class="btn btn-danger" @click="logout">Logout</button>
                                </div>
                        </div>
                </div>
        </nav>        
        `,
        data(){
                return{
                        role: localStorage.getItem("role"),
                        // is_login: localStorage.getItem("auth-token")?true:false
                }
                
        },
        computed: {
                is_login(){
                        return localStorage.getItem("auth-token")?true:false
                }
        },
        methods: {
                logout(){
                        localStorage.removeItem("role");
                        localStorage.removeItem("auth-token");
                        this.$router.push({path:"/login"});
                }
        }
}