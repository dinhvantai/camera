import { callApiFetchPosts, callApiAddPost } from '../api'
import { callApiEditPost, callApiDeletePost, callApiShowPost } from '../api'
import Helper from 'admin/library/Helper'

export const POST_STATUS_SHOW = true
export const POST_STATUS_HIDDEN = false

const ADMIN_POST_FETCH = 'admin_post_fetch'
const ADMIN_POST_SET_PAGE = 'admin_post_set_page'
const ADMIN_POST_SET_POST = 'admin_post_set_post'
const ADMIN_POST_DELETE = 'admin_post_delete'
const ADMIN_POST_SET_FILTER = 'admin_post_set_filter'

const state = {
    posts: [],
    currentPage: 1,
    edit: {
        post: {}
    },
    valueFilter: '',
}

const mutations = {
    [ADMIN_POST_FETCH](state, { posts }) {
        return state.posts = posts;
    },

    [ADMIN_POST_SET_PAGE](state, { page }) {
        return state.currentPage = page
    },

    [ADMIN_POST_SET_POST](state, { post }) {
        return state.edit.post = post
    },

    [ADMIN_POST_DELETE](state, { id }) {
        return state.posts = state.posts.filter((p) => p.id !== id)
    },

    [ADMIN_POST_SET_FILTER](state, { value }) {
        return state.valueFilter = value
    },
}

const actions = {
    async callFetchPosts({ commit }, { vue, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiFetchPosts(params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            return commit(ADMIN_POST_FETCH, { posts: response.data });
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    actionPostSetPage({ commit }, { page }) {
        return commit(ADMIN_POST_SET_PAGE, { page })
    },

    async callPostAdd({ commit }, { vue, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiAddPost(params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            vue.$toaster.success(response.data.message);

            return vue.$router.push({ path: '/posts' })
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    async callPostShow( { commit }, { vue, id }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiShowPost(id)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })
        
        if (response.status == 200) {
            return commit(ADMIN_POST_SET_POST, { post: response.data })
        }

        vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));

        return vue.$router.push({ path: '/posts' })
    },

    async callPostEdit({ commit }, { vue, id, params }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiEditPost(id, params)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            vue.$toaster.success(response.data.message)
            
            return vue.$router.push({ path: '/posts' })
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    async callPostDelete({ commit }, { vue, id }) {
        let mainLoading = vue.$store.state.storeLoading.mainLoading
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: true })
        let response = await callApiDeletePost(id)
        vue.$store.dispatch('setAdminMainLoading', { ...mainLoading, show: false })

        if (response.status == 200) {
            commit(ADMIN_POST_DELETE, { id })

            return vue.$toaster.success(response.data.message);
        }

        return vue.$toaster.error(Helper.getFirstError(response, vue.$i18n.t('textDefaultErrorRequest')));
    },

    actionPostSetFilter({ commit }, { value }) {
        return commit(ADMIN_POST_SET_FILTER, { value })
    },
}

const storeAdminPost = {
    state,
    actions,
    mutations
}

export default storeAdminPost;
