<template>
    <b-row>
        <AdminCategoryAdd
            :submitModalAdd='submitModalAdd'
            :modalAdd="modalAdd"
            :hideModalAdd="hideModalAdd"
            :parentCategoryOption="parentCategoryOption"
        />
        <AdminCategoryEdit
            :submitModalEdit='submitModalEdit'
            :modalEdit.sync="modalEdit"
            :hideModalEdit="hideModalEdit"
            :parentCategoryOption="parentCategoryOption"
        />
        <b-col lg="12">
            <b-button-group class="pull-right">
                <b-button variant="success" @click="clickAddNewItem">
                    <i class="icon-plus"></i>
                    {{ $t('textAddCategory') }}
                </b-button>
            </b-button-group>
        </b-col>
        <b-col lg="12">
            <b-tabs pills card>
                <b-tab
                    :title="$t(option.text)"
                    v-for="option in optionType"
                    :key="option.value"
                    @click="handleChangeTab(option.value)"
                >
                    <b-table
                        class="mb-0 table-outline text-center"                    
                        head-variant="light"
                        :hover="true" :striped="false"
                        :bordered="true" :fixed="true" 
                        :items="getItemFilter(option.value)"
                        :fields="fields"
                        :current-page="currentPage"
                        :per-page="perPage"
                    >
                        <template slot="status" slot-scope="data">
                            <b-button size="sm" :variant="data.item.status ? 'success' : 'danger'">
                                {{ $t(data.item.status ? 'show' : 'hidden') }}
                            </b-button>
                        </template>
                        <template slot="name" slot-scope="data">
                            {{ `${data.item.prefix} ${data.item.name}` }}
                        </template>
                        <template slot="action" slot-scope="data">
                            <b-button
                                type="submit" size="sm"
                                variant="primary"
                                @click="clickEditItem(data.item)"
                            >
                                <i class="icon-pencil"></i>
                                {{ $t('textEdit') }}
                            </b-button>
                            <b-button
                                type="reset" size="sm"
                                variant="danger"
                                @click="clickDeleteItem(data.item.id)"
                            >
                                <i class="icon-trash"></i>
                                {{ $t('textDelete') }}
                            </b-button>
                        </template>
                    </b-table>
                </b-tab>
            </b-tabs>
        </b-col>
    </b-row>
</template>

<script>
    import AdminCategoryAdd from './AdminCategoryAdd.vue'
    import AdminCategoryEdit from './AdminCategoryEdit.vue'

    import { ADMIN_CATEGORY_TYPE_OPTION} from '../store'
    import { CATEGORY_STATUS_SHOW, CATEGORY_STATUS_HIDDEN } from '../store'
    import Helper from 'admin/library/Helper'

    export default {
        name: 'AdminCategory',
        components: { AdminCategoryAdd, AdminCategoryEdit },

        beforeCreate() {
            Helper.changeTitleAdminPage(this.$i18n.t('textManageCategory'))
            this.$store.dispatch('callFetchCategories', { vue: this })
        },

        data() {
            return {
                fields: [
                    {key: 'name', label: this.$i18n.t('textName'), tdClass: 'text-left'},
                    {key: 'link', label: this.$i18n.t('textLink'), tdClass: 'text-left'},
                    {key: 'prioty', label: this.$i18n.t('textPrioty')},
                    {key: 'status', label: this.$i18n.t('textStatus')},
                    {key: 'action', label: this.$i18n.t('textAction')},
                ],
                currentPage: 1,
                perPage: this.totalRows,
                optionType: ADMIN_CATEGORY_TYPE_OPTION
            }
        },

        methods: {
            getTextType(item) {
                let index = _.findIndex(ADMIN_CATEGORY_TYPE_OPTION, (option) => option.value === item.item.type)

                return this.$i18n.t(ADMIN_CATEGORY_TYPE_OPTION[index].text)
            },

            filterData(item) {
                let result = {}
                let fields = this.fields
                for(let i = 0; i < fields.length; i++) {
                    result[fields[i].key] = item[fields[i].key]
                }

                return result;
            },

            getItemFilter(type) {
                return this.items.filter(item => item.type == type)
            },

            clickAddNewItem() {
                let modalAdd = { ...this.modalAdd, open: true }

                return this.$store.dispatch('setCategoryModalAdd', { vue: this, modalAdd })
            },

            submitModalAdd(params) {
                return this.$store.dispatch('callCategoryAdd', { 
                    vue: this,
                    params: this.convertDataSubmit(params) 
                })
            },

            convertDataSubmit(params) {
                return {
                    ...params,
                    parent_id: params.parent_id ? params.parent_id : null
                }
            },

            hideModalAdd(formData) {
                let modalAdd = { ...this.modalAdd, open: false }

                return this.$store.dispatch('setCategoryModalAdd', { vue: this, modalAdd })
            },

            clickEditItem(formData) {
                let modalEdit = { ...this.modalEdit, open: true, formData: { ...formData } }

                return this.$store.dispatch('setCategoryModalEdit', { vue: this, modalEdit })
            },

            submitModalEdit(id, params) {
                return this.$store.dispatch('callCategoryEdit', { 
                    vue: this,
                    params: this.convertDataSubmit(params),
                    id,
                })
            },

            hideModalEdit() {
                let modalEdit = { ...this.modalEdit, open: false };

                return this.$store.dispatch('setCategoryModalEdit', { vue: this, modalEdit })
            },

            async clickDeleteItem(id) {
                return id
                    && await this.$swal({
                        title: this.$i18n.t('textConfirmDelete'),
                        icon: 'warning',
                        buttons: true,
                        dangerMode: true,
                    })
                    && this.$store.dispatch('callCategoryDelete', { vue: this, id })
            },

            handleChangeTab(value) {
                return this.$store.dispatch('actionCategoryChangeTab', value)
            },
        },

        computed: {
            items() {
                let categories = this.$store.state.storeAdminCategory.categories

                let itemsFilter = []

                for (let i = 0; i < categories.length; i++) {
                    categories[i]._rowVariant = 'success'
                    categories[i].prefix = ''
                    categories[i].link = `/${categories[i].slug}`
                    itemsFilter.push(categories[i])

                    let children = categories[i].children_categories
                    for(let j = 0; j < children.length; j++) {
                        children[j].prefix = '| - - '
                        children[j].type = categories[i].type
                        children[j].link = `${categories[i].link}/${children[j].slug}`
                        itemsFilter.push(children[j])
                    }
                }
                return itemsFilter
            },

            parentCategoryOption() {
                let categories = this.$store.state.storeAdminCategory.categories

                return [
                    { value: '', text: '' },
                    ...categories.map(category => ({ value: category.id, text: category.name})),
                ]
            },

            modalAdd() {
                return this.$store.state.storeAdminCategory.modalAdd
            },

            modalEdit() {
                return this.$store.state.storeAdminCategory.modalEdit
            },

            totalRows() {
                return this.items.length
            }
        },
    }
</script>
