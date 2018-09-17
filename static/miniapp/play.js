// var server = '/api';
var server = '';
var draw = null;
var seq = 0;
var serieNames = [];
var series = [];
var bgSeri = null;
var mainSeri = null;
var product = null;
var scene = null;

function ajax(type, url, data, fn){
    // 创建ajax对象
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    if(type === 'POST'){
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    // 处理返回数据
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                fn(null, JSON.parse(xhr.responseText));
            } else {
                fn(xhr.status || 'error');
            }
        }
    }
}

function getParams(){
    var str = window.location.search;
    str = str.substring(1);

    var keyVals = str.split('&');
    var params = {};
    for (var i = 0; i < keyVals.length; i++) {
        var keyVal = keyVals[i];
        // 按照=分割
        var splitIndex = keyVal.indexOf('=');
        if (splitIndex !== -1) {
            params[keyVal.substring(0, splitIndex)] = keyVal.substring(splitIndex + 1);
        }
    }
    // return params.token || 'b3c8aa94413add6c38026c164d2f83eb';
    return params;
}

function init(){
    draw = SVG('drawing');
    draw.panZoom({zoomMin: 0.25, zoomMax: 10});
    var params = getParams();
    var data = 'id='+params.id+'&main_product='+params.id+'&token=' + encodeURIComponent(params.token);
    var prdDone = sceneDone = false;
    var prd = scene = null;
    function done(){
        if(prdDone && sceneDone){
            initScene(prd, scene);
        }
    }

    ajax('POST', server + '/productApi/getProductInfo', data, function(err, rs){
        if(!err && rs && rs.result && rs.result.product){
            prdDone = true;
            prd = rs.result.product;
        }
        done();
    });

    ajax('POST', server + '/productApi/getSceneInfo', data, function(err, rs){
        if(!err && rs && rs.result && rs.result.scene){
            sceneDone = true;
            scene = rs.result.scene;
        }
        done();
    });
}

function initScene(prdParam, senceParam){
    product = prdParam;
    scene = senceParam;
    series = [];
    serieNames = [];

    // 主产品颜色
    mainSeri = {id: seq++, $currPrd : null, title:'产品颜色', zindex : scene.zindex, products : [], isMain: true};
    var defaultMainPrd = null;
    var exsitsPrds = {};
    for(var i=0;i<scene.products.length;i++){
        var prd = scene.products[i];
        prd.$seri = mainSeri;
        prd.id = prd.id || prd.pic_id;
        prd.isMainProduct = true;
        prd.is_default = prd.is_default === undefined ? '1' : prd.is_default;
        prd.is_special = prd.is_special === undefined ? '0' : prd.is_special;

        for(var color of product.attr){
            if(prd.id === color.id){
                prd.pic_title = color.pic_title;
                prd.price = color.price;
                break;
            }
        }

        for(var attr of prd.attr){
            attr.$prd = prd;
        }
        mainSeri.products.push(prd);
        if(!defaultMainPrd && prd.is_special !== '1'){
            defaultMainPrd = prd;
        }
        exsitsPrds[prd.id] = true;
    }
    if(!defaultMainPrd && mainSeri.products.length > 0){
        defaultMainPrd = mainSeri.products[0];
    }
    findNewColor(product, mainSeri, mainSeri.products, defaultMainPrd, exsitsPrds);

    mainSeri.$currPrd = mainSeri.products[0];
    series.push(mainSeri);

    // 背景
    bgSeri = {id: seq++, $currPrd : null, title : '背景系列', zindex : -1, products : [], isBg : true};
    for(var i=0;i<scene.bg_info.length;i++){
        var prd = scene.bg_info[i];
        prd.attr = [{
            x : 0,
            y : 0,
            width : 1024,
            height : 768
        }];
        bgSeri.products.push(prd);
    }
    series.push(bgSeri);
    findDefaultPrd(bgSeri);
    bgSeri = bgSeri;

    // 其他的系列
    for(var i=0;i<scene.other_product.length;i++){
        var seri = scene.other_product[i];
        seri.id = seq++;
        for(var prd of seri.products){
            if(prd.is_default === '1'){
                seri.$currPrd = prd;
                break;
            }
        }
        if(!seri.$currPrd){
            seri.$currPrd = seri.products[0];
        }
        series.push(seri);
    }

    for(var i=0;i<series.length;i++){
        var seri = series[i];
        serieNames.push({
            id : seri.id,
            title : seri.title,
            seri : seri,
            checked : i === 0
        });
    }

    series = sortSeries(series);
    initDom(serieNames);

    changeVisble();
    renderSVG();
}

function initDom(serieNames){
    var prdsHtml = '';
    var serisHtml = '';

    serisHtml += '<div class="seris h-flex">'
    for(var i=0;i<serieNames.length;i++){
        var seri = serieNames[i].seri;
        serisHtml += '<div><div class="serie" id="seri_title_'+seri.id+'" onclick="toggleSeri('+seri.id+')">'+seri.title+'</div></div>';

        prdsHtml += '<div class="prds h-flex" style="display:none;" id="seri_box_'+seri.id+'">';
        for(var j=0;j<seri.products.length;j++){
            var prd = seri.products[j];
            prdsHtml += '<div class="prd" id="prd_'+seri.id+'_'+prd.id+'"  onclick="togglePrd('+prd.id+','+seri.id+')">'
            prdsHtml += '<div class="prd-img" style="background-image:url(\''+ server + prd.url+'\')"></div>';
            prdsHtml += '<div class="prd-title"><div>'+prd.pic_title+'</div></div>';
            prdsHtml += '</div>';
        }
        prdsHtml += '</div>';
    }
    serisHtml += '</div>';

    document.getElementById('bbar').innerHTML = serisHtml + prdsHtml;
    toggleVisible();
}

