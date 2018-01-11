import store from '../store/index.js'
let language = store.getState().getIn(['pageUI', 'language']);
let regZH = /zh/i,
    regEN = /en/i;
if(regZH.test(language)){
    module.exports = {
        ERROR1000: '服务器开了个小差',
        ERROR1001: 'token解析失败',
        ERROR1002: '用户已存在',
        ERROR1003: '用户不存在',
        ERROR1004: '密码错误',
        ERROR1005: '房间不存在',
        ERROR1006: '文件类型错误',
        ERROR1007: '文件过大',
        ERROR1008: '文件读取失败',
        ERROR1008: '文件上传失败',
        ERROR1010: '超出限制，用户最多能创建3个房间',
        ERROR1011: '成功创建房间',
        ERROR1012: '该房间已存在',
        ERROR1013: '权限不足',
        ERROR1014: '昵称被占用',
        ERROR1015: '账号在其他设备登陆!!!',
        ERROR1016: '撤回失败，超出两分钟',

        email: '邮箱',
        nickname: '昵称',
        password: '密码',
        Login: '登陆',s
        SignUp: '注册',

    }
}