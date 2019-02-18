<style lang="less">
    @import "../style/import";
    .address {
        height: 8rem;
        margin-top: .5rem;
        .addresstips {
            position: absolute;
            top: 45%;
            left: 0;
            font-size: 0.444444rem;
            font-weight: 500;
            opacity: .2;
            margin-left: 0.222222rem;
            transition: all 0.4s;
            transform: translateZ(0);
        }
        &__name {
            position: relative;
            height: 1.666667rem;
            animation: float ease-in-out 0.4s 1;
        }
        &__phone {        
            position: relative;
            height: 1.666667rem;
        }
        &__address {        
            position: relative;
            height: 1.666667rem;
        }
        &__postcode {        
            position: relative;
            height: 1.666667rem;
        }
        &__divider {
            transform: scaleY(0.5) translateZ(0);
            height: 2px;
        }
        &__submit-btn {
            width: 6.5rem;
            height: 1.055556rem;
            line-height: 1.15rem;
            border-radius: 999rem;
            text-align: center;
            font-weight: 500;
            font-size: 0.444444rem;//16px
            position: absolute;
            bottom: .2rem;
            left: 50%;
            transform: translateX(-50%);
        }

        input {
            width: 95%;
            position: absolute;
            top: 45%;
            font-size: 0.444444rem;
            font-weight: 500;
            margin-left: 0.222222rem;
            background-color: transparent;
            color: inherit;
        }
    }
</style>
<template>
    <div ref="address" class="address" :style="{'color': fontColor}">
        <div class="address__name">
            <p class="addresstips">姓名</p>
            <input maxlength="20" v-model="playerRecipient" @blur="inputBlur(0)" @focus="inputFocus(0)">
        </div>
        <div class="address__divider" :style="{'background-color': dividerColor}"></div>
        <div class="address__phone">
            <p class="addresstips">手机号</p>
            <input maxlength="11" v-model="playerMobile" @blur="inputBlur(1)" @focus="inputFocus(1)">
        </div>
        <div class="address__divider" :style="{'background-color': dividerColor}"></div>
        <div class="address__address">
            <p class="addresstips">收件地址</p>
            <input maxlength="100" v-model="playerAddress" @blur="inputBlur(2)" @focus="inputFocus(2)">
        </div>
        <div class="address__divider" :style="{'background-color': dividerColor}"></div>
        <div class="address__postcode">
            <p class="addresstips">邮政编码</p>
            <input maxlength="10" v-model="playerPostcode" @blur="inputBlur(3)" @focus="inputFocus(3)">
        </div>
        <div class="address__divider" :style="{'background-color': dividerColor}"></div>

        <div class="address__submit-btn" :style="{'background-color': btnBgColor, 'color': btnFontColor}" @click="submit()">保存</div>
    </div>
</template>
<script>
    import TotastBuilder from '../base/TotastBuilder'
    import Enum from '../common/enum';
    import NativeInterface from 'common/nativeinterface';
    import util2 from 'common/util2';
    import {nameValidator, numberValidator, phoneValidator} from '../common/validators';
    export default {
    name: 'Address',
    props: ['$bgColor', '$pos'],
    props: {
        dividerColor: {
            type: String,
            default: 'rgba(0,0,0,0.1)',
            $rule: {
                name: '分割线颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
        fontColor: {
            type: String,
            default: '#000',
            $rule: {
                name: '字体颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
        btnBgColor: {
            type: String,
            default: '#ff0000',
            $rule: {
                name: '按钮背景颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
        btnFontColor: {
            type: String,
            default: '#ffffff',
            $rule: {
                name: '按钮字体颜色',
                clazz: Enum.CLAZZ.COLOR
            }
        },
    },
    data() {
        return {
        }
    },
    computed: {
        playerRecipient() {
            let value = this.playerInfo.recipient || '';
            this.initInputValue(0);
            return value;
        },
        playerMobile() {
            let value = this.playerInfo.mobile || '';
            this.initInputValue(1);
            return value;
        },
        playerAddress() {
            let value = this.playerInfo.address || '';
            this.initInputValue(2);
            return value;
        },
        playerPostcode() {
            let value = this.playerInfo.postcode || '';
            this.initInputValue(3);
            return value;
        },
        playerInfo() {
            return this.$store.state.playerInfo;
        },
        isRecipientOk() {
            return nameValidator(this.playerInfo.recipient);
        },
        isMobileOk() {
            return phoneValidator(this.playerInfo.mobile);
        },
        isAddressOk() {
            return !!this.playerInfo.address;
        },
        isPostcodeOk() {
            return this.playerInfo.postcode == '' || numberValidator(this.playerInfo.postcode);
        },
        isAllOk() {
            return this.isRecipientOk && this.isMobileOk && this.isAddressOk && this.isPostcodeOk;
        }
    },
    methods: {
        submit() {
            let self = this;
            this.playerInfo.recipient = this.$refs.address.getElementsByTagName('input')[0].value;
            this.playerInfo.mobile = this.$refs.address.getElementsByTagName('input')[1].value;
            this.playerInfo.address = this.$refs.address.getElementsByTagName('input')[2].value;
            this.playerInfo.postcode = this.$refs.address.getElementsByTagName('input')[3].value;
            if(this.isAllOk) {
                this.$store.dispatch('postPlayerInfo', {context: this}).then(function() {
                    let $BottomSheet = self.$closest('BottomSheet'); //todo
                    $BottomSheet.dismiss();
                    TotastBuilder.of(self).show('保存成功', 1500);
                }).catch(function(err) {
                    TotastBuilder.of(self).show('保存失败', 1500);
                });
            } else {
                if(this.playerInfo.recipient == '' || this.playerInfo.mobile == '' || this.playerInfo.address == '') {
                    TotastBuilder.of(this).show('请完善信息', 1000);
                } else if(!this.isRecipientOk) {
                    TotastBuilder.of(this).show('填写姓名有误', 1000);
                } else if(!this.isMobileOk) {
                    TotastBuilder.of(this).show('填写手机号码有误', 1000);
                }
            }    
        },
        initInputValue(index) {
            this.$nextTick(() => {
                let value = this.$refs.address.getElementsByTagName('input')[index].value;
                if(value == '' || value == null) {
                    this.floatDown(index);
                } else {
                    this.floatUp(index);
                }
            })
        },
        inputBlur(index) {
            let value = this.$refs.address.getElementsByTagName('input')[index].value;
            if(value == '' || value == null) {
                this.floatDown(index);
            } else {
                this.floatUp(index);
            }
        },
        inputFocus(index) {
            this.floatUp(index);
        },
        floatUp(index) {
            let $tips = this.$refs.address.querySelectorAll('.addresstips')[index];
            $tips.style.fontSize = '0.333333rem';
            $tips.style.fontWeight = 'normal';
            $tips.style.opacity = 0.4;
            $tips.style.top = '15%';
        },
        floatDown(index) {
            let $tips = this.$refs.address.querySelectorAll('.addresstips')[index];
            $tips.style.fontSize = '0.444444rem';
            $tips.style.fontWeight = 500;
            $tips.style.opacity = 0.2;
            $tips.style.top = '45%';
        }
    }
  }
</script>