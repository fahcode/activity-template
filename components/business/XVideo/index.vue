<style lang="less">
    @keyframes rotate {
        100% {
            transform: rotate(360deg); 
        } 
    }
    .xvideo {
        position: relative;
        margin: 0 0.444444rem;
        min-height: 50px;
        background-position: center;

        &__player {
            width: 100%;
            height: 100%;
        }

        &__cover, &__play-cover {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }

        &__play-cover {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0,0,0,.5);
        }

        &__loading {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        &__loader {
            width: 0.55rem;
            height: 0.55rem;
            border-radius: 100%;
            border: 3px solid #6bdaf9;
            border-bottom-color: transparent !important;
            background: transparent;
            animation: rotate 0.75s linear infinite; 
            animation-fill-mode: both;
        }
    }
</style>
<template>
    <div>
        <div class="xvideo" 
            :style="{'height': $toRem(videoImg.height)}">
            <video ref="video" 
                class="xvideo__player" 
                :preload="preload" 
                :src="videoLink ? videoLink : video.url" 
                @click='play'>
            </video>
            <img class="xvideo__cover" 
                :src="realVideoImg" 
                :class="{'none': isHideVideoCover}">
            <div class="xvideo__play-cover" 
                :class="{'none': isHidePlayCover}"
                @click='play' ><i :style="{'background-image': realToggleImg,'width':$toRem(toggleImg.width),'height':$toRem(toggleImg.height), 'background-size': '100%'}"></i></div>
            <div class="xvideo__loading" 
                :class="{none: isHideLoading}" 
                @click="stopPlay">
                <div class="xvideo__loader" :style="{'border-color': loaderColor}"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import Enum from 'common/enum';
    import util from 'common/util';
    import util2 from 'common/util2';
    import logger from 'common/logger';
    import DialogBuilder from 'base/DialogBuilder'
    export default {
        name: 'XVideo', 
        props: {
            video: {
                type: Object,
                default: () => ({}),
                $rule: {
                    name: '视频',
                    clazz: Enum.CLAZZ.VIDEO
                }
            },
            videoLink: {
                type: String,
                default: '',
                $rule: {
                    name: '视频URL'
                }
            },
            videoImg: {
                type: Object,
                default: () => ({}),
                $rule: {
                    name: '视频封面',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            toggleImg: {
                type: Object,
                default: () => ({url: require("../../assets/toggle.png"), width: 108, height: 108}),
                $rule: {
                    name: '播放按钮',
                    clazz: Enum.CLAZZ.IMAGE
                }
            },
            loaderColor: {
                type: String,
                default: '#6bdaf9',
                $rule: {
                    name: '加载圆环颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        },
        data() {
            return {
                isHideVideoCover: false,
                isHidePlayCover: false,
                isHideLoading: true,
                isWifi: true,
                needCheck: false,
                preload: 'none'
            }
        },
        computed: {
            realVideoImg() {
                return util.getImgUrl(this.videoImg);
            },
            realToggleImg() {
                return util.getImgCSSVal(this.toggleImg);
            },
        },
        methods: {
            play() {
                var self = this;
                if(this.isWifi) {
                    logger.makeActivityLog('activity_video_clicks', {});
                    this.togglePlay();
                } else {
                    DialogBuilder.of(this).confirm('', '非wifi网络，播放将消耗手机流量', function() {
                        this.dismiss();
                        self.togglePlay();
                        self.isWifi = true;
                    }, function() {
                        this.dismiss();
                        self.isWifi = false;
                    }, {
                        confirmBtnTxt: '继续播放',
                        cancelBtnTxt: '取消'
                    });
                }
            },
            togglePlay() {    //当视频停止的时候播放，当视频播放的时候停止
                var video = this.$refs.video;
                if(video.paused) {   
                    video.play();
                    if(parseInt(video.currentTime * 100) <= 10) {  //点击播放后，视频一开始黑屏时，用loading和封面转台代替
                        this.isHideVideoCover = false; 
                        this.isHideLoading = false;
                        this.isHidePlayCover = true;
                        return;
                    }
                    this.isHideVideoCover = true;  
                    this.isHidePlayCover = true; 
                } else {
                    video.pause();
                    this.needCheck = false;
                    this.isHidePlayCover = false; 
                }
            },
            stopPlay() { 
                var video = this.$refs.video;
                video.pause();
                this.isHideLoading = true;
                this.isHidePlayCover = false;
            }
        },
        mounted() {
            let video = this.$refs.video;
            let     lastTime = -1;
            let lastPlayTime = -1;

            this.isWifi = true;

            if(process.env.NODE_ENV == 'production') {
                this.isWifi = util2.getUrlParam('net') == 'wifi';
            } else {
                video.preload = 'auto';
            }

            this.videoImg.onload = ()=> {
                if(this.isWifi) {    //wifi状态下自动加载
                    video.preload = 'auto'; 
                }
            };

            video.onwaiting = (e)=>{      //数据一开始在加载时
                if(parseInt(video.currentTime * 100) <= 10) {
                    this.isHideVideoCover = false;
                }
                this.isHidePlayCover = true;
                this.isHideLoading = false;
            }
            video.ontimeupdate = (e)=>{    //实时监听播放进度
                if(parseInt(video.currentTime * 100) < 20) {   //移动端一开始有几毫秒的的进度，但是页面显示的是黑屏的状态，解决黑屏时的情况
                    if(!this.isHidePlayCover) {  //有遮罩
                        this.isHideLoading = true;
                    } else {
                        this.isHideLoading = false;
                    }

                    this.isHideVideoCover = false;
                    lastTime = Date.now();
                } else {
                    if(video.paused) {
                        video.pause();
                        return;
                    }
                    if(this.needCheck && ((Date.now() - lastTime) - (video.currentTime*1000 - lastPlayTime*1000) > 200)) {   //播放时视频卡顿，则显示loading
                        this.isHideLoading = false;
                    } else {
                        this.isHideLoading = true;
                        this.isHideVideoCover = true;
                    }
                }

                if(!this.needCheck) {
                    this.needCheck = true;
                }
                lastTime = Date.now();
                lastPlayTime = video.currentTime;
            }

            video.onended = (e)=>{  //播放结束，重新回到初始化
                this.isHideVideoCover = false;
                this.isHidePlayCover = false;
                video.src = this.video.url
            }
        },

    }
</script>