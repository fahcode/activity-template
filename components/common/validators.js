export function urlValidator(value) {
    if(!val) return false;
    return /^https?:\/\//.test(value);
}

export function phoneValidator(val) {
    if(!val) return false;
    return /^\d{11}$/.test(val) && (/^(133|153|1700|177|180|181|189)[0-9]{1,}/.test(val) ||
            /^(134|135|136|137|138|139|150|151|152|157|158|159|1705|178|182|183|184|187|188|147)[0-9]{1,}/.test(val) ||
            /^(130|131|132|155|156|1709|176|185|186|145)[0-9]{1,}/.test(val))
}

export function numberValidator(val) {
    if(!val) return false;
    return /^\d+$/.test(val);
}

export function nameValidator(val) {
    if(!val) return false;
    return /^[a-zA-Z\u4e00-\u9fa5]+$/.test(val);
}