export default {
        template: `
        <div class="container bg-light my-4">
                <div class="row">
                        <div class="col-md-8">
                                <div class="content-container p-4" style="font-family: 'Prompt', sans-serif;">
                                        <h2><strong>Product SignUp</strong></h2>
                                        <div class="alert alert-danger alert-dismissible fade show" v-if="error">
                                                <strong>*</strong>{{ error }}
                                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>        
                                        <hr>
                                        <form class="">
                                                <div class="row g-3 p-3">
                                                        <div class="col-md-6">
                                                                <label for="name" class="form-label">Name</label>
                                                                <input type="text" class="form-control" id="name" v-model="product.name" required>
                                                        </div>
                                                        <div class="col-md-6">
                                                                <label for="inputState" class="form-label">Category</label>
                                                                <select id="inputState" class="form-select" required v-model="product.category">
                                                                        <option v-for="category in categories">{{ category.name }}</option>
                                                                </select>
                                                        </div>
                                                        <div class="col-4">
                                                                <label for="cost" class="form-label">Cost</label>
                                                                <input type="number" class="form-control" id="cost" v-model="product.cost" required>
                                                        </div>
                                                        <div class="col-4">
                                                                <label for="stock" class="form-label">Stock</label>
                                                                <input type="number" class="form-control" id="stock" v-model="product.stock" required>
                                                        </div>
                                                        <div class="col-4">
                                                                <label for="inputAddress" class="form-label">Unit Type</label>
                                                                <div>
                                                                        <div class="form-check form-check-inline">
                                                                                <input class="form-check-input" type="radio" name="unit" id="ltr" value="ltr" v-model="product.type" required>
                                                                                <label class="form-check-label text-muted" for="ltr">Liter</label>
                                                                        </div>
                                                                        <div class="form-check form-check-inline">
                                                                                <input class="form-check-input" type="radio" name="unit" id="kg" value="kg" v-model="product.type" required>
                                                                                <label class="form-check-label text-muted" for="kg">KG</label>
                                                                        </div>
                                                                        <div class="form-check form-check-inline">
                                                                                <input class="form-check-input" type="radio" name="unit" id="unit" value="unit" v-model="product.type" required>
                                                                                <label class="form-check-label text-muted" for="unit">Unit</label>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div class="col-6">
                                                                <label for="manf">Manufacture Date</label>
                                                                <input type="date" id="manf" class="form-control" name="card_deadline" v-model="product.manufacture_date">
                                                        </div>
                                                        <div class="col-6">
                                                                <label for="expiry">Expiry Date</label>
                                                                <input type="date" id="expiry" class="form-control" name="card_deadline" v-model="product.expiry_date" >
                                                        </div>
                                                </div>
                                                <hr>
                                                <div class="col-md-12">
                                                        <button @click="submitProduct" type="button" class="btn btn-success">Submit</button>
                                                        <button @click="cancel" type="button" class="btn btn-outline-danger">Cancel</button>
                                                </div>
                                        </form>
                                </div>
                        </div>
                        <div class="col-md-4 p-0">
                                <img src="../static/images/product.jpg" alt="Your Image" class="img-fluid h-100 w-100">
                        </div>
                </div>
        </div>
        `,
        data(){
                return{
                        token: localStorage.getItem("auth-token"),
                        categories: null,
                        product: {
                                name: null,
                                category: null,
                                cost: null,
                                stock: null,
                                type: null,
                                manufacture_date: null,
                                expiry_date: null,
                        },
                        products: null,
                        error: null
                }
        },
        async mounted(){
                const res = await fetch('/get/category',{
                        headers: {
                                'Authentication-Token': this.token,
                        }
                });
                const data = await res.json().catch((e)=>{});
                if(res.ok){
                        this.categories = data;
                }else{
                        this.error = data.message;
                }
        },
        methods: {
                async submitProduct(){
                        // console.log(this.product)
                        const res = await fetch('/api/product',{
                                headers: {
                                        "Authentication-Token": this.token,
                                        'Content-Type': 'application/json',
                                },
                                method: 'POST',
                                body: JSON.stringify(this.product)
                        });
                        const data = await res.json().catch((e)=>{});
                        if(res.ok){
                                alert(data.message);
                                // this.$router.go(0);
                                this.$router.push('/manager/products');
                        }else{
                                this.error = data.message;
                                this.product= {
                                        name: null,
                                        category: null,
                                        cost: null,
                                        stock: null,
                                        type: null,
                                        manufacture_date: null,
                                        expiry_date: null,
                                }
                                // alert(this.error)
                        }

                },
                cancel(){
                        this.$router.push('/manager/products');
                }

        }
}