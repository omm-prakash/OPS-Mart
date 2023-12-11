export default {
        template: `
        <div class="container-fluid">
                <div class="row">
                        <!-- Image Section (40% width) -->
                        <div class="col-md-5 p-0" style="height: 94vh;">
                                <img src="./static/images/admin.jpg" alt="Your Image" class="img-fluid h-100 w-100">
                        </div>
                        <!-- Content Section (60% width) -->
                        <div class="col-md-7">
                                <div class="content-container p-4">
                                        <h1>Welcome, {{ admin.username }} </h1>
                                        <div class="text-muted">
                                                <p class="mb-0">Administrator, OPS Mart</p>
                                                <!-- <p >"The only way to do great work is to love what you do." - Steve Jobs</p> -->
                                        </div>
                                        <hr>
                                        <p style="text-align: justify;">As an administrator, adhere to a set of fundamental principles to ensure a thriving community. Uphold transparency and fairness in decision-making, fostering an inclusive environment. Exercise prudence in utilizing privileges, prioritizing the collective well-being. Maintain open channels of communication, valuing feedback and collaboration. Safeguard the integrity of data and user information with utmost diligence.</p>
                                        <p style="text-align: justify;">Hello, I am Omm Prakash, the director of this amazing platform. I believe in the power of innovation and collaboration to create something extraordinary.</p>
                                        <h4>Admin Privileges</h4>
                                        <p class="text-muted">Core Category Management</p>
                                        <!-- <hr> -->
                                        <div class="container">
                                                <ul>
                                                        <li>Create New Category <ul>
                                                                        <li>Storage handles multiple languages (usually UTF-8 encoding)</li>
                                                                </ul>
                                                        </li>
                                                        <li>Edit Category <ul>
                                                                        <li>Change title or description</li>
                                                                </ul>
                                                        </li>
                                                        <li>Remove Category <ul>
                                                                        <li>With confirmation from the admin</li>
                                                                </ul>
                                                        </li>
                                                        <li>Approve Requests From Store Managers <ul>
                                                                        <li>Add new categories, edit, or delete existing categories</li>
                                                                </ul>
                                                        </li>
                                                </ul>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
        `,
        data(){
                return{
                        admin: {
                                username: "OPS"
                        },
                        token: localStorage.getItem("auth-token")
                }
        },
        async mounted() {
                const res = await fetch("/profile", {
                        headers: {
                                "Authentication-Token": this.token
                        },
                })
                const data = await res.json().catch((e)=>{})
                if(res.ok){
                        this.admin = data;
                        console.log(data);
                }
        },

}