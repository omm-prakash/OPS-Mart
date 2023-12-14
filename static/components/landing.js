export default{
        template: `
        <div>
        <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
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
        <div class="container-fluid">
                <!-- <div class="d-md-flex flex-md-equal m-100 my-md-3 ps-md-3"> -->
                <div class="row g-3 m-100">
                        <!-- <div class="col-6 text-bg-dark me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"> -->
                        <div class="col-md-6 text-bg-dark  text-center overflow-hidden" >
                                <div class="my-3 py-3">
                                        <h2 class="display-5">Fashion</h2>
                                        <p class="lead">Elevate your style with our trendsetting fashion for unparalleled elegance.</p>
                                </div>
                                <div class="bg-body-tertiary shadow-sm mx-auto" style="width: 80%; height: 300px;">
                                <router-link to="/login">
                                        <img src="../static/images/hat.jpg" alt="" class="img-fluid" style=""></a>
                                </router-link>
                                </div>
                        </div>
                        <!-- <div class="col-6 bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"> -->
                        <div class="col-md-6 bg-body-tertiary text-center overflow-hidden">
                                <div class="my-3 p-3">
                                        <h2 class="display-5">Chappals</h2>
                                        <p class="lead">Step into style with our trendy and comfortable footwear collection!</p>
                                </div>
                                <div class="bg-dark shadow-sm mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;">
                                <router-link to="/login">        
                                        <img src="../static/images/chappals.jpg" alt="" class="img-fluid border-radius: 21px 21px 0 0;">
                                </router-link>
                                </div>
                        </div>
                        <div class="col-md-6  bg-body-light text-center overflow-hidden">
                                <div class="my-3 py-3">
                                        <h2 class="display-5">Cakes</h2>
                                        <p class="lead">Indulge in heavenly delights with our exquisite range of decadent cakes.</p>
                                </div>
                                <div class="bg-body-tertiary shadow-sm mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;">
                                <router-link to="/login">
                                        <img src="../static/images/cake.jpg" alt="" class="img-fluid border-radius: 21px 21px 0 0;">
                                </router-link>
                                </div>
                        </div>
                        <!-- <div class="col-6 bg-body-tertiary me-md-3 pt-3 px-3 pt-md-5 px-md-5 text-center overflow-hidden"> -->
                        <div class="col-md-6  text-bg-dark text-center overflow-hidden">
                                <div class="my-3 p-3">
                                        <h2 class="display-5">Delicious Biriyani</h2>
                                        <p class="lead">Indulge in aromatic biryani, a symphony of flavors and spices.</p>
                                </div>
                                <div class="bg-dark shadow-sm mx-auto" style="width: 80%; height: 300px; border-radius: 21px 21px 0 0;">
                                <router-link to="/login">
                                        <img src="../static/images/biriyani.jpg" alt="" class="img-fluid border-radius: 21px 21px 0 0;">
                                </router-link>
                                </div>
                        </div>
                </div>
       </div>
        </div>
        `
}