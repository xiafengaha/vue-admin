/**
 * 保险公司
 * */
const insuCorps = {
    'CHINA_LIFE':'中国人寿财产保险股份有限公司',
    'CHINA_ASSETS':'中国人民财产保险股份有限公司',
    'CHINA_PINGAN':'中国平安保险股份有限公司',
}
export function generateInsuCorps(title) {
    return insuCorps[title]
}
 