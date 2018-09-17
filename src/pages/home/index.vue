<template>
  <i-page :aside="false">
    <div slot="header-handler"><a href="javascript:void(0)" @click="logout">退出</a></div>
    <div slot="page-content" class="home-bg" :class="{'blur': modal}" :style="'padding:20px; background-image:url(' + server + item.background + ')'">
        <div class="company-intro cursor" @click="showModal">
            公司介绍
        </div>

        <Modal v-model="modal" width="800">
            <div style="padding:20px;">
                <div class="flex" style="margin-bottom: 20px; padding-bottom:20px; border-bottom:solid 1px #e2e2e2;">
                    <img :src="server+item.icon" width="66" height="66" alt="">
                    <div style="padding-left: 20px;">
                        <h1 style="font-size: 30px; font-weight: normal">{{item.company_name}}</h1>
                        <p>{{item.company_en_name}}</p>
                    </div>
                </div>
                <p>
                    {{item.introduction}}
                </p>
            </div>
            <div slot="footer" class="p-10">
                <p class="flex">
                    <span>地址：{{item.company_address}}</span>
                </p>
                <p class="flex">
                    <span style="width: 240px; text-align: left;">网址：{{item.website}}</span>
                    <span>mail：{{item.email}}</span>
                </p>
                <p class="flex">
                    <span style="width: 240px; text-align: left;">电话：{{item.phone}}</span>
                    <span>传真：{{item.fax}}</span>
                </p>

            </div>
        </Modal>
    </div>
  </i-page>
</template>
<script>
export default {
    data() {
        return {
            item: '',
            modal: false
        }
    },
    methods: {
        async get() {
            let { data } = await this.http('/userApi/getFactoryInfo', {
                method: 'POST'
            })
            this.item = data.result.info
        },
        showModal() {
            this.modal = !this.modal
        }
    },
    created() {
        this.get()
    }
}
</script>

<style lang="less" scoped>
.home-bg{
    widows: 100%; height: 100%;
    background-position: center center; background-size: 100% auto; background-repeat: no-repeat;
}
.company-intro {
    position: fixed; bottom: 50px; right: 78px; background: #1E8CF3;  color:#fff; padding: 10px 20px;
}
.blur {
    -webkit-filter: blur(5px); /* Chrome, Opera */
       -moz-filter: blur(5px);
        -ms-filter: blur(5px);
            filter: blur(5px);

    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=5, MakeShadow=false); /* IE6~IE9 */
}

</style>
