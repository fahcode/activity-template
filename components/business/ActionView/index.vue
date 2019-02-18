<style lang="less">
    .action-view {
        width: 100%;
        height: 3rem;
    }
</style>
<template>
    <canvas @click="restart" class="action-view" ref="canvas" :style="{'background-color': $bgColor}"></canvas>
</template>
<script>
let application = null;
import Vue from 'vue';
import * as PIXI from 'pixi.js';
import { TimelineMax } from 'gsap';
import Enum from 'common/enum';
import * as Action from 'action';
import BusinessCompMixin from 'base/BusinessCompMixin';
let timeline = null;
function updateStageZIndex() {
    application.stage.children.sort((a, b)=> {
        if(a.zIndex > b.zIndex) {
            return 1;
        } else if(a.zIndex < b.zIndex) {
            return -1;
        } else {
            return a.zOrder - b.zOrder;
        }
    });
}
export default {
    name: 'ActionView',
    mixins: [BusinessCompMixin],
    props: {
        action: {
            type: String,
            default: '',
            $rule: {
                name: '动效',
                clazz: Enum.CLAZZ.ACTION
            }
        },
        $bgColor: {
            default: process.env.NODE_ENV == 'production' ? 'transparent' : '#ececec',
        }
    },
    data() {
        return {
            actionObj: null,
            meta: null
        }
    },
    watch: {
        action(newVal) {
            this.initAction();
        }
    },
    mounted() {
        if(!process.env.IS_SSR) {
            this.initAction();
        }
        // if(process.env.NODE_ENV != 'production') {
        //     this.observer = new MutationObserver(()=> {
        //         this.resizeCanvas();
        //     });
        //     this.observer.observe(this.$el, {attributes: true});
        // }
    },
    beforeDestroy() {
        if(process.env.NODE_ENV != 'production') {
            if(this.observer) {
                this.observer.disconnect();
            }
        }
        this.clear();
        if(application) {
            application.destroy(false);
        }
    },
    methods: {
        addSprite(id, path, props, actions) {
            if(!PIXI.loader.resources[path]) return;
            let sprite = new PIXI.Sprite(
                PIXI.loader.resources[path].texture
            );
            sprite.id = id;
            sprite.anchor.set(.5);
            sprite.x = (props.x + props.w / 2);
            sprite.y = (props.y + props.h / 2);
            sprite.width = props.w;
            sprite.height = props.h;
            sprite.zIndex = props.z;
            sprite.zOrder = props.zOrder;
            sprite.rotation = props.rotation / 180 * Math.PI;
            sprite.alpha = props.alpha / 100;
            
            if(actions.length) {
                let t = new TimelineMax();
                for(let i = 0; i < actions.length; i++) {
                    if(i == 0) {
                        actions[i].params.onStart = ()=> {
                            sprite.visible = true;
                        }
                    }
                    //actions[i].params.$resolution = this.meta.resolution;
                    let newAction = new Action[actions[i].type]().create(sprite, actions[i].params);
                    t.add(newAction, actions[i].params.delay);
                }
                timeline.add(t, 0);
                sprite.visible = false;
                sprite.static = false;
            } else {
                sprite.visible = true;
                sprite.static = true;
            }
           
            application.stage.addChild(sprite);
        },

        initAction() {
            let actionObj = Vue.__SHARE__[this.action];
            if(actionObj) {
                this.clear();

                this.actionObj = actionObj;
                this.meta = this.actionObj.meta;
                this.initCanvas();

                let actionCollection = actionObj.data;
                let resources = [];
                for(let p in actionCollection) {
                    // let p = actionCollection[p];
                    let url = actionCollection[p].res.url;
                    if(!PIXI.loader.resources[url] && resources.indexOf(url) == -1) {
                        resources.push(url);
                    }
                }
                PIXI.loader.add(resources).load(()=> {
                    timeline = new TimelineMax();
                    for(let p in actionCollection) {
                        let action = actionCollection[p];
                        this.addSprite(p, action.res.url, action.props, action.actions);
                    }
                    updateStageZIndex();
                    this.$nextTick(()=> {
                        timeline.play()
                    });
                });
            }
        },

        initCanvas() {
            let _canvas = this.$refs.canvas;
            //let rect = _canvas.getBoundingClientRect();
            application = new PIXI.Application({
                view: _canvas, 
                antialias: true, 
                transparent: true, 
                roundPixels: false,
                width: this.meta.width,
                height: this.meta.height,
                resolution: this.meta.resolution,
                sharedTicker: true,
                sharedLoader: true
            });
            application.stage.x = 0;
            application.stage.y = 0;
            if(process.env.NODE_ENV != 'production') {
                application.renderer.plugins.interaction.autoPreventDefault = false;
            }
            //_canvas.style['touch-action'] = 'auto';
            // application.stage.interactive = true;
            // application.stage.on('click', this.restart);
        },
        clear() {
            if(timeline) {
                timeline.pause();
                timeline.kill();
            }
            if(application) {
                let len = application.stage.children.length;
                while(len--) {
                    application.stage.removeChild(application.stage.children[len]);
                }
            }
        },
        restart() {
            if(process.env.NODE_ENV != 'production' && timeline) {
                application.stage.children.forEach((sprite)=> {
                    if(!sprite.static) {
                        sprite.visible = false;
                    }
                });
                timeline.restart();
            }
        }
        // resizeCanvas() {
        //     if(application) {
        //         let rect = this.$refs.canvas.getBoundingClientRect();
        //         this.observer.disconnect();
        //         application.renderer.resize(rect.width, rect.height);
        //         this.$nextTick(()=> {
        //             this.observer.observe(this.$el, {attributes: true});
        //         });
        //     }
        // }
    }
}
</script>

