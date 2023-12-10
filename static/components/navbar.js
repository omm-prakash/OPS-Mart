export default {
        template: `
        <nav class="navbar navbar-expand-lg bg-body-tertiary bg-primary" data-bs-theme="dark">
                <div class="container-fluid">
                        <router-link to="/" class="navbar-brand" style="font-family: 'Prompt', sans-serif;">
                                <img src="../static/images/logo-rb.png" width="55" height="30" class="d-inline-block align-top" alt="">
                                
                        </router-link>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li class="nav-item"><router-link to="/" class="nav-link active">Home</router-link></li>
                                        <li class="nav-item"><router-link to="/about" class="nav-link">About</router-link></li>
                                        <li class="nav-item"><router-link to="/privacy-policy" class="nav-link active">Privacy Policy</router-link></li>
                                </ul>
                                <!-- Search Bar -->
                                <form class="d-flex mx-auto" role="search">
                                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                                        <button class="btn btn-outline-success" type="submit">Search</button>
                                </form>
                                
                                <!-- Account Setup -->
                                <div class="nav-item mx-3">
                                        <button class="btn btn-success" type="">
                                                <router-link to="/login" class="nav-link bright">Login</router-link>
                                        </button>
                                </div>
                                
                                <!-- Account Setup -->
                                <div class="nav-item">
                                        <button class="btn btn-danger" type="">
                                                <router-link to="/register" class="nav-link bright">Register</router-link>
                                        </button>
                                </div>
                                <!-- Cart Setup -->
                                <!-- <div class="nav-item">
                                <router-link to="/login" class="nav-link bright">Login</router-link>
                        </div> -->
                        </div>
                </div>
        </nav>        
        `
}