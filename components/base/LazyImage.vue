<style lang="less">
	.lazy-img {
		background-color: rgba(0,0,0,0.08);
	}	
</style>
<template>
	<img ref="lazyImg" class="lazy-img" :src="defaultSrc" :data-src="src" @load="handlLoaded" @click="onClick">
</template>
<script>
	import Vue from 'vue';
	import LazyImageLoader from './LazyImageLoader';
	import util from 'common/util';
	const defaultSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
	const defaultBgColor = 'rgba(0,0,0,0.08)';
	export default {
		name: 'LazyImage',
		props: {
			src: {
				type: String
			},
			onClick: {
				type: Function,
				default: util.noop
			}
		},
		data: function() {
			return {
				defaultSrc: defaultSrc,
				bgColor: defaultBgColor,
				isFirstLoaded: false,
				styles: ''
			}
		},
		methods: {
			handlLoaded: function() {
				if (this.$refs.lazyImg.dataset['status']) {
					this.$refs.lazyImg.setAttribute('style', this.styles  + 'background-color: transparent;');
				} else {
					this.$refs.lazyImg.setAttribute('style', this.styles);
				}
			},
			updateSrc: function() {
				this.$refs.lazyImg.dataset['status'] = '';
				this.$refs.lazyImg.dataset['src'] = this.src;
				LazyImageLoader.detect(this.$refs.lazyImg);
			}
		},
		mounted: function() {
			this.styles = this.$refs.lazyImg.getAttribute('style');
			this.updateSrc();
		},
		beforeUpdate: function() {
			this.$refs.lazyImg['src'] = defaultSrc;
			this.$nextTick(()=>this.updateSrc());
		},
		beforeDestroy: function() {
			LazyImageLoader.cancel(this.$refs.lazyImg);
		}
	}
</script>