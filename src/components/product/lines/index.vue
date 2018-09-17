<template>
<div class="line-collapse collapse" :class="{noselect: moving}">
	<div class="cursor flex center" @click="open" style="height: 50px; border-bottom: solid 2px #f2f2f2;">
		显示全部
	</div>
	<Collapse class="xrel" v-model="opened">
		<Panel :ref="'line'+line1.id" :name="line1.id" v-for="(line1, i) in lines" :key="line1.id" class="seri-panel" :class="{moving: line1.moving}" :style="line1.style">
            <span class="line-title-bar flex-full flex-row">
                <span style="display:inline-block;padding-left:5px;" class="flex-full">
                    {{line1.title}}
                </span>

                <span class="btn xbtn xbtn-grey" @mousedown="moveStart($event, line1, i)">
                    <Icon type="arrow-move" size="14"></Icon>
                </span>
                <span class="btn xbtn" @click.stop="showEditInput(line1)">
                    <Icon type="edit" size="12"></Icon>
                </span>
                <upload-img :line="line1" class="xbtn"></upload-img>

                <span class="btn xbtn" style="color:#999" @click.stop="delProductCat(line1.id)">
                    <Icon type="ios-trash" size="16"></Icon>
                </span>
                <span class="btn xbtn" @click.stop="showAddInput(line1.id)">
                    <Icon type="plus" size="14"></Icon>
                </span>
            </span>
			<line-panel slot="content" :line="line1"></line-panel>
		</Panel>
	</Collapse>
	<Modal v-model="showAdd" width="600" @on-ok="submitAddLine">
		<p slot="header" style="color:#2d8cf0; text-align:center">
			<Icon type="compose"></Icon>
			<span>新建系列</span>
		</p>
		<div style="padding-right: 20px;">
			<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
				<Form-item label="系列名称" prop="title">
					<Input v-model="formValidate.title" placeholder="系列名称"></Input>
				</Form-item>
				<!-- <FormItem label="是否为背景">
              <RadioGroup v-model="formValidate.type">
                <Radio label="1">是</Radio>
                <Radio label="2">否</Radio>
              </RadioGroup>
            </FormItem> -->
			</Form>
		</div>
	</Modal>

	<Modal v-model="editForm.visible" width="600" @on-ok="saveSeriTitle">
		<p slot="header" style="color:#2d8cf0; text-align:center">
			<Icon type="compose"></Icon>
			<span>修改系列</span>
		</p>
		<div style="padding-right: 20px;">
			<Form ref="editForm" :model="editForm.form" :rules="editForm.rules" :label-width="80">
				<Form-item label="系列名称" prop="title">
					<Input v-model="editForm.form.title" placeholder="系列名称"></Input>
				</Form-item>
			</Form>
		</div>
	</Modal>

</div>
</template>

<script>
import Vue from 'vue'
import LinePanel from './line-panel'
import LineInput from './line-input'
import UploadImg from './upload-img'
import {
	hex_md5
} from '../../../util/md5'
const timestamp = Date.now()

