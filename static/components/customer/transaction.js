
export default {
        template: `
        <div class="container-fluid">
                <div class="row">
                        <div class="col-md-4 p-0" style="height: 94vh; background-image: url('../static/images/product.jpg'); background-size: cover;">
                        </div>
                        <div class="col-md-8 bg-light p-1" style="height: 94vh;">
                                <div class="container-fluid  m-3 p-4" style="max-height: 94vh; overflow-y: auto; ">
                                        <h2><span v-if="profile.username">{{profile.username}}'s</span><span v-else>Your</span> Transactions</h2>
                                        
                                        <!-- <hr> -->
                                        <p v-if="cart" class="text-secondary">
                                                <strong class="text-dark">
                                                        Current Month Recipt: 
                                                </strong>
                                                <span class="text-dark"> &nbsp;
                                                        <button type="button" class="btn btn-link p-0 " style="text-decoration: none;" @click='downlodResourcePDF'>
                                                        <i class="bi bi-filetype-pdf text-primary" style="font-size: 2em;"></i>
                                                        </button>&nbsp;&nbsp;
                                                        <button type="button" class="btn btn-link p-0 " style="text-decoration: none;" @click='downlodResourceHTML'>
                                                        <i class="bi bi-filetype-html text-danger" style="font-size: 2em;"></i>
                                                        </button>
                                                </span>
                                                <span class="spinner-border spinner-border-sm" aria-hidden="true" v-if="isWaiting"></span>
                                                <span role="status" v-if="isWaiting"> Downloading...</span>
                                        </p>

                                        <table class="table p-4 table-hover table-light text-center" v-if="cart">
                                                <thead class="text-center">
                                                        <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Name</th>
                                                                <th scope="col">Seller</th>
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
                                                                <td><span>&#8377;</span> <strong>{{ total_cost }}</strong></td>
                                                        </tr>
                                                </tbody>
                                        </table>
                                        <br><br><br><br>
                                        <p class="align-items-center text-danger" v-if="cart"><span><i class="bi bi-bag-heart text-danger" style="font-size: 2em;"></i></span>  Thanks {{profile.username}}, for being our loyal customer...</p>
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
                                data.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
                                this.cart = data;
                        }
                }
        },
        computed: {
                total_cost: function () {
                        let net_cost = 0;
                        if (this.selectedCards.length == 0 && this.cart) {
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
                async downlodResourcePDF() {
                        this.isWaiting = true
                        const res = await fetch('/customer/get/transaction/report/pdf', {
                                headers: {
                                        "Authentication-Token": this.token
                                }
                        })
                        const data = await res.json().catch((e) => { })
                        if (res.ok) {
                                const intv = setInterval(async () => {
                                        const pdf_res = await fetch(`/customer/download/transaction/report/pdf/${data['doc-id']}`)
                                        if (pdf_res.ok) {
                                                this.isWaiting = false
                                                clearInterval(intv)
                                                window.location.href = `/customer/download/transaction/report/pdf/${data['doc-id']}`
                                                alert('Recipt downloaded!!')
                                        }
                                }, 1000)
                        }
                },
                async downlodResourceHTML() {
                        this.isWaiting = true
                        const res = await fetch('/customer/get/transaction/report/html', {
                                headers: {
                                        "Authentication-Token": this.token
                                }
                        })
                        const data = await res.json().catch((e) => { })
                        if (res.ok) {
                                const intv = setInterval(async () => {
                                        const pdf_res = await fetch(`/customer/download/transaction/report/html/${data['doc-id']}`)
                                        if (pdf_res.ok) {
                                                this.isWaiting = false
                                                clearInterval(intv)
                                                window.location.href = `/customer/download/transaction/report/html/${data['doc-id']}`
                                                alert('Recipt downloaded!!')
                                        }
                                }, 1000)
                        }
                },
        }

}

