;(function(global){
	"use strict";

	var och = global.och || {version:"0.0.1"};
	och.isTouchSupported = "ontouchstart" in document.documentElement;

	och.locale = {
		'free': 'free download',
		'no-free': 'registered download',
		'multi':'multiple file download',
		'no-multi':'single file download',
		'time':'waiting time after download',
		'no-time':'no waiting time after download',
		'limit':'limited download speed',
		'no-limit':'unlimited download speed'
	}
	och.defaults = {
		hoster:{
			'url': '#',
			'name': 'not found',
			'free': true,
			'down': '',
			'multi': false,
			'timed': ''
		},
		list: {
			'listObj':'#hoster-list',
			'searchObj':'#hoster-search',
			'searchButton':'#hoster-search-button'
		},
		template: '<li><div><a target="_blank" href="{{url}}">{{name}}</a> <div class="item-stats">{{&down}} {{&free}} {{&multi}} {{&timed}}</div></div></li>',
		libUrl: 'js/lib.json'
	}
	och.Hoster = function(cfg){
		this.props = $.extend(och.defaults.hoster, cfg);
		console.log(this.props);
	};
	och.HosterList = function(cfg){
		var that = this;
		this.props = $.extend(och.defaults.list, cfg);
		this.$input = $(this.props.searchObj);
		this.$button = $(this.props.searchButton);
		this.$output = $(this.props.listObj);
		this.bindSearch();
		this.lib = this.loadLib(this.renderList);
		this.results = [];
	};
	och.HosterList.prototype = {
		bindSearch: function(){
			var that = this;
			this.$input.on('keypress', function(e){
				console.log()
				if(e.which === 13){
					that.lookup(that.$input.val());
				}
			});
			this.$button.on('click',	function(e){
				that.lookup(that.$input.val());
			});
		},
		loadLib: function(callback){
			var that = this;
			$.getJSON(
				och.defaults.libUrl,
				function(data){
					if(data){
						that.lib = data;
						that.results = data;
						callback.call(that);
					}
				}
			);
		},
		lookup: function(query){
			if(query.length > 0){
				var item,
						results = [];
				for(var i=0,n=this.lib.length; i < n ; i++){
					item = this.lib[i];
					if(
							item.name.indexOf(query) > -1 ||
							item.url.indexOf(query) > -1
						){
						results.push(item);
					}
				}
				if(results.length == 0){
					results = [och.defaults.hoster];
				}
				this.results = results;
			}else{
				this.results = this.lib;
			}
			this.renderList();
		},
		renderList: function(){
			var view,
					output, 
					item,
					rendered = [],
					free = '',
					multi = '',
					time = '',
					down = '';
			for(var i=0,n=this.results.length; i < n ; i++){
				item = this.results[i];
				free = (item.free ? 'free' : 'no-free');
				multi = (item.multi ? 'multi' : 'no-multi');
				time = (item.timed ? 'time' : 'no-time');
				down = (item.down.length > 0 ? 'limit' : 'no-limit');
				view = {
					url: item.url,
					name: item.name,
					free: '<i title="'+ och.locale[free] +'" class="icon ' + free + '"></i>',
					down: '<i title="'+ och.locale[down] +'" class="icon ' + down + '"></i>' + item.down,
					multi: '<i title="'+ och.locale[multi] +'" class="icon ' + multi + '"></i>',
					timed: '<i title="'+ och.locale[time] +'" class="icon ' + time + '"></i>'
				};
				rendered.push(Mustache.render(och.defaults.template, view));
			}
			this.$output.html(rendered.join(''));
		}
	};
	var test = {
		'url': 'http://rapidshare.com/',
		'name': 'RapidShare',
		'free': true,
		'down': '14kbs',
		'multi': false,
		'timed': ''
	};
	var app = new och.HosterList();
})(window)