export default {
	data: function() {
		return {
            opened: [],
			lines: [],
            moving:  false,
			showAdd: false,
			formValidate: {
				parent_id: 0,
				title: '',
				type: 2,
				isSell: 1
			},
			ruleValidate: {
				title: [{
					required: true,
					message: '名称不能为空',
					trigger: 'blur'
				}]
			},

			editForm: {
				visible: false,
				form: {
					id: '',
					title: ''
				},
				rules: {
					title: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}]
				}
			},

			uploader: {
				timestamp: timestamp,
				token: hex_md5('fitment_' + timestamp),
				type: 'images'
			},
		}
	},
	components: {
		LinePanel,
		LineInput,
		UploadImg
	},
	methods: {
        moveStart(evt, line, index){
            this.$nextTick(()=>{
                this.doMoveStart(evt, line, index);
            })
        },

        doMoveStart(evt, line, index){
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

            const $el = $(this.$refs['line' + line.id][0].$el);
            const width = $el.width();
            const height = $el.height();
            const position = $el.position();
            const start = point(evt);

            const $clone = $(`<div class="moving-pd" style="width:${width}px;height:${height}px;"></div>`);

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

                for(let tmp of this.lines){
                    const $tmp = $(this.$refs['line' + tmp.id][0].$el);
                    if(tmp === line){
                        continue;
                    }

                    const tmpPosition = $tmp.position();
                    const tmpHeight = $tmp.height();
                    const tmpCenterY = tmpPosition.top + tmpHeight/2;

                    if(inRect(tmpCenterY, top, height) || inRect(centerY, tmpPosition.top, tmpHeight)){
                        swap(this.lines, this.lines.indexOf(tmp), this.lines.indexOf(line));
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
                    id: this.lines.map(function(item){return item.id})
                },
                method: 'POST'
            })

            if (data.code !== 0) {
                this.$Message.error(data.msg.zh);
            }
        },

		open() {
			for (let i = 0; i < this.lines.length; i++) {
				this.$refs['line' + this.lines[i].id][0].toggle()
			}
		},
		showEditInput(ser) {
			this.editForm.form.ser = ser;
			this.editForm.form.id = ser.id;
			this.editForm.form.title = ser.title;
			this.editForm.visible = true;
		},
		saveSeriTitle() {
			const form = [{
				id: this.editForm.form.id,
				title: this.editForm.form.title
			}];
			this.$refs['editForm'].validate(async(valid) => {
				if (valid) {
					let {
						data
					} = await this.http('/productApi/productCatModify', {
						data: {
							cats: JSON.stringify(form)
						},
						method: 'POST'
					})
					this.$Message.success(data.msg.zh);
					if (!data.code) {
						this.editForm.form.ser.title = this.editForm.form.title;
					}
				} else {
					this.$Message.error('表单验证失败!');
				}
			})
		},
		showAddInput(id) {
			this.formValidate.parent_id = id
			this.formValidate.title = ''
			this.showAdd = !this.showAdd
		},
		async delProductCat(id) {
			this.$Modal.confirm({
				title: '提示框',
				content: '<p>确认删除本系列吗？</p>',
				loading: true,
				onOk: async() => {
					let {
						data
					} = await this.http('/productApi/productCatDel', {
						data: {
							ids: id
						},
						method: 'POST'
					})
					if (!data.code) {
						this.$Modal.remove();
						this.getList()
					}
					this.$Message.info(data.msg.zh);

				}
			});
		},
		async getList() {
			let {
				data
			} = await this.http('/productApi/getProductCatList', {
				method: 'POST'
			})
            for(let item of data.result.productCats){
                item.moving = false;
                item.style = null;
                if(item.children){
                    for(let sub of item.children){
                        sub.moving = false;
                        sub.style = null;
                    }
                }
            }
			this.lines = data.result.productCats
			this.$bus.emit('cates', data.result.productCats);
		},
		submitAddLine() {
			this.$refs['formValidate'].validate(async(valid) => {
				if (valid) {
					let {
						data
					} = await this.http('/productApi/productCatNew', {
						data: {
							parent_id: this.formValidate.parent_id,
							title: this.formValidate.title,
						},
						method: 'POST'
					})
					if (!data.code) {
						this.$Message.success('提交成功!');
						this.getList()
					}
				} else {
					this.$Message.error('表单验证失败!');
				}
			})

		}
	},
	created() {
		this.getList()
		this.$bus.on('getProductLines', () => {
			this.getList()
		})
	},

	watch: {
		$route(){
			if(this.$route.params && this.$route.params.cate){
				this.opened = [this.$route.params.cate];
			}
		}
	}
}
</script>

<style lang="less">
.line-collapse {
    .ivu-collapse {
        background: none;
        border: none;
        .ivu-icon-arrow-right-b {
            font-size: 12px;
            font-weight: normal;
        }
        .ivu-icon-arrow-right-b:before {
            content: "\F218";
        }
        .ivu-collapse-header {
            padding-left: 16px;
            font-size: 14px;
            font-weight: bold;
            .btn {
                color: #ff0000;
                padding: 3px 2px;
            }

            .btn.xbtn-grey {
                color: #5c6b77;
                cursor: move;
            }
        }
        .ivu-collapse-content {
            background: none;
        }
        .ivu-collapse-content-box {
            padding-top: 0;
        }
        li {
            padding: 5px 0 5px 12px;
        }
    }
}

.flex-full {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.flex-row {
    display: flex;
    flex-flow: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}

.xbtn {
    margin: 0 2px;
    font-size: 14px;
    text-align: center;
}
</style>

<style>
.seri-panel .ivu-collapse-header {
	display: flex;
	flex-flow: row;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
}

.noselect {
	user-select: none;
}

.xrel{
    position:relative;
}

.moving-pd{
    border:1px dashed #ccc;
}

.moving{
    left:0;
    position:absolute;
    box-shadow: 0px 2px 2px #EEEEEE;
    background:#fff;
}
</style>
