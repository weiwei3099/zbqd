webpackJsonp([1],{11:function(t,e,a){t.exports=a(12)},12:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(1),r=a(3),s=a.n(r),n=a(33),o=a.n(n),h=a(34),p=(a.n(h),a(35));s.a.interceptors.request.use(function(t){return o.a.LoadingBar.start(),t},function(t){return Promise.reject(t)}),s.a.interceptors.response.use(function(t){return o.a.LoadingBar.finish(),1e3==t.data.code&&router.push({name:"登录"}),1011==t.data.code&&router.push({name:"登录"}),t},function(t){return Promise.reject(t)}),i.default.mixin({data:function(){return{server:"http://fitment.gz-studio.com.cn",api:""}},methods:{go:function(t){this.$router.push(t)}}}),new i.default({el:"#app",render:function(t){return t(p.a)}})},35:function(t,e,a){"use strict";function i(t){a(36)}var r=a(38),s=a(48),n=a(37),o=i,h=n(r.a,s.a,o,null,null);e.a=h.exports},36:function(t,e){},38:function(t,e,a){"use strict";function i(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,a){function i(r,s){try{var n=e[r](s),o=n.value}catch(t){return void a(t)}if(!n.done)return Promise.resolve(o).then(function(t){i("next",t)},function(t){i("throw",t)});t(o)}return i("next")})}}var r=a(39),s=a.n(r),n=(a(42),a(3)),o=a.n(n),h=a(45),p=a.n(h);o.a.defaults.headers["Content-Type"]="application/x-www-form-urlencoded",e.a={data:function(){return{items:[]}},methods:{getParams:function(t){for(var e=location.search.replace(/^\?/,"").split("&"),a={},i=0,r=e.length;i<r;i++){var s=e[i].split("=");a[s[0]]=s[1]}return t?a[t]||"":a},getUrlParam:function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(e);return null!=a?unescape(a[2]):null},getList:function(){function t(){return e.apply(this,arguments)}var e=i(s.a.mark(function t(){var e,a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.post("/picApi/factoryAlbumInfo",p.a.stringify({id:this.getUrlParam("id")}));case 2:e=t.sent,a=e.data,this.item=a.result.album,this.items=a.result.album.pic;case 6:case"end":return t.stop()}},t,this)}));return t}(),share:function(){function t(){return e.apply(this,arguments)}var e=i(s.a.mark(function t(){var e,a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,o.a.post("/wxApi/shareConfig");case 2:e=t.sent,a=e.data;case 4:case"end":return t.stop()}},t,this)}));return t}()},created:function(){this.getList()},mounted:function(){}}},42:function(t,e,a){"use strict";var i=a(43),r=(a.n(i),a(44));a.n(r);a(1).default.directive("turn",{componentUpdated:function(t,e){var a=$(window).width(),i=$(window).height(),r=$(".audio")[0];$(t).find(".flipbook").turn({width:a,height:i,elevation:50,gradients:!0,autoCenter:!0,pages:2,display:"single",duration:1e3,when:{turning:function(t,e,a){r.paused&&r.play()},turned:function(t,e,a){r.paused||r.pause()}}})}})},43:function(t,e){var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};(function(t){function e(t,e,i){if(!i[0]||"object"==a(i[0]))return e.init.apply(t,i);if(e[i[0]])return e[i[0]].apply(t,Array.prototype.slice.call(i,1));throw c(i[0]+" is not a method or property")}function i(t,e,a,i){return{css:{position:"absolute",top:t,left:e,overflow:i||"hidden",zIndex:a||"auto"}}}function r(t,e,a,i,r){var n=1-r,o=n*n*n,h=r*r*r;return s(Math.round(o*t.x+3*r*n*n*e.x+3*r*r*n*a.x+h*i.x),Math.round(o*t.y+3*r*n*n*e.y+3*r*r*n*a.y+h*i.y))}function s(t,e){return{x:t,y:e}}function n(t,e,a){return g&&a?" translate3d("+t+"px,"+e+"px, 0px) ":" translate("+t+"px, "+e+"px) "}function o(t){return" rotate("+t+"deg) "}function h(t,e){return Object.prototype.hasOwnProperty.call(e,t)}function p(){for(var t=["Moz","Webkit","Khtml","O","ms"],e=t.length,a="";e--;)t[e]+"Transform"in document.body.style&&(a="-"+t[e].toLowerCase()+"-");return a}function d(t,e,a,i,r){var n,o=[];if("-webkit-"==v){for(n=0;n<r;n++)o.push("color-stop("+i[n][0]+", "+i[n][1]+")");t.css({"background-image":"-webkit-gradient(linear, "+e.x+"% "+e.y+"%,"+a.x+"% "+a.y+"%, "+o.join(",")+" )"})}else{var e={x:e.x/100*t.width(),y:e.y/100*t.height()},a={x:a.x/100*t.width(),y:a.y/100*t.height()},h=a.x-e.x;n=a.y-e.y;var p=Math.atan2(n,h),d=p-Math.PI/2,d=Math.abs(t.width()*Math.sin(d))+Math.abs(t.height()*Math.cos(d)),h=Math.sqrt(n*n+h*h),a=s(a.x<e.x?t.width():0,a.y<e.y?t.height():0),l=Math.tan(p);for(n=-1/l,l=(n*a.x-a.y-l*e.x+e.y)/(n-l),a=n*l-n*a.x+a.y,e=Math.sqrt(Math.pow(l-e.x,2)+Math.pow(a-e.y,2)),n=0;n<r;n++)o.push(" "+i[n][1]+" "+100*(e+h*i[n][0])/d+"%");t.css({"background-image":v+"linear-gradient("+-p+"rad,"+o.join(",")+")"})}}function l(e,a,i){return e=t.Event(e),a.trigger(e,i),e.isDefaultPrevented()?"prevented":e.isPropagationStopped()?"stopped":""}function c(t){function e(t){this.name="TurnJsError",this.message=t}return e.prototype=Error(),e.prototype.constructor=e,new e(t)}function u(t){var e={top:0,left:0};do{e.left+=t.offsetLeft,e.top+=t.offsetTop}while(t=t.offsetParent);return e}var g,f,v="",w=Math.PI,m=w/2,b="ontouchstart"in window,x=b?{down:"touchstart",move:"touchmove",up:"touchend",over:"touchstart",out:"touchend"}:{down:"mousedown",move:"mousemove",up:"mouseup",over:"mouseover",out:"mouseout"},y={backward:["bl","tl"],forward:["br","tr"],all:"tl bl tr br l r".split(" ")},_=["single","double"],P=["ltr","rtl"],M={acceleration:!0,display:"double",duration:600,page:1,gradients:!0,turnCorners:"bl,br",when:null},z={cornerSize:100},k={init:function(e){g="WebKitCSSMatrix"in window||"MozPerspective"in document.body.style;var a;f=!(a=/AppleWebkit\/([0-9\.]+)/i.exec(navigator.userAgent))||534.3<parseFloat(a[1]),v=p();var i;a=0;var r=this.data(),s=this.children(),e=t.extend({width:this.width(),height:this.height(),direction:this.attr("dir")||this.css("direction")||"ltr"},M,e);if(r.opts=e,r.pageObjs={},r.pages={},r.pageWrap={},r.pageZoom={},r.pagePlace={},r.pageMv=[],r.zoom=1,r.totalPages=e.pages||0,r.eventHandlers={touchStart:t.proxy(k._touchStart,this),touchMove:t.proxy(k._touchMove,this),touchEnd:t.proxy(k._touchEnd,this),start:t.proxy(k._eventStart,this)},e.when)for(i in e.when)h(i,e.when)&&this.bind(i,e.when[i]);for(this.css({position:"relative",width:e.width,height:e.height}),this.turn("display",e.display),""!==e.direction&&this.turn("direction",e.direction),g&&!b&&e.acceleration&&this.transform(n(0,0,!0)),i=0;i<s.length;i++)"1"!=t(s[i]).attr("ignore")&&this.turn("addPage",s[i],++a);return t(this).bind(x.down,r.eventHandlers.touchStart).bind("end",k._eventEnd).bind("pressed",k._eventPressed).bind("released",k._eventReleased).bind("flip",k._flip),t(this).parent().bind("start",r.eventHandlers.start),t(document).bind(x.move,r.eventHandlers.touchMove).bind(x.up,r.eventHandlers.touchEnd),this.turn("page",e.page),r.done=!0,this},addPage:function(e,a){var i,r=!1,s=this.data(),n=s.totalPages+1;if(s.destroying)return!1;if((i=/\bp([0-9]+)\b/.exec(t(e).attr("class")))&&(a=parseInt(i[1],10)),a){if(a==n)r=!0;else if(a>n)throw c('Page "'+a+'" cannot be inserted')}else a=n,r=!0;return 1<=a&&a<=n&&(i="double"==s.display?a%2?" odd":" even":"",s.done&&this.turn("stop"),a in s.pageObjs&&k._movePages.call(this,a,1),r&&(s.totalPages=n),s.pageObjs[a]=t(e).css({float:"left"}).addClass("page p"+a+i),-1!=navigator.userAgent.indexOf("MSIE 9.0")&&s.pageObjs[a].hasClass("hard")&&s.pageObjs[a].removeClass("hard"),k._addPage.call(this,a),k._removeFromDOM.call(this)),this},_addPage:function(e){var a=this.data(),i=a.pageObjs[e];if(i)if(k._necessPage.call(this,e)){if(!a.pageWrap[e]){a.pageWrap[e]=t("<div/>",{class:"page-wrapper",page:e,css:{position:"absolute",overflow:"hidden"}}),this.append(a.pageWrap[e]),a.pagePlace[e]||(a.pagePlace[e]=e,a.pageObjs[e].appendTo(a.pageWrap[e]));var r=k._pageSize.call(this,e,!0);i.css({width:r.width,height:r.height}),a.pageWrap[e].css(r)}a.pagePlace[e]==e&&k._makeFlip.call(this,e)}else a.pagePlace[e]=0,a.pageObjs[e]&&a.pageObjs[e].remove()},hasPage:function(t){return h(t,this.data().pageObjs)},center:function(e){var a=this.data(),i=t(this).turn("size"),r=0;return a.noCenter||("double"==a.display&&(e=this.turn("view",e||a.tpage||a.page),"ltr"==a.direction?e[0]?e[1]||(r+=i.width/4):r-=i.width/4:e[0]?e[1]||(r-=i.width/4):r+=i.width/4),t(this).css({marginLeft:r})),this},destroy:function(){var e=this,a=this.data(),i="end first flip last pressed released start turning turned zooming missing".split(" ");if("prevented"!=l("destroying",this)){for(a.destroying=!0,t.each(i,function(t,a){e.unbind(a)}),this.parent().unbind("start",a.eventHandlers.start),t(document).unbind(x.move,a.eventHandlers.touchMove).unbind(x.up,a.eventHandlers.touchEnd);0!==a.totalPages;)this.turn("removePage",a.totalPages);return a.fparent&&a.fparent.remove(),a.shadow&&a.shadow.remove(),this.removeData(),a=null,this}},is:function(){return"object"==a(this.data().pages)},zoom:function(e){var a=this.data();if("number"==typeof e){if(.001>e||100<e)throw c(e+" is not a value for zoom");if("prevented"==l("zooming",this,[e,a.zoom]))return this;var i=this.turn("size"),r=this.turn("view"),s=1/a.zoom,n=Math.round(i.width*s*e),i=Math.round(i.height*s*e);for(a.zoom=e,t(this).turn("stop").turn("size",n,i),a.opts.autoCenter&&this.turn("center"),k._updateShadow.call(this),e=0;e<r.length;e++)r[e]&&a.pageZoom[r[e]]!=a.zoom&&(this.trigger("zoomed",[r[e],r,a.pageZoom[r[e]],a.zoom]),a.pageZoom[r[e]]=a.zoom);return this}return a.zoom},_pageSize:function(t,e){var a=this.data(),i={};if("single"==a.display)i.width=this.width(),i.height=this.height(),e&&(i.top=0,i.left=0,i.right="auto");else{var r=this.width()/2,s=this.height();if(a.pageObjs[t].hasClass("own-size")?(i.width=a.pageObjs[t].width(),i.height=a.pageObjs[t].height()):(i.width=r,i.height=s),e){var n=t%2;i.top=(s-i.height)/2,"ltr"==a.direction?(i[n?"right":"left"]=r-i.width,i[n?"left":"right"]="auto"):(i[n?"left":"right"]=r-i.width,i[n?"right":"left"]="auto")}}return i},_makeFlip:function(t){var e=this.data();if(!e.pages[t]&&e.pagePlace[t]==t){var a="single"==e.display,i=t%2;e.pages[t]=e.pageObjs[t].css(k._pageSize.call(this,t)).flip({page:t,next:i||a?t+1:t-1,turn:this}).flip("disable",e.disabled),k._setPageLoc.call(this,t),e.pageZoom[t]=e.zoom}return e.pages[t]},_makeRange:function(){var t,e;if(!(1>this.data().totalPages))for(e=this.turn("range"),t=e[0];t<=e[1];t++)k._addPage.call(this,t)},range:function(t){var e,a,i,r=this.data(),t=t||r.tpage||r.page||1;if(i=k._view.call(this,t),1>t||t>r.totalPages)throw c('"'+t+'" is not a valid page');return i[1]=i[1]||i[0],1<=i[0]&&i[1]<=r.totalPages?(t=Math.floor(2),r.totalPages-i[1]>i[0]?(e=Math.min(i[0]-1,t),a=2*t-e):(a=Math.min(r.totalPages-i[1],t),e=2*t-a)):a=e=5,[Math.max(1,i[0]-e),Math.min(r.totalPages,i[1]+a)]},_necessPage:function(t){if(0===t)return!0;var e=this.turn("range");return this.data().pageObjs[t].hasClass("fixed")||t>=e[0]&&t<=e[1]},_removeFromDOM:function(){var t,e=this.data();for(t in e.pageWrap)h(t,e.pageWrap)&&!k._necessPage.call(this,t)&&k._removePageFromDOM.call(this,t)},_removePageFromDOM:function(t){var e=this.data();if(e.pages[t]){var a=e.pages[t].data();O._moveFoldingPage.call(e.pages[t],!1),a.f&&a.f.fwrapper&&a.f.fwrapper.remove(),e.pages[t].removeData(),e.pages[t].remove(),delete e.pages[t]}e.pageObjs[t]&&e.pageObjs[t].remove(),e.pageWrap[t]&&(e.pageWrap[t].remove(),delete e.pageWrap[t]),k._removeMv.call(this,t),delete e.pagePlace[t],delete e.pageZoom[t]},removePage:function(t){var e=this.data();if("*"==t)for(;0!==e.totalPages;)this.turn("removePage",e.totalPages);else{if(1>t||t>e.totalPages)throw c("The page "+t+" doesn't exist");e.pageObjs[t]&&(this.turn("stop"),k._removePageFromDOM.call(this,t),delete e.pageObjs[t]),k._movePages.call(this,t,-1),e.totalPages-=1,e.page>e.totalPages?(e.page=null,k._fitPage.call(this,e.totalPages)):(k._makeRange.call(this),this.turn("update"))}return this},_movePages:function(t,e){var a,i=this,r=this.data(),s="single"==r.display,n=function(t){var a=t+e,n=a%2,o=n?" odd ":" even ";r.pageObjs[t]&&(r.pageObjs[a]=r.pageObjs[t].removeClass("p"+t+" odd even").addClass("p"+a+o)),r.pagePlace[t]&&r.pageWrap[t]&&(r.pagePlace[a]=a,r.pageWrap[a]=r.pageObjs[a].hasClass("fixed")?r.pageWrap[t].attr("page",a):r.pageWrap[t].css(k._pageSize.call(i,a,!0)).attr("page",a),r.pages[t]&&(r.pages[a]=r.pages[t].flip("options",{page:a,next:s||n?a+1:a-1})),e&&(delete r.pages[t],delete r.pagePlace[t],delete r.pageZoom[t],delete r.pageObjs[t],delete r.pageWrap[t]))};if(0<e)for(a=r.totalPages;a>=t;a--)n(a);else for(a=t;a<=r.totalPages;a++)n(a)},display:function(e){var a=this.data(),i=a.display;if(void 0===e)return i;if(-1==t.inArray(e,_))throw c('"'+e+'" is not a value for display');switch(e){case"single":a.pageObjs[0]||(this.turn("stop").css({overflow:"hidden"}),a.pageObjs[0]=t("<div />",{class:"page p-temporal"}).css({width:this.width(),height:this.height()}).appendTo(this)),this.addClass("shadow");break;case"double":a.pageObjs[0]&&(this.turn("stop").css({overflow:""}),a.pageObjs[0].remove(),delete a.pageObjs[0]),this.removeClass("shadow")}return a.display=e,i&&(e=this.turn("size"),k._movePages.call(this,1,0),this.turn("size",e.width,e.height).turn("update")),this},direction:function(e){var a=this.data();if(void 0===e)return a.direction;if(e=e.toLowerCase(),-1==t.inArray(e,P))throw c('"'+e+'" is not a value for direction');return"rtl"==e&&t(this).attr("dir","ltr").css({direction:"ltr"}),a.direction=e,a.done&&this.turn("size",t(this).width(),t(this).height()),this},animating:function(){return 0<this.data().pageMv.length},corner:function(){var t,e,a=this.data();for(e in a.pages)if(h(e,a.pages)&&(t=a.pages[e].flip("corner")))return t;return!1},data:function(){return this.data()},disable:function(e){var a,i=this.data(),r=this.turn("view");i.disabled=void 0===e||!0===e;for(a in i.pages)h(a,i.pages)&&i.pages[a].flip("disable",!!i.disabled||-1==t.inArray(parseInt(a,10),r));return this},disabled:function(t){return void 0===t?!0===this.data().disabled:this.turn("disable",t)},size:function(t,e){if(void 0===t||void 0===e)return{width:this.width(),height:this.height()};this.turn("stop");var a,i,r=this.data();i="double"==r.display?t/2:t,this.css({width:t,height:e}),r.pageObjs[0]&&r.pageObjs[0].css({width:i,height:e});for(a in r.pageWrap)h(a,r.pageWrap)&&(i=k._pageSize.call(this,a,!0),r.pageObjs[a].css({width:i.width,height:i.height}),r.pageWrap[a].css(i),r.pages[a]&&r.pages[a].css({width:i.width,height:i.height}));return this.turn("resize"),this},resize:function(){var t,e=this.data();for(e.pages[0]&&(e.pageWrap[0].css({left:-this.width()}),e.pages[0].flip("resize",!0)),t=1;t<=e.totalPages;t++)e.pages[t]&&e.pages[t].flip("resize",!0);k._updateShadow.call(this),e.opts.autoCenter&&this.turn("center")},_removeMv:function(t){var e,a=this.data();for(e=0;e<a.pageMv.length;e++)if(a.pageMv[e]==t)return a.pageMv.splice(e,1),!0;return!1},_addMv:function(t){var e=this.data();k._removeMv.call(this,t),e.pageMv.push(t)},_view:function(t){var e=this.data(),t=t||e.page;return"double"==e.display?t%2?[t-1,t]:[t,t+1]:[t]},view:function(t){var e=this.data(),t=k._view.call(this,t);return"double"==e.display?[0<t[0]?t[0]:0,t[1]<=e.totalPages?t[1]:0]:[0<t[0]&&t[0]<=e.totalPages?t[0]:0]},stop:function(t,e){if(this.turn("animating")){var a,i,r,s=this.data();for(s.tpage&&(s.page=s.tpage,delete s.tpage),a=0;a<s.pageMv.length;a++)s.pageMv[a]&&s.pageMv[a]!==t&&(r=s.pages[s.pageMv[a]],i=r.data().f.opts,r.flip("hideFoldedPage",e),e||O._moveFoldingPage.call(r,!1),i.force&&(i.next=0==i.page%2?i.page-1:i.page+1,delete i.force))}return this.turn("update"),this},pages:function(t){var e=this.data();if(t){if(t<e.totalPages)for(var a=e.totalPages;a>t;a--)this.turn("removePage",a);return e.totalPages=t,k._fitPage.call(this,e.page),this}return e.totalPages},_missing:function(t){var e=this.data();if(!(1>e.totalPages)){for(var a=this.turn("range",t),i=[],t=a[0];t<=a[1];t++)e.pageObjs[t]||i.push(t);0<i.length&&this.trigger("missing",[i])}},_fitPage:function(t){var e=this.data(),a=this.turn("view",t);if(k._missing.call(this,t),e.pageObjs[t]){e.page=t,this.turn("stop");for(var i=0;i<a.length;i++)a[i]&&e.pageZoom[a[i]]!=e.zoom&&(this.trigger("zoomed",[a[i],a,e.pageZoom[a[i]],e.zoom]),e.pageZoom[a[i]]=e.zoom);k._removeFromDOM.call(this),k._makeRange.call(this),k._updateShadow.call(this),this.trigger("turned",[t,a]),this.turn("update"),e.opts.autoCenter&&this.turn("center")}},_turnPage:function(e){var a,i,r=this.data(),s=r.pagePlace[e],n=this.turn("view"),o=this.turn("view",e);if(r.page!=e){var h=r.page;if("prevented"==l("turning",this,[e,o]))return void(h==r.page&&-1!=t.inArray(s,r.pageMv)&&r.pages[s].flip("hideFoldedPage",!0));-1!=t.inArray(1,o)&&this.trigger("first"),-1!=t.inArray(r.totalPages,o)&&this.trigger("last")}"single"==r.display?(a=n[0],i=o[0]):n[1]&&e>n[1]?(a=n[1],i=o[0]):n[0]&&e<n[0]&&(a=n[0],i=o[1]),s=r.opts.turnCorners.split(","),n=r.pages[a].data().f,o=n.opts,h=n.point,k._missing.call(this,e),r.pageObjs[e]&&(this.turn("stop"),r.page=e,k._makeRange.call(this),r.tpage=i,o.next!=i&&(o.next=i,o.force=!0),this.turn("update"),n.point=h,"hard"==n.effect?"ltr"==r.direction?r.pages[a].flip("turnPage",e>a?"r":"l"):r.pages[a].flip("turnPage",e>a?"l":"r"):"ltr"==r.direction?r.pages[a].flip("turnPage",s[e>a?1:0]):r.pages[a].flip("turnPage",s[e>a?0:1]))},page:function(e){var a=this.data();if(void 0===e)return a.page;if(!a.disabled&&!a.destroying){if(0<(e=parseInt(e,10))&&e<=a.totalPages)return e!=a.page&&(a.done&&-1==t.inArray(e,this.turn("view"))?k._turnPage.call(this,e):k._fitPage.call(this,e)),this;throw c("The page "+e+" does not exist")}},next:function(){return this.turn("page",Math.min(this.data().totalPages,k._view.call(this,this.data().page).pop()+1))},previous:function(){return this.turn("page",Math.max(1,k._view.call(this,this.data().page).shift()-1))},peel:function(t,e){var a=this.data(),i=this.turn("view"),e=void 0===e||!0===e;return!1===t?this.turn("stop",null,e):"single"==a.display?a.pages[a.page].flip("peel",t,e):(i="ltr"==a.direction?-1!=t.indexOf("l")?i[0]:i[1]:-1!=t.indexOf("l")?i[1]:i[0],a.pages[i]&&a.pages[i].flip("peel",t,e)),this},_addMotionPage:function(){var e=t(this).data().f.opts,a=e.turn;a.data(),k._addMv.call(a,e.page)},_eventStart:function(t,e,a){var i=e.turn.data(),r=i.pageZoom[e.page];t.isDefaultPrevented()||(r&&r!=i.zoom&&(e.turn.trigger("zoomed",[e.page,e.turn.turn("view",e.page),r,i.zoom]),i.pageZoom[e.page]=i.zoom),"single"==i.display&&a&&("l"==a.charAt(1)&&"ltr"==i.direction||"r"==a.charAt(1)&&"rtl"==i.direction?(e.next=e.next<e.page?e.next:e.page-1,e.force=!0):e.next=e.next>e.page?e.next:e.page+1),k._addMotionPage.call(t.target)),k._updateShadow.call(e.turn)},_eventEnd:function(e,a,i){t(e.target).data();var e=a.turn,r=e.data();i?(i=r.tpage||r.page)!=a.next&&i!=a.page||(delete r.tpage,k._fitPage.call(e,i||a.next,!0)):(k._removeMv.call(e,a.page),k._updateShadow.call(e),e.turn("update"))},_eventPressed:function(e){var e=t(e.target).data().f,a=e.opts.turn;return a.data().mouseAction=!0,a.turn("update"),e.time=(new Date).getTime()},_eventReleased:function(e,a){var i;i=t(e.target);var r=i.data().f,s=r.opts.turn,n=s.data();i="single"==n.display?"br"==a.corner||"tr"==a.corner?a.x<i.width()/2:a.x>i.width()/2:0>a.x||a.x>i.width(),(200>(new Date).getTime()-r.time||i)&&(e.preventDefault(),k._turnPage.call(s,r.opts.next)),n.mouseAction=!1},_flip:function(e){e.stopPropagation(),e=t(e.target).data().f.opts,e.turn.trigger("turn",[e.next]),e.turn.data().opts.autoCenter&&e.turn.turn("center",e.next)},_touchStart:function(){var t,e=this.data();for(t in e.pages)if(h(t,e.pages)&&!1===O._eventStart.apply(e.pages[t],arguments))return!1},_touchMove:function(){var t,e=this.data();for(t in e.pages)h(t,e.pages)&&O._eventMove.apply(e.pages[t],arguments)},_touchEnd:function(){var t,e=this.data();for(t in e.pages)h(t,e.pages)&&O._eventEnd.apply(e.pages[t],arguments)},calculateZ:function(t){var e,a,i,r,s=this,n=this.data();e=this.turn("view");var o=e[0]||e[1],h=t.length-1,p={pageZ:{},partZ:{},pageV:{}},d=function(t){t=s.turn("view",t),t[0]&&(p.pageV[t[0]]=!0),t[1]&&(p.pageV[t[1]]=!0)};for(e=0;e<=h;e++)a=t[e],i=n.pages[a].data().f.opts.next,r=n.pagePlace[a],d(a),d(i),a=n.pagePlace[i]==i?i:a,p.pageZ[a]=n.totalPages-Math.abs(o-a),p.partZ[r]=2*n.totalPages-h+e;return p},update:function(){var e,a=this.data();if(this.turn("animating")&&0!==a.pageMv[0]){var i,r=this.turn("calculateZ",a.pageMv),s=this.turn("corner"),n=this.turn("view"),o=this.turn("view",a.tpage);for(e in a.pageWrap)h(e,a.pageWrap)&&(i=a.pageObjs[e].hasClass("fixed"),a.pageWrap[e].css({display:r.pageV[e]||i?"":"none",zIndex:(a.pageObjs[e].hasClass("hard")?r.partZ[e]:r.pageZ[e])||(i?-1:0)}),i=a.pages[e])&&(i.flip("z",r.partZ[e]||null),r.pageV[e]&&i.flip("resize"),a.tpage?i.flip("hover",!1).flip("disable",-1==t.inArray(parseInt(e,10),a.pageMv)&&e!=o[0]&&e!=o[1]):i.flip("hover",!1===s).flip("disable",e!=n[0]&&e!=n[1]))}else for(e in a.pageWrap)h(e,a.pageWrap)&&(r=k._setPageLoc.call(this,e),a.pages[e]&&a.pages[e].flip("disable",a.disabled||1!=r).flip("hover",!0).flip("z",null));return this},_updateShadow:function(){var e,a,r=this.data(),s=this.width(),n=this.height(),o="single"==r.display?s:s/2;e=this.turn("view"),r.shadow||(r.shadow=t("<div />",{class:"shadow",css:i(0,0,0).css}).appendTo(this));for(var h=0;h<r.pageMv.length&&e[0]&&e[1];h++)e=this.turn("view",r.pages[r.pageMv[h]].data().f.opts.next),a=this.turn("view",r.pageMv[h]),e[0]=e[0]&&a[0],e[1]=e[1]&&a[1];switch(e[0]?e[1]?3:"ltr"==r.direction?2:1:"ltr"==r.direction?1:2){case 1:r.shadow.css({width:o,height:n,top:0,left:o});break;case 2:r.shadow.css({width:o,height:n,top:0,left:0});break;case 3:r.shadow.css({width:s,height:n,top:0,left:0})}},_setPageLoc:function(t){var e=this.data(),a=this.turn("view"),i=0;if(t==a[0]||t==a[1]?i=1:("single"==e.display&&t==a[0]+1||"double"==e.display&&t==a[0]-2||t==a[1]+2)&&(i=2),!this.turn("animating"))switch(i){case 1:e.pageWrap[t].css({zIndex:e.totalPages,display:""});break;case 2:e.pageWrap[t].css({zIndex:e.totalPages-1,display:""});break;case 0:e.pageWrap[t].css({zIndex:0,display:e.pageObjs[t].hasClass("fixed")?"":"none"})}return i},options:function(e){if(void 0===e)return this.data().opts;var a=this.data();if(t.extend(a.opts,e),e.pages&&this.turn("pages",e.pages),e.page&&this.turn("page",e.page),e.display&&this.turn("display",e.display),e.direction&&this.turn("direction",e.direction),e.width&&e.height&&this.turn("size",e.width,e.height),e.when)for(var i in e.when)h(i,e.when)&&this.unbind(i).bind(i,e.when[i]);return this},version:function(){return"4.1.0"}},O={init:function(t){return this.data({f:{disabled:!1,hover:!1,effect:this.hasClass("hard")?"hard":"sheet"}}),this.flip("options",t),O._addPageWrapper.call(this),this},setData:function(e){var a=this.data();return a.f=t.extend(a.f,e),this},options:function(e){var a=this.data().f;return e?(O.setData.call(this,{opts:t.extend({},a.opts||z,e)}),this):a.opts},z:function(t){var e=this.data().f;return e.opts["z-index"]=t,e.fwrapper&&e.fwrapper.css({zIndex:t||parseInt(e.parent.css("z-index"),10)||0}),this},_cAllowed:function(){var t=this.data().f,e=t.opts.page,a=t.opts.turn.data(),i=e%2;return"hard"==t.effect?"ltr"==a.direction?[i?"r":"l"]:[i?"l":"r"]:"single"==a.display?1==e?"ltr"==a.direction?y.forward:y.backward:e==a.totalPages?"ltr"==a.direction?y.backward:y.forward:y.all:"ltr"==a.direction?y[i?"forward":"backward"]:y[i?"backward":"forward"]},_cornerActivated:function(e){var a=this.data().f,i=this.width(),r=this.height(),e={x:e.x,y:e.y,corner:""},s=a.opts.cornerSize;if(0>=e.x||0>=e.y||e.x>=i||e.y>=r)return!1;var n=O._cAllowed.call(this);switch(a.effect){case"hard":if(e.x>i-s)e.corner="r";else{if(!(e.x<s))return!1;e.corner="l"}break;case"sheet":if(e.y<s)e.corner+="t";else{if(!(e.y>=r-s))return!1;e.corner+="b"}if(e.x<=s)e.corner+="l";else{if(!(e.x>=i-s))return!1;e.corner+="r"}}return!(!e.corner||-1==t.inArray(e.corner,n))&&e},_isIArea:function(t){var e=this.data().f.parent.offset(),t=b&&t.originalEvent?t.originalEvent.touches[0]:t;return O._cornerActivated.call(this,{x:t.pageX-e.left,y:t.pageY-e.top})},_c:function(t,e){switch(e=e||0,t){case"tl":return s(e,e);case"tr":return s(this.width()-e,e);case"bl":return s(e,this.height()-e);case"br":return s(this.width()-e,this.height()-e);case"l":return s(e,0);case"r":return s(this.width()-e,0)}},_c2:function(t){switch(t){case"tl":return s(2*this.width(),0);case"tr":return s(-this.width(),0);case"bl":return s(2*this.width(),this.height());case"br":return s(-this.width(),this.height());case"l":return s(2*this.width(),0);case"r":return s(-this.width(),0)}},_foldingPage:function(){var t=this.data().f;if(t){var e=t.opts;if(e.turn)return t=e.turn.data(),"single"==t.display?1<e.next||1<e.page?t.pageObjs[0]:null:t.pageObjs[e.next]}},_backGradient:function(){var e=this.data().f,a=e.opts.turn.data();return(a=a.opts.gradients&&("single"==a.display||2!=e.opts.page&&e.opts.page!=a.totalPages-1))&&!e.bshadow&&(e.bshadow=t("<div/>",i(0,0,1)).css({position:"",width:this.width(),height:this.height()}).appendTo(e.parent)),a},type:function(){return this.data().f.effect},resize:function(t){var e=this.data().f,a=e.opts.turn.data(),i=this.width(),r=this.height();switch(e.effect){case"hard":t&&(e.wrapper.css({width:i,height:r}),e.fpage.css({width:i,height:r}),a.opts.gradients&&(e.ashadow.css({width:i,height:r}),e.bshadow.css({width:i,height:r})));break;case"sheet":t&&(t=Math.round(Math.sqrt(Math.pow(i,2)+Math.pow(r,2))),e.wrapper.css({width:t,height:t}),e.fwrapper.css({width:t,height:t}).children(":first-child").css({width:i,height:r}),e.fpage.css({width:i,height:r}),a.opts.gradients&&e.ashadow.css({width:i,height:r}),O._backGradient.call(this)&&e.bshadow.css({width:i,height:r})),e.parent.is(":visible")&&(a=u(e.parent[0]),e.fwrapper.css({top:a.top,left:a.left}),a=u(e.opts.turn[0]),e.fparent.css({top:-a.top,left:-a.left})),this.flip("z",e.opts["z-index"])}},_addPageWrapper:function(){var e=this.data().f,a=e.opts.turn.data(),r=this.parent();if(e.parent=r,!e.wrapper)switch(e.effect){case"hard":var s={};s[v+"transform-style"]="preserve-3d",s[v+"backface-visibility"]="hidden",e.wrapper=t("<div/>",i(0,0,2)).css(s).appendTo(r).prepend(this),e.fpage=t("<div/>",i(0,0,1)).css(s).appendTo(r),a.opts.gradients&&(e.ashadow=t("<div/>",i(0,0,0)).hide().appendTo(r),e.bshadow=t("<div/>",i(0,0,0)));break;case"sheet":var s=this.width(),n=this.height();Math.round(Math.sqrt(Math.pow(s,2)+Math.pow(n,2))),e.fparent=e.opts.turn.data().fparent,e.fparent||(s=t("<div/>",{css:{"pointer-events":"none"}}).hide(),s.data().flips=0,s.css(i(0,0,"auto","visible").css).appendTo(e.opts.turn),e.opts.turn.data().fparent=s,e.fparent=s),this.css({position:"absolute",top:0,left:0,bottom:"auto",right:"auto"}),e.wrapper=t("<div/>",i(0,0,this.css("z-index"))).appendTo(r).prepend(this),e.fwrapper=t("<div/>",i(r.offset().top,r.offset().left)).hide().appendTo(e.fparent),e.fpage=t("<div/>",i(0,0,0,"visible")).css({cursor:"default"}).appendTo(e.fwrapper),a.opts.gradients&&(e.ashadow=t("<div/>",i(0,0,1)).appendTo(e.fpage)),O.setData.call(this,e)}O.resize.call(this,!0)},_fold:function(t){var e=this.data().f,a=e.opts.turn.data(),i=O._c.call(this,t.corner),r=this.width(),h=this.height();switch(e.effect){case"hard":t.x="l"==t.corner?Math.min(Math.max(t.x,0),2*r):Math.max(Math.min(t.x,r),-r);var p,l,c,u,g,b=a.totalPages,x=e.opts["z-index"]||b,y={overflow:"visible"},_=i.x?(i.x-t.x)/r:t.x/r,P=90*_,M=90>P;switch(t.corner){case"l":u="0% 50%",g="100% 50%",M?(p=0,l=0<e.opts.next-1,c=1):(p="100%",l=e.opts.page+1<b,c=0);break;case"r":u="100% 50%",g="0% 50%",P=-P,r=-r,M?(p=0,l=e.opts.next+1<b,c=0):(p="-100%",l=1!=e.opts.page,c=1)}y[v+"perspective-origin"]=g,e.wrapper.transform("rotateY("+P+"deg)translate3d(0px, 0px, "+(this.attr("depth")||0)+"px)",g),e.fpage.transform("translateX("+r+"px) rotateY("+(180+P)+"deg)",u),e.parent.css(y),M?(_=1-_,e.wrapper.css({zIndex:x+1}),e.fpage.css({zIndex:x})):(_-=1,e.wrapper.css({zIndex:x}),e.fpage.css({zIndex:x+1})),a.opts.gradients&&(l?e.ashadow.css({display:"",left:p,backgroundColor:"rgba(0,0,0,"+.5*_+")"}).transform("rotateY(0deg)"):e.ashadow.hide(),e.bshadow.css({opacity:1-_}),M?e.bshadow.parent()[0]!=e.wrapper[0]&&e.bshadow.appendTo(e.wrapper):e.bshadow.parent()[0]!=e.fpage[0]&&e.bshadow.appendTo(e.fpage),d(e.bshadow,s(100*c,0),s(100*(1-c),0),[[0,"rgba(0,0,0,0.3)"],[1,"rgba(0,0,0,0)"]],2));break;case"sheet":var z,k,j,A,T,W,C,F=this,S=0,E=s(0,0),I=s(0,0),Z=s(0,0),D=O._foldingPage.call(this);Math.tan(0);var q=a.opts.acceleration,L=e.wrapper.height(),R="t"==t.corner.substr(0,1),H="l"==t.corner.substr(1,1),$=function e(){var n=s(0,0),o=s(0,0);n.x=i.x?i.x-t.x:t.x,n.y=f?i.y?i.y-t.y:t.y:0,o.x=H?r-n.x/2:t.x+n.x/2,o.y=n.y/2;var p=m-Math.atan2(n.y,n.x),d=p-Math.atan2(o.y,o.x),d=Math.max(0,Math.sin(d)*Math.sqrt(Math.pow(o.x,2)+Math.pow(o.y,2)));return S=p/w*180,Z=s(d*Math.sin(p),d*Math.cos(p)),p>m&&(Z.x+=Math.abs(Z.y*n.y/n.x),Z.y=0,Math.round(Z.x*Math.tan(w-p))<h)?(t.y=Math.sqrt(Math.pow(h,2)+2*o.x*n.x),R&&(t.y=h-t.y),e()):(p>m&&(n=w-p,o=L-h/Math.sin(n),E=s(Math.round(o*Math.cos(n)),Math.round(o*Math.sin(n))),H&&(E.x=-E.x),R)&&(E.y=-E.y),z=Math.round(Z.y/Math.tan(p)+Z.x),n=r-z,o=n*Math.cos(2*p),d=n*Math.sin(2*p),I=s(Math.round(H?n-o:z+o),Math.round(R?d:h-d)),a.opts.gradients&&(T=n*Math.sin(p),n=O._c2.call(F,t.corner),n=Math.sqrt(Math.pow(n.x-t.x,2)+Math.pow(n.y-t.y,2))/r,C=Math.sin(m*(1<n?2-n:n)),W=Math.min(n,1),A=100<T?(T-100)/T:0,k=s(T*Math.sin(p)/r*100,T*Math.cos(p)/h*100),O._backGradient.call(F)&&(j=s(1.2*T*Math.sin(p)/r*100,1.2*T*Math.cos(p)/h*100),H||(j.x=100-j.x),!R))&&(j.y=100-j.y),Z.x=Math.round(Z.x),Z.y=Math.round(Z.y),!0)};switch(p=function(t,i,p,l){var c=["0","auto"],u=(r-L)*p[0]/100,g=(h-L)*p[1]/100,i={left:c[i[0]],top:c[i[1]],right:c[i[2]],bottom:c[i[3]]},c={},f=90!=l&&-90!=l?H?-1:1:0,v=p[0]+"% "+p[1]+"%";F.css(i).transform(o(l)+n(t.x+f,t.y,q),v),e.fpage.css(i).transform(o(l)+n(t.x+I.x-E.x-r*p[0]/100,t.y+I.y-E.y-h*p[1]/100,q)+o((180/l-2)*l),v),e.wrapper.transform(n(-t.x+u-f,-t.y+g,q)+o(-l),v),e.fwrapper.transform(n(-t.x+E.x+u,-t.y+E.y+g,q)+o(-l),v),a.opts.gradients&&(p[0]&&(k.x=100-k.x),p[1]&&(k.y=100-k.y),c["box-shadow"]="0 0 20px rgba(0,0,0,"+.5*C+")",D.css(c),d(e.ashadow,s(H?100:0,R?0:100),s(k.x,k.y),[[A,"rgba(0,0,0,0)"],[.8*(1-A)+A,"rgba(0,0,0,"+.2*W+")"],[1,"rgba(255,255,255,"+.2*W+")"]],3),O._backGradient.call(F)&&d(e.bshadow,s(H?0:100,R?0:100),s(j.x,j.y),[[.6,"rgba(0,0,0,0)"],[.8,"rgba(0,0,0,"+.3*W+")"],[1,"rgba(0,0,0,0)"]],3))},t.corner){case"tl":t.x=Math.max(t.x,1),$(),p(Z,[1,0,0,1],[100,0],S);break;case"tr":t.x=Math.min(t.x,r-1),$(),p(s(-Z.x,Z.y),[0,0,0,1],[0,0],-S);break;case"bl":t.x=Math.max(t.x,1),$(),p(s(Z.x,-Z.y),[1,1,0,0],[100,100],-S);break;case"br":t.x=Math.min(t.x,r-1),$(),p(s(-Z.x,-Z.y),[0,1,1,0],[0,100],S)}}e.point=t},_moveFoldingPage:function(t){var e=this.data().f;if(e){var a=e.opts.turn,i=a.data(),r=i.pagePlace;t?(i=e.opts.next,r[i]!=e.opts.page&&(e.folding&&O._moveFoldingPage.call(this,!1),O._foldingPage.call(this).appendTo(e.fpage),r[i]=e.opts.page,e.folding=i),a.turn("update")):e.folding&&(i.pages[e.folding]?(a=i.pages[e.folding].data().f,i.pageObjs[e.folding].appendTo(a.wrapper)):i.pageWrap[e.folding]&&i.pageObjs[e.folding].appendTo(i.pageWrap[e.folding]),e.folding in r&&(r[e.folding]=e.folding),delete e.folding)}},_showFoldedPage:function(t,e){var a=O._foldingPage.call(this),i=this.data(),r=i.f,s=r.visible;if(a){if(!(s&&r.point&&r.point.corner==t.corner||(a="hover"==r.status||"peel"==r.status||r.opts.turn.data().mouseAction?t.corner:null,s=!1,"prevented"!=l("start",this,[r.opts,a]))))return!1;if(e){var n=this,i=r.point&&r.point.corner==t.corner?r.point:O._c.call(this,t.corner,1);this.animatef({from:[i.x,i.y],to:[t.x,t.y],duration:500,frame:function(e){t.x=Math.round(e[0]),t.y=Math.round(e[1]),O._fold.call(n,t)}})}else O._fold.call(this,t),i.effect&&!i.effect.turning&&this.animatef(!1);if(!s)switch(r.effect){case"hard":r.visible=!0,O._moveFoldingPage.call(this,!0),r.fpage.show(),r.opts.shadows&&r.bshadow.show();break;case"sheet":r.visible=!0,r.fparent.show().data().flips++,O._moveFoldingPage.call(this,!0),r.fwrapper.show(),r.bshadow&&r.bshadow.show()}return!0}return!1},hide:function(){var t=this.data().f,e=t.opts.turn.data(),a=O._foldingPage.call(this);switch(t.effect){case"hard":e.opts.gradients&&(t.bshadowLoc=0,t.bshadow.remove(),t.ashadow.hide()),t.wrapper.transform(""),t.fpage.hide();break;case"sheet":0==--t.fparent.data().flips&&t.fparent.hide(),this.css({left:0,top:0,right:"auto",bottom:"auto"}).transform(""),t.wrapper.transform(""),t.fwrapper.hide(),t.bshadow&&t.bshadow.hide(),a.transform("")}return t.visible=!1,this},hideFoldedPage:function(t){var e=this.data().f;if(e.point){var a=this,i=e.point,n=function(){e.point=null,e.status="",a.flip("hide"),a.trigger("end",[e.opts,!1])};if(t){var o=O._c.call(this,i.corner),t="t"==i.corner.substr(0,1)?Math.min(0,i.y-o.y)/2:Math.max(0,i.y-o.y)/2,h=s(i.x,i.y+t),p=s(o.x,o.y-t);this.animatef({from:0,to:1,frame:function(t){t=r(i,h,p,o,t),i.x=t.x,i.y=t.y,O._fold.call(a,i)},complete:n,duration:800,hiding:!0})}else this.animatef(!1),n()}},turnPage:function(t){var e=this,a=this.data().f,i=a.opts.turn.data(),t={corner:a.corner?a.corner.corner:t||O._cAllowed.call(this)[0]},s=a.point||O._c.call(this,t.corner,a.opts.turn?i.opts.elevation:0),n=O._c2.call(this,t.corner);this.trigger("flip").animatef({from:0,to:1,frame:function(a){a=r(s,s,n,n,a),t.x=a.x,t.y=a.y,O._showFoldedPage.call(e,t)},complete:function(){e.trigger("end",[a.opts,!0])},duration:i.opts.duration,turning:!0}),a.corner=null},moving:function(){return"effect"in this.data()},isTurning:function(){return this.flip("moving")&&this.data().effect.turning},corner:function(){return this.data().f.corner},_eventStart:function(t){var e=this.data().f,a=e.opts.turn;if(!e.corner&&!e.disabled&&!this.flip("isTurning")&&e.opts.page==a.data().pagePlace[e.opts.page]){if(e.corner=O._isIArea.call(this,t),e.corner&&O._foldingPage.call(this))return this.trigger("pressed",[e.point]),O._showFoldedPage.call(this,e.corner),!1;e.corner=null}},_eventMove:function(t){var e=this.data().f;if(!e.disabled)if(t=b?t.originalEvent.touches:[t],e.corner){var a=e.parent.offset();e.corner.x=t[0].pageX-a.left,e.corner.y=t[0].pageY-a.top,O._showFoldedPage.call(this,e.corner)}else e.hover&&!this.data().effect&&this.is(":visible")&&((t=O._isIArea.call(this,t[0]))?("sheet"==e.effect&&2==t.corner.length||"hard"==e.effect)&&(e.status="hover",e=O._c.call(this,t.corner,e.opts.cornerSize/2),t.x=e.x,t.y=e.y,O._showFoldedPage.call(this,t,!0)):"hover"==e.status&&(e.status="",O.hideFoldedPage.call(this,!0)))},_eventEnd:function(){var t=this.data().f,e=t.corner;!t.disabled&&e&&"prevented"!=l("released",this,[t.point||e])&&O.hideFoldedPage.call(this,!0),t.corner=null},disable:function(t){return O.setData.call(this,{disabled:t}),this},hover:function(t){return O.setData.call(this,{hover:t}),this},peel:function(e,a){var i=this.data().f;if(e){if(-1==t.inArray(e,y.all))throw c("Corner "+e+" is not permitted");if(-1!=t.inArray(e,O._cAllowed.call(this))){var r=O._c.call(this,e,i.opts.cornerSize/2);i.status="peel",O._showFoldedPage.call(this,{corner:e,x:r.x,y:r.y},a)}}else i.status="",O.hideFoldedPage.call(this,a);return this}};window.requestAnim=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)},t.extend(t.fn,{flip:function(){return e(t(this[0]),O,arguments)},turn:function(){return e(t(this[0]),k,arguments)},transform:function(t,e){var a={};return e&&(a[v+"transform-origin"]=e),a[v+"transform"]=t,this.css(a)},animatef:function(e){var a=this.data();if(a.effect&&a.effect.stop(),e){e.to.length||(e.to=[e.to]),e.from.length||(e.from=[e.from]);for(var i=[],r=e.to.length,s=!0,n=this,o=(new Date).getTime(),h=0;h<r;h++)i.push(e.to[h]-e.from[h]);a.effect=t.extend({stop:function(){s=!1},easing:function(t,e,a,i,r){return i*Math.sqrt(1-(e=e/r-1)*e)+a}},e),this.data(a),function t(){if(a.effect&&s){for(var h=[],p=Math.min(e.duration,(new Date).getTime()-o),d=0;d<r;d++)h.push(a.effect.easing(1,p,e.from[d],i[d],e.duration));e.frame(1==r?h[0]:h),p==e.duration?(delete a.effect,n.data(a),e.complete&&e.complete()):window.requestAnim(t)}}()}else delete a.effect}}),t.isTouch=b,t.mouseEvents=x,t.cssPrefix=p,t.cssTransitionEnd=function(){var t,e=document.createElement("fakeelement"),a={transition:"transitionend",OTransition:"oTransitionEnd",MSTransition:"transitionend",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in a)if(void 0!==e.style[t])return a[t]},t.findPos=u})(jQuery)},44:function(t,e){},48:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"turn",rawName:"v-turn"}],attrs:{id:"app"}},[t._m(0),t._v(" "),a("div",{staticClass:"flipbook-viewport"},[a("div",{staticClass:"container1"},[a("div",{staticClass:"flipbook"},t._l(t.items,function(e,i){return a("div",{key:i,style:"position: absolute;background-image:url(http://fitment.gz-studio.com.cn"+e.url+")"},[e.hotlink.length?a("div",t._l(e.hotlink,function(t,e){return a("div",{key:e,staticClass:"hover-scale hotlink",style:t.attr[0].style},[a("a",{staticClass:"hotlink-link",style:"width:"+t.attr[0].width+"px;height:"+t.attr[0].height+"px",attrs:{href:""}})])})):t._e()])}))])])])},r=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("audio",{staticClass:"audio"},[a("source",{attrs:{src:"/static/fy.mp3",type:"audio/ogg"}})])}],s={render:i,staticRenderFns:r};e.a=s}},[11]);
//# sourceMappingURL=client.eef17723.js.map