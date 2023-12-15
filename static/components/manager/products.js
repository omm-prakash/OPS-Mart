export default {
        template: `
        <div class="container p-5">
                <div class="d-flex flex-column">
                        <h2>Product Directory</h2>
                        <div class="alert alert-danger alert-dismissible fade show" v-if="error">
                                <strong>*</strong>{{ error }}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                                
                        <div class="align-self-end float-end">
                                <router-link to='/manager/add_product'>
                                        <button type="button" class="btn btn-success">
                                                <i class="bi bi-bookmark-plus-fill"></i> Add
                                        </button>
                                </router-link>
                        </div>
                        <hr>
                </div>
                <!-- <small v-if="error" class="text-danger"> </small> -->
                <table class="table table-striped p-5  table-hover ">
                        <thead>
                                <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Cost</th>
                                        <th scope="col">Stock</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Manufacturing</th>
                                        <th scope="col">Expiry</th>
                                        <th scope="col" class="text-center">Actions</th>
                                </tr>
                        </thead>
                        <tbody>
                                <tr v-for="(product,i) in products">
                                        <th scope="row" v-bind:class="!product.category?'text-muted':''">{{ product.id }}</th>
                                        <td v-bind:class="!product.category?'text-muted':''">{{ product.name }}</td>
                                        <td v-bind:class="!product.category?'text-muted':''">{{ product.category }}</td>
                                        <td v-bind:class="!product.category?'text-muted':''">{{ product.cost }}</td>
                                        <td v-bind:class="!product.category?'text-muted':''">{{ product.stock }}</td>
                                        <td v-bind:class="!product.category?'text-muted':''">{{ product.type }}</td>
                                        <td v-bind:class="!product.category?'text-muted':''">{{ product.manufacture_date }}</td>
                                        <td v-bind:class="!product.category?'text-muted':''">{{ product.expiry_date }}</td>
                                        <td class="text-center">
                                                <div class="btn-group btn-group-toggle" data-toggle="buttons"> 
                                                        <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" v-bind:data-bs-target="'#product-edit-'+product.id.toString()">
                                                                <i class="bi bi-pencil-square" data-bs-toggle="tooltip" title="Edit"></i>
                                                        </button>
                                                        <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" v-bind:data-bs-target="'#product-delete-'+product.id.toString()">
                                                                <i class="bi bi-trash" data-bs-toggle="tooltip" title="Delete"></i>
                                                        </button>
                                                </div>
                                        </td>
                                        <div class="modal fade" v-bind:id="'product-delete-'+product.id.toString()" tabindex="-1" aria-labelledby="sad" aria-hidden="true">
                                                <div class="modal-dialog">
                                                        <div class="modal-content">
                                                                <div class="modal-header">
                                                                        <h5 class="modal-title" id="exampleModalLabel">Confirmation</h5>
                                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div class="modal-body"> Do you really want to delete {{ product.name }}? </div>
                                                                <div class="modal-footer">
                                                                        <button type="button" class="btn btn-success" data-bs-dismiss="modal">Close</button>
                                                                        <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal" @click="remove(product.id)">Delete</button>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                        <div class="modal fade" v-bind:id="'product-edit-'+product.id.toString()" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                <div class="modal-dialog modal-lg">

                                                        <div class="modal-content">
                                                                <div class=" p-4" style="font-family: 'Prompt', sans-serif;">        
                                                                        <h2><strong>Edit Product</strong></h2>
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
                                                                                                <input type="date" id="expiry" class="form-control" name="card_deadline" v-model="product.expiry_date">
                                                                                        </div>
                                                                                </div>
                                                                        </form>
                                                                        <div class="modal-footer col-md-12">
                                                                                <button @click="editProduct(product)" type="button" class="btn btn-success" data-bs-dismiss="modal">Submit</button>
                                                                                <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancel</button>
                                                                        </div>        
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                
                                </tr>
                        </tbody>
                </table>
                <p class="text-secondary" v-if="products">
                        <strong class="text-dark">
                                <i class="bi bi-filetype-csv text-success" style="font-size: 1.5em;"></i> CSV Report: 
                        </strong>
                        <span class="text-dark">Click 
                                <button type="button" class="btn btn-link p-0 align-center" style="text-decoration: none;" @click='downlodResource'>
                                        here
                                </button>, to download.
                        </span>
                        <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isWaiting"></span>
                        <span role="status" v-if="isWaiting"> Downloading...</span>
                </p>

        </div>
        `,
        data(){
                return{
                        token: localStorage.getItem("auth-token"),
                        error: null,
                        products: null,
                        categories: null,
                        isWaiting: false
                }
        },
        async mounted(){
                const res = await fetch('/api/product',{
                        headers: {
                                "Authentication-Token": this.token, //{ name: '/manager/edit_product/', params: { id: product.id }}
                                'Content-Type': 'application/json',
                        },
                });
                const data = await res.json().catch((e)=>{})
                if(res.ok){
                        if(data){
                                this.products = data;
                        }
                }else{
                        this.error = data.message;
                }

                const cat = await fetch('/get/category');
                const cats = await cat.json().catch((e)=>{});
                if(cat.ok){
                        this.categories = cats;
                }else{
                        this.error = cats.message;
                }


        },
        methods: {
                async editProduct(product){
                        // console.log(product);
                        const res = await fetch('/api/product', {
                                method: 'PUT',
                                headers: {
                                        'Content-Type': 'application/json',
                                        "Authentication-Token": this.token

                                },
                                body: JSON.stringify(product),
                        })
                        const data = await res.json().catch((e)=>{});
                        if (res.ok) {
                                alert(data.message);
                                this.$router.go(0);
                        } else {
                                this.error = data.message;
                        }
               
                },
                async remove(id){
                        const res = await fetch(`/api/product/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                                method: "DELETE"
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                                this.$router.go(0);
                        }else{
                                this.error = data.message;
                        }

                },
                async downlodResource() {
                        this.isWaiting = true
                        const res = await fetch('/manager/get/product/report',{
                                headers: {
                                        "Authentication-Token": this.token
                                }
                        })
                        const data = await res.json()
                        if (res.ok) {
                                const taskId = data['task-id']
                                const intv = setInterval(async () => {
                                        const csv_res = await fetch(`/manager/download/product/report/${taskId}`,{
                                                headers: {
                                                        "Authentication-Token": this.token
                                                }                        
                                        })
                                        if (csv_res.ok) {
                                                this.isWaiting = false
                                                clearInterval(intv)
                                                window.location.href = `/manager/download/transaction/report/${taskId}`
                                        }
                                }, 1000)
                        }
                },

        }
}