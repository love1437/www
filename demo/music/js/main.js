// JavaScript Document
//推荐曲目回调
function ShowRecommandList(data){
	var list = data.result.list;
	rewriteSongList(list);
}
//分类曲目回调
function ShowClassifyList(data){
	var list = data.song_list;
	rewriteSongList(list);
}
// 热门歌手列表
function ShowArtistList(data){
	var list = data.song_list,liDom = [];
	list.map(function(items){
		liDom.push('<li>');
		liDom.push('<a ting_uid='+ items.ting_uid +' rank='+ items.rank +' artist_name="'+ items.name +'">');
		liDom.push('<img src="'+ items.avatar_middle +'" width="130" height="130" alt="'+ items.name +'">');
		liDom.push('<div class="artist-name"><span>'+ items.name +'</span></div>')
		liDom.push('</li>');
	})
	$(".artist-view-tab .total").html("共"+ list.length +"名");
	$(".hot-artist").html(liDom.join(''));
}
// 获取某个歌手的歌曲列表
function showSongListByArtist(data){
	var list = data.songlist;
	rewriteSongList(list);
}
// 显示搜索结果
function showSearchResult(data){
	var list = [];
	data.song.map(function(items,index){
		var albumname = data.album[index] ? data.album[index].albumname : '';
		list.push({
			song_id : items.songid,
			title : items.songname,
			ting_uid : "",
			author : items.artistname,
			album_title : albumname
		})
	});
	rewriteSongList(list);
}
//公用显示歌曲列表函数
function rewriteSongList(list){
	myaudio.setPlayList(list);
	var liDom = [];
	list.map(function(items){
		liDom.push('<li song_id='+ items.song_id +'>');
		liDom.push('<div class="songName"><span class="checkbox"><input type="checkbox" ></span><span class="icon"></span>');
		liDom.push('<span><a class="song-name">'+items.title+'</a></span></div><div class="artistName">');
		liDom.push('<a class="artist-name" artistid='+ items.ting_uid +'>'+ items.author +'</a></div>');
		liDom.push('<div class="albumName"><span><a class="album-name">');
		liDom.push(items.album_title ? ('《'+ items.album_title  +'》'):'...');
		liDom.push('</a></span><span class="opt"><a class="favor" title="收藏">&nbsp;</a>');
		liDom.push('<a class="add" title="添加到歌单">&nbsp;</a>');
		liDom.push('<a class="download" title="下载歌曲">&nbsp;</a>');
		liDom.push('<a class="delete" title="从列表中删除">&nbsp;</a>');
		liDom.push('</span></div></li>');
	});
	$(".songList-wrapper .songList").html(liDom.join(''));
	$("#artist-list").hide();
	$(".song-list").show();
	$(".playlist-length > span").html(list.length);
}

