
export default {
        template: `
        <div class="container-fluid">
                <div class="row">
                        <div class="col-md-4 p-0" style="height: 94vh; background-image: url('../static/images/product.jpg'); background-size: cover;">
                        </div>
                        <div class="col-md-8 bg-light p-1" style="height: 94vh;">
                                <div class="container-fluid  m-3 p-4" style="max-height: 94vh; overflow-y: auto; ">
                                        <h2>Transaction Chart</h2>
                                        <ul class="list-unstyled px-0">
                                                <li><p><strong><i class="bi bi-envelope"></i> Email: </strong><span class="text-primary">{{profile.email}}</span></p></li>
                                        </ul>
                                        <!-- <hr> -->
                                        <br>
                                        <table class="table p-4 table-hover table-light" v-if="cart">
                                                <thead class="text-center">
                                                        <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Name</th>
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
                                                        <td>{{card.quantity}}</td>
                                                        <td>{{card.product_id.cost}}</td>
                                                        <td>{{card.transaction_date.slice(0,-6)}}</td>
                                                        <td><span>&#8377;</span> {{card.quantity*card.product_id.cost}}</td>
                                                </tr>
                                        
                                                        <tr class="border border-light">
                                                                <td></td><td></td><td></td><td></td>
                                                                <td>Total Amount</td>
                                                                <td> <strong><span>&#8377;</span> {{ total_cost }}</strong></td>
                                                        </tr>
                                                </tbody>
                                        </table>
                                        <p v-if="cart" class="text-secondary">
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
                                        <br><br><br><br>
                                        <p v-if="cart"><span><i class="bi bi-box2-heart text-danger" style="font-size: 2em;"></i></span>  Thanks {{profile.username}}, for being our loyal store manager...</p>                                                
                                        <p class="align-items-center text-danger" v-if="!cart"><span><i class="bi bi-receipt text-danger" style="font-size: 1.5em;"></i></span>  No transaction till yet..</p>

                                </div>
                        </div>
                </div>
        </div>
        `,
        data() {
                return {
                        token: localStorage.getItem("auth-token"),
                        profile: {
                                username: null
                        },
                        cart: null,
                        selectedCards: [],
                        card: null,
                        isWaiting: false
                        // selectedCard: null
                }
        },
        async mounted() {
                const prof = await fetch('/api/profile', {
                        headers: {
                                "Authentication-Token": this.token
                        }
                });
                const p = await prof.json().catch((e) => { });
                if (prof.ok) {
                        this.profile = p;
                        // console.log(profile);
                }

                const res = await fetch('/customer/transactions', {
                        headers: {
                                "Authentication-Token": this.token
                        }
                });
                const data = await res.json().catch((e) => { });
                if (res.ok) {
                        if (data && data.length > 0) {
                                // console.log(data)
                                data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
                                this.cart = data;
                        }

                        // console.log(this.cart.length);
                }
        },
        computed: {
                total_cost: function () {
                        let net_cost = 0;
                        // console.log(this.selectedCards.length);
                        if (this.selectedCards.length == 0 && this.cart) {
                                // console.log(this.cart)
                                for (let cd of this.cart) {
                                        net_cost += cd.quantity * cd.product_id.cost;
                                }
                        } else {
                                for (let cd of this.selectedCards) {
                                        net_cost += cd.quantity * cd.product_id.cost;
                                }

                        }
                        return net_cost
                }
        },
        methods: {
                async downlodResource() {
                        this.isWaiting = true
                        const res = await fetch('/manager/get/transaction/report',{
                                headers: {
                                        "Authentication-Token": this.token
                                }
                        })
                        const data = await res.json()
                        if (res.ok) {
                                const taskId = data['task-id']
                                const intv = setInterval(async () => {
                                        const csv_res = await fetch(`/manager/download/transaction/report/${taskId}`,{
                                                headers: {
                                                        "Authentication-Token": this.token
                                                }                        
                                        })
                                        if (csv_res.ok) {
                                                this.isWaiting = false
                                                clearInterval(intv)
                                                window.location.href = `/manager/download/transaction/report/${taskId}`
                                                alert('CSV Report downloaded!!')
                                        }
                                }, 1000)
                        }
                },
        }
}

