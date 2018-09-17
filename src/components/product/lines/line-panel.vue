<template>
    <ul slot="content" :class="{noselect: moving}">
        <li class="cursor" v-for="(line2, x) in line.children" :key="line2.id" :ref="'line' + line2.id" :class="{'moving-wrapper': line2.moving}" :style="line2.style">
            <item :item="line2" @movestart="movestart"></item>
        </li>
        <line-input v-if="showAdd" :id="line.id" @add-ok="getList"></line-input>
    </ul>
</template>

<script>
import Vue from 'vue'
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
            moving:  false,
            showAdd: false
        }
    },
    methods: {
        showAddInput() {
            this.showAdd = !this.showAdd
        },

        movestart(evt, line){
            evt.cancelBubble = true;
            evt.stopPropagation();
            evt.preventDefault();

            const inRect = function(y, top, height){
                return y > top && y < top + height;
            }

            const point = function(event){
                return {x: event.clientX, y: event.clientY};
            }

            const swap = function(arr, x, y){
                var origin = arr[x];
                arr[x] = arr[y];
                Vue.set(arr, y, origin);
            }

            this.moving = true;
            line.moving = true;
            const $body = $(document.body)

            const $el = $(this.$refs['line' + line.id][0]);
            const width = $el.width();
            const height = $el.height();
            const position = $el.position();
            const start = point(evt);

            const $clone = $(`<div class="moving-pd-item" style="width:${width}px;height:${height}px;"></div>`);

            $clone.insertAfter($el);
            line.style = {
                top: position.top + 'px',
                width: width + 'px'
            }

            const drag = (event, end)=>{
                event.cancelBubble = true;
                event.stopPropagation();
                event.preventDefault();

                const p = point(event);
                const top = position.top + (p.y - start.y);
                const centerY = top + height/2;
                line.style.top = `${top}px`;

                for(let tmp of this.line.children){
                    const $tmp = $(this.$refs['line' + tmp.id][0]);
                    if(tmp === line){
                        continue;
                    }

                    const tmpPosition = $tmp.position();
                    const tmpHeight = $tmp.height();
                    const tmpCenterY = tmpPosition.top + tmpHeight/2;

                    if(inRect(tmpCenterY, top, height) || inRect(centerY, tmpPosition.top, tmpHeight)){
                        swap(this.line.children, this.line.children.indexOf(tmp), this.line.children.indexOf(line));
                        this.$nextTick(()=>{
                            $clone.insertAfter($el);
                        });
                        break;
                    }
                }

                return false;
            };

            const dragEnd = (event)=>{
                event.cancelBubble = true;
                event.stopPropagation();
                event.preventDefault();

                drag(event, true);

                this.moving = false;
                line.moving = false;
                line.style = null;
                $clone.remove();
                $body.off('mousemove', drag);
                $body.off('mouseup', dragEnd);

                this.saveOrder();

                return false;
            };

            // 拖动
            $body.on('mousemove', drag)
            $body.on('mouseup', dragEnd)
            return false;
        },

        async saveOrder(){
            let {data} = await this.http('/productApi/modifyProductCatSort ', {
                data: {
                    id: this.line.children.map(function(item){return item.id})
                },
                method: 'POST'
            })

            if (data.code !== 0) {
                this.$Message.error(data.msg.zh);
            }
        },

    }
}
</script>

<style>
.xrel{
    position:relative;
}

.moving-pd-item{
    border:1px dashed #ccc;
    margin:5px 0;
}

.moving-wrapper{
    left:16px;
    position:absolute;
    box-shadow: 0px 2px 2px #EEEEEE;
    background:#fff;
}
</style>
