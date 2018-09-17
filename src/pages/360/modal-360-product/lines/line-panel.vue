<template>
    <ul slot="content">
        <li class="cursor" v-for="(line2, x) in line" :key="x">
            <item :item="line2"></item>
        </li>
        <line-input v-if="showAdd" :id="line.id" @add-ok="getList"></line-input>
    </ul>
</template>

<script>
import Item from './line-item'
export default {
    props: {
        line: {},
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
      console.log(this.line)
    }
}
</script>
