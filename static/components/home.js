import manager from "./manager/home.js";
import admin from "./admin/home.js";
import customer from "./customer/home.js";
import landing from "./landing.js";

export default {
        template: `
        <div>
                <admin v-if="userRole=='admin'" />
                <manager v-else-if="userRole=='manager'" />
                <customer v-else-if="userRole=='customer'" />
                <landing v-else/>
                
        </div> 
        `,
        data(){
                return {
                        userRole: localStorage.getItem('role'),
                        authToken: localStorage.getItem('auth-token'),
                }
        },
        components: {
                manager,
                admin,
                customer,
                landing
        },
}