//双击加载歌曲回调
function loadSelectSong(data){
	
	myaudio.play(data.songinfo,true);
	myaudio.load(data);
}
function SongProcessor(data){
	ShowPanelName(data.songinfo);
	BaiduMusic.getSongLrc(data.songinfo.song_id,showLrc);
	showAlbum(data.songinfo.pic_big,data.songinfo.album_title);
	$(".songList-wrapper .songList li").removeClass("current");
	$(".songList-wrapper .songList li").each(function(index, element) {
        if($(this).attr("song_id")==data.songinfo.song_id){
			$(this).addClass("current");
		}
    });
}
//显示播放器 歌曲信息 歌名 艺术家
function ShowPanelName(songinfo){
	$(".panel-title .song-name").html(songinfo.title);
	$(".panel-title .artist").html(songinfo.author);
}
//播放歌曲
function bindPlayEvent(){
	var audio = document.getElementById("myaudio");
	//播放器开始加载
	audio.addEventListener("loadstart",function(){
		
		},false)
	//audio可以播放 但中途可能因为加载而暂停
	audio.addEventListener("canplay",function(){
		AnalyzeLrc.begin();
		$(".left-panel .play").removeClass("stop");
		$("#timeWrap .totalTime").html(lengthToTimeFormat(this.duration));
		$("#volSlider").width(this.volume*100+"%");
		Player.play();
		},false)
	//暂停事件
	audio.addEventListener("pause",function(){
		AnalyzeLrc.pause();
		$(".left-panel .play").addClass("stop");
		Player.pause();
		},false)
	//结束事件
	audio.addEventListener("ended",function(){
		AnalyzeLrc.stop();
		$(".left-panel .play").addClass("stop");
		Player.stop();
		myaudio.next();
		},false)
	audio.addEventListener("error",function(){
		//console.log(audio.error.code);
		console.log("歌曲连接错误！");
		myaudio.next();
		},false)
}
//显示歌词
function showLrc(data){
	$(".lrc-wrapper").scrollTop(0);
	if(!data.lrcContent){
		$(".lrc-wrapper .no-lrc").show();
	}else{
		var lrc = AnalyzeLrc.analyze(data.lrcContent);
		var liDom = [];
		lrc.lrc.map(function(items){
			liDom.push('<li class="ui-lrc-sentence">'+ items +'</li>');
		})
		$(".lrc-wrapper .no-lrc").hide();
		$(".lrc-wrapper > ul").html(liDom.join(""));
		if(liDom.length==0){
			$(".lrc-wrapper .no-lrc").show();
		}else{
			$(".lrc-wrapper .no-lrc").hide();
			$(".lrc-wrapper > ul").html(liDom.join(""));
			AnalyzeLrc.lrcMethod = scrolLrcMethod;
			//AnalyzeLrc.begin(scrolLrcMethod);
			//console.log(AnalyzeLrc.arrTime);
		}
	}
	
}
//显示专辑信息
function showAlbum(src,title){
	$(".album-wrapper .album img").attr("src",src);
	$(".album-wrapper .album-name").html(title?("《"+title+"》"):"未知专辑");
}
//歌词滚动方法
//通过audio 已播放时间计算来显示歌词的位置
function scrolLrcMethod(){
	var audio = document.getElementById("myaudio"),
		currentTime = audio.currentTime;
	if(!this.arrTime) return;
	var index = this.arrTime.filter(function(items){
			return currentTime*1000 > timePointFormat(items);
		}).length-1;

	if(index > this.currentIndex){
		var height = this.obj.height()*0.4,
			top = this.obj.find("li").eq(index).offset().top - this.obj.find("ul").offset().top;
		this.obj.find(".ui-lrc-sentence").removeClass("ui-lrc-current").eq(index).addClass("ui-lrc-current");
		//$(".lrc-wrapper").scrollTop(top-height);	
		$(".lrc-wrapper").animate({"scrollTop":top-height+"px"},200);
		this.currentIndex = index;
	}
}
//时间点转换
// [00:3.54] == > 3540
function timePointFormat(time){
	var point = time.replace("[","").replace("]","");
	if(!point){ return 0;}
	var m = parseInt(point.split(":")[0]),
		s = parseInt(point.split(":")[1].split(".")[0]),
		_s= parseInt(point.split(".")[1]);
	return (m*60+s+_s*0.01)*1000;
}
/* 长度转时间 */
function lengthToTimeFormat(length){
	var m = Math.floor(length/60),
		s = parseInt(length%60),
	m = m>=10 ? m : ("0"+m);
	s = s>=10 ? s : ("0"+s);
	return m+":"+s;
}


Player = {
	timer : null,
	audio : document.getElementById("myaudio"),
	ranges : function(){
		var audio = this.audio;
		var t = setInterval(function(){
				// 获取已缓冲部分的 TimeRanges 对象
				var timeRanges = audio.buffered;
				 // 获取以缓存的时间
				var timeBuffered = timeRanges.end(timeRanges.length - 1);
				 // 获取缓存进度，值为0到1
				var bufferPercent = timeBuffered / audio.duration;
				$(".progress-wrapper .loaded").width(bufferPercent*100+"%");
				if(bufferPercent>=1){
					clearInterval(t);
				}
			},50)
		},
	play : function(){
		this.ranges();
		this.interval();
	},
	interval : function(){
		clearInterval(this.timer);
		var self = this,audio = self.audio;
		self.timer = setInterval(function(){
			 var percent = audio.currentTime / audio.duration * 100;
			 $(".progress-wrapper .progressing").width(percent+"%");
			 $("#timeWrap .curTime").html(lengthToTimeFormat(audio.currentTime));
		},100)
	},
	pause : function(){
		clearInterval(this.timer);
		this.timer = null;
	},
	stop : function(){
		clearInterval(this.timer);
		this.timer = null;
		$(".progress-wrapper .progressing").width(0);
		$(".progress-wrapper .loaded").width(0);
		$("#timeWrap .curTime").html("00:00");
		$("#timeWrap .totalTime").html("00:00");
	}
}
