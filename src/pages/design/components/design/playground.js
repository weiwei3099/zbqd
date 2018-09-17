import SVG from "svg.js";
import select from "svg.select.js";
import resize from "svg.resize.js";
import draggable from "svg.draggable.js";
import panzoom from 'svg.panzoom.js';

class Playground{
    constructor(el, server){
        this.product = null;  // 主参数数据
        this.scene = null; // 场景数据
        this.elements = []; // 所有图上的元素
        this.series = []; // 图上元素按照系列分组
        this.server = server; // url的前缀

        this.drawer = SVG(el); // svg 画布对象
        this.zoom = 1; // 缩放比例
        this.$el = $(el); // 容器的jQuery对象
				console.log(this.$el);
        this.dirty = false;
        this.touchendTime = 0; // 用来记录上次 touchend时间，防止错误click事件
    }

    /**
     * 字符串转数字
     * @param  {Number/String} num
     * @return {Number}
     */
    str2num(num){
        if(typeof num === 'number'){
            return num;
        }
        return Number(num) || 0;
    }

    /**
     * 初始化
     */
    init(product, scene, series, panel){
        this.panel = panel;
        this.scene = scene;
        this.product = product;
        this.series = series;
        this.drawer.panZoom({zoomMin: 0.25, zoomMax: 10});
        this.initScene();
    }

    /**
     * 初始化场景
     */
    initScene(){
        // 图层排序
        this.sort(true);

        // 添加到画布中
        for(let seri of this.series){
            if(!seri.$currPrd){
                continue;
            }

            this.drawPrd(seri);
        }

        // 自动缩放到可以看全尺寸
        this.autoScaling();

        // 点击画布空白处，取消选择
        this.drawer.on('click', (evt)=>{
            if(new Date().getTime() - this.touchendTime < 50){
                return ;
            }
            if($(evt.target).is('svg')){
                for(let el of this.elements){
                    if(el.$selected){
                        console.log('清除选择...');
                        this.select(el, false);
                        break;
                    }
                }
            }
        });
    }

    drawPrd(seri){
        if(!seri.$currPrd || seri.$currPrd.attr.length === 0){
            return ;
        }
        for(let attr of seri.$currPrd.attr){
            attr.x = this.str2num(attr.x);
            attr.y = this.str2num(attr.y);
            attr.width = this.str2num(attr.width);
            attr.height = this.str2num(attr.height);
            this.drawimg(seri, seri.$currPrd, attr);
            this.elements.push(attr);
        }
    }

    /**
     * 自动缩小到可以看全的范围
     */
    autoScaling(){
        const imgSize = this.realSize(); // 图像大小
        const canvasSize = this.containerSize(); // 画布大小

        if(imgSize.width > canvasSize.width || imgSize.height > canvasSize.height){
            const zoom = Math.min(canvasSize.width/imgSize.width, canvasSize.height/imgSize.height);
            if(zoom < 1){
                this.scaling(zoom, {x : canvasSize.width/2, y:0})
            }
        }
    }

    /**
     * 整个图像获取真实的宽高
     */
    realSize(){
        let x = null;
        let y = null;
        let maxWidth = 0;
        let maxHeight = 0;

        for(let el of this.elements){
            if(x === null){
                x = el.x;
                y = el.y;
            }else{
                x = Math.min(x, el.x);
                y = Math.min(y, el.y);
            }

            const w = el.x + el.width;
            const h = el.y + el.height;

            maxWidth = Math.max(maxWidth, w);
            maxHeight = Math.max(maxHeight, h);
        }

        return {x : x, y : y, width : maxWidth, height : maxHeight};
    }

