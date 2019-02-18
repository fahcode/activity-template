export default {
    FLAG: {
        GLOBAL: 1,
        DISABLE_MOVE: 2,
        DISABLE_SIZE: 4,
        DISABLE_RESIZE: 8
    },
    CLAZZ: {
        IMAGE: 'IMAGE', //图片
        IMAGE_ARRAY: 'IMAGE_ARRAY', //图片数组
        COLOR: 'COLOR', //颜色
        SELECT: 'SELECT', //下拉
        FONT_SIZE: 'FONT_SIZE', //字体大小
        DATE: 'DATE', //日期
        DATE_TIME: 'DATE_TIME', //日期时间
        RITCH_TEXT: 'RITCH_TEXT', //富文本
        MOTION: 'MOTION', //动作
        CHECKBOX: 'CHECKBOX', //多类选择框
        TEXTAREA: 'TEXTAREA',
        VIDEO: 'VIDEO',
        ACTION: 'ACTION' //动效
    },
    MOTION: {
        OPEN_URL: 'OPEN_URL',
        SHOW_DIALOG: 'SHOW_DIALOG',
        INSTALL_APP: 'INSTALL_APP', //下载app
        INSTALL_LOGIN_APP: 'INSTALL_LOGIN_APP', //下载并登陆app
        MY_AWARD: 'MY_AWARD', //我的奖品
        RULE_TXT: 'RULE_TEXT', //活动规则
        WINNER_LIST: 'WINNER_LIST', //中奖名单
        ADDRESS: 'ADDRESS', //填写地址
        PHONE: 'PHONE', //填写手机号码
        SUBSCRIBE_APP: 'SUBSCRIBE_APP', //预约app
        GO_APP_INFO: 'GO_APP_INFO', //跳转APP详情
        GO_SUBSCRIBE_INFO:'GO_SUBSCRIBE_INFO', //跳转预约APP详情
        SEND_ISSUES: 'SEND_ISSUES' //问题反馈
    },
    INTERFACE_EVENT: {
        APP_PROGRESS: 'APP_PROGRESS',
        START_LOTTERY: 'START_LOTTERY',
        STOP_LOTTERY: 'STOP_LOTTERY',
        PAGE_HIDE: 'PAGE_HIDE',
        PAGE_SHOW: 'PAGE_SHOW',
        PAY_SUCCESS: 'PAY_SUCCESS',
        PAY_ERROR: 'PAY_ERROR',
        OAUTH_RESPONSE: 'OAUTH_RESPONSE',
        OAUTH_ERROR: 'OAUTH_ERROR',
        TOKEN_SUCCESS: 'TOKEN_SUCCESS',
        TOKEN_ERROR: 'TOKEN_ERROR',
        UPDATE_TIMES: 'UPDATE_TIMES',
        APP_INSTALLED: 'APP_INSTALLED',
        APP_DEFAULT: 'APP_DEFAULT',
        APP_DOWNLOADING: 'APP_DOWNLOADING',
        LOGIN: 'LOGIN',
        LOGOUT: 'LOGOUT'
    },
    CUSTOM_EVENT: {
        UPDATE_LANGS: 'UPDATE_LANGS'
    },
    AWARD_TYPE: {
        NOTHING: 'NOTHING', //没有中奖
        MATERIAL: 'MATERIAL', //实物
        MATERIAL100: 'MATERIAL100', //100%实物
        INTEGRATION: 'INTEGRATION', //积分
        COUPON: 'COUPON', //优惠券
        GIFT: 'GIFT', //礼包
        VOUCHER: 'VOUCHER', //消费券
        PROP: 'PROP', //道具
        PAYINTEGRATION: 'PAYINTEGRATION', //付费积分
        RATEOFFLOW: 'RATEOFFLOW', //流量
        TELCHARGE: 'TELCHARGE', //话费
        PRIZES: 'PRIZES', //奖品包
        VIRTUAL: 'VIRTUAL' //虚拟奖品
    },
    APP_STATUS: { //游戏初始化状态
        UNINSTALL: 'UNINSTALL', //未安装
        INSTALLED: 'INSTALLED', //已安装
        GOT: 'GOT', //已获取抽奖次数
        UPDATE: 'UPDATE'  //有更新
    },
    ACTION_TYPE: {
        FADE_IN: 'FadeIn',
        ZOOM_IN: 'ZoomIn',
        FLY_LEFT: 'FlyLeft',
        FLY_RIGHT: 'FlyRight',
        FLY_TOP: 'FlyTop',
        FLY_BOTTOM: 'FlyBottom',
        DROP: 'Drop',
        ZOOM_IN_BOUNCE: 'ZoomInBounce',
        ZOOM_OUT: 'ZoomOut',
        ZOOM_OUT_BOUNCE: 'ZoomOutBounce',
        ROTATE_IN: 'RotateIn',
        ROTATE_LEFT_IN: 'RotateLeftIn',
        ROTATE_RIGHT_IN: 'RotateRightIn',
        SLIDE_TOP: 'SlideTop',
        SLIDE_BOTTOM: 'SlideBottom',
        SLIDE_LEFT: 'SlideLeft',
        SLIDE_RIGHT: 'SlideRight',
        EXPAND_BOTTOM: 'ExpandBottom',
        EXPAND_TOP: 'ExpandTop',
        EXPAND_RIGHT: 'ExpandRight',
        EXPAND_LEFT: 'ExpandLeft',
        FLOAT: 'Float',
        ROTATE: 'Rotate'
    },
    ACTION_TRIGGER_TYPE: {
        DEFAULT: 1,
        SCROLL: 2, //滚动
        WINNING: 3, //中奖
        NO_WINNING: 4, //没有中奖
        //NO_LOTTERY_TIMES: 5
    },
    ACTION_FLAG: {
        X: 1,
        Y: 2,
        WIDTH: 4,
        HEIGHT: 8,
        SCALE_X: 16,
        SCALE_Y: 32,
        ALPHA: 64,
        ROTATION: 128,
        DEFAULT: -1
    }
}