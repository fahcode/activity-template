<style>
    .float-anchor {
        position: absolute;
        z-index: 999;
        top: 0;
        left: 0;
        width: 200px;
        height: 100px;
    }
</style>
<template>
    <div ref="el" class="float-anchor" @click="$doMotion(motion)" :style="{'background-color': $bgColor, '-webkit-transform': (this.top && this.left) ? `translate(${this.left},${this.top})` : false }"></div>
</template>
<script>
    import Enum from '../../common/enum';
    import util from '../../common/util';
    export default {
        name: 'FloatAnchor',
        props: {
            motion: {
                type: Object,
                default: ()=>({}),
                $rule: {
                    name: '点击响应动作',
                    clazz: Enum.CLAZZ.MOTION
                }
            },
            $bgColor: {
                default: process.env.NODE_ENV == 'production' ? 'transparent' : 'rgba(255, 0, 0, 0.25)',
            }
        },
        data: ()=> {
            return {
                top: 0,
                left: 0
            }
        },
        mounted() {
            if(process.env.NODE_ENV != 'production') {
                if(!this.$config || util.isEmptyObject(this.$config) || !this.$config.staticStyle || util.isEmptyObject(this.$config.staticStyle)) {
                    let app = document.getElementById('app');
                    this.top = (window.scrollY + app.scrollTop + window.innerHeight / 2 - this.$refs.el.offsetHeight / 2) + 'px';
                    this.left = (window.scrollX + app.scrollLeft +  window.innerWidth / 2 - this.$refs.el.offsetWidth / 2) + 'px';
                    this.observer = new MutationObserver(()=> {
                        if(this.top == 0 && this.left == 0) {
                            return;
                        } else {
                            this.top = 0;
                            this.left = 0;
                        }
                    });
                    this.observer.observe(this.$el, {attributes: true});
                }
            }
        },
        beforeDestroy() {
            if(process.env.NODE_ENV != 'production') {
                if(this.observer) {
                    this.observer.disconnect();
                }
            }
        },
        methods: {
            
        }
    }
</script>