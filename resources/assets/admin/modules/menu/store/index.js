import { callApiFetchMenus, callApiAddMenu } from '../api'
import { callApiEditMenu, callApiDeleteMenu } from '../api'
import Helper from 'admin/library/Helper'

export const MENU_POSITION_ON_TOP_LEFT = 'top_left'
export const MENU_POSITION_ON_TOP_RIGHT = 'top_right'


export const ADMIN_MENU_POSITION_OPTION = [
    { value: MENU_POSITION_ON_TOP_LEFT, text: 'textPositionOnTopLeft' },
    { value: MENU_POSITION_ON_TOP_RIGHT, text: 'textPositionOnTopRight' }
]

const ADMIN_MENU_FETCH = 'admin_menu_fetch'
const ADMIN_MENU_MODAL_ADD = 'admin_menu_modal_add'
const ADMIN_MENU_MODAL_EDIT = 'admin_menu_modal_edit'

const state = {
    menus: [],
    modalAdd: {
        open: false
    },
    modalEdit: {
        open: false,
        formData: {}
    }
}

const mutations = {
    [ADMIN_MENU_FETCH](state, { menus }) {
        return state.menus = menus
    },

    [ADMIN_MENU_MODAL_ADD](state, { modalAdd }) {
        return state.modalAdd = modalAdd;
    },

    [ADMIN_MENU_MODAL_EDIT](state, { modalEdit }) {
        return state.modalEdit = modalEdit;
    }
}

const actions = {
    async callFetchMenus({ commit }, { vue, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiFetchMenus(params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            return commit(ADMIN_MENU_FETCH, { menus: response.data });
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    async callMenuAdd({ commit }, { vue, params }) {
        let modalAdd = vue.$store.state.storeAdminMenu.modalAdd

        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiAddMenu(params)    
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })
        
        if (response.status == 200) {
            commit(ADMIN_MENU_MODAL_ADD, { modalAdd: { ...modalAdd, open: false }})
            vue.$store.dispatch('callFetchMenus', { vue, params })

            return vue.$toaster.success(response.data.message);
        }

        commit(ADMIN_MENU_MODAL_ADD, { modalAdd: { ...modalAdd, open: true }})

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    setMenuModalAdd({ commit }, { modalAdd }) {
        return commit(ADMIN_MENU_MODAL_ADD, { modalAdd })
    },

    async callMenuEdit({ commit }, { vue, id, params }) {
        let modalEdit = vue.$store.state.storeAdminMenu.modalEdit

        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiEditMenu(id, params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            commit(ADMIN_MENU_MODAL_EDIT, { modalEdit: { ...modalEdit, open:false } })
            vue.$store.dispatch('callFetchMenus', { vue, params })

            return vue.$toaster.success(response.data.message);
        }
        
        commit(ADMIN_MENU_MODAL_EDIT, { modalEdit: { ...modalEdit, open:true } })

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    setMenuModalEdit({ commit }, { modalEdit }) {
        return commit(ADMIN_MENU_MODAL_EDIT, {modalEdit})
    },

    async callMenuDelete({ commit }, { vue, id }) {

        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiDeleteMenu(id)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            vue.$store.dispatch('callFetchMenus', { vue })
            
            return vue.$toaster.success(response.data.message);
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    }
}

const storeAdminMenu = {
    state,
    actions,
    mutations
}

export default storeAdminMenu;
