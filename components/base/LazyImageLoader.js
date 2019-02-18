const lazyImageMap = {};
var lazyImageArray = [];
const TIME_OUT = 64;
const LOADING = 'LOADING';
const LOADED = 'LOADED';

export default class LazyImageLoader {

	static inited = false;

	static _onLoadHandler() {
		lazyImageMap[this.src] = true;
		this.dataset['status'] = LOADED;
		this.onload = null;
	}

	static _onErrorHandler() {
		this.onerror = null;
		this.onload = null;
	}

	static detect(img) {
		if(!img) return;
		if(lazyImageMap[img.dataset['src']]) {
			img.src = img.dataset['src'];
			return;
		}
		lazyImageArray.push(img);
		if(!LazyImageLoader.inited) {
			function check() {
				let winHeight = window.innerHeight;
				let winWidth = window.innerWidth;
				lazyImageArray = lazyImageArray.filter(function(img) {
					if(img.dataset['status'] == LOADED || img.dataset['status'] == LOADING) {
						return false;
					} else {
						return true;
					}
				});
				lazyImageArray.forEach(function(img) {
					if(img.dataset['status']) return;
					let rect = img.getBoundingClientRect();
					let {top, right, left, bottom} = rect;
					if((top|right|left|bottom) == 0) { //if img is not in document;
						//img.dataset['status'] = LOADED; //todo
						return;
					}
					if(((top > 0 && top < winHeight) || (bottom > 0 && bottom <= winHeight)) 
						&& ((left > 0 && left <= winWidth) || (right > 0 && right <= winWidth))) {
						img.onload = LazyImageLoader._onLoadHandler;
						img.onerror = LazyImageLoader._onErrorHandler;
						img.src = img.dataset['src'];
						img.dataset['status'] = LOADING;
						img.dataset['src'] = '';
					}
				});
				setTimeout(check, TIME_OUT);
			}
			setTimeout(check, TIME_OUT);
			LazyImageLoader.inited = true;
		}
	}

	static cancel(img) {
		lazyImageArray = lazyImageArray.filter(function(_img) {
			return _img != img;
		});
	}
}