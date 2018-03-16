<template>
   <b-card>
        <b-row>
            <b-col sm="12">
                <b-form validated>
                    <b-row>
                        <b-col sm="12">
                            <b-form-fieldset :label="$t('textTitle')">
                                <b-form-input
                                    :placeholder="$t('textTitle')" 
                                    v-model="formData.option.title" 
                                />
                            </b-form-fieldset>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="12">
                            <b-form-fieldset :label="$t('textLogo')"
                            >
                                <vue-transmit
                                    tag="section"
                                    v-bind="uploadOptions"
                                    @success="successUploader"
                                    @error="errorUploader"
                                    upload-area-classes="bg-faded"
                                    ref="uploader"
                                    style="border: 1px solid #E5E5E5"
                                >
                                    <b-row>
                                        <b-col sm="10"
                                            style="border-radius: 1px; boder: 1px solid #DCDCDC; padding-top:5px"
                                            class="text-left"
                                        >
                                            <b-img thumbnail 
                                                :src="`/${formData.currentLogo}`" 
                                                style="max-width: 150px; margin-left: 10px; margin-bottom: 15px"
                                                v-if="formData.currentLogo"
                                            />
                                            <button class="btn btn-primary"
                                                @click="triggerBrowse"
                                                style="margin-left: 20px"
                                            >{{ $t('textUploadNewFile') }}</button>
                                        </b-col>
                                    </b-row>
                                    <!-- Scoped slot -->
                                    <template slot="files" slot-scope="props">
                                        <div v-for="(file, i) in props.files" 
                                            :key="file.id" :class="{'mt-5': i === 0}"
                                            style="margin-bottom: 20px"
                                        >
                                            <b-row>
                                                <b-col sm="2">
                                                    <b-img thumbnail 
                                                        :src="file.dataUrl" 
                                                        class="img-fluid d-flex mr-3"
                                                    />
                                                </b-col>
                                                <b-col sm="9">
                                                    <div class="progress">
                                                        <div class="progress-bar bg-success"
                                                            :style="{width: file.upload.progress + '%'}"
                                                        >
                                                        </div>                                          
                                                    </div>
                                                </b-col>
                                                <b-col sm="1">
                                                    <b-button type="reset" size="sm" variant="danger" 
                                                        @click="removeUploadFile(i, $event)"
                                                    >
                                                        <i class="fa fa-remove"></i>  
                                                    </b-button>                                  
                                                </b-col>
                                            </b-row>
                                        </div>
                                    </template>
                                </vue-transmit>
                            </b-form-fieldset>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="12">
                            <b-form-fieldset :label="$t('textSeoKeyword')">
                                <b-form-input
                                    type="text"
                                    :placeholder="$t('textSeoKeyword')"
                                    v-model="formData.seo_keyword"
                                />
                            </b-form-fieldset>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col sm="12">
                            <b-form-fieldset :label="$t('textSeoDescription')">
                                <b-form-input
                                    type="text"
                                    :placeholder="$t('textSeoDescription')"
                                    v-model="formData.seo_description"
                                />
                            </b-form-fieldset>
                        </b-col>
                    </b-row>
                </b-form>
            </b-col><!--/.col-->
        </b-row>
        <div slot="header" class="w-100">
            <b-row>
                <b-col sm="4">{{ $t('textSetups') }}</b-col>
                <b-col sm="8" class="text-right">
                    <b-button type="submit" size="xs" variant="primary" @click="clickSubmitEdit">
                        <i class="fa fa-dot-circle-o"></i>
                        {{ $t('textSave') }}
                    </b-button>
                    <b-button type="reset" size="xs" variant="danger" @click="clickCancel">
                        <i class="fa fa-ban"></i>
                        {{ $t('textCancel') }}
                    </b-button>
                </b-col>
            </b-row>
        </div>
        <div slot="footer" class="w-100 text-center">
            <b-button type="submit" size="xs" variant="primary" @click="clickSubmitEdit">
                <i class="fa fa-dot-circle-o"></i>
                {{ $t('textSave') }}
            </b-button>
            <b-button type="reset" size="xs" variant="danger" @click="clickCancel">
                <i class="fa fa-ban"></i>
                {{ $t('textCancel') }}
            </b-button>
        </div>
    </b-card>
