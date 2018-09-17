<template>
<div style="padding-left: 15px;">
    <div v-for="(line1, i) in line" v-menu-children>
        <div class="cursor menu-children-title">{{line1.title}}</div>
        <ul class="menu-children" slot="content">
            <li class="cursor" v-for="(line2, x) in line1.children" :key="x">
                <item :item="line2"></item>
            </li>
            <line-input v-if="showAdd" :id="line.id" @add-ok="getList"></line-input>
        </ul>
    </div>
</div>
</template>

<script>
import Item from './line-item'
export default {
    props: {
        line: '',
    },
    components: {
        Item
    },
    data: function() {
        return {
            showAdd: false
        }
    },
    methods: {
        showAddInput() {
            this.showAdd = !this.showAdd
        }
    },
    created() {
    }
}
</script>
