export default {
        template: `
        <div class="container bg-light p-5 my-3">
                <h2 style="font-family: 'Prompt', sans-serif;"><strong>Sign Up</strong></h2>
                <hr>
                <form class="row g-3">
                        <div class=" form-group">
                                <label for="user-name" class="form-label">User name</label>
                                <input type="text" class="form-control" id="user-name" placeholder="Your name" v-model="credential.username">
                        </div>
                        <div class="form-group col-md-6">
                                <label for="user-email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="user-email" placeholder="Enter email" v-model="credential.email">
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div class="form-group col-md-6">
                                <label for="user-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="user-password" placeholder="Password" v-model="credential.password">
                        </div>
                        <!-- <fieldset class="row mb-3"> -->
                        <legend class="col-form-label col-sm-1 pt-0">Role</legend>
                        <div class="col-sm-6">
                                <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="role" id="role-manager" value="manager" v-model="credential.role">
                                        <label class="form-check-label text-muted" for="role-manager">Manager</label>
                                </div>
                                <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="role" id="role-customer" value="customer" v-model="credential.role">
                                        <label class="form-check-label text-muted" for="role-customer">Customer</label>
                                </div>
                        </div>
                        <!-- </fieldset> -->
                        <br><br>
                        <button @click='register' class="btn btn-primary">Sign Up</button>
                        <small class="form-text text-muted mx-2">Already have an account? Click <router-link to="/login">here</router-link> to login.</small>
                </form>
        </div>
        `,
        data() {
                return {
                        credential: {
                                email: null,
                                password: null,
                                username: null,
                                role: null,
                        },
                        error: null
                }
        },
        methods: {
                async register() {
                        // console.log(this.credential)
                        const res = await fetch('/user-register', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(this.credential),
                        })
                        const data = await res.json();
                        console.log(data)
                        if (res.ok) {
                                console.log(data)
                                if (data.token) {
                                        localStorage.setItem('auth-token', data.token)
                                        localStorage.setItem('role', data.role)
                                }
                        } else {
                                this.error = data.message
                        }
                }
        }
}