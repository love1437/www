BaiduMusic = {
	// API地址
	base :"http://tingapi.ting.baidu.com/v1/restserver/ting",
	listType : [
		[1,"新歌榜"],[2,"热歌榜"],
		[6,"KTV热歌榜"],[7,"叱咤歌曲榜"],[8,"美国Billboard单曲榜"],[9,"雪碧音碰音榜"],
		[10,"雪碧音碰音赛歌榜"],[11,"摇滚榜"],[12,"爵士榜"],[18,"Hito中文榜"],
		[20,"华语金曲榜"],[21,"欧美金曲榜"],[22,"经典老歌榜"],[23,"情歌对唱榜"],[24,"影视金曲榜"],
		[25,"网络歌曲榜"]
		// 26竟然可以获取热门歌手列表 共291条
	],
	// 获取分类列表
	getListByClass : function(type,size,callback){
		var data = {
			size:size,type:type,
			format:"json",method:"baidu.ting.billboard.billList",
			_t:new Date(),_:new Date()
		};
		AjaxforBaiduMusic(data,callback);
	},
	//获取推荐列表
	getListByRecommand : function(songid,count,callback){
		var data = {
			song_id:songid,num:count,format:"json",
			method:"baidu.ting.song.getRecommandSongList",
			_t:new Date(),_:new Date()
			};
		AjaxforBaiduMusic(data,callback);
	},
	//获取歌手歌曲列表
	getListByArtist : function(artistid,count,callback){
		var data = {
			tinguid:artistid,limits:count,use_cluster:1,order:2,
			format:"json",method:"baidu.ting.artist.getSongList",
			_t:new Date(),_:new Date()
			};
		AjaxforBaiduMusic(data,callback);
	},
	//获取歌手信息
	getArtistInfo : function(artistid,callback){
		var data = {
			tinguid:artistid,
			format:"json",method:"baidu.ting.artist.getInfo",
			_t:new Date(),_:new Date()
			};
		AjaxforBaiduMusic(data,callback);
	},
	//获取歌曲歌词
	getSongLrc : function(songid,callback){
		var data = {
			songid:songid,
			format:"json",method:"baidu.ting.song.lry",
			_t:new Date(),_:new Date()
			};
		AjaxforBaiduMusic(data,callback);
	},
	//下载歌曲
	downloadSong : function(songid,callback){
		var data = {
			songid:songid,bit:"24, 64, 128, 192, 256, 320, flac",
			format:"json",method:"baidu.ting.song.downWeb",
			_t:new Date(),_:new Date()
			};
		AjaxforBaiduMusic(data,callback);
	},
	//搜索 
	search : function(keyword,callback){
		var data = {
			query:keyword,
			format:"json",method:"baidu.ting.search.catalogSug",
			_t:new Date(),_:new Date()
			};
		AjaxforBaiduMusic(data,callback);
	},
	//播放
	play : function(songid,callback){
		var data = {
				songid : songid,
				format:"json",method:"baidu.ting.song.play",
				_t:new Date(),_:new Date()
			};
		AjaxforBaiduMusic(data,callback);
	}
}

function AjaxforBaiduMusic(data,callback){
	$.ajax({
			type:"get",
			url:BaiduMusic.base,
			data : data,
			async:true,
			dataType : "jsonp",
			success : callback
		});
}
