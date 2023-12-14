export default {
        props: ['prod'],
        template: `
        <div class="card m-2 col-md-3 p-0 bg-light bg-gradient">
                <div class="card-header">
                        <h4><strong>{{ prod.name }}</strong></h4>
                </div>
                <div class="card-body">
                        <p v-if="prod.stock<=0" class="text-danger">*out of stock</p>
                        <ul class="list-unstyled px-4">
                                <li><strong>Price:</strong> <span>&#8377;</span>{{ prod.cost }}</li>
                                <li><strong>Category:</strong> {{ prod.category }}</li>
                                <li><strong>Seller:</strong> {{ prod.manager }}</li>
                                <li><strong>Manf.:</strong> <span v-if="prod.manufacture_date">{{ prod.manufacture_date }}</span><span v-else>NA</span></li>
                                <li><strong>Expiry:</strong> <span v-if="prod.expiry_date">{{prod.expiry_date}}</span><span v-else>NA</span> </li>
                        </ul>
                        <p class="card-text" ><small class="text-muted" v-if="prod.onboard_date"><i class="bi bi-tag"></i> added on {{prod.onboard_date}}</small></p>
                        <hr>
                        <form class="row align-items-center">
                                <div class="btn-group col-auto" role="group">
                                        <button type="button" class="btn col-2 btn-danger" @click="removeFromCart(prod)"><i class="bi bi-cart-dash-fill"></i></button>
                                        <button type="button" class="btn col-2 btn-success" @click="addToCart(prod)"><i class="bi bi-cart-plus-fill"></i></button>
                                </div>
                        </form>


                        
                </div>
        </div>
        `,
        data(){
                return{
                        token: localStorage.getItem("auth-token"),
                }
        },
        methods: {
                async addToCart(prod){
                        const res = await fetch(`/customer/cart/add/${prod.id}`,{
                                headers: {
                                        'Authentication-Token': this.token
                                }
                        });
                        const data = await res.json().catch((e)=>{});
                        if(res.ok){
                                alert(data.message);
                                this.$router.go(0);
                        }else{
                                alert(data.message);
                        }

                        // console.log(prod.name)

                },
                async removeFromCart(prod){
                        const res = await fetch(`/customer/cart/remove/${prod.id}`,{
                                headers: {
                                        'Authentication-Token': this.token
                                }
                        });
                        const data = await res.json().catch((e)=>{});
                        if(res.ok){
                                alert(data.message);
                                this.$router.go(0);
                        }else{
                                alert(data.message);
                        }

                        // console.log(prod.name)

                }

        }
}