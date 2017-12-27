import Login from './views/common/Login.vue'
import NotFound from './views/common/404.vue'
// import Home from './views/Home.vue'
import ProductList from './views/common/ProductList.vue'
import Control from './views/buss/Control.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/products',
        component: ProductList,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/login'}
    },
    {
        path: '/control',
        component: Control,
        name: '',
        hidden: true
    }
];

export default routes;
