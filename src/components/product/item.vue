<template>
    <li class="cursor">
        <div class="img-box" v-if="item.attr.attr_pic.length" :style="'background-image:url(' + server + item.attr.attr_pic[0].url +')'"  @click="goDetail"></div>
        <div class="flex space-between p-t-10" @click="goDetail">
            <span>{{item.product_title}}</span>
        </div>
        <div class="flex space-between p-t-5 info" style="cursor:default;">
            <span v-if="item.attr.attr_pic.length">¥{{item.attr.attr_pic[0].price}}</span>
            <div class="info-handler">

                <span class="cursor" @click.stop="productFavorite(item.pid)"><Icon type="android-favorite-outline" size="14"></Icon></span>
                <span class="cursor" @click.stop="productBuy(item.pid)"><Icon type="ios-cart" size="14"></Icon></span>
                <span class="cursor" @click.stop="productDel(item.pid)"><Icon type="ios-trash" size="14"></Icon></span>
            </div>
        </div>
        <div class="flex space-between p-t-5 info" style="cursor:default;">
            <div></div>
            <div class="info-handler sorts">
                <span @click.stop="empty"><Input v-model="item.sort" size="small" style="width:50px;text-align:center;" class="skip-input" @on-enter="skip(item)"></Input></span>
                <Button type="ghost" icon="arrow-swap" size="small" @click.stop="skip(item)" style="width:24px;text-align:center;"></Button>
            </div>
        </div>
    </li>
</template>

<script>
export default {
    props: {
        item: {}
    },
    data: function() {
        return {}
    },
    methods: {
        empty(){},
        async skip(item){
            const num = parseInt(item.sort);
            if(isNaN(num) || num < 0){
                this.$Message.error('序号输入有误');
                return ;
            }

            let { data } = await this.http('/productApi/modifyProductSort', {
                data: {
                    id: item.pid,
                    sort: num
                },
                method: 'POST'
            });
            if(!data.code){
                this.$Message.info(data.msg.zh);
                this.$parent.getProductList();
            }else {
                this.$Message.error(data.msg.zh);
            }
        },
        goDetail() {
            this.$router.push({name: "产品详细", params:{ productId: this.item.pid}})
        },
        productDel(id) {
            this.$Modal.confirm({
                title: '提示框',
                content: '<p>确认删除本产品吗？</p>',
                loading: true,
                onOk: async () => {
                    let { data } = await this.http('/productApi/productDel', {
                        data: {
                            ids: [id]
                        },
                        method: 'POST'
                    })
                    if( !data.code ) {
                        this.$Modal.remove();
                        this.$parent.getProductList()
                    }
                    this.$Message.info(data.msg.zh);

                }
            });
        },
    }
}
</script>

<style>
.sorts{
    flex-flow:row;
    display: flex;
    align-items: center;
    justify-content:flex-end;
}

.skip-input input{
    text-align:center;
}
</style>
