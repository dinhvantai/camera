import { callApiFetchCategories, callApiAddCategory } from '../api'
import { callApiEditCategory, callApiDeleteCategory } from '../api'
import Helper from 'admin/library/Helper'

export const CATEGORY_TYPE_PRODUCT = 'product'
export const CATEGORY_TYPE_POST = 'post'

export const CATEGORY_STATUS_SHOW = true
export const CATEGORY_STATUS_HIDDEN = false


export const ADMIN_CATEGORY_TYPE_OPTION = [
    { value: CATEGORY_TYPE_PRODUCT, text: 'textTypeProduct' },
    { value: CATEGORY_TYPE_POST, text: 'textTypePost' }
]

const ADMIN_CATEGORY_FETCH = 'admin_category_fetch'
const ADMIN_CATEGORY_MODAL_ADD = 'admin_category_modal_add'
const ADMIN_CATEGORY_MODAL_EDIT = 'admin_category_modal_edit'
const ADMIN_CATEGORY_CHANGE_TAB = 'admin_category_change_tab'

const state = {
    categories: [],
    modalAdd: {
        open: false
    },
    modalEdit: {
        open: false,
        formData: {}
    },
    currentTab: ADMIN_CATEGORY_TYPE_OPTION[0].value,
}

const mutations = {
    [ADMIN_CATEGORY_FETCH](state, { categories }) {
        return state.categories = categories;
    },

    [ADMIN_CATEGORY_MODAL_ADD](state, { modalAdd }) {
        return state.modalAdd = modalAdd;
    },

    [ADMIN_CATEGORY_MODAL_EDIT](state, { modalEdit }) {
        return state.modalEdit = modalEdit;
    },

    [ADMIN_CATEGORY_CHANGE_TAB](state, { value }) {
        return state.currentTab = value
    },
}

const actions = {
    async callFetchCategories({ commit }, { vue, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiFetchCategories(params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            let categories = response.data.map((category) => {
                return { 
                    ...category, 
                    status: category.status ? true: false
                }
            })

            return commit(ADMIN_CATEGORY_FETCH, { categories });
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    async callCategoryAdd({ commit }, { vue, params }) {
        let modalAdd = vue.$store.state.storeAdminCategory.modalAdd

        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiAddCategory(params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            commit(ADMIN_CATEGORY_MODAL_ADD, { modalAdd: { ...modalAdd, open:false } })
            vue.$store.dispatch('callFetchCategories', { vue })

            return vue.$toaster.success(response.data.message);
        }

        commit(ADMIN_CATEGORY_MODAL_ADD, { modalAdd: { ...modalAdd, open:true } })

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    setCategoryModalAdd({ commit }, { modalAdd }) {
        return commit(ADMIN_CATEGORY_MODAL_ADD, { modalAdd })
    },

    async callCategoryEdit({ commit }, { vue, id, params }) {
        let modalEdit = vue.$store.state.storeAdminCategory.modalEdit

        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiEditCategory(id, params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            commit(ADMIN_CATEGORY_MODAL_EDIT, { modalEdit: { ...modalEdit, open:false } })
            vue.$store.dispatch('callFetchCategories', { vue })

            return vue.$toaster.success(response.data.message);
        }

        commit(ADMIN_CATEGORY_MODAL_EDIT, { modalEdit: { ...modalEdit, open:true } })

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    setCategoryModalEdit({ commit }, { modalEdit }) {
        return commit(ADMIN_CATEGORY_MODAL_EDIT, { modalEdit})
    },

    async callCategoryDelete({ commit }, { vue, id }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiDeleteCategory(id)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            vue.$store.dispatch('callFetchCategories', { vue })

            return vue.$toaster.success(response.data.message);
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    actionCategoryChangeTab({ commit }, value) {
        return commit(ADMIN_CATEGORY_CHANGE_TAB, { value })
    },
}

const storeAdminCategory = {
    state,
    actions,
    mutations
}

export default storeAdminCategory;
