function Music(config){
	this.init(config);
} 
/* 初始化 */
/* 播放模式
* @ cycle 循环播放
* @ random 随机播放
* @ single 单曲循环
*/
Music.prototype.init = function(config){
	// 设置播放器
	this.audio = typeof config.player=="object"? config.player : document.getElementById(config.player);
	this.audio.preload = "auto";
	this.audio.autoPlay = "autoPlay";
	this.volume(config.volume || 50);
	//设置播放模式
	this.model = config.model || "cycle";
	/* 设置播放列表
	 * 可单独调用setPlayList  需传入歌曲列表
	 * 歌曲列表为数组形式 
	 * 数组成员为歌曲的绝对路径 或 以主html页面的相对路径
	 */
	this.setPlayList(config.playlist || []);
}
/* 加载音乐 */
Music.prototype.load = function(data){
	if(!data.bitrate){
		console.log("歌曲资源未找到！");
		this.next();
		return;
	}
	
	var filelink = data.bitrate[0].file_link; 
	this.audio.src = filelink;
	this.audio.play();
	SongProcessor(data);
}
/* 播放 */
Music.prototype.play = function(song,bool){
	this.playing = song ? song : this.getSong();
	//单曲循环与非单曲循环
	/* 单曲循环需要重新获取临时播放列表
	 */
	if(this.model=="single"){
		this.temporary = this.getPlaylistByModel();
	}
	this.playIndex = this.getIndexFromPlayList();
	if(!bool){
		var self = this;
		BaiduMusic.downloadSong(this.playing.song_id,function(data){self.load(data)});
	}
}
/* 暂停 */
Music.prototype.pause = function(){
	this.audio.pause();
}
/* 停止 */
Music.prototype.stop = function(){
	this.audio.pause();
	this.audio.currentTime = 0;
}
/* 音量 */
Music.prototype.volume = function(value){
	this.audio.volume = value>1?value/100:value;
}
/* 静音 */
Music.prototype.mute = function(){
	//点击静音时记录当前音量 便于取消静音时设置
	this._volume = this.audio.volume;
	this.volume(0);
}
/* 取消静音 */
Music.prototype.cancelmute = function(){
	this.volume(this._volume||50);
}
/* 上一首 */
Music.prototype.prev = function(){
	if(this.playIndex==0){
		this.playIndex = this.temporary.length-1;
	}else{
		if(this.model=="single"){
			this.playIndex = 0;
		}else{
			this.playIndex--;
		}
	}
	//this.load(this.temporary[this.playIndex]);
	this.playing = this.temporary[this.playIndex];
	var self = this;
	BaiduMusic.downloadSong(this.playing.song_id,function(data){self.load(data)});
}
/* 下一首 */
Music.prototype.next = function(){
	this.play();
}
/* 更换播放模式 */
Music.prototype.changeModel = function(model){
	this.model = model;
	this.temporary = this.getPlaylistByModel();
	this.playIndex = this.getIndexFromPlayList();
}
/* 获取播放曲目在播放列表中的下标 */
Music.prototype.getIndexFromPlayList = function(){
	var Index = 0,self = this;
	this.temporary.map(function(items,index){
		if(items.song_id==self.playing.song_id){
			Index = index;
		}
	})
	return Index;
}
/* 传入歌曲列表 */
Music.prototype.setPlayList = function(playlist){
	this.playlist = Object.prototype.toString.call(playlist)=="[object Array]" ? playlist : [];
	this.playIndex = 0;
	//临时列表  播放列表的备份
	this.temporary = this.getPlaylistByModel();
	//this.play();
}
/* 获取播放歌曲地址 */
Music.prototype.getSong = function(){
	if(!this.playIndex && this.playIndex!==0){
		this.playIndex = 0;
	}else{
		if(this.model=="single"){
			this.playIndex = 0;
		}else{
			this.playIndex++;
		}
	}
	if(this.playIndex == this.temporary.length){
		this.playIndex = 0;
	}
	return this.temporary[this.playIndex];
}
/* 根据播放模式获取临时播放列表 */
Music.prototype.getPlaylistByModel = function(){
	var list = this.playlist.concat([]);
	//循环播放
	if(this.model=="cycle" || this.model=="order") return list;
	//随机播放
	if(this.model=="random") return list.sort(function(){return Math.random()*2 < 1;});
	//单曲循环
	if(this.model=="single") return new Array(this.playing ? this.playing : list[0]);
}