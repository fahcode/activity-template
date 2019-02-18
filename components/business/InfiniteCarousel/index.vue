<style lang="less">
.infinite-carousel {
    position: relative;
    padding: 0 0.444444rem;

    &__inner {
        position: relative;

        li:nth-child(1) {
            /*transform: scale(0.9166);*/
            opacity: .5;
            z-index: 50;
        }

        li:nth-child(2) {
            left: 0;
            right: 0;
            z-index: 100;
        }

        li:nth-child(3) {
            /*transform: scale(0.9166);*/
            opacity: .5;
            z-index: 50;
        }

        li:nth-child(4) {
            /*transform: scale(0.9166);*/
            transform: scale(0);
            opacity: 0;
            z-index: 0;
        }
    }

    &__item {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        z-index: 1;
        margin: auto;
        transform: translate3d(0,0,0);
        -webkit-backface-visibility: hidden;
        img {
            vertical-align: middle;
        }
    }

    &__back-btn, &__forward-btn {
        position: absolute;
        left: 0.444444rem;
        top: 0;
        bottom: 0;
        z-index:99;
        margin: auto;
        width: 0.666667rem;
        height: 0.666667rem;
        background: transparent url('../../assets/left-arrow.png') center no-repeat;
        background-size: 100%;
        -webkit-tap-highlight-color: transparent
    }

    &__forward-btn {
        left: auto;
        right: 0.444444rem;
        background-image: url('../../assets/right-arrow.png');
    }
}
</style>
<template>
    <div class="infinite-carousel" ref="carousel">
        <ul class="infinite-carousel__inner" v-bind:style="{height: $toRem(currentImgs[0].height)}">
            <li v-for="img in currentImgs" class="infinite-carousel__item" v-bind:style="{width: $toRem(img.width), height: $toRem(img.height)}">
                <img :key="img.url" :src="img.url" style="width: 100%; height: 100%"/>
            </li>
        </ul>
        <a class="infinite-carousel__back-btn" href="javascript:void(0)" @click="back($event)"></a>
        <a class="infinite-carousel__forward-btn" href="javascript:void(0)" @click="forward($event)"></a>
    </div>
