import { callApiFetchProducts, callApiAddProduct } from '../api'
import { callApiEditProduct, callApiDeleteProduct, callApiShowProduct } from '../api'
import Helper from 'admin/library/Helper'

export const PRODUCT_STATUS_SHOW = true
export const PRODUCT_STATUS_HIDDEN = false

const ADMIN_PRODUCT_FETCH = 'admin_product_fetch'
const ADMIN_PRODUCT_SET_PAGE = 'admin_product_set_page'
const ADMIN_PRODUCT_SET_PRODUCT = 'admin_product_set_product'
const ADMIN_PRODUCT_DELETE = 'admin_product_delete'
const ADMIN_PRODUCT_SET_FILTER = 'admin_product_set_filter'

const state = {
    products: [],
    edit: {
        product: {}
    },
    currentPage: 1,
    valueFilter: '',
}

const mutations = {
    [ADMIN_PRODUCT_FETCH](state, { products }) {
        return state.products = products;
    },

    [ADMIN_PRODUCT_SET_PAGE](state, { page }) {
        return state.currentPage = page
    },
    
    [ADMIN_PRODUCT_SET_PRODUCT](state, { product }) {
        return state.edit.product = product
    },

    [ADMIN_PRODUCT_DELETE](state, { id }) {
        return state.products = state.products.filter((p) => p.id !== id)
    },

    [ADMIN_PRODUCT_SET_FILTER](state, { value }) {
        return state.valueFilter = value
    },
}

const actions = {
    async callFetchProducts({ commit }, { vue, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiFetchProducts(params);
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            return commit(ADMIN_PRODUCT_FETCH, { products: response.data });
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    actionProductSetPage({ commit }, { page }) {
        return commit(ADMIN_PRODUCT_SET_PAGE, { page })
    },

    async callProductAdd({ commit }, { vue, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiAddProduct(params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })
        
        if (response.status == 200) {
            vue.$toaster.success(response.data.message);

            return vue.$router.push({ path: '/products' })
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    async callProductShow( { commit }, { vue, id }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiShowProduct(id)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            return commit(ADMIN_PRODUCT_SET_PRODUCT, { product: response.data })
        }

        vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));

        return vue.$router.push({ path: '/products' })
    },

    async callProductEdit({ commit }, { vue, id, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiEditProduct(id, params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            vue.$toaster.success(response.data.message)
            
            return vue.$router.push({ path: '/products' })
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    async callProductDelete({ commit }, { vue, id }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiDeleteProduct(id)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            commit(ADMIN_PRODUCT_DELETE, { id })

            return vue.$toaster.success(response.data.message);
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    actionProductSetFilter({ commit }, { value }) {
        return commit(ADMIN_PRODUCT_SET_FILTER, { value })
    },
}

const storeAdminProduct = {
    state,
    actions,
    mutations
}

export default storeAdminProduct;