    // 拷贝
    copy(){
        let selected = this.checkSelection();
        if(!selected){
            return ;
        }

        // if(selected.$prd.isMainProduct){
        //     this.panel.$Message.warning('主产品不能复制');
        //     return ;
        // }

        if(selected.$prd.isRect){
            this.panel.$Message.warning('门框不能复制');
            return ;
        }

        // 复制对象，新对象向右向下偏移10像素
        const cloned = $.extend({}, selected);
        cloned.$selected = false;
        cloned.$img = null;
        cloned.id = null;
        cloned.x += 30;
        cloned.y += 30;
        selected.$prd.attr.push(cloned);
        this.elements.push(cloned);

        this.drawimg(cloned.$prd.$seri, cloned.$prd, cloned);
        this.sortEls();

        this.select(selected, false);
        this.select(cloned, true);

        const currPrd = cloned.$prd;
        for(let prd of currPrd.$seri.products){
            if(prd.id === currPrd.id){
                continue;
            }

            const tmp = $.extend({}, cloned);
            tmp.$selected = false;
            tmp.$img = null;
            tmp.id = null;
            prd.attr.push(tmp);
        }
    }

    /**
     * 上一层
     */
    up(){
        this.move(1);
    }

    /**
     * 下一层
     */
    down(){
        this.move(-1);
    }

    /**
     * 顶层
     */
    top(){
        this.move(2);
    }

    /**
     * 底层
     */
    bottom(){
        this.move(-2);
    }

    move(direction){
        let selected = this.checkSelection();
        if(!selected){
            return ;
        }

        const seri = selected.$prd.$seri;
        let index = 0;

        // 找出当前系列所在的层级
        for(;index<this.series.length;index++){
            const tmp = this.series[index];
            if(tmp === seri){
                break;
            }
        }

        // 已经是最底层了，不能再继续向下了
        if(direction < 0 && index === 0){
            this.panel.$Message.warning('已经最底层啦');
            return;
        }

        // 已经是顶层了，不能再向上了
        if(direction > 0 && index >= this.series.length - 1){
            this.panel.$Message.warning('已经最顶层啦');
            return;
        }

        if(direction === -1 || direction === 1){
            const targetSeri = this.findNextSeri(index, direction);
            this.swipeIndex(seri, targetSeri);
        }else{
            if(direction < 0){
                seri.zindex = -999;
            }else{
                seri.zindex = this.series.length + 999;
            }
        }

        // 重新排序
        this.sort(true);

        // 重新排序元素
        this.sortEls();

        console.log(this.series);
    }

    sortEls(){
        for(let seri of this.series){
            if(seri.$currPrd){
                for(let attr of seri.$currPrd.attr){
                    attr.$img.front();
                }
            }
        }
    }

    /**
     * 图层排序
     * @param  {boolean} reset 是否重置
     */
    sort(reset){
        this.series.sort((a, b)=>{
            return a.zindex - b.zindex;
        });

        if(reset){
            let index = 0;
            for(let seri of this.series){
                seri.zindex = index++;
            }
        }
    }

    /**
     * 查找产品
     */
    findEl(feild, val){
        return this.find(this.elements, feild, val);
    }

    findSeri(feild, val){
        return this.find(this.series, feild, val);
    }

    find(arr, feild, val){
        for(let obj of arr){
            if(obj[feild] === val){
                return obj;
            }
        }
    }

    /**
     * 目前最大的zindex
     * @return {Number}
     */
    maxZindex(){
        let maxzindex = 0;
        for(let seri of this.series){
            maxzindex = Math.max(seri.zindex, maxzindex);
        }

        return maxzindex;
    }

    /**
     * 查找上一个/下一个有元素的系列
     */
    findNextSeri(index, step){
        while(true){
            index+=step;
            if(index > this.series.length || index < 0){
                break;
            }

            if(this.series[index].$currPrd && this.series[index].$currPrd.attr.length > 0){
                return this.series[index];
            }
        }
    }

    /**
     * 交换zindex
     */
    swipeIndex(target, group){
        let tmp = target.zindex;
        target.zindex = group.zindex;
        group.zindex = tmp;
    }

    /**
     * 寻找同系列的子元素
     * @param  {Object} item
     * @return {Array}
     */
    findSiblings(item){
        const arr = [];
        for(let tmp of this.$currPrd){
            if(tmp !== item && tmp.$id === item.$id){
                arr.push(tmp);
            }
        }
        return arr;
    }

    // 缩小
    zoomin(){
        this.scaling(this.zoom - 0.25);
    }

