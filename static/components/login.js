export default {
        template: `
        <div class="container bg-light p-3 my-3">
                <h3 style="font-family: 'Prompt', sans-serif;"><strong>Sign In</strong></h3>
                <small class="form-text text-danger">{{ this.error }}</small>
                <hr>
                <form>
                        <div class="form-group">
                                <label for="user-email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="user-email" placeholder="Enter email" v-model="credential.email">
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div class="form-group my-2">
                                <label for="user-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="user-password" placeholder="Password" v-model="credential.password">
                        </div>
                        <br>
                        <button @click='login' class="btn btn-primary">Login</button>
                        <small class="form-text text-muted mx-2">Don't have an account? Click <router-link to="/register">here</router-link> to signup.</small>
                </form>
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
                        const data = await res.json();
                        if(res.ok){                                
                                if(data.token){
                                        localStorage.setItem('auth-token',data.token)
                                        localStorage.setItem('role',data.role)
                                        this.$router.push({path: '/'} )
                                }
                        }else{
                                this.error = data.message
                        }
                }
        }
}
