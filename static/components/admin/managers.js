export default {
        template: `
        <div> 
        <div class="container p-5">
                <h2>Managers</h2>
                <small v-if="error" class="text-danger"> *{{ error }} </small>
                <hr>
                <table class="table table-striped p-5">
                        <thead>
                                <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col" class="text-center">Action</th>
                                        <th scope="col" class="text-center">Delete</th>
                                </tr>
                        </thead>
                        <tbody>
                                <tr v-for="(manager,index) in allManagers">
                                        <th scope="row">{{ manager.id }}</th>
                                        <td>{{ manager.username }}</td>
                                        <td>{{ manager.email }}</td>
                                        <td v-if="manager.active" class="text-center">
                                                <button type="button" class="btn btn-outline-danger" @click="deactivate(manager.id)">Deactivate</button>
                                        </td>
                                        <td v-else class="text-center">
                                                <button type="button" class="btn btn-outline-success" @click="activate(manager.id)"> Activate </button>
                                        </td>
                                        <td class="text-center">
                                                <button type="button" class="btn btn-danger" @click="remove(manager.id)">Delete</button>
                                        </td>
                                </tr>
                        </tbody>
                </table>
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
                const res = await fetch("/get/managers", {
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
                async activate(id){
                        const res = await fetch(`/activate/manager/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                                this.$router.push({path: '/admin/managers'} )
                        }else{
                                this.error = res.statusText;
                        }
                },
                async deactivate(id){
                        const res = await fetch(`/deactivate/manager/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                        }else{
                                this.error = res.statusText;
                        }
                },
                async remove(id){
                        const res = await fetch(`/drop/user/${id}`, {
                                headers: {
                                        "Authentication-Token": this.token
                                },
                        })
                        const data = await res.json().catch((e)=>{})
                        if(res.ok){
                                alert(data.message);
                        }else{
                                this.error = res.statusText;
                        }

                }
        }
}