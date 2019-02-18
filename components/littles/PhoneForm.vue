<style lang="less">
    .phone-form {
        position: relative;
        width: 100%;
        top: 0.166667rem;
        overflow: hidden;
        &__number {
            position: relative;
            display: inline-block;
            width: 100%;
            outline: 0;
            border: 0;
            background: transparent;
            padding-bottom: 0.333333rem;
            border-bottom: 1.2px solid #d07235;
            font-size: 0.444444rem;
            color: inherit;
            &::-webkit-input-placeholder{
                color: inherit;
                opacity: 0.5;
            }
        }
        &__tips {
            margin-top: 0.166667rem;
            font-size: 0.388889rem;
            color: #fba013;
        }
    }
</style>
<template>
    <div class="phone-form"> 
        <input class="phone-form__number" v-bind:style="{'border-bottom-color': inputBorderColor}" v-model="$store.state.chargePhoneNumber" type="tel" maxlength="11" placeholder="请输入领取奖品的手机号码" autocomplete="off" v-on:keyup="checkPhoneNum">
        <p class="phone-form__tips" v-bind:style="{visibility: (!isSetErr) ? 'hidden' : 'visible', 'color': tipsColor}">{{ errMsg }}</p>
    </div>
</template>
<script>
    import Enum from '../common/enum';
    import { phoneValidator } from '../common/validators';
    const defaultErrMsg = '手机号码有误，请重新输入';
    export default {
        name: 'PhoneForm',
        props: {
            type: {
                type: String,
                default: Enum.AWARD_TYPE.TELCHARGE
            },
            inputBorderColor: {
                type: String,
                default: '#00f',
                $rule: {
                    name: '输入框底边颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            },
            tipsColor: {
                type: String,
                default: '#fba013',
                $rule: {
                    name: '提示文字颜色',
                    clazz: Enum.CLAZZ.COLOR
                }
            }
        },
        data() {
            return {
                errMsg: defaultErrMsg,
                isSetErr: false
            }
        },
        computed: {
            isValid() {
                return phoneValidator(this.$store.state.chargePhoneNumber) || !this.$store.state.chargePhoneNumber;
            },
            isError() {
                return !phoneValidator(this.$store.state.chargePhoneNumber)
            }
        }, 
        watch: {
            // isError: {
            //     handler(newVal) {
            //         //this.$nextTick(()=> { //why
            //             //this.$dispatch('Dialog', 'DISABLED', [!newVal]);
            //             let $Dialog = this.$closest('Dialog');
            //             if($Dialog) {
            //                 $Dialog.setDisabled(newVal);
            //             }
            //             if(newVal) {
            //                 this.isSetErr = false;
            //                 this.errMsg = defaultErrMsg;
            //             }
            //         //});
            //     },
            //     immediate: true
            // }
        },
        methods: {
            setErrMsg(errMsg) {
                this.isSetErr = true;
                this.errMsg = errMsg;
            },
            checkPhoneNum() { //todo
                let val = this.$store.state.chargePhoneNumber;
                let $Dialog = this.$closest('Dialog');
                if(/^\d{11}$/.test(val)) {
                    $Dialog.setDisabled(false);
                } else {
                    $Dialog.setDisabled(true);
                    this.isSetErr = false;
                };
            }
        }
    }
</script>