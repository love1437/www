// JavaScript Document
AnalyzeLrc = {
	obj : $(".lrc-wrapper"),
	lrc : "",
	reg : /\[\d{2}[:][0-5][0-9][.]\d\d\]/g,
	arrLrc : [],
	arrTime : [],
	analyze : function(lrcContent){
		this.arrLrc = [];
		this.arrTime = [];
		this.arrLrc = lrcContent.replace(/\]\n\[/g,"]--------[").split(this.reg);
		this.arrLrc.shift();
		this.arrTime = lrcContent.match(this.reg);
		return {lrc:this.arrLrc,time:this.arrTime};
	},
	timer : null,
	currentIndex : 0,
	begin : function(){
		if(typeof this.lrcMethod !=="function"){
			this.lrcMethod = function(){};
		}
		this.currentIndex = -1;
		this.interval();
	},
	interval : function(){
		clearInterval(this.timer);
		var self = this;
		self.timer = setInterval(function(){
			self.lrcMethod.call(self);
		},20)
	},
	pause :function(){
		clearInterval(this.timer);
		this.timer = null;
	},
	stop : function(){
		clearInterval(this.timer);
		this.timer = null;
		this.count = 0;
		this.lrcindex = 0;
	}
}