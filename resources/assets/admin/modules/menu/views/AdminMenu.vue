<template>
    <b-row>
        <AdminMenuAdd
            :submitModalAdd='submitModalAdd'
            :modalAdd="modalAdd"
            :hideModalAdd="hideModalAdd"
            :parentMenuOption="parentMenuOption"
        />
        <AdminMenuEdit
            :submitModalEdit='submitModalEdit'
            :modalEdit.sync="modalEdit"
            :hideModalEdit="hideModalEdit"
            :parentMenuOption="parentMenuOption"
        />
        <b-col lg="12">
            <b-button-group class="pull-right">
                <b-button variant="success" @click="clickAddNewMenu">
                    <i class="icon-plus"></i>
                    {{ $t('textAddMenu') }}
                </b-button>
            </b-button-group>
        </b-col>
        <b-col lg="12">
            <b-card>
                <b-table
                    class="mb-0 table-outline text-center"                    
                    head-variant="light"
                    :hover="true" :striped="false"
                    :bordered="true" :fixed="true" 
                    :items="items"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                >
                    <template slot="name" slot-scope="data">
                        <!-- <img :src="`/${data.item.icon}`" v-if="data.item.icon" style="height: 37px"> -->
                        {{ data.item.name }}
                    </template>
                    <template slot="position" slot-scope="data">
                        {{ getTextPosition(data) }}
                    </template>
                    <template slot="action" slot-scope="data">
                        <b-button
                            type="submit" size="sm"
                            variant="primary"
                            @click="clickEditMenu(data.item)"
                        >
                            <i class="icon-pencil"></i>
                            {{ $t('textEdit') }}
                        </b-button>
                        <b-button
                            type="reset" size="sm"
                            variant="danger"
                            @click="clickDeleteMenu(data.item.id)"
                        >
                            <i class="icon-trash"></i>
                            {{ $t('textDelete') }}
                        </b-button>
                    </template>
                </b-table>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    import AdminMenuAdd from './AdminMenuAdd.vue'
    import AdminMenuEdit from './AdminMenuEdit.vue'

    import Helper from 'admin/library/Helper'

    export default {
        name: 'AdminMenu',
        components: { AdminMenuAdd, AdminMenuEdit },

        beforeCreate() {
            Helper.changeTitleAdminPage(this.$i18n.t('textManageMenu'))
            this.$store.dispatch('callFetchMenus', { vue: this })
        },

        data() {
            return {
                fields: [
                    {key: 'name', label: this.$i18n.t('textName'), tdClass: ' text-left'},
                    {key: 'path', label: this.$i18n.t('textLink'), tdClass: ' text-left'},
                    {key: 'prioty', label: this.$i18n.t('textPrioty')},
                    {key: 'action', label: this.$i18n.t('textAction')},
                ],
                currentPage: 1,
                perPage: this.totalRows,
            }
        },

        methods: {
            clickAddNewMenu() {
                let modalAdd = { ...this.modalAdd, open: true }

                return this.$store.dispatch('setMenuModalAdd', { vue: this, modalAdd })
            },

            submitModalAdd(params) {
                if (!params.name || !params.path) {
                    return this.$toaster.error(this.$i18n.t('textNotFillEnough'))
                }

                return this.$store.dispatch('callMenuAdd', { vue: this, params })
            },

            hideModalAdd(formData) {
                let modalAdd = { ...this.modalAdd, open: false }

                return this.$store.dispatch('setMenuModalAdd', { vue: this, modalAdd })
            },

            clickEditMenu(formData) {
                let modalEdit = { ...this.modalEdit, open: true, formData: { ...formData } }

                return this.$store.dispatch('setMenuModalEdit', { vue: this, modalEdit })
            },

            submitModalEdit(id, params) {
                return this.$store.dispatch('callMenuEdit', { vue: this, params, id })
            },

            hideModalEdit() {
                let modalEdit = { ...this.modalEdit, open: false };

                return this.$store.dispatch('setMenuModalEdit', { vue: this, modalEdit })
            },

            async clickDeleteMenu(id) {
                return id
                    && await this.$swal({
                        title: this.$i18n.t('textConfirmDelete'),
                        icon: 'warning',
                        buttons: true,
                        dangerMode: true,
                    })
                    && this.$store.dispatch('callMenuDelete', { vue: this, id })
            }
        },

        computed: {
            items() {
                return this.$store.state.storeAdminMenu.menus
            },

            parentMenuOption() {
                let menus = this.$store.state.storeAdminMenu.menus

                return [
                    { value: '', text: '' },
                    ...menus.map(menu => ({ value: menu.id, text: menu.name})),
                ]
            },

            modalAdd() {
                return this.$store.state.storeAdminMenu.modalAdd
            },

            modalEdit() {
                return this.$store.state.storeAdminMenu.modalEdit
            },

            totalRows() {
                return this.items.length
            }
        },
    }
</script>
