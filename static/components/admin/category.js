const modal = `
        <div class="modal fade" v-bind:id="'category-form-'+category.id.toString()" tabindex="2" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
        <div class="modal-content">
                <div class="row g-0">
                        <div class="col-md-5">
                                <img src="./static/images/category3.jpg" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-7">
                                <div class="card-body p-2">
                                        <div class="modal-header">
                                                <h3 style="font-family: 'Prompt', sans-serif;"><strong>Edit Category</strong></h3>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                                        </div>
                                        <div class="modal-body">
                                                <form>
                                                        <div class="row mb-3">
                                                                <label for="category-id" class="col-form-label col-sm-3">ID</label>
                                                                <div class="col-sm-9">
                                                                        <input type="text" class="form-control" id="category-id" :value="category.id" readonly>
                                                                </div>
                                                        </div>
                                                        <div class="row mb-3">
                                                                <label for="category-name" class="col-form-label col-sm-3">Name</label>
                                                                <div class="col-sm-9">
                                                                        <input type="text" class="form-control" id="category-name" v-model:value="category.name" >
                                                                </div>
                                                        </div>
                                                        <div class="row mb-3">
                                                                
                                                                <label for="category-description" class="col-form-label col-sm-3">Description</label>
                                                                <div class="col-sm-9">
                                                                        <textarea class="form-control" id="category-description" placeholder="" rows="4" v-model:value="category.description"></textarea>
                                                                </div>
                                                        </div>
                                                </form>
                                        </div>
                                        <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal" data-bs-dismiss="modal">Close</button>
                                                <button @click='editCategory(category)' class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
        </div>
        </div>
        <!-- Delete Modal -->
`
export default {
        template: `
        <div class="container p-5">
        <div class="d-flex flex-column">        
                <h2>Product Categories</h2>
                <small v-if="error" class="text-danger"> *{{ error }} </small>
                <hr>
                <div class="align-self-end">
                        <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#register"><i class="bi bi-bookmark-plus-fill"></i> Add</button>
                </div>
        </div>
        <!-- <small v-if="error" class="text-danger"> </small> -->
        
        <table class="table table-striped p-5">
                <thead >
                        <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col" class="text-center">Edit Requests</th>
                                <th scope="col" class="text-center">Delete Requests</th>
                                <th scope="col" class="text-center">Actions</th>
                        </tr>
                </thead>
                <tbody>
                        <tr v-for="(category,i) in allCategories">
                                <th scope="row" v-bind:class="!category.active?'text-muted':''">{{ category.id }}</th>
                                <td v-bind:class="!category.active?'text-muted':''">{{ category.name }}</td>
                                <td v-bind:class="!category.active?'text-muted':''">{{ category.description }}</td>
                                <td class="text-center" v-bind:class="!category.active?'text-muted':''">{{ category.edit_request }}</td>
                                <td class="text-center" v-bind:class="!category.active?'text-muted':''">{{ category.delete_request }}</td>
                                <td class="text-center">
                                        <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" v-bind:data-bs-target="'#category-form-'+category.id.toString()"> 
                                                        <i class="bi bi-pencil-square" data-bs-toggle="tooltip" title="edit"></i>
                                                </button>
                                                <button type="button" class="btn btn-outline-success" v-if="!category.active" data-bs-toggle="tooltip" title="activate" @click="activate(category.id)"> <i class="bi bi-activity"></i></button>
                                                <button type="button" class="btn btn-outline-warning" v-else data-bs-toggle="tooltip" title="deactivate" @click="deactivate(category.id)"> <i class="bi bi-dash-lg"></i></button>
                                                <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" v-bind:data-bs-target="'#category-delete-'+category.id.toString()"> 
                                                        <i class="bi bi-trash" data-bs-toggle="tooltip" title="remove" ></i>
                                                </button>
                                        </div>
                                </td>
                                ${modal}
                                <div class="modal fade" v-bind:id="'category-delete-'+category.id.toString()" tabindex="-1" aria-labelledby="sad" aria-hidden="true">
                                <div class="modal-dialog">
                                        <div class="modal-content">
                                                <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLabel">Confirmation</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                        Do you really want to delete {{ category.name }}?
                                                </div>
                                                <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="remove(category.id)">Delete</button>
                                                </div>
                                        </div>
                                </div>
                                </div>
                        </tr>
                </tbody>
        </table>
        <div class="modal fade" id="register" tabindex="-1" aria-labelledby="e1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
                <div class="modal-content">
                        <div class="row g-0">
                                <div class="col-md-4">
                                        <img src="./static/images/category.jpg" class="img-fluid rounded-start" alt="...">
                                </div>
                                <div class="col-md-8">
                                        <div class="card-body p-2">
                                                <div class="modal-header">
                                                        <h3 style="font-family: 'Prompt', sans-serif;"><strong>Add Category</strong></h3>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                                                </div>
                                                <div class="modal-body">
                                                        <form>
                                                                <div class="row mb-3">
                                                                        <label for="category-name" class="col-form-label col-sm-3">Name</label>
                                                                        <div class="col-sm-9">
                                                                                <input type="text" class="form-control" id="category-name" v-model="categoryData.name">
                                                                        </div>
                                                                </div>
                                                                <div class="row mb-3">
                                                                        
                                                                        <label for="category-description" class="col-form-label col-sm-3">Description</label>
                                                                        <div class="col-sm-9">
                                                                                <textarea class="form-control" id="category-description" placeholder="" rows="4" v-model="categoryData.description"></textarea>
                                                                        </div>
                                                                </div>
                                                        </form>
                                                </div>
                                                <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal" data-bs-dismiss="modal">Close</button>        
                                                        <button @click='addCategory' class="btn btn-primary" data-bs-dismiss="modal">Submit</button>                                                        
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
        </div>

        </div>
        `,
        data(){
                return {
                        allCategories: [],
                        token: localStorage.getItem("auth-token"),
                        error: null,
                        categoryData: {
                                "name": null,
                                "description": null
                        },
                }

        },
        async mounted() {
                const res = await fetch("/api/category/0", {
                        headers: {
                                "Authentication-Token": this.token
                        },
                })
                const data = await res.json().catch((e)=>{})
                if(res.ok){
                        this.allCategories = data;
                }else{
                        alert(this.error) 
                }
        },
        methods: {
                async remove(id){
                        const res = await fetch(`/api/category/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                                method: "DELETE"
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                        }else{
                                this.error = data.message;
                                // console.log(data.message)
                                // alert(data.message)
                        }

                },
                async activate(id){
                        const res = await fetch(`/activate/category/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                                // this.$router.push({path: '/admin/managers'} )
                        }else{
                                this.error = data.message;
                        }
                },
                async deactivate(id){
                        const res = await fetch(`/deactivate/category/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                        }else{
                                this.error = data.message;
                        }
                },
                async addCategory(){
                        const res = await fetch('/api/category', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        "Authentication-Token": this.token

                                },
                                body: JSON.stringify(this.categoryData),
                        })
                        const data = await res.json().catch((e)=>{});
                        if (res.ok) {
                                // this.mounted();
                                alert(data.message);
                        } else {
                                // alert(data.message)
                                this.error = data.message.id;
                        }

                },
                async editCategory(category){
                        const res = await fetch('/api/category', {
                                method: 'PUT',
                                headers: {
                                        'Content-Type': 'application/json',
                                        "Authentication-Token": this.token

                                },
                                body: JSON.stringify(category),
                        })
                        // console.log(category)
                        const data = await res.json().catch((e)=>{});
                        if (res.ok) {
                                // this.mounted();
                                alert(data.message);
                        } else {
                                this.error = data.message;
                        }
               
                }
        }

}

/*  */