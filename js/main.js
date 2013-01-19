;(function(global){
	"use strict";

	var och = global.och || {version:"0.0.1"};
	och.isTouchSupported = "ontouchstart" in document.documentElement;

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
		template: '<li><div><a target="_blank" href="{{url}}">{{name}}</a> <ul class="item-stats"><li>{{&down}}</li><li>{{&timed}}</li><li>{{&multi}}</li><li>{{&free}}</li></ul><div class="clearfix"></div></div></li>',
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
				view = {
					url: item.url,
					name: item.name,
					free: item.free ? 'free' : 'required',
					down: item.down,
					multi: item.multi,
					timed: item.timed
				};
				for(var key in view){
					if(view[key] === undefined){
						view[key] = '?';
					}
				}
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