    // 放大
    zoomout(){
        this.scaling(this.zoom + 0.25);
    }

    scaling(val, p){
        if(val < 0.25){
            val = 0.25;
        }else if(val > 10){
            val = 10;
        }
        this.zoom = val;
        this.drawer.zoom(this.zoom, p);
        this.panel.$emit('zoom', val);
    }

    /**
     * 获取容器的大小
     * @return {Object}
     */
    containerSize(){
        return {
            width : this.$el.width(),
            height : this.$el.height(),
        };
    }

    /**
     * 添加元素
     */
    addEl(item){
        this.reset(item);
        this.$currPrd.push(item);
    }

    /**
     * 选中元素
     * @param  {Object} item     元素对象
     * @param  {boolean} selected 是否选中
     */
    select(item, selected){
        if(!item.$img || item.$prd.isBg){
            return ;
        }

        item.$img.selectize(selected ? {deepSelect:true, radius : 20} : false);
        item.$img.draggable(selected);
        item.$img.resize(selected ? {preserveAspectRatio : true} : 'stop');
        item.$selected = selected;

        if(selected && !item.$prd.selected){
            for(let seri of this.series){
                for(let prd of seri.products){
                    if(prd.selected && prd !== item.$prd){
                        prd.selected = false;
                    }
                }
            }
        }
        item.$prd.selected = selected;
    }

    /**
     * 获取当前被选中的元素
     */
    getSelection(){
        for(let item of this.elements){
            if(item.$selected){
                return item;
            }
        }
    }

    /**
     * 检查元素是否已经被选中
     */
    checkSelection(){
        let item = this.getSelection();
        if(!item){
            this.panel.$Message.warning('请先选择一个元素');
        }
        return item;
    }

    /**
     * 水平翻转
     */
    flipx(){
        this.flip('x');
    }

    /**
     * 垂直翻转
     */
    flipy(){
        this.flip('y');
    }

    /**
     * 水平或者垂直翻转
     * @param  {String} direction x/y
     */
    flip(direction){
        let selected = this.checkSelection();
        if(!selected){
            return ;
        }

        if(selected.$prd.isBg || selected.$prd.isRect){
            return ;
        }

        let m = new SVG.Matrix(selected.$img);
        if(direction === 'x'){
            m = m.flip(direction, selected.$img.x() + selected.$img.width()/2);
        }else{
            m = m.flip(direction, selected.$img.y() + selected.$img.height()/2);
        }

        selected.$img.transform(m)
        this.syncSize(selected);
    }

    /**
     * 左转
     * @param  {number} angle 角度
     */
    trunlf(angle){
        this.trun(angle || -90);
    }

    /**
     * 右转
     * @param  {number} angle 角度
     */
    trunrt(angle){
        this.trun(angle || 90);
    }

    trun(angle){
        let selected = this.checkSelection();
        if(!selected){
            return ;
        }

        let m = new SVG.Matrix(selected.$img);
        m = m.rotate(angle, selected.$img.x() + selected.$img.width()/2, selected.$img.y() + selected.$img.height()/2)
        selected.$img.transform(m);

        this.syncSize(selected);
    }

    transformPoint(x, y, p, m){
        p.x = x;
        p.y = y;
        return p.matrixTransform(m);
    }

    // 右移
    rxmove(shiftKey){
        this.xymove(shiftKey ? 10 : 1, 0);
    }
    //左移
    lxmove(shiftKey){
        this.xymove(shiftKey ? -10 : -1, 0);
    }
    // 下移
    bymove(shiftKey){
        this.xymove(0, shiftKey ? 10 : 1);
    }
    // 上移动
    tymove(shiftKey){
        this.xymove(0, shiftKey ? -10 : -1);
    }

    /**
     * 通过键盘点击上下左右来移动
     * @param  {number} x x轴移动多少
     * @param  {number} y y轴移动多少
     */
    xymove(x, y){
        let selected = this.checkSelection();
        if(!selected){
            return ;
        }

        const el = selected.$img;
        const box = el.bbox();


        const relativePoint = el.parent().node.createSVGPoint();
        const m = el.node.getScreenCTM().inverse();

        const startPoint = this.transformPoint(0, 0, relativePoint, m);
        const endPoint = this.transformPoint(x, y, relativePoint, m);

        const newX = box.x + endPoint.x - startPoint.x;
        const newY = box.y + endPoint.y - startPoint.y;

        el.move(newX, newY);
        this.syncSize(selected);
    }

