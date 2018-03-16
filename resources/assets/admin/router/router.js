import VueRouter from 'vue-router'

import { STORAGE_AUTH } from '../modules/auth/store/'
import Admin from '../components/Admin.vue'

import Login from '../modules/auth/views/Login.vue'
import Dashboard from '../modules/dashboard/views/Dashboard.vue'

import AdminMenu from '../modules/menu/views/AdminMenu.vue'
import AdminCategory from '../modules/category/views/AdminCategory.vue'

import AdminProduct from '../modules/product/views/AdminProduct.vue'
import AdminProductAdd from '../modules/product/views/AdminProductAdd.vue'
import AdminProductEdit from '../modules/product/views/AdminProductEdit.vue'

import AdminPost from '../modules/post/views/AdminPost.vue'
import AdminPostAdd from '../modules/post/views/AdminPostAdd.vue'
import AdminPostEdit from '../modules/post/views/AdminPostEdit.vue'

import AdminBanner from '../modules/banner/views/AdminBanner.vue'

import AdminSetup from '../modules/setup/views/AdminSetup.vue'

const router =  new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
            component: Admin,
            name: 'Trang chủ',
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/dashboard',
                    name: 'Quản lý',
                    component: Dashboard
                },
                {
                    path: '/menus',
                    name: 'Menus',
                    component: AdminMenu
                },
                {
                    path: '/categories',
                    name: 'Danh mục',
                    component: AdminCategory
                },
                {
                    name: 'Sản phẩm',
                    path: '/products',
                    component: {
                        render(c) { 
                            return c('router-view')
                        }
                    },
                    children: [
                        {
                            path: '',
                            name: 'Danh sách sản phẩm',
                            component: AdminProduct
                        },
                        {
                            path: 'add',
                            name: 'Thêm mới sản phẩm',
                            component: AdminProductAdd
                        },
                        {
                            path: 'edit/:id',
                            name: 'Cập nhật sản phẩm',
                            component: AdminProductEdit
                        }
                    ]
                },
                {
                    name: 'Bài viết',
                    path: '/posts',
                    component: {
                        render(c) { 
                            return c('router-view')
                        }
                    },
                    children: [
                        {
                            path: '',
                            name: 'Danh sách bài viết',
                            component: AdminPost
                        },
                        {
                            path: 'add',
                            name: 'Thêm mới bài viết',
                            component: AdminPostAdd
                        },
                        {
                            path: 'edit/:id',
                            name: 'Cập nhật bài viết',
                            component: AdminPostEdit
                        }
                    ]
                },
                {
                    name: 'Banners',
                    path: 'banners',
                    component: AdminBanner
                },
                {
                    name: 'Cài đặt',
                    path: 'setups',
                    component: AdminSetup
                },
            ]
        },
        {
            path: '/login',
            name: 'Đăng nhập',
            component: Login
        },
        // {
        //     path: '*',
        //     redirect: '/dashboard'
        // }
    ]

});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const auth = JSON.parse(window.localStorage.getItem(STORAGE_AUTH)) || {};

        if (!auth || !auth.token || !auth.token.access_token) {
            return next({ path: '/login' })
        }
    }

    return next();
})

export default router;
