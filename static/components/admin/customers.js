export default {
        template: `
        <div> 
                <div class="container p-5">
                <h2>Customers</h2>
                <small v-if="error" class="text-danger"> *{{ error }} </small>
                <hr>
                <table class="table table-striped p-5  table-hover ">
                        <thead>
                                <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col" class="text-center">Delete</th>
                                </tr>
                        </thead>
                        <tbody>
                                <tr v-for="(manager,index) in allManagers">
                                        <th scope="row">{{ manager.id }}</th>
                                        <td>{{ manager.username }}</td>
                                        <td>{{ manager.email }}</td>
                                        <td class="text-center">
                                                <button type="button" class="btn btn-danger" @click="remove(manager.id)">Delete</button>
                                        </td>
                                </tr>
                        </tbody>
                </table>
                <div v-if="error" class="container text-danger"><small> *{{ error }} </small></div>
        </div>

        </div>`,
        data() {
                return {
                        allManagers: [],
                        token: localStorage.getItem("auth-token"),
                        error: null,
                }
        },
        async mounted() {
                // console.log(this.$route.name)
                const res = await fetch("/get/customers", {
                        headers: {
                                "Authentication-Token": this.token
                        },
                })
                const data = await res.json().catch((e)=>{})
                if(res.ok){
                        this.allManagers = data;
                }else{
                        this.error = res.statusText;
                }
        },
        methods: {
                async remove(id){
                        const res = await fetch(`/drop/user/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                                this.$router.go(0);
                        }else{
                                this.error = res.statusText;
                        }

                }
        }
}