</template>
<script>
    //todo 太复杂
    import Enum from 'common/enum';
    import BusinessCompMixin from 'base/BusinessCompMixin';
    import TWEEN from '@tweenjs/tween.js';
    import Hammer from 'hammerjs';
    import Vue from 'vue';
    export default{
        name: 'InfiniteCarousel',
        mixins: [BusinessCompMixin],
        props: {
            imgs: {
                type: Array,
                default: ()=> ([]),
                $rule: {
                    name: '图片(至少4张，如不够建议再重复添加一次)',
                    clazz: Enum.CLAZZ.IMAGE_ARRAY
                }
            },
            duration: {
                type: Number,
                default: 300,
                $rule: {
                    name: '动画过渡时间(毫秒)'
                }
            },
            autoPlay: {
                type: Boolean,
                default: false,
                $rule: {
                    name: '自动播放'
                }
            },
            autoPlayInterval: {
                type: Number,
                default: 2400,
                $rule: {
                    name: '自动播放间隔'
                }
            },
            imageGap: {
                type: Number,
                default: 0,
                $rule: {
                    name: '图片间的间距（0遵循默认规则）',
                    clazz: Enum.CLAZZ.Number
                }
            },
        },
        data() {
            return {
                next: 3,
                position: 0,

                itemPosition: 0,
                items: [],
                offset: 0,
                scale: 0.9166,
                hm: null,
                autoPlayTimer: -1,
                inactivityTimer: -1,
                inactivityInterval: 5000
            }
        },
        computed: {
            normalizeImgs() {
                let def = {
                    url: '',
                    width: 360,
                    height: 640
                };
                let arr = this.imgs.slice(0);
                if(arr.length == 3) {
                    arr.push(this.imgs[0]);
                } else if(arr.length < 3) {
                    if(arr[0]) {
                        def.width = arr[0].width;
                        def.height = arr[0].height;
                    }
                    for(let i = arr.length; i < 4; i++) {
                        arr.push(def);
                    }
                }
                return arr;
            },
            currentImgs() {
                return this.normalizeImgs.slice(0, 4);
            },
            leftStyle() {
                return {offset: -1 * this.offset, opacity: .5, scale: this.scale};
            },
            centerStyle() {
                return {offset: 0, opacity: 1, scale: 1};
            },
            rightStyle() {
                return {offset: this.offset, opacity: .5, scale: this.scale};
            },
            backStyle() {
                return {offset: 0, opacity: 0, scale: 0.5};
            }
        },
        watch: {
            autoPlay(newVal) {
                if(newVal) {
                    this.setUpAutoPlay();
                } else {
                    clearTimeout(this.autoPlayTimer);
                    this.autoPlayTimer = -1;
                }
            }
        },
        mounted() {
            this.items = this.$refs.carousel.querySelectorAll('.infinite-carousel__item');
            this.offset = Number(this.$toRem(this.imageGap).replace('rem', '')) || Number(this.$toRem(390 - this.currentImgs[0].width * this.scale / 2).replace('rem', ''));
            let offset = this.offset + 'rem';
            this.items[0].style.setProperty('transform', `translate3d(-${offset},0,0) scale(${this.scale})`);
            this.items[0].style.setProperty('webkitTransform', `translate3d(-${offset},0,0) scale(${this.scale})`);

            this.items[2].style.setProperty('transform', `translate3d(${offset},0,0) scale(${this.scale})`);
            this.items[2].style.setProperty('webkitTransform', `translate3d(${offset},0,0) scale(${this.scale})`);

            function animate(time) {
                requestAnimationFrame(animate);
                TWEEN.update(time);
            }
            requestAnimationFrame(animate);

            if(this.autoPlay) {
                this.setUpAutoPlay();
            }
            //初始化手势
            this.hm = new Hammer.Manager(this.$refs.carousel, {
                recognizers: [
                    [Hammer.Swipe,{ direction: Hammer.DIRECTION_HORIZONTAL, velocity: .1 }],
                ]
            }).on('swipeleft', (event)=> {
                this.back(event);
            }).on('swiperight', (event)=> {
                this.forward(event);
            });
        },
        // beforeUpdate() {
        //     clearTimeout(this.autoPlayTimer);
        // },
        // updated() {
        //     if(this.autoPlay) {
        //         this.setUpAutoPlay();
        //     }
        // },
        beforeDestroy() {
            clearTimeout(this.autoPlayTimer);
            clearTimeout(this.inactivityTimer);
            if(this.hm) {
                this.hm.destroy();
            }
        },
        methods: {
            _updateItemStyle(item, style) {
                item.style.setProperty('transform', `translate3d(${style.offset}rem,0,0) scale(${style.scale})`);
                item.style.setProperty('webkitTransform', `translate3d(${style.offset}rem,0,0) scale(${style.scale})`);
                item.style.setProperty('opacity', style.opacity);
                //item.style.setProperty('z-index', style.zIndex);
            },
            setUpAutoPlay() {
                let self = this;
                if(this.autoPlayTimer != -1) {
                    clearTimeout(this.autoPlayTimer);
                }
                function play() {
                    self.back();
                    self.autoPlayTimer = setTimeout(()=> {
                        play();
                    }, self.autoPlayInterval);
                }
                play();
            },
            setUpInactivityTimer() {
                clearTimeout(this.inactivityTimer);
                this.inactivityTimer = setTimeout(()=> {
                    if(this.autoPlay) {
                        this.setUpAutoPlay();
                    }
                }, this.inactivityInterval);
            },
            back($event) {
                let item1 = this.items[this.itemPosition];
                let item2 = this.items[(this.itemPosition + 1) % 4];
                let item3 = this.items[(this.itemPosition + 2) % 4];
                let item4 = this.items[(this.itemPosition + 3) % 4];

                if($event) {
                    //this.autoPlay = false; // stop auto play
                    clearTimeout(this.autoPlayTimer);
                }
                this.setUpInactivityTimer();

                //update next
                this.position++;
                this.currentImgs[this.next] = this.normalizeImgs[(this.position + 3) % this.normalizeImgs.length];

                this.next++;
                if(this.next > 3) {
                    this.next = 0;
                }
                this.$forceUpdate();

                this.$nextTick(()=> {
                    new TWEEN.Tween(Object.assign({}, this.rightStyle)) 
                        .to(Object.assign({}, this.centerStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onStart(()=> {
                            item3.style.setProperty('z-index', 100);
                        }).onUpdate((obj)=> {
                            this._updateItemStyle(item3, obj);
                        }).start();
                    new TWEEN.Tween(Object.assign({}, this.leftStyle)) 
                        .to(Object.assign({}, this.backStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out) 
                        .onStart(()=> {
                            item1.style.setProperty('z-index', 0);
                        }).onUpdate((obj)=> {
                            this._updateItemStyle(item1, obj); 
                        }).start();
                    new TWEEN.Tween(Object.assign({}, this.centerStyle)) 
                        .to(Object.assign({}, this.leftStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onStart(()=> {
                            item2.style.setProperty('z-index', 50);
                        })
                        .onUpdate((obj)=> { 
                            this._updateItemStyle(item2, obj);
                        }).start();
                    
                    new TWEEN.Tween(Object.assign({}, this.backStyle)) 
                        .to(Object.assign({}, this.rightStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onStart(()=> {
                            item4.style.setProperty('z-index', 50);
                            this.itemPosition++;
                            if(this.itemPosition > 3) {
                                this.itemPosition = 0;
                            }
                        })
                        .onUpdate((obj)=> {
                            this._updateItemStyle(item4, obj); 
                        }).start();
                    });
            },
            forward($event) {
                let item1 = this.items[this.itemPosition];
                let item2 = this.items[(this.itemPosition + 1) % 4];
                let item3 = this.items[(this.itemPosition + 2) % 4];
                let item4 = this.items[(this.itemPosition + 3) % 4];

                if($event) {
                    //this.autoPlay = false; // stop auto play
                    clearTimeout(this.autoPlayTimer);
                }
                this.setUpInactivityTimer();

                //update next       
                this.position--;
                if(this.position < 0) {
                    this.position = this.normalizeImgs.length - 1;
                } else {
                    this.position = this.position % this.normalizeImgs.length;
                }
                
                this.currentImgs[this.next] = this.normalizeImgs[this.position];

                this.next--;
                if(this.next < 0) {
                    this.next = 3;
                }
                this.$forceUpdate();

                this.$nextTick(()=> {
                    new TWEEN.Tween(Object.assign({}, this.leftStyle)) 
                        .to(Object.assign({}, this.centerStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out) 
                        .onStart(()=> {
                            item1.style.setProperty('z-index', 100);
                        }).onUpdate((obj)=> {
                            this._updateItemStyle(item1, obj); 
                        }).start();
                    new TWEEN.Tween(Object.assign({}, this.centerStyle)) 
                        .to(Object.assign({}, this.rightStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onStart(()=> {
                            item2.style.setProperty('z-index', 50);
                        }).onUpdate((obj)=> { 
                            this._updateItemStyle(item2, obj);
                        }).start();
                    new TWEEN.Tween(Object.assign({}, this.rightStyle))
                        .to(Object.assign({}, this.backStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onStart(()=> {
                            item3.style.setProperty('z-index', 0);
                        }).onUpdate((obj)=> {
                            this._updateItemStyle(item3, obj);
                        }).start();
                    new TWEEN.Tween(Object.assign({}, this.backStyle))
                        .to(Object.assign({}, this.leftStyle), this.duration)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .onStart(()=> {
                            item4.style.setProperty('z-index', 50);
               
                            this.itemPosition--;
                            if(this.itemPosition < 0) {
                                this.itemPosition = 3;
                            }
                        }).onUpdate((obj)=> {
                            this._updateItemStyle(item4, obj); 
                        }).start();
                })
            }
        }
    }
</script>