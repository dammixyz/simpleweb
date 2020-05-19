/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import VueRouter from 'vue-router'
import {AlertError, Form, HasError} from 'vform'
import moment from 'moment'
import VueProgressBar from 'vue-progressbar'
import Gate from "./Gate";
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'


//Custom auth
Vue.prototype.$gate = new Gate(window.user);

// SweetAlert2
window.Swal = Swal


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
window.Toast = Toast

window.Form = Form;

window.Fire = new Vue()

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

const options = {
    color: '#bffaf3',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}

Vue.use(VueProgressBar, options)


Vue.use(VueRouter)
/* Routes */
const routes = [
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '/invoice', component: require('./components/Invoice.vue').default },
    { path: '*', component: require('./components/NotFound.vue').default }
]

/* Vue Router instance */
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})


//Global filters
Vue.filter('upFirstLetter', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})
Vue.filter('fancyDate', function (date) {
    if (!date) return ''
    return moment(date).format('MMMM Do YYYY');
})


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('not-found', require('./components/NotFound.vue').default);
Vue.component('pagination', require('laravel-vue-pagination'));

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    data: {
        search: ''
    },
    methods: {
        searchit: _.debounce(() => {
            Fire.$emit('searching')
        }, 1000)
    }
});
