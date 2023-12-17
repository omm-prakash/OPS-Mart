export default {
        template: `
        <div class="container-fluid">
                <div class="row">
                        <!-- Image Section (40% width) -->
                        <div class="col-md-5 p-0" style="height: 94vh;">
                                <img src="./static/images/manager.jpg" alt="Your Image" class="img-fluid h-100 w-100">
                        </div>
                        <!-- Content Section (60% width) -->
                        <div class="col-md-7">
                                <div class="content-container p-4">
                                        <div>
                                                <h1 v-if="userData">Welcome, {{ user.username }} </h1>
                                                <h1 v-else>Welcome, Prospective Manger </h1>
                                                <div class="text-muted">
                                                        <ul class="list-unstyled px-3">
                                                        <li v-if="userData"><strong>Email:</strong> {{ user.email }} </li>
                                                        <li><strong>Account Status:</strong> 
                                                                <span v-if="user.active" class="text-success"> Active </span>
                                                                <span v-else class="text-danger"> Inactive </span>
                                                        </strong>
                                                        </li>
                                                        
                                                        <li v-if="userData"class="mb-0"><strong>Role:</strong> {{ user.roles }}, OPS Mart</li>
                                                        </ul>
                                                        <p v-if="!userData" class="text-primary"> Please contact admit to activate your account. </p>
                                                        <!-- <p >"The only way to do great work is to love what you do." - Steve Jobs</p> -->
                                                </div>
                                        </div>
                                        <hr>
                                        <p style="text-align: justify;">As the manager of the web market, you're not just steering a ship; you're navigating uncharted waters of innovation. Embrace the challenges as opportunities and let your strategic vision guide the sails. Your leadership is the compass that directs the team toward success, turning obstacles into stepping stones for growth. In this dynamic digital realm, inspire creativity, foster collaboration, and blaze a trail of excellence.</p>
                                        <p style="text-align: justify;">Hello, I am Omm Prakash, the director of this amazing platform. I believe in the power of innovation and collaboration to create something extraordinary.</p>
                                        <h4 class="text-primary">Manager Privileges</h4>
                                        <p class="text-muted">Core Category Management</p>
                                        <!-- <hr> -->
                                        <div class="container">
                                                <ul>
                                                        <li>Create New Product <ul>
                                                                        <li>Storage handles multiple languages (usually UTF-8 encoding)</li>
                                                                </ul>
                                                        </li>
                                                        <li>Edit Product <ul>
                                                                        <li>Change title or description</li>
                                                                </ul>
                                                        </li>
                                                        <li>Remove Product <ul>
                                                                        <li>Delete product</li>
                                                                </ul>
                                                        </li>
                                                        <li>Requests To Admin <ul>
                                                                        <li>Add new categories, edit, or delete existing categories</li>
                                                                </ul>
                                                        </li>
                                                </ul>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
        `,
        data(){
                return{
                        user: {
                                id: null,
                                username: null,
                                email: null,
                                active: null,
                                roles: null
                        },
                        userData: false,
                        token: localStorage.getItem("auth-token")
                }
        },
        computed: {
                is_login(){
                        // console.log(this.userData)
                        return this.userData?true:false
                }
        },
        async beforeMount() {
                const res = await fetch("/api/profile", {
                        headers: {
                                "Authentication-Token": this.token
                        },
                })
                const data = await res.json().catch((e)=>{})
                if(res.ok){
                        if (data){
                                this.user = data;
                                this.userData = true;
                        }
                }
        },

}