function toggleVisible(){
    let mainId = mainSeri.$currPrd.id;
    for(var i=0;i<serieNames.length;i++){
        var seri = serieNames[i];
        document.getElementById('seri_title_' + seri.id).className = seri.checked ? 'serie active' : 'serie';
        document.getElementById('seri_box_' + seri.id).style.display = seri.checked ? '' : 'none';

        if(seri.checked){
            var prds = seri.seri.products;
            for(var j=0;j<prds.length;j++){
                var prd = prds[j];
                var cls = ['prd'];
                if(seri.seri.$currPrd === prd){
                    cls.push('active');
                }

                if(prd.is_visible == '0' && prd.same_by !== mainId){
                    cls.push('none');
                }

                document.getElementById('prd_' + seri.id + '_' + prd.id).className = cls.join(' ');
            }
        }
    }
}

// changeVisble
function changeVisble(){
    const mainId = mainSeri.$currPrd.id;

    for(let serie of series){
        if(serie.isMain || serie.isBg){
            continue;
        }

        // 这个系列下没有东西， 继续
        let curr = serie.$currPrd;
        if(!curr){
            continue;
        }

        // 现在已经是同色的了，继续
        if(curr.same_by === mainId){
            continue;
        }

        let found = false;
        for(let prd of serie.products){
            if(prd.same_by === mainId){
                found = true;
                serie.$currPrd = prd;
                break;
            }
        }

        if(!found){
            serie.$currPrd = serie.products[0];
        }
    }
}

function toggleSeri(id){
    for(var i=0;i<serieNames.length;i++){
        var seri = serieNames[i];
        seri.checked = id == seri.id;
    }

    toggleVisible();
}

function togglePrd(id, seriId){
    for(var i=0;i<serieNames.length;i++){
        var seri = serieNames[i].seri;
        if(seriId == seri.id){
            for(var j=0;j<seri.products.length;j++){
                var prd = seri.products[j];
                if(prd.id == id){
                    seri.$currPrd = prd;
                }
            }

            break;
        }
    }
    draw.clear();
    toggleVisible();

    if(seriId === mainSeri.id){
        changeVisble();
    }
    renderSVG();
}

function sortSeries(series){
    return series.sort((a, b)=>{
        return a.zindex - b.zindex;
    });
}

function findDefaultPrd(seri){
    for(var prd of seri.products){
        if(prd.is_default == '1'){
            seri.$currPrd = prd;
            break;
        }
    }
    if(!seri.$currPrd){
        seri.$currPrd = seri.products[0];
    }
}

function props(attr){
    var obj = {};
    for(var f in attr){
        if(/^\$/.test(f) || f === 'is_default' || f === 'is_special'){
            continue;
        }
        obj[f] = attr[f];
    }
    return obj;
}

function findNewColor(product, mainSeri, sceneProducts, defaultMainPrd, exsitsPrds){
    for(var color of product.attr){
        if(exsitsPrds[color.id]){
            continue;
        }
        var prdItem = {
            pic_id : color.id,
            pic_title : color.pic_title,
            url : color.url,
            width : Number(color.width),
            height : Number(color.height),
            price : color.price,
            is_default : '1',
            is_special : '0',
            attr : [{
                x : 0,
                y : 0,
                width : Number(color.width),
                height : Number(color.height)
            }]
        };

        prdItem.selected = false;
        prdItem.$seri = mainSeri;
        prdItem.isMainProduct = true;

        if(defaultMainPrd){
            prdItem.attr = [];

            for(var attr of defaultMainPrd.attr){
                var cloneAttr = props(attr);
                cloneAttr.$prd = prdItem;
                prdItem.attr.push(cloneAttr);
            }
        }
        sceneProducts.push(prdItem);
    }
}

function renderSVG(){
    draw.clear();

    // 画背景图片
    drawimg(draw, bgSeri.$currPrd, bgSeri.$currPrd.attr[0]);

    // 画门
    var group = draw.nested();
    for(var seri of series){
        if(seri.isBg){
            bgPrd = seri.$currPrd;
            continue;
        }

        var prd = seri.$currPrd;
        if(prd){
            for(var img of prd.attr){
                drawimg(group, prd, img);
            }
        }
    }

    var bgPrd = bgSeri.$currPrd;

    group.size(bgPrd.show_attr.width, bgPrd.show_attr.height)
    group.move(bgPrd.show_attr.x, bgPrd.show_attr.y);

    var rectRadio = bgPrd.show_attr.height/bgPrd.show_attr.width;
    var bbox = group.bbox();
    var ratioHeight = bbox.width * rectRadio;
    bbox.height = ratioHeight;

    group.viewbox(bbox);

    // 画遮挡
    if(bgPrd.parts){
        for(var part of bgPrd.parts){
            for(var i=0;i<part.attr.length;i++){
                var img = part.attr[i];
                drawimg(draw, part, img);
            }
        }
    }

    var canvasBbox = draw.bbox();
    draw.viewbox(canvasBbox);
}


function drawimg(draw, prd, attr){
    var img = draw.image(server + prd.url, attr.width, attr.height);
    if(attr.matrix){
        var matrix = new SVG.Matrix(attr.matrix);
        img.transform(matrix);
    }
    img.move(attr.x, attr.y);
    return img;
}

window.onload = init;
