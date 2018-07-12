/*
 *  Project: Seleqt
 *  Description: HTML select element replacement with search and optgroup support
 *  Author: miso25
 *  License: MIT
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

;(function ( $, window, document, undefined ) {


	// indexOf function for IE <=8
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(obj, start) {
			for (var i = (start || 0), j = this.length; i < j; i++) {
			if (this[i] === obj) { return i; }
			}
			return -1;
		}
	}	
	$.isSubstring = function(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
	};
	
	var delay = (function(){
				var timer = 0;
				return function(callback, ms){
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
				};
			})();
	
		var diacriticsRemovalMap = [
				{'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
				{'base':'AA','letters':/[\uA732]/g},
				{'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
				{'base':'AO','letters':/[\uA734]/g},
				{'base':'AU','letters':/[\uA736]/g},
				{'base':'AV','letters':/[\uA738\uA73A]/g},
				{'base':'AY','letters':/[\uA73C]/g},
				{'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
				{'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
				{'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
				{'base':'DZ','letters':/[\u01F1\u01C4]/g},
				{'base':'Dz','letters':/[\u01F2\u01C5]/g},
				{'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
				{'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
				{'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
				{'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
				{'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
				{'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
				{'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
				{'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
				{'base':'LJ','letters':/[\u01C7]/g},
				{'base':'Lj','letters':/[\u01C8]/g},
				{'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
				{'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
				{'base':'NJ','letters':/[\u01CA]/g},
				{'base':'Nj','letters':/[\u01CB]/g},
				{'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
				{'base':'OI','letters':/[\u01A2]/g},
				{'base':'OO','letters':/[\uA74E]/g},
				{'base':'OU','letters':/[\u0222]/g},
				{'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
				{'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
				{'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
				{'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
				{'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
				{'base':'TZ','letters':/[\uA728]/g},
				{'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
				{'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
				{'base':'VY','letters':/[\uA760]/g},
				{'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
				{'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
				{'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
				{'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
				{'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
				{'base':'aa','letters':/[\uA733]/g},
				{'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
				{'base':'ao','letters':/[\uA735]/g},
				{'base':'au','letters':/[\uA737]/g},
				{'base':'av','letters':/[\uA739\uA73B]/g},
				{'base':'ay','letters':/[\uA73D]/g},
				{'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
				{'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
				{'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
				{'base':'dz','letters':/[\u01F3\u01C6]/g},
				{'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
				{'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
				{'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
				{'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
				{'base':'hv','letters':/[\u0195]/g},
				{'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
				{'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
				{'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
				{'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
				{'base':'lj','letters':/[\u01C9]/g},
				{'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
				{'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
				{'base':'nj','letters':/[\u01CC]/g},
				{'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
				{'base':'oi','letters':/[\u01A3]/g},
				{'base':'ou','letters':/[\u0223]/g},
				{'base':'oo','letters':/[\uA74F]/g},
				{'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
				{'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
				{'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
				{'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
				{'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
				{'base':'tz','letters':/[\uA729]/g},
				{'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
				{'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
				{'base':'vy','letters':/[\uA761]/g},
				{'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
				{'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
				{'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
				{'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
			];
	var removeDiacritics = function(str) {
			var changes;
			if(!changes) {
				changes = diacriticsRemovalMap;
			}
			for(var i=0; i<changes.length; i++) {
				str = str.replace(changes[i].letters, changes[i].base);
			}
			return str;
		}
	
	jQuery.extend({
		highlight: function (node, re, nodeName, className) {
			if (node.nodeType === 3) {
			
				var str = removeDiacritics(node.data);
				//var str = node.data;
				var match = str.match(re);
			
				//var match = node.data.match(re);
				
				if (match) {
					var highlight = document.createElement(nodeName || 'span');
					highlight.className = className || 'highlight';
					var wordNode = node.splitText(match.index);
					wordNode.splitText(match[0].length);
					var wordClone = wordNode.cloneNode(true);
					highlight.appendChild(wordClone);
					wordNode.parentNode.replaceChild(highlight, wordNode);
					return 1; //skip added node in parent
				}
			} else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
					!/(script|style)/i.test(node.tagName) && // ignore script and style nodes
					!(node.tagName === nodeName.toUpperCase() && node.className === className)) { // skip if already highlighted
				for (var i = 0; i < node.childNodes.length; i++) {
					i += jQuery.highlight(node.childNodes[i], re, nodeName, className);
				}
			}
			return 0;
		}
	});

	jQuery.fn.unhighlight = function (options) {
		var settings = { className: 'highlight', element: 'span' };
		jQuery.extend(settings, options);

		return this.find(settings.element + "." + settings.className).each(function () {
			var parent = this.parentNode;
			parent.replaceChild(this.firstChild, this);
			parent.normalize();
		}).end();
	};

	jQuery.fn.highlight = function (words, options) {
		var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false };
		jQuery.extend(settings, options);
		
		words = removeDiacritics(words); 
		
		if (words.constructor === String) {
			words = [words];
		}
		words = jQuery.grep(words, function(word, i){
		  return word != '';
		});
		words = jQuery.map(words, function(word, i) {
		  return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		});
		if (words.length == 0) { return this; };

		var flag = settings.caseSensitive ? "" : "i";
		var pattern = "(" + words.join("|") + ")";
		if (settings.wordsOnly) {
			pattern = "\\b" + pattern + "\\b";
		}
		var re = new RegExp(pattern, flag);
		
		return this.each(function () {
			jQuery.highlight(this, re, settings.element, settings.className);
		});
	};
	

	
	// IE 7 document.querySelectorAll for listenScrollAgain
	if (!document.querySelectorAll) {
	  document.querySelectorAll = function (selectors) {
		var style = document.createElement('style'), elements = [], element;
		document.documentElement.firstChild.appendChild(style);
		document._qsa = [];

		style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
		window.scrollBy(0, 0);
		style.parentNode.removeChild(style);

		while (document._qsa.length) {
		  element = document._qsa.shift();
		  element.style.removeAttribute('x-qsa');
		  elements.push(element);
		}
		document._qsa = null;
		return elements;
	  };
	}

	if (!document.querySelector) {
	  document.querySelector = function (selectors) {
		var elements = document.querySelectorAll(selectors);
		return (elements.length) ? elements[0] : null;
	  };
	}
		
		
	var KEY = {
			TAB: 9,
			ENTER: 13,
			ESC: 27,
			SPACE: 32,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40,
			SHIFT: 16,
			CTRL: 17,
			ALT: 18,
			PAGE_UP: 33,
			PAGE_DOWN: 34,
			HOME: 36,
			END: 35,
			BACKSPACE: 8,
			DELETE: 46,
			isArrow: function (k) {
				k = k.which ? k.which : k;
				switch (k) {
				case KEY.LEFT:
				case KEY.RIGHT:
				case KEY.UP:
				case KEY.DOWN:
					return true;
				}
				return false;
			},
			isControl: function (e) {
				var k = e.which;
				switch (k) {
				case KEY.SHIFT:
				case KEY.CTRL:
				case KEY.ALT:
					return true;
				}

				if (e.metaKey) return true;

				return false;
			},
			isFunctionKey: function (k) {
				k = k.which ? k.which : k;
				return k >= 112 && k <= 123;
			}
		}
		



    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window is passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'seleqt',
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function seleqtPlugin( element, options ) {
        //this.element = element;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        
		this.elem = element;
		this.$elem = $(element);
		this.$elem_original = this.$elem
		this.options = options;
		
		this.multiple = false;
		this.selected = []
		this.multiple_options = []
		
		this.page = 1
		this.allLoaded = false
		
		//this.limit = 20
		
		//this.options.maximumInputLength = 256
		
		// This next line takes advantage of HTML5 data attributes
		// to support customization of the plugin on a per-element
		// basis. For example,
		// <div class=item' data-plugin-options='{"message":"Goodbye World!"}'></div>
		//this.metadata = this.$elem.data( 'plugin-options' );
		this.metadata = this.$elem.data( );
		
		this._init();
    }

	
	//Plugin.prototype = 
	seleqtPlugin.prototype = 
	{
		
		
		
		defaults: { 
			formatResult: function(data){ return data.text },
			data: false,
			ajaxUrl: false,
			cache: true,
			searchAllowed: true,
			maxInputLength: 256,
			minInputLength: 0,
			maxSelectionSize: false,
			multiple: false,
			infiniteScroll: true,
			limit: 20,
			allowClear: true,
			placeHolder: false,
			animation: 'faded',  // 'grow cards curl wave flip fly fly-simplified fly-reverse helix fan papercut twirl' 
								// 'skew tilt zipper faded'	
			//textSelectResult: this.lang.textSelectResult(),
			message: 'Hello world!'
			
		},
		
		
		lang: {
			textSelectAll: function () { return "Select all"; },
			textDeselectAll: function () { return "Cancel all selected"; },
			textSelectAllInGroup: function () { return "Select all in group"; },
			textCancelSelection: function () { return "Cancel selected item"; },
			textLoading: function () { return "Loading items…"; },
			textLoadMore: function () { return "Load more"; },
			textListEnd: function () { return "End of the list"; },
			
			textInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " or more character" + (n == 1 ? "" : "s"); },
			textInputTooLong: function (max) { var str = "The searching string can only have "+max+" character"; if(max > 1)str += 's'; return str; },
			textNotClassified: function () { return "Not classified"; },
			textNoMatches: function () { return "No matches found"; },
			textSearching: function () { return "Searching…"; },
			textSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
			//textSelectResult: function () { return "Select from the list..."; },
			textSelectResult: function () { return lang['click_to_select_option']; },
			textResultsToSelect: function (limit) {
				if (limit == 1) {
					//return "item to select";
					return lang['items'];
				} else {
					//return "items to select";
					return lang['items'];
				}
			}
		},
		

		
		
		

		_init: function() {
			// Introduce defaults that can be extended either 
			// globally or using an object literal. 
			
			//
			
			

			this.config = $.extend({}, this.defaults, this.options, 
			this.metadata);

			this.lang = $.extend({}, this.lang, $.fn.seleqt.lang );
			
			if( !this.config.placeHolder )
			this.config.placeHolder = this.lang.textSelectResult()
			
			if( !this.config.ajaxUrl )
			this.allLoaded = true
			//alert( JSON.stringify( this.config.placeHolder  ) )
			//alert( JSON.stringify( this.lang.textSelectResult()  ) )
			//alert( JSON.stringify( this.lang.textSearching() ) )
			//alert(KEY.TAB)
			//alert( this.config.maximumInputLength )
			//alert( JSON.stringify(this.defaults)  )
			// Sample usage:
			// Set the message per instance:
			// $('#elem').plugin({ message: 'Goodbye World!'});
			// or
			// var p = new Plugin(document.getElementById('elem'), 
			// { message: 'Goodbye World!'}).init()
			// or, set the global default message:
			// Plugin.defaults.message = 'Goodbye World!'
			
			//if( $.isSubstring("hello world", "world")) ) // true;​​​​​​​​​​​
			//alert(1)

			this._transformElement();
			this._initEvents();
			return this;
		},

		_parseInt: function(a)
		{
			var b = parseInt(a)
			if(b)
			return b
			return false
		},
		
		// replace INPUT or SELECT with new DIV
		_transformElement: function() 
		{
			//console.time('&#039jquery&#039');
			//console.timeEnd('&#039jquery&#039');
			
			


			//alert(this.page)
			// eg. show the currently configured message
			//console.log(this.config.data);
			//var cf = this.close(); // selected_options
			
			// self for using in jquery events
			var self = this;

			// var ell = this.$elem

			//var elid = this.$elem.data('elid')
			//var multiple_options =''


			var tagname = this.$elem.prop('tagName')
			this.tag = tagname

			var remove_tag = this.getRemoveTag()
			
			this.multiple = this.$elem.data('multiple') || 
							this.config.multiple
							|| this.$elem.attr('multiple')	? true : false
				
				//this.$elem.attr('multiple')
				//alert(this.multiple)
			var selected = false;
			var attr_name = this.$elem.attr('name') != undefined ? this.$elem.attr('name') : '';
			//alert(tagname)
			
			//if( tagname !== 'SELECT' && tagname !== 'UL' )
			if( tagname === 'INPUT' )
			{
				//if(this.$elem.data('val'))
				selected = this.$elem.data('val')
				
				//alert(selected)
				//alert( JSON.stringify(selected) )
				//var data_val = this.$elem.data('val')
				// var data_text = this.$elem.data('text')
				//var data_id = this.$elem.data('id')
				var data_text ='';
				var data_id ='';
				//if(data_val)
				//{
				//	var data_text = data_val[0].text
				//	var data_id = data_val[0].id
				//}

				//if(data_val)
				//alert(data_val[0].text)
				
				//this.selected = data_val
				//if(this.multiple)
				//{
					//this.multiple = true
				//	multiple_options = data_val
				//}
				//else
				//this.multiple = false

				//	if(!data_text || !data_id)
				//{
				//remove_tag = '';
				//data_text = self.noneSelectedLabel()
				//data_id = '';
				//}
			}
			else		// SELECT or UL element
			{
				//alert(tagname)
				var option_name = 'option'
				if(tagname == 'UL')
				option_name = 'li'
				
				//alert(option_name)
				//var data_text = this.$elem.find('option:selected').text()
				
				//var multiple = this.$elem.attr('multiple')
				//alert( JSON.stringify(selected) )
				//if(multiple == undefined)
				//	this.multiple = false
				//else
				if(this.multiple)
				{
					var mult_arr = []
					//this.$elem.find(':selected').each(function(){
					this.$elem.find('option').each(function(){
					//alert( $(this).data('id') )
					if( $(this).attr('selected') )
					mult_arr.push({"text": $(this).text(), "id":$(this).val() });
					})
					if(mult_arr)
					selected = mult_arr
					
					//alert( this.$elem.val() )
					
					
					
					//multiple_options = mult_arr
					//this.multiple = true
				}
				else
				{
					var data_text = ''//this.$elem.find('option:selected').text()
					var data_id = ''//this.$elem.find('option:selected').data('id')
					//alert(tagname)
					
					if(tagname == 'UL')
					{
						data_id = this.$elem.data('selected')
						//var a_el = $(this).find('a').length
						var t = this.$elem.find('li[data-value="'+data_id+'"]')
						if( t.find('a').length )
						data_text = this.$elem.find('li[data-value="'+data_id+'"]').find('a').html()
						else
						data_text = this.$elem.find('li[data-value="'+data_id+'"]').html()
							
						//var t = 
						//alert(t)
						//data_text = t
					
					}
					else
					this.$elem.find( option_name ).each(function(){
						//alert(tagname)
						//alert( JSON.stringify( $(this).html() ) )
						
						
						if(tagname == 'UL')
						{
							if( $(this).data('selected') )
							{
							//alert(5)
							var a_el = $(this).find('a').length
							if(a_el)
							data_text = $(this).find('a').html()
							else
							data_text = $(this).html()
							//alert()
							data_id = $(this).val()
							}
						}
						else
						{
							if( $(this).attr('selected') )
							{
							data_text = $(this).text()
							data_id = $(this).val()
							}
						}
					
						//alert ( $(this).data('id') +"  "+ $(this).attr('selected') );
						//alert( $(this).data('id') )
						//mult_arr.push({"text": $(this).text(),"id":$(this).data('id') });
					})
				
					selected = [{'id':data_id, 'text':data_text}]
					
					
				}


				//if(!data_text)
				//{
				//remove_tag = '';
				//var data_id = this.$elem.find('option:first').data('id')
				//var data_text = 'click and select...'
				
				//}
			}
			//alert()
			
			//alert( JSON.stringify(attr_data) )
			
			//var print_attr_id = '';
			
			
			var wrap = $("<div class='seleqt'></div>");
			var items = "";

			//items += "<div class='input_box'>"
			items += "<div class='area'>"
			//items += "<div class='openf'> <i class='icon icon-down-open'></i> </div>"
			
			//if( !this.multiple )
			{
				//items += "<div class='text' data-id='"+data_id+"'> "+data_text+" </div>"
				//items += "<div class='text' data-id=''> </div>"
				
				if( !this.multiple )
				{
				//items += "<div class='open'> <i class='icon icon-down-open'></i> </div>"
				//items += remove_tag
				//var remove_tag = this.getRemoveTag()
				}
			}
			
			//alert(selected)
			items += this._initSelection( selected, attr_name )
			
			// ◄►◄►◄►◄►◄►◄►◄►◄►◄►◄►◄►◄►◄►◄►◄►◄►
			
			
			
			//this.multiple_options = multiple_options
			
			items += "<div class='options_cached'></div>"
			items += "</div>"

			var i = wrap.html(items)
			
			//wrap.html(items)
			 //$( i ).replaceAll( self.$elem );
			//var i = $( items ).wrapAll( "<div class='seleqt'></div>" );
			
			var witms = "<div class='seleqt_wrapper' style='position:relative'>"
				//witms += "<input class='input' type='hidden' name='' value='' />"
				witms += "</div>"
			
			var wrap2 = $( witms );
			
			$( this.$elem ).wrapAll( wrap2 );
			//this.$elem.before("<input class='input' type='hidden' name='' value='' />")
			this.$elem.closest('.seleqt_wrapper').append(i)
			
			//this.$elem.hide()
			this.$elem.css('width','1px')
			this.$elem.css('height','1px')
			this.$elem.css('position','absolute')
			this.$elem.css('left','0')
			
			
			// form serialization value init
			var init_selected = ''
			if(this.multiple)
			init_selected = this.multiple_options;
			else{
			if(selected && selected.data && selected.data[0] && selected.data[0].id)
			{
			//alert(selected.data[0].id)
			init_selected = selected.data[0].id;
			}
			}
			init_selected = init_selected.toString()
			this.$elem_original.closest('.seleqt_wrapper').find('.input').attr('name', attr_name )
			
			
			
			this.setSelected( init_selected )
			//alert( this.$elem_original.closest('.seleqt_wrapper').prop('tagName') )
			
			//this.$elem.replaceWith(i)
			//$( i ).replaceAll( this.elem )
			
			
			
			//wrap.append( wrap2 )
			//var aa = this.$elem.after( i )
			//this.$elem.hide()
			//$( aa, this.$elem ).wrapAll( "<div class='seleqttt'></div>" );
			
			
			
			//alert( this.$elem_orig.attr('class') )
			// add existing options to select div element
			if( tagname == 'SELECT' || tagname == 'UL'  )
			{
				//alert(tagname)
				var option_name = 'option'
				if(tagname == 'UL')
				option_name = 'li'
				
				var has_options = this.$elem.find( option_name ).length
				var optgroup = '';
				var optgroup_label = '';
				var optgroup_count = self.$elem.find('optgroup').length
				//alert( JSON.stringify(optgroup_count) )
				
				if(has_options)
				{
					//var itm = '';
					var objj = {}
					var i = 0;
					var o_index = 0;
					
					
					
					var l = this.$elem.find( option_name ).length
					this.$elem.find( option_name ).each(function(e){
					//alert(tagname)
					//var id = $(this).data('id')
					
					if(tagname == 'UL')
					{
					var id = $(this).data('value')
					var text = $(this).html()
					}
					else
					{
					var id = $(this).attr('value')
					var text = $(this).text()
					
					
					}
					
					//alert(id)
					
					optgroup = $(this).closest('optgroup').length
					
					if( optgroup !== 0 ) 
					{
					//j = 14;
					o_index = $(this).closest('optgroup').index() + 1 * 1
					optgroup_label = $(this).closest('optgroup').attr('label')
					//alert(o_index)
					//o_index = 40
					//alert( o_index )
					//objj[i]  = { "id":'1', "text":optgroup_label, "optgroup":1 }
					//i=i+1;
					}
					else
					{
					o_index = 0;
					optgroup_label = self.lang.textNotClassified()
					//alert(o_index)
					}
					
					//alert(this.lang.textNotClassified())
					//alert( JSON.stringify(self.config) )
					//if( !objj[optgroup_label] ) 
					//var objj = {};
					//alert(1)
					//itm += self.createOption(id, text, false)
					//itm += "<p data-id='"+$(this).data('id')+"'>"+$(this).val()+"</p>" ) 
					if( objj[ o_index ] == undefined )
					{
					objj[ o_index ] = {}
					// i = 0;
					//objj[j]['data'] = []
					//objj[j]['aaa'] = 'bbb'
					}
					objj[ o_index ]['label'] = optgroup_label;
					
					
					if( objj[ o_index ]['options'] == undefined)
					objj[ o_index ]['options'] = {}
					
					
					
					objj[ o_index ]['options'][ i ] = { "id":id, "text":text }
					
					//if( i >= (l-1) )
					
					//alert( o_index )
					//if(id && text)
					//if(id)
					//objj[ o_index ].push( { "id":id, "text":text } )
					
					//objj[i].push( { "id":id, "text":text } )
					//alert( JSON.stringify( objj[j][i] ) )
					//alert(i)
					//alert( l )
					
					i=i+1;
					
					})
					

					//alert( JSON.stringify( objj ) )
					
					var itm = self.createOptions(objj, false)
					//var itm = ''
					//alert(itm)
					//var itemss = $("<div class='options'>"+itm+"</div>");
					
					
					wrap.find('.options_cached').append( itm )	

				}
			}
			//this.el_wrap = wrap

			//this.$elem.data('selected', data_id)
			//alert(JSON.stringify( this.multiple_options ) )
			var input = wrap.find('.input')
			
			var attr_id = this.$elem.attr('id')
			var attr_name = this.$elem.attr('name')
			var attr_class = this.$elem.attr('class')
			//var attr_data = this.$elem.data()
			
			$.each(this.$elem.data(), function (name, value) {
				//input.data(name, value)
			})
						
			// this.elem = wrap;
			//if(attr_id)
			//alert(attr_id)
			//input.attr('id', attr_id)
			if(attr_name)
			input.attr('name', attr_name)
			
			if(attr_class)
			{
				var myString = attr_class;
				var classes = myString.split(' ');
				
				for(var i=0;i<classes.length;i++){
					
					//if(  ! wrap.hasClass( classes[i] ) )
					//input.addClass( classes[i] )
				}
			}
			
			//if(attr_class)
			//wrap.attr('class', attr_class)

			
			// the main property this.$elem is not INPUT or SELECT anymore 
			this.$elem = wrap;
			this.seleqt = this.$elem
			
			//this.$elem.width('21em')	
			//console.timeEnd('&#039jquery&#039');

			//alert( val )
		},
		
		setSelected: function ( selected ) {
			
			selected = selected.toString()
			//alert( typeof(selected) )
			
			//this.$elem_original.closest('.seleqt_wrapper').find('.input').val( selected )
			
			this.$elem_original.val(  selected  )
			this.$elem_original.data( 'selected', selected )
			
		},
		
		getSelected: function()
		{
			
			//alert(this.selected)
			return this.$elem_original.data( 'selected' );
		},
		
		_isEqual: function (a, b) {

			if (a === '' || b === '') return false;
			if (a === b) return true;
			if (a === undefined || b === undefined) return false;
			if (a === null || b === null) return false;
			
			// Check whether 'a' or 'b' is a string (primitive or object).
			// The concatenation of an empty string (+'') converts its argument to a string's primitive.
			//if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
			//if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
			return false;
		},

		_initSelection: function( selected, name )
		{	
			var items = '';
			//alert(this.lang.textNotClassified())
			//if(selected)
			//alert(JSON.stringify(selected) )
			//items += "<div class='text' data-id='"+data_id+"'> "+data_text+" </div>"
			
			var selected_id;
			
			if(this.multiple)
			{
				items += "<div class='selected_options' data-id=''>"
				//var s_opt = this.createSelectedOptions( selected )
				var s_opt = this.createSelectedOptions( selected.data )
				if( s_opt )
				{
				selected_id = this.multiple_options
				items += s_opt
				}
				else
				items += this.noneSelectedLabel()
				items += "</div>"
				
				//alert(JSON.stringify( this.multiple_options ) )
			}
			else
			{
				//alert(JSON.stringify(selected) )
				
				var text
				//items += "<div class='single'>"
				if(selected && selected.data && selected.data[0] )
				{
					var selected_id
					var text
					//if(selected[0].id)
					 selected_id = selected.data[0].id
					//if(selected[0].text)
					 text = selected.data[0].text
					
				}
				items += "<div class='text_wrap'>"
				items += "<div class='text' data-id='"+selected_id+"'>"
				
				if(text)
				{
				//selected[0]['tpl'] = "aaaa - aaaa"
				
				//alert( selected.data[0] )
				var iii = this.createOption( selected.data[0], selected  )
				//var iii = {}
				//var iii = $( selected.data[0] )
				//alert(iii)
				
				
				items += iii
				//items += iii
				}
				else
				items += this.noneSelectedLabel()
				items += "</div>"
				items += "</div>"
				//items += "</div>"
				
				
				if( text )
				items += this.getRemoveTag()
				//var remove_tag = this.getRemoveTag()
				
			}
			
			items += "<div class='open'> <div class='openicon'><i class='icon icon-down-open'></i></div> </div>"
			
			
			if( selected_id == undefined )
			selected_id = ''
			
			//alert(text)
			// for jquery form serialize
			
			
			
			
			//witms += "<input class='input' type='hidden' name='' value='' />"
			//this.$elem_original.val( selected_id )
			//this.$elem_original.attr( 'name', '' )
			//this.$elem.find('.input').val( selected_id ) ;
			
			//alert( this.$elem.find('.input_search input').val() )
			//alert( this.$elem_original.prop('tagName') )
			
			return items;
		},
		
		
		_initEvents: function()
		{	
			
			//alert(this.multiple)
			var self = this	
			var el_wrap = this.$elem	
			var el_text = this.$elem.find('.text')
			//alert( this.el.html() )
		
		
			this.$elem_original.on('focusin', function(){
			self.$elem.css('border','1px solid black')
			
			//alert(432)
			})
			
			this.$elem_original.on('focusout', function(){
			
			self.$elem.css('border','0px')
			//alert(1343)
			})
			
			
			
			/*
			this.$elem.on( 'click', '.optgroup', function(e) 
			{
			alert('.optgroup')
			})
			this.$elem.on( 'click', '.options', function(e) 
			{
			alert('.options')
			})
			this.$elem.on( 'click', '.options_inner', function(e) 
			{
			alert('.options_inner')
			})
			this.$elem.on( 'click', '.options_wrapper', function(e) 
			{
			alert('.options_wrapper')
			})
			this.$elem.on( 'click', '.resultbox', function(e) 
			{
			alert('.resultbox')
			})
			
			$(document).on( 'click', 'li', function(e) 
			{
			alert(111)
			})
			this.$elem.on( 'click', 'input', function(e) 
			{
			alert(222)
			})
			*/
			
			
			
			
			
			var c = false
			
			this.$elem.on( 'touchmove', '.options li', function(e) 
			{
				c = true
			})
			
			
			

			
			this.$elem.on( 'mousedown', '.options li', function(e) {
			
			//e.preventDefault();
			e.preventDefault();
			
				
			})
			
			
			
			
			
			
			this.$elem.on( 'touchend mouseup', '.options li', function(e) 
			{
				
				
				
				
				if(c)
				{
				
				c = false
				return
				}
				//alert(el_wrap.html() )
				//return;
				
				var orig_id = el_wrap.find('.text').data('id')
				
				
				var id = $(this).data('id')
				var text = $(this).html()
				var textdiv = el_text
				var data_id = id;
				
				var selection_success = false
				
				//alert( $(e.target).data('id') )
				
				if( id !== orig_id )
				{
					if(self.multiple)
					{
						//var exists = self.multiple_options.indexOf( id );
						
						//if( exists === -1 )
						//alert(exists)
						//this.multiple_options.push(59)
						
						selection_success = self.selectOption( $(this) )
						
						//self.refreshSelectionStatuses()
						
						data_id = self.multiple_options
					}
					else
					{	
						selection_success = true
						//alert('selected')
						textdiv.html(text)
						textdiv.data('id', id)

						//self.select()
						var remove_tag = self.getRemoveTag();
						if(!self.$elem.find('.remove').length)
						//self.$elem.find('.remove').replaceWith( remove_tag )
						//else
						self.$elem.find('.open').after( remove_tag )
					}
					
					//self.$elem.data('selected', data_id)
					
					if(selection_success)
					self.triggerChange( data_id );
					//self.$elem.trigger("change");
				}
				
				
				//self.clearInputIfEmpty()
				
				
				
				
				if(!self.multiple)
				self.close(  )
				
				c = false
				//alert( area.data('id' ) )
				//area.data('id', 156)
				//alert(241)
			})
			
			
			$(document).on('click', '.seleqt', function(e)
			{
			//alert(1)
			e.stopPropagation();
			})
			
			
			$(document).on('click', function(e)
			{
				//if( self.$elem == $(this) )
				//console.log( JSON.stringify( $(this).closest('div').prop('tagName')  )  )
				//var a = $(this).prop('tagName')
				//alert(a)
				//$('.selected').each(function()
				$('.seleqt').each(function()
				{
					if( $(this).hasClass('opened') )
					{

						self.close( $(this) );

					}
					//alert( $(this).html() )
				})


			});
		
		 
			
			
			
			this.$elem.on( 'click', '.area, input', function(e) 
			{
			
				//alert( self.$elem.html() )
				//if(!a)
				//wrap.toggleClass('opened')
				e.stopPropagation();


				//$('.selected').not( self.$elem ).each(function()
				$('.seleqt').not( self.$elem ).each(function()
				{
					if( $(this).hasClass('opened') )
					{
						self.close( $(this) );
					}
					//alert( $(this).html() )
				})

				var thistagname = ( $(this).prop('tagName') )

				var opened = self.$elem.hasClass('opened')
				if(thistagname == 'INPUT')
				{
					if( !opened  )
					{
						self.open( false );
					}
				}
				else
				{
					if( opened  )
						self.close(  );
					else
					{
						self.open( );
					}
				}
				//wrap.find('.icon').removeClass('icon-up-open').addClass('icon-down-open')
				//alert(a)

			})	
			
			//var get_more_el = this.$elem.find('.options .get_more')
			var q_string, opts, which;
			this.$elem.on( 'keyup', '.input_search input', function(e) 
			{
				if( KEY.isArrow (e.which) )
				return false;
				
				//alert(e.which )
				
				//alert(  self.config.maxInputLength  )	
				q_string = el_wrap.find('.input_search input').val() 
				//q_string_length = q_string.length
				
				if( q_string.length > self.config.maxInputLength )
				{
				q_string = q_string.substring(0, q_string.length - 1);
				$(this).val( q_string )
				self.showMsg( self.lang.textInputTooLong( self.config.maxInputLength)  )
					
				return;
				}
				if( q_string.length <  self.config.minInputLength )
				{
					self.showMsg( self.lang.textInputTooShort(q_string, self.config.minInputLength) )
					if( e.which !=8 ) // key is not backspace
					return;
					else
					{
					
					q_string = ''
					}
				}
				
				var delay_sec = 0
				if( !self.allLoaded || !self.config.cache )
				delay_sec = 500
				//alert(e.which)
				//alert( q_string )
				
				delay(function(){
					
					if(!self.config.cache)
					self.page = 1
					
					
					//console.log(self.page)
					//alert(self.page)
					//if( !self.config.cache )
					//self.page = 1;
					//if( q_string.length > 0 )
					// ( self.$elem.find('.options .get_more').addClass('hidden') )
					//console.log(q_string.length)
					//if(!q_string)
					//self.page = 1;
					//else
					//self.page = 1;
					self.$elem.find('.get_more').data('page', 1)
					q_string = removeDiacritics( q_string ).toLowerCase()
					
					opts = self.getOptions( q_string, 1 )
					
					self.showOptions( opts, false )
					
					
					self.$elem.find('.options li').unhighlight();
					self.$elem.find('.options li').highlight( q_string );
					
				}, delay_sec );


			})
			
			
			// remove in single select
			this.$elem.on( 'click', '.remove', function(e) {
			
				e.stopPropagation();
				//alert( self.$elem.find('.text').data('id') )
				self.$elem.find('.text').data('id', '')
				self.$elem.find('.text').html( self.noneSelectedLabel() )
				$(this).remove()
				
				
				//self.$elem.trigger("change");
				self.triggerChange( '' );
				//self.$elem.data( 'selected', '' )
			})
			
			
			
			// remove option in multiple select
			this.$elem.on( 'click', '.remove_selected_option', function(e) 
			{
				e.stopPropagation();
				var option = $(this).closest('.selected_option')
				//var id = option.data('id')
				//var text = option.text()
				
				
				
				self.removeSelectedOption( option )
				
				delay( function(){
				self.triggerChange( self.multiple_options );
				}, 400 )
				
				
				//self.triggerChange( self.multiple_options );
				//option.fadeOut(300, function(){ 
				
				
				
				//self.refreshSelectionStatuses()
				
				//self.$elem.data( 'selected', self.multiple_options )
				//self.$elem.trigger("change");
				//self.triggerChange( self.multiple_options );
				
				return;
				
			})
			
			
			// remove option in multiple select
			this.$elem.on( 'click', '.select_all_in_group', function(e) 
			{
				
				
				if(!self.multiple)
				return
				
				var select;
				var selected = 0
				$(this).closest('.optgroup').find('li').each(function(){
				
					//self.selectOption( $(this)  )
					select = self.selectOption( $(this)  )
					if(!select)
					return false;
					else
					selected ++ 
					//alert( $(this).html() )
					
				})
			
				
				if(selected)
				self.triggerChange( self.multiple_options );
				
				//self.noOptionsFound()
				//self.refreshSelectionStatuses()
				//alert( self.multiple_options )
			})
			
			this.$elem.on( 'click', '.select_all', function(e) 
			{
				e.stopPropagation();
				
				if(!self.multiple)
				return
				
				var select;
				var selected = 0;
				self.$elem.find('.options li').each(function(){
					if( $(this).hasClass('hidden'))
					return;
					select = self.selectOption( $(this)  )
					if(!select)
					return false;
					else
					selected ++
					//alert( $(this).html() )
				})
				
				if(selected)
				self.triggerChange( self.multiple_options );
			})
			
			this.$elem.on( 'click', '.deselect_all', function(e) 
			{
				e.stopPropagation();
								
				if(!self.multiple)
				return

				self.$elem.find('.selected_options .selected_option').each(function(){
					self.removeSelectedOption( $(this) )
				})
				
				
				delay( function(){
				self.triggerChange( self.multiple_options );
				}, 400 )
				
				
			})
			
			
			
			
			
			
			
			
			
			
			
			
			this.$elem.on( 'click', '.get_more', function(e) 
			{
				e.stopPropagation();
					
				self._getMoreResults()
			})
			
			this.$elem.on( 'click', '.go_top', function(e) 
			{
				e.stopPropagation();
					
				self.$elem.find('.options_inner').animate({scrollTop: 0}, 300);
			})
			
			this.$elem.on( 'click', '.msg_ok', function(e) 
			{
				e.stopPropagation();
				//alert(1)
				//$(this).closest('.msg').fadeOut(300, function(){ $(this).remove() } )	
				$(this).closest('.msg').remove()	
			})
			
			
			 	
				
				
				
			
			
		},
		
		
		
		_getMoreResults: function(  )
		{
			
			var self = this
			
			if( self.allLoaded )
			{
			
			console.log('_getMoreResults')
			return false;
			}
			//return false;
			
			//var no_data = self.$elem.find('.options .no_data').length end
			var get_more = self.$elem.find('.get_more')
			
			var get_more_el = self.$elem.find('.options .get_more')
			var get_more_el_html = get_more_el.html()
			
			//if(!self.multiple)
			//return
			if( get_more_el.hasClass('end') ) 
			return;
			
			get_more_el.html("<i class='icon icon-spin icon-spinner'></i> "+ self.lang.textLoading() )
			self.$elem.find('.options').data('loading', 1) 
			//return;
			
			//alert(a)
			//alert(a)
			//console.log(self.page)
			var qpage = get_more.data('page')
			//if(!qpage)
			//var a = $(this).closest('.options').find('.get_more').addClass('hidden')
			//var opts = ( self.ajax('') )
			var q_string = self.$elem.find('.input_search input').val()
			
			
			if(q_string)
			{
				if(!qpage)
				{
				qpage = 2
				get_more.data('page', 2)
				}
				else
				qpage ++
				get_more.data('page', qpage)
			}
			else
			{
				self.page = self.page+1;
				qpage = self.page
			}
			
			//console.log( qpage )
			//else
			//self.page = 1;
			//alert(a )
			var ajax = self._ajax( q_string, qpage ) 
			var d = self.createOptions( ajax, true, false )  
			
			
			//alert(JSON.stringify( d ))
			var li_last = get_more.closest('.options').find('li:not(.hidden)').length
			
			if(li_last)
			{
			
			self.$elem.find('.options').find('li:last').after(d)
			}
			else
			{
			//
			get_more_el.before(d)
			}
			
			if(self.config.animation)
			{
			//stroll.unbind( self.$elem.find('.options_inner') );
			//stroll.bind( self.$elem.find('.options_inner') );
			}
			get_more_el.html( get_more_el_html )
			if( ajax && ajax[0].options.length < self.config.limit )
			{
				get_more_el.addClass('end').html( self.lang.textListEnd() + " <span class='go_top'><i class='icon icon-up-circled'></i></span>" )
			
				//alert(1)
				if( !q_string && self.config.cache )
				self.allLoaded = true
			}
			//self.$elem.find('.options').append(d)
			//self.$elem.find('.options').height('1000')
			
			//console.log( d )
			//if(li_last)
			//var opt = self.$elem.find('.options')
			//$(d).appendTo(opt)
			//self.$elem.find('.options').append(d)
			//else
			//self.$elem.find('.get_more').before(d)
			
			//console.log( self.$elem.find('.options').height() ) 
			
			if( self.config.cache && !q_string  )
			{
				//if(self.config.animation)
				//stroll.unbind( self.$elem.find('.options_inner') );
				
				//if(!self.allLoaded)
				//console.log('cached22')
				//self.$elem.find('.options_cached').find('li:last').after( d )
				self.$elem.find('.options_cached').html( self.$elem.find('.options').html() )
			
				//if(self.config.animation)
				//stroll.bind( self.$elem.find('.options_inner')  );
			}
			
			//console.log( self.$elem.find('.options_cached').html() )
			self.$elem.unhighlight();
			self.$elem.highlight( q_string );
			
			self.refreshSelectionStatuses()
			
			
			self.$elem.find('.options').data('loading', 0) 
		},
		
		
		
		removeSelectedOption: function( el )
		{
			var self = this
			//this.updateCount();
			//alert( 11 )
			//this.$elem.data( 'selected', selected_data )
			var id = el.data('id')		
			//var index = this.multiple_options.indexOf( id );
			//var a = ['1','2','3']
			//var index = a.indexOf( '2' );
			//alert( JSON.stringify(a)  )
			//alert( JSON.stringify(index)  )
			//alert( JSON.stringify(this.multiple_options)  )
			//alert( JSON.stringify(index)  )
			
			el.fadeOut(300, function(){ 
				
			var id = $(this).data('id')		
					
			//var div = $(this).closest('.selected_options')
			$(this).remove() 
			
			
				
				var index = self.multipleOptionExist( id );
		
				if(index !== false)
				{
					self.multiple_options.splice(index, 1);
				
					
					
				}
				
				
				
				var ex = self.$elem.find('.options').find("[data-id='" + id + "']").closest('.optgroup').removeClass('hidden');
				var ex = self.$elem.find('.options').find("[data-id='" + id + "']").removeClass('hidden');
				
				//alert( self.multiple_options )
				//self.triggerChange( self.multiple_options );	
				
				var l =self.$elem.find('.selected_options .selected_option').length
			//alert(l)
			if ( ! l )
				//if ( ! div.find('.selected_option').length )
					self.$elem.find('.selected_options').html( self.noneSelectedLabel() )
			})
			
			
			
			
		},
		
		triggerChange: function( selected_data )
		{
			var self = this
			
			// clear input search and refresh options if there are no options to select
			var shown_items = self.$elem.find('.options li:not(.hidden)').length
			if( shown_items <= 0 )
			{
			self.$elem.find('.input_search input').val('')
			self.$elem.find('.input_search input').trigger($.Event('keyup', {keycode: 8, which: 8}))
			self.$elem.find('.input_search input').focus()
			}
			
			//if(selected_data == null)
			//if(!selected_data || selected_data == '')
			//selected_data = 111
			//alert( 'aaa'+ selected_data )
			
			//this.updateCount();
			//alert( JSON.stringify(selected_data)  )
			//this.$elem.data( 'selected', selected_data )
			//this.$elem.find('.input').val( selected_data ) ;
			//this.$elem_original.data( 'selected', selected_data.toString() )
			//this.$elem_original.val( selected_data );
			self.setSelected( selected_data ) 
			self.$elem_original.trigger("change");
			self.refreshSelectionStatuses()
			
			
			if(self.config.animation)
			{
			//stroll.unbind( self.$elem.find('.options_inner') );
			//stroll.bind( self.$elem.find('.options_inner')  );
			}
			// form serialization value
			//this.$elem_original.closest('.seleqt_wrapper').find('.input').val( selected_data )
			
			
			
		},
		
		getRemoveTag: function( )
		{
			var t = '';
			if(this.config.allowClear)
			var t = "<div class='remove'> <i class='icon icon-cancel-1' title='"+this.lang.textCancelSelection()+"'></i> </div>";
			
			return t;
		},
		
		multipleOptionExist: function( id )
		{	
			//id = this._parseInt( id )
			id = id.toString()
			
			var index = this.multiple_options.indexOf( id );
			//alert( this.multiple_options )
			
			if(index !== -1)
			return index;
			
			return false;
			
		},
		
		showMsg: function( text, autohide )
		{
			if(!autohide && autohide !== false)
			autohide = true;
			
			var msg = ""
			 msg += "<div class='msg'>"
			 msg += "<div class='msg_wrap'>"
			 msg += "<div class='msg_text'> "+text+"</div>"
			 msg += "<div class='msg_foot'> <div class='msg_ok'>OK</div></div>"
			 msg += "</div>"
			 msg += "</div>"
			
			var exists = this.$elem.find('.options_wrapper .msg').length
			this.$elem.find('.options_wrapper .msg').remove()
			this.$elem.find('.options_wrapper')
			.append(msg)
			if(!exists)
			this.$elem.find('.options_wrapper .msg').hide().fadeIn(300)
			//.hide().fadeIn(300)
			if(autohide)
			this.$elem.find('.options_wrapper .msg').fadeOut(4000, function(){ $(this).remove()} )
			
		},
		
		selectOption: function( el )
		{
			if( this.config.maxSelectionSize &&
				this.config.maxSelectionSize <= this.multiple_options.length )
			{
			//alert( this.multiple_options.length )
				this.showMsg( this.lang.textSelectionTooBig( this.config.maxSelectionSize ) )
				return false;
			}
			
			var self = this
			
			var id = el.data('id')
					
				//id = self._parseInt(id)
			var text = el.text() 
			
			
			//if( this.multiple )
			var exists = self.multipleOptionExist( id );
			//console.log( exists )
			//else
			//var exists = false
			//alert( id )
			//var a = self.multiple_options.indexOf( id );
			//alert( a )
			
			if( self._isEqual ( exists,  false)  )
			{
				
				self.hideOption( el )
				
				//self.createSelectedOption()
				
				var op = $( self.createSelectedOption(id, text) ) 
				//self.multiple_options.push(id)
				self.$elem.find( '.selected_options' )
				.append( op )
				op.hide().fadeIn(300)
				//var ell = $(this)
				
				
				//alert( $(this).html() )
				//items += "<div class='none_selected'>Vyberte zo zoznamu...<div>";
				
				if ( self.$elem.find('.none_selected').length )
				self.$elem.find('.none_selected').remove()
				//no_data
				
				
			
			}
			//console.log( self.multiple_options )
			return true;
			//alert(li_total)
			//alert(li_hidden)
			//el.closest('div').append("<div class='no_data'> no options </div>")
			//alert(li_hidden)
			//alert(div2)
		//self.selectOption( $(this) )
		
			//el.fadeOut(300, function(){
			//$(this).remove();
			//var l = self.$elem.find('.options li').length
			//if(l <= 0)
			//self.noResults()
			//})
			
		},
		
		hideOption: function( el )
		{
			var self = this
			var id = el.data('id') 	
				id = id.toString()	
				
			var e = this.$elem.find('.options_cached').find("[data-id='" + id + "']").addClass('hidden');
			
			//this.$elem.find('.options_cached').find("[data-id='" + id + "']").addClass('hidden');
			//var li_total = this.$elem.find('.options_cached .optgroup').length;
			//var li_hidden = this.$elem.find('.options_cached .optgroup').length;
			//alert( e2 )
			//alert( el.closest('div').attr('class') )
			el.addClass('hidden')
			
			var li_group_total = el.closest('div').find('li').length
			var li_group_hidden = el.closest('div').find('li.hidden').length
			
			if(li_group_hidden >= li_group_total)
			{
			//el.closest('div').addClass('hidden')
			//this.$elem.find('.options_cached').find("[data-id='" + id + "']").closest('div').addClass('hidden')
			}
			
			
			
			
			var li_total = el.closest('.options').find('li').length
			var li_hidden = el.closest('.options').find('li.hidden').length
			
			if(li_hidden >= li_total)
			{
			self.noResults()
			//el.closest('.options').append( nr )
			//this.$elem.find('.options_cached').find("[data-id='" + id + "']").closest('div').addClass('hidden')
			}
		},
		
		
		noneSelectedLabel: function( )
		{
			//var self = this
			var s = "<div class='none_selected'>"+ this.config.placeHolder +"</div>"
			return s;
			//this.$elem.find('.options').html('<div class="no_data"> no data found..</div>')
			//alert(4)
		},
		

		getCookie: function( w )
		{
			
			cName = "";
			pCOOKIES = new Array();
			pCOOKIES = document.cookie.split('; ');
			for(bb = 0; bb < pCOOKIES.length; bb++){
				NmeVal  = new Array();
				NmeVal  = pCOOKIES[bb].split('=');
				if(NmeVal[0] == w){
					cName = unescape(NmeVal[1]);
				}
			}
			return cName;
		
		},
		
		_ajax: function( q_string, page )
		{
			if(!page)
			page = 	this.page	
			
			var csrf_name = 'csrfname';
			var csrf_token = this.getCookie('csrfprotect');
			
			var params = location.href.split('?')[1];
			//var self = this
			if(!post_data) var post_data = {};
			post_data[ csrf_name ] = csrf_token;
			
			post_data[ 'page_id' ] = $('#page').data('id');
			post_data['field'] =  this.$elem.find('.input').data('elid')
			
			post_data['q'] =  q_string
			post_data['page'] =  page
			post_data['limit'] =  this.config.limit
			
			var page_id = $('#page').data('id');
			var field =  this.$elem.find('.input').data('elid')
			var q =  q_string
			
			//alert(field)
			
			var ret_data = {};
			var results = false;
			var tpl = '';
			var li_batch = {};
			//alert( post_data[ 'page_id' ] )
			var url = this.config.ajaxUrl 
				url = url+'?'+'q='+q+'&page_id='+page_id+'&field='+field
			//var url = 'ajax/autocomplete2/8?'+'q='+q+'&page_id='+page_id+'&field='+field
			var error = false;
			//alert(897)
			if( this.config.ajaxUrl )
			$.ajax({
				type: "GET",
				url: url,
				scriptCharset: "UTF-8", 
				async: false,
				data: post_data,
				//cache:false,
				dataType: "json",
				//jsonpCallback: 'callback',
				success: function(rdata) 
				{
					//alert( JSON.stringify(data) )
					if(rdata.data)
					{
						ret_data = rdata.data
						//alert(rdata.data.tpl)
						results = rdata.data.results
						tpl = rdata.data.tpl
						li_batch = rdata.data.li_batch
					}
					
				},
				error: function (request, type, errorThrown) 
				{
					error = errorThrown
					switch (type) {
						case 'timeout':
							//error += "The request timed out.";
							break;
						case 'notmodified':
							//msg += "The request was not modified but was not retrieved from the cache.";
							break;
						case 'parsererror':
							//msg += "XML/Json format is bad.";
							break;
						case 'error':
							//msg += "An error occured, please try again.";
							break;	
						default:
							//msg += "HTTP Error (" + request.status + " " + request.statusText + ").";
							//show_err = false;
							break;
					}
					
					results = false;
				}
				
				
			})
			
			//alert( JSON.stringify(results) )
			if(error)
			this.showMsg( error, false )
			
			var obj;
			
			if(results)
			{
				obj = {}
				obj[0] = {}
				obj[0]['tpl'] = tpl
				obj[0]['li_batch'] = li_batch
				obj[0]['label'] = 'none'
				obj[0]['options'] = results
				obj[0]['data'] = ret_data
			}
			//alert( JSON.stringify(obj) )
			return obj;
			//return ret_data;
		},
		

		//get_results: function( q_string )
		getOptions: function( q_string, page )
		{	
			var self = this
			//var no_items_found = 'No items found...';
			
			if(!q_string)
			//alert(11)
			q_string = '';
			
			
			//if(!q_string)
			//alert(1)
			//alert(this.tag) css
			
			var all_options = this.$elem.find('.options_cached li').length
			var get_more = this.$elem.find('.options_cached .get_more').length
			
			//alert(get_more)
			//alert( q_string )
			
			// load options from cache
			if(  all_options && (!q_string || !get_more || this.allLoaded ) )
			{
				
				//self.allLoaded = true
				// console.log( this.$elem.find('.options').html() )
				//alert( el.find('.options').html() )

				var opt = ''
				var str = ''
				// q_string = removeDiacritics( q_string ).toLowerCase()
				// var optgroup
				//var opts = el.find('.options').find('p:contains("'+q_string+'")')
				var opts = this.$elem.find('.options_cached').find('li')
				.each(function(e){

				var id = $(this).data('id')



				if( self.multiple && self.multipleOptionExist(id) !== false )
				return;

				{
				str = removeDiacritics( $(this).text() ).toLowerCase()
				//var str = $(this).html().toLowerCase()

				//console.log( id )
				//if ( str.toLowerCase().indexOf( q_string ) >= 0 )
				//alert(str.toLowerCase())

				//if( $.isSubstring( str, q_string) )
				//alert(1)

				if( $.isSubstring( str, q_string) )
				//if ( str.indexOf( q_string ) >= 0 )
				{
				$(this).removeClass('hidden')


				//var clone  = $(this).clone().wrap('<div></div>').parent().html();

				//opt += clone
				}
				else
				{
				$(this).addClass('hidden')
				}

				}


				var total_count = $(this).closest('div').find('li').length
				var hidden_count = $(this).closest('div').find('li.hidden').length

				if(hidden_count >= total_count)
				$(this).closest('div').addClass('hidden')
				else
				$(this).closest('div').removeClass('hidden')

				//if(optgroup)
				//	opt += "</div>";

				})

				var hidden_options = this.$elem.find('.options_cached li.hidden').length
				
				
				
				
				if( hidden_options >= all_options || self.allLoaded )
				{
				//var no_data = this.$elem.find('.options .no_data').length
				
				this.$elem.find('.get_more').hide()
				//alert(no_data)
				//if(!no_data)

				//this.noResults()
				}
				else
				{
				//this.noResults( false )
				//var no_data = this.$elem.find('.options .no_data').length
				//alert(no_data)
				//if(no_data)
				//this.$elem.find('.options .no_data').remove()
				}


				//this.refreshSelectionStatuses()

				//var length =  
				// alert(hidden_options)


				var options = this.$elem.find('.options_cached').html()
				//console.log(options)
				
				return options;
			}
			 
			 
			 if(this.config.data)
			 {
				self.allLoaded = true
				
				var rslts = this.config.data
				if(rslts)
				{
				var obj = {}
				obj[0] = {}
				obj[0]['label'] = 'none'
				obj[0]['options'] = rslts
				}
			 }
			 else
			 {
				var loading = "<div class='loading'><i class='icon icon-spin icon-spinner'></i></div>";
				this.$elem.find('.input_search input').before(loading)	
				
				var obj = self._ajax( q_string, page );
				//alert(rslts)
			}
			//alert(q_string)
			//var obj = rslts
				
				if(rslts && rslts != '')
				{
				
				
				}
				
			//alert( JSON.stringify(obj) )
			var itt = self.createOptions( obj );
			//alert( this.limit ) 
			//alert( JSON.stringify(obj[0].options.length ) )
			
			//alert(call.data)
			//this.$elem.find('.options').append('<li>aa</li>')
			
			if( obj && !this.config.data 
					&& this.config.limit <= obj[0].options.length )
				itt +="<div class='get_more'> <i class='icon icon-plus'></i> "+self.lang.textLoadMore()+"</div>"
			
			// get results from server only once
			var options = this.$elem.find('.options_cached li').length
			if( this._isEqual (options, 0) )
			{
				//console.log( this.config.cache )
				if( this.config.cache || !this.config.ajaxUrl )
				this.$elem.find('.options_cached').append( itt )
			}
			
			
			
			this.$elem.find('.loading').remove()
			
			var res = '';
				res = itt;
				
				
			//if(call.data.first_load_only != undefined )
			//this.$elem.find('.options').html(res)
			
			return res;	
		},
		

		createOptions: function(obj, multiple_check, render_optgroup ) {
			var itt = '';
				
			if( !multiple_check && multiple_check !== false )
			multiple_check = true
			if( !render_optgroup && render_optgroup !== false )
			render_optgroup = true
			
			//var obj = call.data.results2
			
			//alert(obj.length)
			
			
			var obj_common = {};
			var obj2;
			var label;
			var options;
			var li_batch;
			var id;
			var text;
			var optgroup;
			var tpl;

			
			var all_ids = []
			//alert( Object.keys(obj).length )
			var group_count = 0;
			for( key in obj )
			{
			group_count ++ ;
			}
			//alert( JSON.stringify( obj  ) )
			
			if( group_count == 0 )
			{
			itt += this.noResults();
			
			}
			else
			for( key in obj )
			{
				//for( key2 in key)
				obj2 = obj[key]
				label = obj[key].label
				options = obj[key].options
				tpl = obj[key].tpl
				
				li_batch = obj[key].li_batch
				
				obj_common = obj[key].data
				//if(key == 0)
				//{//optgroup = false; //}
				//else
				//optgroup = true;
				
				//alert( JSON.stringify( li_batch  ) ) 
				
				//if(optgroup)
				
				if(render_optgroup)
				itt += "<div class='optgroup optgroup"+key+"'>"
				
				//if( key != 0 ) 
				if( group_count > 1 ) 
				{
					itt += "<p>"+label
					if(this.multiple)
					itt += " <i class='icon icon-list-add select_all_in_group' title='"+this.lang.textSelectAllInGroup()+"'></i>"
					itt += "</p>"
				}
				
				
				//var data = {}
				if(li_batch)
				{
				itt += li_batch
				}
				else
				for( key2 in options )
				{
					id = options[ key2 ]['id']
					text = options[ key2 ]['text']
					
					
					//alert(id)
					//alert( JSON.stringify( options[key2] ) )
					//var e = self.$elem.find('.options_cached').find("[data-id='" + id + "']").removeClass('hidden');
					all_ids.push(id)
					
					
					//indexOf
					text = this.config.formatResult( options[ key2 ] )
					//created = this.createOption(id, text, optgroup, multiple_check)
					
					//if(created)
					//created_count ++;
					
					itt += this.createOption( options[ key2 ], obj_common, id, text, optgroup, multiple_check, tpl)
				}
				
				//alert(created_count)
				//if(optgroup)
				{
				if(render_optgroup)
				itt += "</div>"
				}
				
			}
			
			//alert( all_ids )
			   //if(!itt)
			   //itt = 'no data';
			//alert(itt)   
			return itt;   
		},
		
		createOption: function( obj, obj_common, id, text, optgroup,  multiple_check ) {
			
			if(!obj)
			return '';
			if(!obj_common)
			obj_common = {};
			
			tpl = obj_common.tpl
			
			if( !multiple_check && multiple_check !== false )
			multiple_check = true
			
			if( !optgroup && optgroup !== true )
			optgroup = false
			
			
			//console.log( parseInt( id ) )
			//id = this._parseInt( id )
			//alert(id)
			//
			
			//if( isNaN(id) || id==undefined || id == '' || id < 0 || !text )
			if( !obj.id  )
			return '';
			if( !obj.text)
			obj.text = 'ID: '+obj.id;
			
			//console.log( id )
			
			var cls = '';
			
			//if(this.multiple && multiple_check)
			if( this.multiple )
			{
			
				//alert( JSON.stringify ( this.multiple_options ) )
				//id = parseInt( id )
				//var exists = this.multiple_options.indexOf( id );
				var exists = this.multipleOptionExist( obj.id );
				//alert(exists)
				//var exists = 1;
				//console.log( typeof ( this.multiple_options ) )
				//console.log( exists )
				//console.log( JSON.stringify ( this.multiple_options ) )
				//alert(exists)
				if(exists !== false )
				cls = "class='hidden'"
				
				//if(exists !== false )
				//return '';			
			}
			
			//alert(JSON.stringify(obj_common))
			//alert(JSON.stringify(tpl))
			if(!tpl)
			{
			tpl =  obj.text 
			
			var str  = " <li "+cls+"data-id='"+obj.id+"' >"+tpl+"</li>"
			
			}
			else
			{
			var tpl_obj = $(tpl)
			
			//if(tpl_obj.prop('tagName') == 'LI')
			var str = tpl
			}
			
			//else
			//var str  = " <li "+cls+"data-id='"+obj.id+"' title='"+$("<p>" + obj.text + "</p>").html( obj.text ).text()+"'>"+tpl+"</li>"
			
			//
			//tpl = "<li {cls} data-id='{id}' title='{title}'>{text}</li>"
			//else
			//if(tpl)
			//text = tpl
			//if(optgroup)
			//cls = "class='optgroup' "
			//tpl=tpl.replace("{cls}", cls )
			//tpl=tpl.replace("{title}", $("<p>" + text + "</p>").html(text).text() )
			//tpl=tpl.replace("{id}", id )
			var date = new Date();
			var time = date.getTime(); 

			str=str.replace("{$text}", obj.text )
			str=str.replace("{$suffix}", obj.suffix + "?" + time )
			str=str.replace("{$id}", obj.id )
			str=str.replace("{$icon}", obj.icon )
			
			str=str.replace("{$path}", obj_common.image_path )
			str=str.replace("{$image}", '<img />' )
			//str=str.replace("{tpl}", tpl )
			
			var itt2 = str;
			//var itt2 = "<li "+cls+"data-id='"+id+"' title='"+$("<p>" + text + "</p>").html(text).text()+"'>"+text+"</li>";	
			//alert(itt)	
			
			return itt2;   
		},
		
				
		createSelectedOptions: function( obj )
		{
			var self = this
			var i = 0;
			var s_opt ='';
			var id, text;
			
			//alert( obj.length )
			if(obj)
			for( j=0; j < obj.length; j++ )
			{
				//if( obj[j] !== undefined )
				{
				//alert( JSON.stringify( obj[j]) )
				id = obj[j]['id']
				
				//id = self._parseInt( id )
				text = obj[j]['text']
				//this.multiple_options[j] = id
				//alert(i)
				//i = i+1

				//items += "<div class='option' data-id='"+id+"'><i class='icon icon-cancel-1 remove_selected_option'></i> "+text+"</div>"
				s_opt += this.createSelectedOption( id, text )
				//s_opt += ii
				//alert(ii)
				}
			}
		
			//for (var prop in obj) 
			//{
			//	var id = obj[prop]['id']
			//	var text = obj[prop]['text']
			//	this.multiple_options[i] = id
			//	i = i+1
			//	var ii = this.createSelectedOption(id, text)
			//	s_opt += ii
			//}
			
			return s_opt;
		},

		createSelectedOption: function( id, text )
		{
			//id = this._parseInt( id )
			//alert(id)
			//console.log( 'aef' )
			id = id.toString()
			//if( isNaN(id) || id==undefined || id == '' || id < 0 )
			if(!id || !text)
			return '';
			
			this.multiple_options.push(id)
			//allowClear
			var t = "<div class='selected_option' data-id='"+id+"'>";
				
				//if(this.config.allowClear)
				t += "<div class='remove_selected_option'>";
				t += "<i class='icon icon-cancel-1'></i>";
				t += "</div>"; 

				t += "<div class='option_text'>"+text+"</div>";
				t += "</div>";
			
			return t;
		},

		
		showOptions: function( opts, fade )
		{
			var self = this
			//alert(opts)
			//console.log('showOptions')
			
			if(!opts)
			{
			var data = ''
			//this.noResults()
			}
			else
			var data = opts
			
			if( !fade && fade !== false )
			fade = true
			
			//alert(data)
			if(data)
			{
				
				if(fade)
				this.$elem.find('.options').html( data ).hide().fadeIn(200, function(){ 
					//alert(22)
					var l = self.$elem.find('.options li').length
					//alert(l)
					
					
					})
				else
				this.$elem.find('.options').html( data )
			}
			else
			{
			//alert(54)
			//this.noResults()
			}
			
			
		
			
			if( ! this.config.infiniteScroll )
			this.$elem.find('.get_more').addClass('hidden')
			
			this.refreshSelectionStatuses();
			//if(has_options)
			{
				//var itm = '';
				//this.$elem.find('option').each(function(e){ ( itm += "<p data-id='"+$(this).data('id')+"'>"+$(this).val()+"</p>" ) })
				//var itemss = $("<div class='options'>"+opts+"</div>");
				//this.$elem.find('.area').append( itemss )	

			}
			
			
			var img_count = this.$elem.find('.options').find('img').length
			if(img_count > 0)
			{
				this.$elem.find('.options').find('img').load(function(){
				self.refreshSelectionStatuses();
				})
			}
			
			
			
		// test if element is in viewport (visible on screen)	

			
			
			
			
		},
		
		
		
		
		refreshSelectionStatuses: function()
		{
			var self = this
			//this.updateCount();
			var shown_items = this.$elem.find('.options li:not(.hidden)').length
			var shown_selected_items = this.$elem.find('.selected_options .selected_option').length
			
			//alert(shown_selected_items)
			//alert(this.config.maxSelectionSize)
			//if(shown_items <= 0)
			if( shown_items <= 0 || 
				( this.config.maxSelectionSize && 
				shown_selected_items >= this.config.maxSelectionSize )
				)
			this.$elem.find('.select_all').addClass('hidden')
			else
			this.$elem.find('.select_all').removeClass('hidden')
			
			
			//console.log( shown_items )
			//console.log( shown_selected_items )
			if(this.config.maxSelectionSize && (this.config.maxSelectionSize - shown_selected_items) < shown_items )
			this.$elem.find('.select_all .count').html( this.config.maxSelectionSize - shown_selected_items )
			else
			this.$elem.find('.select_all .count').html( shown_items )
			this.$elem.find('.deselect_all .count').html( shown_selected_items )
			
			//if( shown_selected_items <= 0 || shown_selected_items >= this.maxSelectionSize )
			if( shown_selected_items > 0 )
			this.$elem.find('.deselect_all').removeClass('hidden')
			else
			this.$elem.find('.deselect_all').addClass('hidden')
			
			//res += this.lang.textResultsToSelect( );
			//if( shown_selected_items >= this.maxSelectionSize )
			
			
						//hide().find('.deselect_all').show()
						//.addClass('deselect_all')
						//.html("<i class='icon icon-plus-squared'></i>")
			//else
			this.$elem.find('.deselect_all')
					//.removeClass('deselect_all')
					//.addClass('select_all')
					//.html("<i class='icon icon-minus-squared'></i>")

			//var hidden_items = this.$elem.find('.options_cached li.hidden').length
			//alert( all_items )
			var results_to_select = 
			this.$elem.find('.search_info .search_text').html( this.lang.textResultsToSelect( shown_items ) )
			
			this.$elem.find('.search_info .count_items').html( shown_items );	
			
			var all_options = this.$elem.find('.options li').length
			var hidden_options = this.$elem.find('.options li.hidden').length
			//alert(all_options +" "+ hidden_options)
			var div_exists = this.$elem.find('.options .no_data').length
			
			//alert( shown_items * 25 + 25 )
			//if(shown_items > 0)
			//this.$elem.find('.options').height( shown_items * 35 )
			//else
			//this.$elem.find('.options').height( 25 )
			//this.$elem.find('.options').append(d)
			
			var height =  this.$elem.find('.options').height()
			var height2 =  this.$elem.find('.options li').height()
			var totalHeight = 0
			this.$elem.find('.options li').each(function(){
				totalHeight = totalHeight + $(this).outerHeight();
			});
			
			//console.log(totalHeight)
			if( totalHeight <= 250 )
			//if( shown_items <= 10 )
			this.$elem.find('.options_inner').css('overflow-y', 'none')
			else
			this.$elem.find('.options_inner').css('overflow-y', 'scroll') 
			
			
			//alert( hidden_options +' - '+ all_options) 
		//	$(this).css('overflow-y', 'scroll') 
			
			if( hidden_options >= all_options )
			{
				
				if( !div_exists )
				{
					var div  = this.noResults()
					this.$elem.find('.options').append( div )
					//this.noResults()
					//alert(no_data)
				}
			}
			else
			{
				if( div_exists )
				this.$elem.find('.options').find('.no_data').remove()
			}
			
			
			this.$elem.find('.options').find('.optgroup').each( function(){
			
				var length_total = $(this).find('li').length
				var length_hidden = $(this).find('li.hidden').length
				
				if( length_hidden >= length_total)
				$(this).addClass('hidden')
			
			
			//if( self.allLoaded  )
			//{
				//console.log( self.allLoaded )
				//var getmore = this.$elem.find('.options').find('.get_more')	
				//if(getmore.length)
				//getmore.hide()
			//}
				//alert(length_total) get_more
				//alert(length_hidden)
			})
			//var li_group_total = el.closest('div').find('li').length
			//var li_group_hidden = el.closest('div').find('li.hidden').length
			
			//if(li_group_hidden >= li_group_total)
			//{
			//el.closest('div').addClass('hidden')
			//this.$elem.find('.options_cached').find("[data-id='" + id + "']").closest('div').addClass('hidden')
			//}
		

		// showing options in viewport
		var win = $(window);
		var viewport = {
		top : win.scrollTop(),
		left : win.scrollLeft()
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();
		var bounds = this.$elem.offset();
		bounds.right = bounds.left + this.$elem.outerWidth();
		bounds.bottom = bounds.top + this.$elem.outerHeight();
			
			var ttop = bounds.top - viewport.top 
			var bbottom = viewport.bottom - bounds.bottom
			
			var hh = this.$elem.find('.resultbox').height() 
			var hha = this.$elem.find('.area').height()
			var hhx = hh+hha+2
			//console.log( bounds.top )
			//console.log( hhx )
			
			if( bbottom >= (ttop) || bounds.top <= hhx )
			{
			this.$elem.find('.resultbox').css('margin-top', '-1px' )
			//console.log( 'bottom' )
			}
			else
			{
			
			this.$elem.find('.resultbox').css('margin-top', -hhx )
			
			//console.log( hha )
			}
			
			
			
		},
		
		
		noResults: function(  )
		{
			var text = "<div class='no_data'>"+this.lang.textNoMatches()+"</div>"
			
			return text;
			//alert(4)
		},
		
		
		open: function( higlight )
		{	
			
			var self = this
			
			if( !this.config.cache )
			this.page = 1;	// reset page / ajax call
			//alert(el)
			//if(!higlight)
			//higlight = true
			//this.$elem.find('.search_info').html('aaaa')
			//var el = this.$elem
			//console.log(self.multiple_options)
			//console.log(self.multiple_options)
			//alert(has_options)
			
				
			
			
			//if( (viewport.top - bounds.top)  )
			//console.log( bounds.top - viewport.top )
			//console.log( viewport.bottom - bounds.bottom )
			//if( viewport.top < bounds.top  )
			//console.log( 'top' )
			//console.log(etop)
			
			//var zindex = el.css('z-index')
			this.$elem.css('z-index','999')
			
			this.$elem.addClass('opened')
			
			//if(!this.multiple)
			this.$elem.find('.open .icon').removeClass('icon-down-open').addClass('icon-up-open')
			
			var res = '';
				res += "<div class='resultbox'>";
				
				if( this.config.searchAllowed )
				{
					res += "<div class='input_search'>";
					
					res += "<div class='input_wrap'>";
					res +=  "<div class='search'><i class='icon icon-search-1'></i></div>";
					//alert( this.config.maxInputLength )
					res += "<input type='text' maxlength='"+(this.config.maxInputLength+1)+"' />";

					
					
					res += "<div class='search_info'>"
					res += "<span class='count_items'></span> "
					
					//res += "<span class='search_text'>"+this.lang.textSearching()+"</span> "
					res += "<span class='search_text'></span> "
					
					
					if(this.multiple)
					{
					res += "<span class='select_deselect'>";
					res += "<span class='select_all hidden' title='"+this.lang.textSelectAll()+"'>";
					res += "<i class='icon icon-plus-squared'></i>";
					res += "<span class='count'>";
					res += "0";
					res += "</span>";
					res += "</span>";
					res += "<span class='deselect_all hidden' title='"+this.lang.textDeselectAll()+"'>";
					res += "<i class='icon icon-minus-squared'></i>";
					res += "<span class='count'>";
					res += "0";
					res += "</span>";
					res += "</span>";
					res += "</span>";
					}
					res += "</div>";
					
					res += "</div>";
					
					res += "</div>";
				}
				
				var animation = '';
				if(this.config.animation)
				animation = " "+this.config.animation;
				
				res += "<div class='options_wrapper'>";
				res += "<ul class='options_inner"+ animation +"'>";
				res += "<div class='options'>";
				
				//alert()
				//res += this.get_results( el )
				
				res += "</div>";
				res += "</ul>";
				res += "</div>";
				
				res += "</div>";
			res = $(res)
			
			
			//alert(el.html())
			
			/*if( bbottom >= ttop)
			console.log( 'bottom' )
			else
			console.log( 'top' )
			*/
			
			//console.log( res.height()  )
			res.appendTo( this.$elem )
			
			
			
			
			
			
			//this.$elem.before( res)
			//res.hide().slideDown(200)
			
			this.$elem.find('.input_search input').focus();
			
			
			
			if(this.config.infiniteScroll)
			{
				//function onScrollEvent()
				function listenScrollAgain()
				{
					
					//console.log( $(this).scrollHeight() +" / " )
					//console.log( $(this).clientHeight() +" / " )
					//console.log( $(this).height() )
					var a = $(this).scrollTop() + 250
					var b = $(this).find('.options').innerHeight()
					//console.log( a +" / "+b )
					//console.log( $(this).innerHeight() +" / " )
					//console.log( $(this).outerHeight() +" / " )
					var l = self.$elem.find('.options').data('loading')
					if( (a+1)>=b && l != 1 )
					//if( $(this).scrollTop()+250*1 >= $(this).find('.options').height() )
					//if( $(this).scrollTop() % 254 == 0 )
					{
						self._getMoreResults();
						
					}
				}
				//function listen_again() {
				var all = document.querySelectorAll(".options_inner");
				all[0].onscroll = listenScrollAgain;
			}	
			

				
				//alert(JSON.stringify(all[0]) )
			//}
			//this.$elem.find('.options').onscroll = scrollfunc
			//listen_again()
			
			
				
			
			 //var has_options = el.find('.options').length
			// if(has_options)
			// var opts = el.find('.options').html()
			//else
			
			 
			var opts = this.getOptions( )
			
			this.showOptions( opts )
			
			
			//console.log(opts)
			//if(this.config.animation)
			//stroll.bind( this.$elem.find('.options_inner') );	
			//stroll.bind( this.$elem.find('.options_inner'), { live: true } );	
			//var a = this.$elem.find('.options li:first').focus()	
			//alert(a)
			//this.refreshSelectionStatuses()
		
		},
		
		
		
		
		
		close: function( el )
		{
			//if(this.config.animation)
			//stroll.unbind( this.$elem.find('.options_inner') );
			//console.log('closed')
			if(!el)
			el = this.$elem
			
			el.css('z-index','998')
			
			el.removeClass('opened')
			
			//if(!this.multiple)
			el.find('.open .icon').removeClass('icon-up-open').addClass('icon-down-open')
			
			el.find('.resultbox').remove()
			
			this.$elem.unhighlight();
			
			
			
		}
		
		,
		test : function()
		{
		
		alert('testing')
		}
		
		
	}
		
    


    // You don't need to change something below:
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {
					
                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new seleqtPlugin( this, options ));
                }
            });

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
			
            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof seleqtPlugin && typeof instance[options] === 'function') {
					//alert( options )
                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

}(jQuery, window, document));
