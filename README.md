# seleqt
jquery Plugin for html Select element replacement

# Requirements:
This plugin requires the latest version of [jQuery](http://jquery.com/).

# Basic Usage
jsFiddle example for [basic usage](https://jsfiddle.net/miso25/75z2Ljyd/)

# Basic Usage AJAX data loading with Change event
Basic Usage AJAX data loading with Change event on the original element. jsFiddle example for [basic usage](https://jsfiddle.net/miso25/d1g5rch7/)

# Options
A complete listing of all options applicable for this plugin.

Option | Data Attribute | Data type | Default | Description
----|------|----|----|----
formatResult | data-format-result  | function | function(data){ return data.text }  | desc
data | data-data  | boolean | false  | desc
ajaxUrl | data-ajax-url  | boolean | false  | desc
cache | data-cache  | boolean | true  | desc
searchAllowed | data-search-allowed  | boolean | true  | desc
maxInputLength | data-max-input-length  | integer | 256  | desc
minInputLength | data-max-input-length  | integer | 0  | desc
maxSelectionSize | data-max-selection-size  | boolean | false  | desc
multiple | data-multiple  | boolean | false  | desc
infiniteScroll | data-infinite-scroll  | boolean | true  | desc
limit | data-limit  | integer | 20  | desc
allowClear | data-allow-clear  | boolean | true  | desc
placeHolder | data-place-holder  | boolean | false  | desc
animation | data-animation  | string | faded  | desc


# Events
Events usage

<input type="text" class="seleqt" >
$('.seleqt').seleqt()

$('.seleqt').on('change', function(){
	alert('changed to option ID: ' + $(this).val() )
})
