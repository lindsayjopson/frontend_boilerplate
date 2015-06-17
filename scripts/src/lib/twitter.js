;
(function(window, $) {

	'use strict';
	
	function getTwits(username, number, callback) {
		var url = 'https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=true&screen_name=' + username + '&count=' + number + '&callback=?';
		$.getJSON(url, function(data) {
			if (data !== null && data.length && data[0].created_at !== undefined) {
				var html = '';
				var numberOfWords = 90;
				for (var i = 0, l = Math.min(data.length, number); i < l; i++) {
					var tweet = data[i];
					var firstWords = tweet.text.split(" ", numberOfWords).join(" ");
					var userUrl = 'https://www.twitter.com/' + username;
					var tweetUrl = 'https://www.twitter.com/' + username + '/status/' + tweet.id_str;
					html += '<p class="promo-callout-body js-twitter-tweet">' + tweetify(firstWords) + '</p>';
					html += '<p class="promo-callout-meta js-twitter-time">' + timeAgo(tweet.created_at) + '</p>';
					html = html.replace(/(href target)/, 'href="' + userUrl + '" target');
				}
				callback(html);
			}
		});
	}

	function timeAgo(dateString) {
		var rightNow = new Date();
		var then = new Date(dateString);
		/* IE can't parse these crazy Ruby dates */
		if ($('.oldie, .ie9').length) {
			then = Date.parse(dateString.replace( /( \+)/ , ' UTC$1'));
		}
		var diff = rightNow - then;
		var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
		/*return blank string if unknown*/
		if (isNaN(diff) || diff < 0) {
			return '';
		}
		/*within 7 seconds*/
		if (diff < second * 7) {
			return 'right now';
		}
		if (diff < minute) {
			return Math.floor(diff / second) + ' seconds ago';
		}
		if (diff < minute * 2) {
			return 'about 1 minute ago';
		}
		if (diff < hour) {
			return Math.floor(diff / minute) + ' minutes ago';
		}
		if (diff < hour * 2) {
			return 'about 1 hour ago';
		}
		if (diff < day) {
			return Math.floor(diff / hour) + ' hours ago';
		}
		if (diff > day && diff < day * 2) {
			return 'yesterday';
		}
		if (diff < day * 365) {
			return Math.floor(diff / day) + ' days ago';
		} else {
			return 'over a year ago';
		}
	}

	function tweetify(html) {
		return html
			.replace( /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi , '<a href="$1" target="_blank">$1</a>')
			.replace( /(^|\s)#(\w+)/g , '$1<a href="http://search.twitter.com/search?q=%23$2" target="_blank">#$2</a>')
			.replace( /(^|\s)@(\w+)/g , '$1<a href="http://twitter.com/$2" target="_blank">@$2</a>');
	}

	function Twitter() {}
	Twitter.init = function (username, number, selector) {
		getTwits(username, number, function(html) {
			$(selector).html(html);
		});
	};

	window.Twitter = Twitter;

})(window, jQuery, undefined);