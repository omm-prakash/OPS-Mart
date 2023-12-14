export default {
        template: `
        <div class="container p-5">
                <div class="d-flex flex-column">
                        <h2>Category Directory</h2>
                        <small v-if="error" class="text-danger"> *{{ error }} </small>
                        <div class="align-self-end">
                                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#register"><i class="bi bi-bookmark-plus-fill"></i> Add</button>
                        </div>
                        <hr>
                </div>
                <!-- <small v-if="error" class="text-danger"> </small> -->
                <table class="table table-striped p-5  table-hover ">
                        <thead>
                                <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col" class="text-center">Actions</th>
                                </tr>
                        </thead>
                        <tbody>
                                <tr v-for="(category,i) in categories">
                                        <th scope="row" v-bind:class="!category.active?'text-muted':''">{{ category.id }}</th>
                                        <td v-bind:class="!category.active?'text-muted':''">{{ category.name }}</td>
                                        <td v-bind:class="!category.active?'text-muted':''">{{ category.description }}</td>
                                        <td class="text-center">
                                                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                                        <button type="button" class="btn btn-outline-primary" @click="editRequest(category.id)">
                                                                <i class="bi bi-pencil-square" data-bs-toggle="tooltip" title="Edit Request"></i>
                                                        </button>
                                                        <button type="button" class="btn btn-outline-danger" @click="deleteRequest(category.id)">
                                                                <i class="bi bi-trash" data-bs-toggle="tooltip" title="Delete Request"></i>
                                                        </button>
                                                </div>
                                        </td>
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
                                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                        categories: [],
                        token: localStorage.getItem("auth-token"),
                        error: null,
                        categoryData: {
                                "name": null,
                                "description": null
                        },
                }

        },
        async mounted() {
                const res = await fetch("/get/category", {
                        headers: {
                                "Authentication-Token": this.token
                        },
                })
                const data = await res.json().catch((e)=>{})
                if(res.ok){
                        this.categories = data;
                        // console.log(data)
                }else{
                        alert(this.error) 
                }
        },
        methods: {
                async deleteRequest(id){
                        const res = await fetch(`/manager/request/delete/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                                method: "GET"
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                                this.$router.go(0);
                        }else{
                                this.error = data.message;
                        }

                },
                async addCategory(){
                        const res = await fetch('/manager/add/category', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        "Authentication-Token": this.token
                                },
                                body: JSON.stringify(this.categoryData),
                        })
                        const data = await res.json().catch((e)=>{});
                        if (res.ok) {
                                alert(data.message);
                                this.$router.go(0);
                        } else {
                                this.error = data.message;
                        }

                },
                async editRequest(id){
                        const res = await fetch(`/manager/request/edit/${id}`, {
                                method: 'GET',
                                headers: {
                                        "Authentication-Token": this.token
                                },
                        })
                        const data = await res.json().catch((e)=>{});
                        if (res.ok) {
                                alert(data.message);
                                this.$router.go(0);
                        } else {
                                this.error = data.message;
                        }
                }
        }

} 