import productCard from './card.js'

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
                                                <div style="display: flex; gap: 4px; align-items: center;" class="py-1">
                                                        <span>&#8377;{{ minPrice }} </span>
                                                                <input type="range" id="rangeInput" v-model="filter.price">
                                                        <span>&#8377;{{ maxPrice }}</span>
                                                </div>
                                                <p class="text-secondary">@product price < &#8377;{{ minPrice + ((filter.price / 100) * (maxPrice - minPrice)) }}</p>
                                                
                                        </li>
                                        <li>
                                                <h5 class="fw-bold">Manf. Date</h5>
                                                        
                                                <p>From<input type="date" id="manf" class="form-control" name="card_deadline" v-model="filter.from"></p>
                                                <p>To<input type="date" id="expiry" class="form-control" name="card_deadline" v-model="filter.to"></p>
                                                
                                        </li>
                                
                                </ul>
                                <button type="button" class="btn btn-outline-warning" @click="refresh">Clear Filter</button>
                                <hr>
                                
                                       
                                <input class="form-control me-2  text-dark " type="text" aria-label="Search" v-model="searchText" placeholder="Search Product">

                                
                        </div>
                        <div class="col-md-9  bg-transparent bg-gradient" style="opacity: 0.9;">
                                <div class="container-fluid" style="max-height: 94vh; overflow-y: auto; ">
                                        <div class="row px-1 py-1">
                                                <productCard v-for="product in filteredProducts" :prod="product" />
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
                        minPrice: null,
                        maxPrice: null,
                        filter: {
                                price: 100,
                                selectedCategories: [],
                                from: null,
                                to: null
                        },
                        fetchedProducts: null,
                        searchText: "",
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
                }

                // fetch products
                const prod = await fetch("/get/products")
                const prods = await prod.json().catch((e) => { })
                if (prod.ok) {
                        prods.sort((a, b) => new Date(b.onboard_date) - new Date(a.onboard_date));
                        this.maxPrice = prods.reduce((max, product) => (product.cost > max ? product.cost : max), -Infinity);
                        this.minPrice = prods.reduce((min, product) => (product.cost < min ? product.cost : min), Infinity);
                        this.fetchedProducts = prods
                }

        },
        computed: {
                filteredProducts() {
                        if (this.fetchedProducts) {
                                let serachResult = this.fetchedProducts.filter(p => { return p.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1; });
                                let categoryFilter = serachResult
                                if (this.filter.selectedCategories.length != 0) {
                                        categoryFilter = serachResult.filter(product => this.filter.selectedCategories.includes(product.category_id))
                                }
                                let priceFilter = categoryFilter.filter(product => product.cost <= this.minPrice + ((this.filter.price / 100) * (this.maxPrice - this.minPrice)));
                                let manfFilter = priceFilter
                                if(this.filter.from){
                                        manfFilter = priceFilter.filter(product => product.manufacture_date >= this.filter.from);
                                }
                                if(this.filter.to){
                                        manfFilter = manfFilter.filter(product => product.manufacture_date <= this.filter.to);
                                }
                                return manfFilter
                        }
                }
        },
        methods:{
                refresh(){
                        this.filter={
                                price: this.maxPrice,
                                selectedCategories: [],
                                from: null,
                                to: null
                        };
                }
        },
        components: {
                productCard
        }

}

// ref: https://stackoverflow.com/questions/69287834/search-bar-vue-js