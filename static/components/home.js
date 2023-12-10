import manager from "./manager.js";
import admin from "./admin.js";
import customer from "./customer.js";

export default {
        template: `
        <div>
                <admin v-if="userRole=='admin'" />
                <manager v-if="userRole=='manager'" />
                <customer v-if="userRole=='customer'" />
                <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel" v-if="!userRole">
                        <div class="carousel-inner" style="height: 70vh;">
                                <div class="carousel-item active">
                                        <img src="../static/images/santa.jpg" class="d-block w-100" alt="..." style="height: 70vh;">
                                        <div class="carousel-caption d-none d-md-block text-white">
                                                <h2>OPS Mart's<strong class="text-danger" style="font-family: 'Prompt', sans-serif;"> Christmas Cheer</strong>: 10% Off!</h2>
                                                <p>Celebrate Christmas with joy, shop gifts that sparkle and delight today!</p>
                                        </div>
                                </div>
                                <div class="carousel-item">
                                        <img src="../static/images/new-year.jpg" class="d-block w-100" alt="..." style="height: 70vh;">
                                        <div class="carousel-caption d-none d-md-block text-dark">
                                                <h2>Celebrate This <strong class="text-danger" style="font-family: 'Prompt', sans-serif;">New Year</strong> With Us</h2>
                                                <p>Ring in the New Year with style! Shop resolutions, dreams, and happiness.</p>
                                        </div>
                                </div>
                                <div class="carousel-item">
                                        <img src="../static/images/republic day.jpg" class="d-block w-100" alt="..." style="height: 70vh;">
                                        <div class="carousel-caption d-none d-md-block text-light ">
                                                <h2>Prefer Product <strong class="text-danger" style="font-family: 'Prompt', sans-serif;">Swadesh!!</strong></h2>
                                                <p>Patriotic styles for Republic Day!! Wear your pride, Shop the spirit.</p>
                                        </div>
                                </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                        </button>
                </div>              
        </div> 
        `,
        data(){
                return {
                        userRole: localStorage.getItem('role'),
                        authToken: localStorage.getItem('auth-token'),
                }
        },
        components: {
                manager,
                admin,
                customer
        },
        // methods: {
                // print(){
                //         console.log(this.userRole)
                // }
        // }
}

// export default home
/* <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
<div class="carousel-inner" style="height: 70vh;">
        <div class="carousel-item active">
                <img src="../static/images/santa.jpg" class="d-block w-100" alt="..." style="height: 70vh;">
                <div class="carousel-caption d-none d-md-block text-white">
                        <h2>OPS Mart's<strong class="text-danger" style="font-family: 'Prompt', sans-serif;"> Christmas Cheer</strong>: 10% Off!</h2>
                        <p>Celebrate Christmas with joy, shop gifts that sparkle and delight today!</p>
                </div>
        </div>
        <div class="carousel-item">
                <img src="../static/images/new-year.jpg" class="d-block w-100" alt="..." style="height: 70vh;">
                <div class="carousel-caption d-none d-md-block text-dark">
                        <h2>Celebrate This <strong class="text-danger" style="font-family: 'Prompt', sans-serif;">New Year</strong> With Us</h2>
                        <p>Ring in the New Year with style! Shop resolutions, dreams, and happiness.</p>
                </div>
        </div>
        <div class="carousel-item">
                <img src="../static/images/republic day.jpg" class="d-block w-100" alt="..." style="height: 70vh;">
                <div class="carousel-caption d-none d-md-block text-light ">
                        <h2>Prefer Product <strong class="text-danger" style="font-family: 'Prompt', sans-serif;">Swadesh!!</strong></h2>
                        <p>Patriotic styles for Republic Day!! Wear your pride, Shop the spirit.</p>
                </div>
        </div>
</div>
<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
</button>
<button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
</button>
</div> */