</template>

<script>
import Helper from 'admin/library/Helper'

import { STORAGE_AUTH } from 'admin/modules/auth/store'

export default {
    name: 'AdminSetup',

    beforeCreate() {
        Helper.changeTitleAdminPage(this.$i18n.t('textSetups'))
    },

    async mounted() {
        this.$store.dispatch('setAdminMainLoading', { ...this.mainLoading, show: true })
        let response = await axios.get('/setups')
        this.$store.dispatch('setAdminMainLoading', { ...this.mainLoading, show: false })

        if (response.status == 200) {
            let formData = response.data;
            formData.option = JSON.parse(formData.option);
            formData.currentLogo = formData.option.logo

            return this.formData = formData;
        }

        this.$toaster.error(Helper.getFirstError(response, this.$i18n.t('textDefaultErrorRequest')))

        return this.$router.push({ path: '/dashboard' })
    },

    computed: {
        mainLoading() {
            return this.$store.state.storeLoading.mainLoading
        },
    },

    data() {
        let token = JSON.parse(localStorage.getItem(STORAGE_AUTH)).token
        let today = new Date()

        return {
            formData: {
                seo_keywork: '',
                seo_description: '',
                option: {
                    logo: '',
                    title: '',
                },

                currentLogo: '',
            },

            uploadOptions: {
                acceptedFileTypes: ['image/*'],
                url: '/api/v0/upload-image',
                clickable: false,
                params: {
                    folder: `logo-${today.getFullYear()}
                        -${today.getMonth() + 1}
                        -${today.getDate()}
                    `,
                },
                maxFiles: 1,                
                paramName: 'image',
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`
                }
            }
        }
    },

    methods: {
        async removeUploadFile(index, event) {
            event.preventDefault()

            let files = this.$refs.uploader.files

            await this.$swal({
                title: this.$i18n.t('textConfirmDelete'),
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }) && (this.$refs.uploader.files = files.filter((f, i) => i !== index))

            return this.formData.option.logo = this.formData.currentLogo
        },

        triggerBrowse(event) {
            event.preventDefault()

            if (this.$refs.uploader.files.length >= this.uploadOptions.maxFiles) {
                return this.$toaster.error(this.$i18n.t('textNotAddFile'));
            }

            return this.$refs.uploader.triggerBrowseFiles()
        },

        successUploader(response) {
            let serveRespone = JSON.parse(response.xhr.response)
            
            return this.formData.option.logo = serveRespone.path
        },

        errorUploader(error) {
            let files = this.$refs.uploader.files
            let xhr = { response: JSON.parse(error.xhr.response) }
            
            this.$toaster.error(Helper.getFirstError(xhr, this.$i18n.t('textDefaultErrorRequest')))

            return this.$refs.uploader.files.length = files.length - 1;
        },

        convertDataSubmit() {
            return this.formData
        },

        async clickSubmitEdit() {
            let params = this.convertDataSubmit();

            this.$store.dispatch('setAdminMainLoading', { ...this.mainLoading, show: true })
            let response = await axios.put('/setups', params)
            this.$store.dispatch('setAdminMainLoading', { ...this.mainLoading, show: false })

            if (response.status == 200) {
                this.$toaster.success(response.data.message);
                this.formData.currentLogo = this.formData.option.logo

                return this.$refs.uploader.files = []
            }

            return this.$toaster.error(Helper.getFirstError(response, this.$i18n.t('textDefaultErrorRequest')))
        },

        clickCancel() {
            return this.$router.push({ path: '/dashboard' })
        },
    }
}
</script>
