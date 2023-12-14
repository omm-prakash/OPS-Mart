export default {
        template: `
        <div class="container-fluid">
                <div class="row">
                        <div class="col-md-9 p-0 bg-light" style="height: 94vh;">
                                <div class="container-fluid  m-3 p-4" style="max-height: 94vh; overflow-y: auto; ">
                                        <h2><span v-if="profile.username">{{profile.username}}'s</span><span v-else>Your</span> Cart</h2>
                                        <p><strong><i class="bi bi-envelope"></i> Email: </strong><span class="text-primary">{{profile.email}}</span></p>
                                        <!-- <hr> -->
                                        <br>
                                        <table class="table p-4 table-hover table-light text-center" v-if="cart">
                                                <thead>
                                                        <tr>
                                                                <th scope="col"></th>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Seller</th>
                                                                <th scope="col">Quantity</th>
                                                                <th scope="col">Price</th>
                                                                <th scope="col">Actions</th>
                                                                <th scope="col">Delete</th>
                                                                <th scope="col">Total Cost</th>
                                                        </tr>
                                                </thead>
                                                <tbody>

                                                <tr v-for="(card,index) in cart" class="text-center">
                                                        <th scope="row">
                                                                <input class="form-check-input" type="checkbox" v-model="selectedCards" :value="card"/>
                                                        </th>
                                                        <td>{{index+1}}</td>
                                                        <td>{{card.product_id.name}}</td>
                                                        <td>{{card.product_id.manager}}</td>
                                                        <td>{{card.quantity}} {{card.product_id.type}}</td>
                                                        <td><span>&#8377;</span> {{card.product_id.cost}}</td>
                                                        <td class="text-center">
                                                                        <div class="btn-group col-auto" role="group">
                                                                                <button type="button" class="btn col-2 btn-danger" @click="removeFromCart(card.product_id)"><i class="bi bi-cart-dash-fill"></i></button>
                                                                                <button type="button" class="btn col-2 btn-success" @click="addToCart(card.product_id)"><i class="bi bi-cart-plus-fill"></i></button>
                                                                        </div>
                                                        </td>
                                                        <td >
                                                                <button type="button" class="btn btn-outline-danger" @click="deleteCard(card.product_id)">
                                                                        <i class="bi bi-trash"></i>
                                                                </button>
                                                        </td>
                                                        <td><span>&#8377;</span> {{card.quantity*card.product_id.cost}}</td>
                                                </tr>
                                        
                                                        <tr class="border border-light">
                                                                <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                                                <td>Total Price</td>
                                                                <td><span>&#8377;</span> {{ total_cost }}</td>
                                                        </tr>
                                                </tbody>
                                        </table>
                                        <form class="row align-items-center" v-if="cart">
                                                <div class="btn-group col-auto" role="group">
                                                        <button type="button" class="btn col-2 btn-info" @click="placeOrder">
                                                                <i class="bi bi-bag-heart-fill"></i> Place Order
                                                        </button>
                                                </div>
                                        </form>
                                        <p class="align-items-center text-danger" v-if="!cart"><span><i class="bi bi-emoji-frown text-danger" style="font-size: 1.5em;"></i></span>  No product added..</p>

                                </div>
                        </div>
                        <div class="col-md-3 p-0" style="height: 94vh; background-image: url('../static/images/cart.jpg'); background-size: cover;">
                        </div>
                </div>
        </div>
        `,
        data(){
                return{
                        token: localStorage.getItem("auth-token"),
                        profile: {
                                username: null
                        },
                        cart: null,
                        selectedCards: [],
                        card: null
                        // selectedCard: null
                }
        },
        async mounted(){
                const prof = await fetch('/api/profile',{
                        headers: {
                                "Authentication-Token": this.token
                        }
                });
                const p = await prof.json().catch((e)=>{});
                if(prof.ok){
                        this.profile = p;
                        // console.log(profile);
                }

                const res = await fetch('/customer/cart/get',{
                        headers: {
                                "Authentication-Token": this.token
                        }
                });
                const data = await res.json().catch((e)=>{});
                if(res.ok){
                        if(data && data.length>0){
                                // console.log(data)
                                // data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
                                this.cart = data;
                        }
                }

        },
        computed:{
                total_cost: function(){
                        let net_cost = 0;
                        // console.log(this.selectedCards.length);
                        if(this.selectedCards.length==0 && this.cart){
                                // console.log(this.cart)
                                for (let cd of this.cart){
                                        net_cost += cd.quantity*cd.product_id.cost; 
                                }
                        }else{
                                for (let cd of this.selectedCards){
                                        net_cost += cd.quantity*cd.product_id.cost; 
                                }
        
                        }
                        return net_cost
                }
        },
        methods: {
                async placeOrder(){
                        for(let crd of this.selectedCards){
                                const res = await fetch(`/customer/buy`,{
                                        headers: {
                                                'Authentication-Token': this.token,
                                                'content-type': 'application/json'
                                        },
                                        method: 'POST',
                                        body: JSON.stringify({'id':crd.id})
                                });
                                const data = await res.json().catch((e)=>{});
                                if(res.ok){
                                        alert(data.message);
                                        this.$router.go(0);
                                }else{
                                        alert(data.message);
                                }
                        }
                        // console.log(this.selectedCards)
                },
                handleOrder(){
                        // this.selectedCards.push(selectedCard)
                        console.log('from cart',this.selectedCards)
                },
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

                },
                async deleteCard(prod){
                        const res = await fetch(`/customer/cart/delete/${prod.id}`,{
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
        },
        components: {
                // cartElement
        }
}

/* <cartElement v-for="(card,index) in cart" :card="card" :index="index+1" @update:selectedCard="handleOrder"/> */
                                                