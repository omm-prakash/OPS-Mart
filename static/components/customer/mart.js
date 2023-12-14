import productCard from './card.js'
// import * as stringSimilarity from 'string-similarity';

export default {
        template: `
        <div class="container-fluid" style="background-image: url('../static/images/display.jpg'); background-size: cover;">
                <div class="row ">
                        <div class="col-md-3 p-4 bg-dark bg-gradient text-white" style="height: 94vh; opacity: 0.8;">
                                
                                <h3>OPS Market</h3>
                                <hr>
                                <!-- <ul class="nav nav-pills flex-column mb-auto"> -->
                                <h4 class="">Filter</h4>
                                <ul class="list-unstyled px-5">
                               
                                        <li>
                                                <h5 class="fw-bold">Category</h5>
                                                <div class="px-3 py-1">
                                                        <div class="form-check" v-for="category in categories">
                                                                <input 
                                                                        class="form-check-input" 
                                                                        type="checkbox" 
                                                                        :value="category.id" 
                                                                        :id="category.id.toString()" 
                                                                        v-model="filter.selectedCategories"
                                                                />
                                                                <label class="form-check-label" :for="category.id.toString()"> {{category.name}} </label>
                                                        </div>
                                                </div>
                                        </li>
                                        <li>
                                                <h5 class="fw-bold">Price</h5>
                                                <div style="display: flex; gap: 4px; align-items: center;" class="px-3 py-1">
                                                        <span>{{ minPrice }} </span>
                                                                <input type="range" id="rangeInput" v-model="filter.maxPrice">
                                                        <span>{{ maxPrice }}</span>
                                                </div>
                                        </li>
                                
                                </ul>
                                
                                <button type="button" class="btn btn-outline-info" @click="filterProduct"><i class="bi bi-search"></i> Filter</button>
                                <br>  <hr>
                                
                                
                                <br>
                                <form class="d-flex" role="search">
                                        <input class="form-control me-2 bg-transparent text-white " type="search" aria-label="Search" v-model="searchText">
                                        <button class="btn btn-outline-success" @click="searchProduct"><i class="bi bi-search"></i></button>
                                </form>
                        </div>
                        <div class="col-md-9  bg-transparent bg-gradient" style="opacity: 0.9;">
                                <div class="container-fluid" style="max-height: 94vh; overflow-y: auto; ">
                                        <div class="row px-1 py-1">
                                                <productCard v-for="product in products" :prod="product" />
                                        </div>
                                </div>
                                 
                        </div>
                </div>
        </div>
        `,
        data() {
                return {
                        token: localStorage.getItem('auth-token'),
                        categories: null,
                        // selectedCategory: [],
                        minPrice: null,
                        maxPrice: null,
                        filter: {
                                // minPrice: 0,
                                maxPrice: 100,
                                selectedCategories: [],
                                // categories: null
                        },
                        products: null,
                        fetchedProducts: null,
                        searchText: "",
                        filteredProducts: null,
                        similarityThreshold: 0.5,
                        productNames: []
                }
        },
        async mounted() {
                // fetch categories
                const res = await fetch("/get/category", {
                        headers: {
                                "Authentication-Token": this.token
                        },
                })
                const data = await res.json().catch((e) => { })
                if (res.ok) {
                        this.categories = data;
                } else {
                        alert(this.error)
                }

                // fetch products
                const prod = await fetch("/get/products")
                const prods = await prod.json().catch((e) => { })
                if (prod.ok) {
                        prods.sort((a, b) => new Date(b.onboard_date) - new Date(a.onboard_date));
                        this.maxPrice = prods.reduce((max, product) => (product.cost > max ? product.cost : max), -Infinity);
                        this.minPrice = prods.reduce((min, product) => (product.cost < min ? product.cost : min), Infinity);
                        this.products = prods
                        this.fetchedProducts = prods
                        this.productNames = this.fetchedProducts.map(obj => obj.name);
                        // console.log(this.maxPrice)
                } else {
                        console.log(this.error);
                }

        },
        methods: {
                filterProduct() {
                        this.filteredProducts = this.fetchedProducts.filter(product => product.cost <= this.minPrice+((this.filter.maxPrice / 100)*(this.maxPrice-this.minPrice)));
                        if (this.filter.selectedCategories.length != 0) {
                                this.filteredProducts = this.filteredProducts.filter(product => this.filter.selectedCategories.includes(product.category_id))
                        }
                        this.products = this.filteredProducts
                        // console.log(this.filter.maxPrice)
                        // console.log(this.filter.selectedCategories.length)
                },
                searchProduct() {
                        // console.log(this.fetchedProducts.name)
                        if (this.searchText != "") {
                                const matches = stringSimilarity.findBestMatch(this.searchText, this.productNames);
                                const similarStrings = matches.ratings
                                        .filter((rating, index) => rating.rating > this.similarityThreshold)
                                        .map((rating, index) => this.productNames[index]);
                                // console.log(matches, similarStrings)
                                this.products = this.fetchedProducts.filter(product => similarStrings.includes(product.name))
                        }else{
                                this.products = this.fetchedProducts
                        }
                        // this.products = similarStrings;
                }
        },
        components: {
                productCard
        }

}

// <div class="card m-2 col-md-5 p-0 bg-light bg-gradient ">
// <div class="card-header">
//         <h4><strong>Product</strong></h4>
// </div>
// <div class="card-body">
//         <ul class="list-unstyled px-4">
//                 <li><strong>Price:</strong>10</li>
//                 <li><strong>Manf. Date:</strong>10</li>
//                 <li><strong>Expiry. Date:</strong>10</li>
//         </ul>
//         <p class="card-text"><small class="text-muted">added on </small></p>
//         <hr>
//         <button type="button" class="btn btn-success"><i class="bi bi-cart-plus-fill"></i></button>
//         <p class="card-text"></p>
// </div>
// </div>
