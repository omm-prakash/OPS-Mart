export default {
        template: `   
        <div class="container p-3">
        <div class="card mb-3 bg-light">
                <div class="row g-0">
                        <div class="col-md-5">
                                <img src="./static/images/base-product.jpg" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-7">
                                <div class="card-body">
                                        <div class="m-2">
                                                <h3 style="font-family: 'Prompt', sans-serif;"><strong>Sign In</strong></h3>
                                                <small class="form-text text-danger">{{ this.error }}</small>
                                                <hr>
                                                <form>
                                                        <div class="row mb-3">
                                                                <label for="user-email" class="col-form-label col-sm-3">Email address</label>
                                                                <div class="col-sm-9">
                                                                        <input type="email" class="form-control" id="user-email" placeholder="Enter email" v-model="credential.email">
                                                                </div>
                                                                <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
                                                        </div>
                                                        <div class="row mb-3">
                                                                <label for="user-password" class="col-form-label col-sm-3">Password</label>
                                                                <div class="col-sm-9">
                                                                        <input type="password" class="form-control" id="user-password" placeholder="Password" v-model="credential.password">
                                                                </div>
                                                        </div>
                                                        <br>
                                                        <button @click='login' class="btn btn-primary">Login</button>
                                                        <small class="form-text text-muted mx-2">Don't have an account? Click <router-link to="/register">here</router-link> to signup.</small>
                                                </form>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
        </div>

        `,
        data(){
                return {
                        credential: {
                                email: null,
                                password: null
                        },
                        error: null
                }
        },
        methods: {
                async login(){
                        // console.log(this.credential)
                        const res = await fetch('/user-login', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(this.credential),
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){                                
                                if(data.token){
                                        localStorage.setItem('auth-token',data.token)
                                        localStorage.setItem('role',data.role)
                                        this.$router.push({path: '/'} )
                                }
                        }else{
                                console.log(data)
                                if(data.token){
                                        this.error = data.message
                                }
                        }
                }
        }
}

// garbage login template
// <div class="container bg-light p-3 my-3">
// <h3 style="font-family: 'Prompt', sans-serif;"><strong>Sign In</strong></h3>
// <small class="form-text text-danger">{{ this.error }}</small>
// <hr>
// <form>
//         <div class="form-group">
//                 <label for="user-email" class="form-label">Email address</label>
//                 <input type="email" class="form-control" id="user-email" placeholder="Enter email" v-model="credential.email">
//                 <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
//         </div>
//         <div class="form-group my-2">
//                 <label for="user-password" class="form-label">Password</label>
//                 <input type="password" class="form-control" id="user-password" placeholder="Password" v-model="credential.password">
//         </div>
//         <br>
//         <button @click='login' class="btn btn-primary">Login</button>
//         <small class="form-text text-muted mx-2">Don't have an account? Click <router-link to="/register">here</router-link> to signup.</small>
// </form>
// </div>   
