/**
 * 获取远程数据
 * 备注：这个JS一定要放在 config.js 和 main.js 前面
 **/
//获取参数
function getcode(name)
{
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

// 获取远程数据
var remoteData = getRemoteData();
function getRemoteData()
{
	var result;
  	$.ajaxSettings.async = false;
  	$.ajax({url:"/picApi/factoryAlbumInfo", data:{id: tid}, type: 'POST', success:function(data) {
        console.log(data.result.album)
        var pictures = []
        data.result.album.pic.forEach(function(v) {
            pictures.push({
                image: v.url, name: 'sdf'
            })
        })

         result = {
            blackground: "/static/images/bg.jpg",
            //logo: "http://oss.xhzer.com/organization_album_logo_84917252da77c1e8d96ccb72d3bd6743.jpg",
            mp3:"http://oss.xhzer.com/organization_album_mp3_9539321b5aa21e957ed79281c2cf7a72.mp3",
            name:  data.result.album.title,
            num: data.result.album.pic.length,
            pictures: pictures,
            thumb: '',
            tid: tid
         };
         document.title = result.name
         console.log(result)
        //  result = {
        //     blackground: "http://www.xhzer.com/public/static/books/images/backGroundImgURL.jpg",
        //     logo: "http://oss.xhzer.com/organization_album_logo_84917252da77c1e8d96ccb72d3bd6743.jpg",
        //     mp3:"http://oss.xhzer.com/organization_album_mp3_9539321b5aa21e957ed79281c2cf7a72.mp3",
        //     name: "新东旭门窗",
        //     num: 100,
        //     pictures: {  image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
        //     thumb: "organization_album_thumb_4346b45ab38cf3ec999a7230b4680c86.jpg",
        //     tid: 156
        //  }
      }});　
    //   result = {
    //     blackground: "http://www.xhzer.com/public/static/books/images/backGroundImgURL.jpg",
    //     logo: "http://oss.xhzer.com/organization_album_logo_84917252da77c1e8d96ccb72d3bd6743.jpg",
    //     mp3:"http://oss.xhzer.com/organization_album_mp3_9539321b5aa21e957ed79281c2cf7a72.mp3",
    //     name: "新东旭门窗",
    //     num: 12,
    //     pictures:[
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //         { image:"organization_album_picture_image_101a1a01168596f3205ffb663920cd66.jpg", name :"A (1)"},
    //     ],
    //     thumb: "organization_album_thumb_4346b45ab38cf3ec999a7230b4680c86.jpg",
    //     tid: 156
    //  }
  	return (result);
}

//获取页数
function getnum()
{　
  	return(remoteData.num);
}

// 获取图片
var cks = getpic();
function getpic()
{
	var pics = new Array();
	for(var i=0;i<remoteData.num;i++)
	{
		pics[i] = remoteData.pictures[i].image;
	}
  	return (pics);
}

//获取LOGO
function getlogo()
{　
  	return (remoteData.logo);
}

//获取Music
function getmusic()
{　
  	return (remoteData.mp3);
}

//获取背景图片
function getbackground()
{
	return (remoteData.blackground);
}

