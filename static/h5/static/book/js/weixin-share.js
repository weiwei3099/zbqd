var link=window.location.href.replace(/#\S*/,"");

wx.ready(function(){

	// 分享到朋友圈

	wx.onMenuShareTimeline({

		title: title, // 分享标题

		link: link, // 分享链接

		imgUrl: imgUrl, // 分享图标

		success: function () {

			sendvisitinfo("7");

		},

		cancel: function () {}

	});

	// 分享给朋友

	wx.onMenuShareAppMessage({

		title: title, // 分享标题

		desc: desc, // 分享描述

		link: link, // 分享链接

		imgUrl: imgUrl, // 分享图标

		success: function () { 

			sendvisitinfo("7");

		},

		cancel: function () { }

	});

	wx.onMenuShareQQ({

		title: title, // 分享标题

		desc: desc == "" ? title : desc, // 分享描述

		link: link, // 分享链接

		imgUrl: imgUrl, // 分享图标

		success: function () { 

		   sendvisitinfo("7");

		},

		cancel: function () { }

	});

	wx.onMenuShareWeibo({

		title: title, // 分享标题

		desc: desc == "" ? title : desc, // 分享描述

		link: link, // 分享链接

		imgUrl: imgUrl, // 分享图标

		success: function () { 

		   sendvisitinfo("7");

		},

		cancel: function () { }

	});

	wx.onMenuShareQZone({

		title: title, // 分享标题

		desc: desc == "" ? title : desc, // 分享描述

		link: link, // 分享链接

		imgUrl: imgUrl, // 分享图标

		success: function () { 

		   sendvisitinfo("7");

		},

		cancel: function () { }

	});

});

wx.error(function(res){

	// alert.log("error==========",res)

});