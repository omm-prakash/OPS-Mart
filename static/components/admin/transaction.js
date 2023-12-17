
export default {
        template: `
        <div class="container-fluid">
                <div class="row">
                        <div class="col-md-4 p-0" style="height: 94vh; background-image: url('../static/images/product.jpg'); background-size: cover;">
                        </div>
                        <div class="col-md-8 bg-light p-1" style="height: 94vh;">
                                <div class="container-fluid  m-3 p-4" style="max-height: 94vh; overflow-y: auto; ">
                                        <h2>Transaction Chart</h2>
                                        
                                        <!-- <hr> -->
                                        <br>
                                        <table class="table p-4 table-hover table-light" v-if="cart">
                                                <thead class="text-center">
                                                        <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Manager</th>
                                                                <th scope="col">Quantity</th>
                                                                <th scope="col">Price</th>
                                                                <th scope="col">Ordered On</th>
                                                                <th scope="col">Bill Amount</th>
                                                        </tr>
                                                </thead>
                                                <tbody class="text-center">

                                                <tr v-for="(card,index) in cart">
                                                        <td>{{index+1}}</td>
                                                        <td>{{card.product_id.name}}</td>
                                                        <td>{{card.product_id.manager}}</td>
                                                        <td>{{card.quantity}} {{card.product_id.type}}</td>
                                                        <td><span>&#8377;</span> {{card.product_id.cost}}</td>
                                                        <td>{{card.transaction_date.slice(0,-6)}}</td>
                                                        <td><span>&#8377;</span> {{card.quantity*card.product_id.cost}}</td>
                                                </tr>
                                        
                                                        <tr class="border border-light">
                                                                <td></td><td></td><td></td><td></td><td></td>
                                                                <td>Total Amount</td>
                                                                <td> <strong><span>&#8377;</span> {{ total_cost }}</strong></td>
                                                        </tr>
                                                </tbody>
                                        </table>
                                        <form class="row align-items-center text-danger">
                                        <p v-if="cart"><span><i class="bi bi-chat-left-heart text-warning" style="font-size: 2em;"></i>  </span>     Thanks {{profile.username}}, for your great leadership...</p>
                                        <p class="align-items-center text-danger" v-if="!cart"><span><i class="bi bi-receipt text-danger" style="font-size: 1.5em;"></i></span>  No transaction till yet..</p>
                                        </form>
                                </div>
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

                const res = await fetch('/customer/transactions',{
                        headers: {
                                "Authentication-Token": this.token
                        }
                });
                const data = await res.json().catch((e)=>{});
                if(res.ok){
                        if(data && data.length>0){
                                // console.log(data)
                                data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
                                this.cart = data;
                        }
                        
                        // console.log(this.cart.length);
                }else{
                        // alert(data.message)
                        
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
}

                                                