    /**
     * 重置元素
     * @param {Object} item     元素
     * @param {boolean} selected 当前元素是否已经选中
     */
    drawimg(seri, prd, attr, selected){
        if(attr.$img){
            if(selected){
                this.select(attr, false);
            }
            attr.$img.remove();
            attr.$img = null;
        }

        // 创建svg元素
        let img = null;
        if(prd.isRect){
            img = this.drawer.rect(attr.width, attr.height).fill({color: "#33ccff", opacity: 0.6});
        }else{
            img = this.drawer.image(this.server + prd.url, attr.width, attr.height);
        }

        if(attr.matrix){
            const matrix = new SVG.Matrix(attr.matrix);
            img.transform(matrix);
        }

        img.move(attr.x, attr.y);

        // 把svg元素的引用相互保存到item中
        attr.$img = img;
        attr.$img.ref = attr;

        if(selected){
            this.select(attr, true);
        }

        // 监听svg元素的点击事件
        img.click(()=>{
            if(attr.$selected){
                return ;
            }

            for(let sibling of this.elements){
                if(sibling.$selected){
                    this.select(sibling, false); // 取消选中已选中的
                }
            }

            this.select(attr, true);
            this.touchendTime = new Date().getTime();// 框架/浏览器有bug？，用来防止后续svg的点击事件会被激活
        });

        img.on('dragend', (evt)=>{
            this.syncSize(attr);
            console.log('dragend');
        });

        img.on('resizedone', ()=>{
            if(!attr.$prd.isRect){
                this.constraintRatio(img, attr);
            }
            this.syncSize(attr);
            console.log('resizedone');
        });
    }

    constraintRatio(img, attr){
        let width = img.width();
        let height = img.height();

        const radio = width/height;
        console.log('attr.$prd.width:',attr.$prd.width, ',', attr.$prd.height);
        const constraint = attr.$prd.width ? Number(attr.$prd.width)/Number(attr.$prd.height) : attr.width/attr.height;
        // 以高为准，
        if(radio > constraint){
            width = constraint*height;
            img.size(width, height);
        // 以宽为准
        }else{
            height = width/constraint;
            img.size(width, height);
        }
    }

    /**
     * 同步属性
     */
    syncSize(item){
        this.dirty = true;
        const img = item.$img;
        item.x = img.x();
        item.y = img.y();
        item.width = img.width();
        item.height = img.height();

        const matrix = new SVG.Matrix(img);
        item.matrix = `${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e},${matrix.f}`;

        this.sync(item, ['x', 'y', 'width', 'height', 'matrix']);
        console.log('x:', item.x, ',y:', item.y, ',width:', item.width, ',height:', item.height, ',matrix:', item.matrix);
        this.touchendTime = new Date().getTime();
    }

    /**
     * 修改产品
     */
    changePrd(seri, prd){
        if(seri.isBg){
            return ;
        }

        this.dirty = true;

        let selectIndex = -1;
        // 已经添加这个系列到图上了
        if(seri.$currPrd){
            // 当前选的已经是这个了
            if(prd.id === seri.$currPrd.id){
                return ;
            }else{
                // 从elements中删除
                for(let i=0;i<this.elements.length;i++){
                    if(this.elements[i].$prd === seri.$currPrd){
                        this.elements.splice(i, 1);
                        i--;
                    }
                }

                const oldPrd = seri.$currPrd;
                const position = oldPrd.attr[0].$img.position();
                // 销毁原来的svg元素
                for(let i=0;i<oldPrd.attr.length;i++){
                    const attr = oldPrd.attr[i];
                    if(attr.$selected){
                        selectIndex = i;
                        this.select(attr, false);
                    }

                    attr.$img.remove();
                    attr.$img = null;
                }


                seri.$currPrd = prd;
                this.drawPrd(seri);
                // 移动到原来的元素的前面
                for(let att of prd.attr){
                    this.drawer.add(att.$img, position);
                }
            }

        // 还没有添加这个系列到图上呢？
        }else{
            seri.zindex = this.maxZindex() + 1; // 后加进来的默认在最上面
            seri.$currPrd = prd;
            prd.is_default = '1';
            prd.is_special = '0';
            this.drawPrd(seri);
            seri.zindex = this.series.length;
            this.resetZIndex(true);
        }

        if(selectIndex === -1){
            selectIndex = 0;
            const currSelection = this.getSelection();
            if(currSelection){
                this.select(currSelection, false);
            }
        }

        this.sortEls();
        this.select(seri.$currPrd.attr[selectIndex], true);
        this.sync(prd.attr[0]);
    }

