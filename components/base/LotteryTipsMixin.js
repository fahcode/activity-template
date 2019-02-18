export default {
    props: {
        $$noTimesTitle: {
            type: String,
            default: '暂无抽奖机会',
            $rule: {
                name: '暂无抽奖机会对话框标题'
            }
        },
        $$noTimesTips: {
            type: String,
            default: '请下载并打开游戏获取',
            $rule: {
                name: '暂无抽奖机会提示(仍可以下载游戏获取)'
            }
        },
        $$reallyNoTimesTitle: {
            type: String,
            default: '无抽奖机会',
            $rule: {
                name: '没有抽奖机会对话框标题'
            }
        },
        $$reallyNoTimesTips: {
            type: String,
            default: '祝游戏愉快！',
            $rule: {
                name: '没有抽奖机会提示(所有游戏已经下载或打开过)'
            }
        },
        $$loseTitle: {
            type: String,
            default: '很遗憾没中奖',
            $rule: {
                name: '未中奖对话框标题'
            }
        },
        $$loseTips: {
            type: String,
            default: '更多抽奖机会请关注魅族游戏中心活动，祝你游戏愉快！',
            $rule: {
                name: '未中奖对话框内容'
            }
        },
        $$winTitle: {
            type: String,
            default: '&nbsp;&nbsp;恭喜中奖！',
            $rule: {
                name: '中奖对话框标题'
            }
        },
        $$winMaterialTips: {
            type: String,
            default: '请填写正确的收货地址以便奖品发放',
            $rule: {
                name: '中奖领取实物提示',
            }
        },
        $$winTelchargeTips: {
            type: String,
            default: '奖品将通过短信发放，请注意填写正确的手机号码<br>若未收到请保存中奖截图并查看活动说明',
            $rule: {
                name: '中奖领取话费提示'
            }
        },
        $$winRateofflowTips: {
            type: String,
            default: '流量获奖用户将在48小时内收到短信通知<br>如未收到请保存获奖截图并查看活动说明',
            $rule: {
                name: '中奖领取流量提示'
            }
        },
        $$winCouponTips: {
            type: String,
            default: '支付时勾选优惠券即可抵现',
            $rule: {
                name: '中奖领取优惠券提示'
            }
        },
        $$winGiftTips: {
            type: String,
            default: '',
            $rule: {
                name: '中奖领取礼包提示'
            }
        },
        $$winPropTips: {
            type: String,
            default: '可每天抽奖获得，集齐3个立即兑换优惠券',
            $rule: {
                name: '中奖领取道具提示'
            }
        },
        $$winVirtualTips: {
            type: String,
            default: '奖品已通过短信发放，请注意查收<br>如未收到请保存获奖截图并查看活动说明',
            $rule: {
                name: '中奖领取虚拟奖品提示'
            }
        }
    }
}