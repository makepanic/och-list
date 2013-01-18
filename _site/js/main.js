;(function(global){
	"use strict";

	var och = global.och || {version:"0.0.1"};
	och.isTouchSupported = "ontouchstart" in document.documentElement;

	och.defaults = {
		hoster:{
			'url': '',
			'name': '',
			'free': true,
			'down': '',
			'multi': '',
			'timed': ''
		},
		list: {
			'listItem':'#hoster-list'
		},
		template: "",
		libUrl: 'js/lib.json'
	}
	och.Hoster = function(cfg){
		this.props = $.extend(och.defaults.hoster, cfg);
		console.log(this.props);
	};
	och.HosterList = function(cfg){
		var that = this;

		this.props = $.extend(och.defaults.list, cfg);

		this.$input = $(this.props.listId);

		console.log(och.defaults.libUrl);
		this.lib = this.loadLib();

		this.$input.on('keypress', function(e){
			if(e.which === 13){
				that.lookup(that.$input.val());
			}
		});
	};
	och.HosterList.prototype = {
		loadLib: function(){
			$.getJSON(
				och.defaults.libUrl,
				function(data){
					if(data){
						console.log('success', data);
						return data;
					}else{
						console.log('fail');
					}
					return null;
				}
			);
		},
		lookup: function(query){
			console.log("search " + query);
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
	var app = new och.HosterList({
		listItem: '#hoster-list'
	});
})(window)