    // 删除产品
    delPrd(prd){
        this.dirty = true;
        const seri = prd.$seri;
        if(seri.$currPrd === prd){
            // 从elements中删除
            for(let i=0;i<this.elements.length;i++){
                if(this.elements[i].$prd === prd){
                    this.elements.splice(i, 1);
                    i--;
                }
            }

            // 销毁原来的svg元素
            for(let i=0;i<prd.attr.length;i++){
                const attr = prd.attr[i];
                if(attr.$selected){
                    this.select(attr, false);
                }

                attr.$img.remove();
                attr.$img = null;
            }

            seri.$currPrd = null;
        }

        // 从序列中删除产品
        for(let i=0;i<seri.products.length;i++){
            if(seri.products[i] === prd){
                seri.products.splice(i, 1);
                break;
            }
        }
    }

    // 删除元素
    remove(){
        let selected = this.checkSelection();
        if(!selected){
            return ;
        }

        const prd = selected.$prd;
        const seri = prd.$seri;


        // 取消选中
        this.select(selected, false);

        // 删除元素
        selected.$img.remove();
        selected.$img = null;

        // 从elements中删除
        for(let i=0;i<this.elements.length;i++){
            if(this.elements[i] === selected){
                this.elements.splice(i, 1);
                break;
            }
        }

        // 最后一个了,就不是删除元素了，是删除prd
        if(prd.attr.length === 1){
            seri.$currPrd = null;

            // 如果是遮挡，需要删除系列
            if(prd.$seri.$emptyable === false){
                for(let i=0;i<this.series.length;i++){
                    this.series.splice(i, 1);
                    break;
                }
            }
            return ;
        }

        // 从 product.attr中删除, 包括其他兄弟节点
        for(let i=0;i<prd.attr.length;i++){
            if(prd.attr[i] === selected){
                for(let sblings of seri.products){
                    sblings.attr.splice(i, 1);
                }
                break;
            }
        }
    }

    // 重置zindex
    resetZIndex(sort){
        if(sort){
            this.series.sort((a, b)=>{
                return a.zindex - b.zindex;
            });
        }
        for(let i=0;i<this.series.length;i++){
            this.series[i].zindex = i;
        }
    }

    sync(el){
        // 非默认的，不同步
        if(el.$prd.is_special == '1'){
            return ;
        }

        const currPrd = el.$prd;
        const currSeri = currPrd.$seri;
        if(currSeri.products.length === 1){
            return;
        }

        this.syncByPrd(currPrd, currSeri);
    }

    syncByPrd(currPrd, seri){
        for(let prd of seri.products){
            // 同系列下的兄弟产品， 只要不被标记成特殊的，都级联修改
            if(prd.id !== currPrd.id && prd.is_special != '1'){
                this.syncPrdByTarget(prd, currPrd);
            }
        }
    }

    syncPrdByTarget(dist, src){
        for(let i=0;i<src.attr.length;i++){
            let currAttr = src.attr[i];
            let targetAttr = dist.attr[i];
            if(targetAttr){
                targetAttr.x = currAttr.x;
                targetAttr.y = currAttr.y;
                targetAttr.width = currAttr.width;
                targetAttr.height = currAttr.height;
                targetAttr.matrix = currAttr.matrix;
            }
        }
    }
};

export default Playground;
