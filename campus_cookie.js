// campus_cookie.js —— Loon 脚本
// 从 confong 请求头里抠 cookie2（会话本体），把整串 Cookie 存到 Loon
// 持久存储，同时弹一条通知（点通知时 Loon 会把 cookie 写进剪贴板）。
// campus-lite 的「导入登录态」要的就是这个格式（_nk_=..; cookie2=..; ...）。

var headers = $request.headers || {};
var rawCookie = headers["Cookie"] || headers["cookie"] || "";

function pick(blob, name) {
    var m = blob.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
    return m ? m[1] : null;
}

var cookie2 = pick(rawCookie, "cookie2");

if (!cookie2) {
    // 没抓到会话，放行不打扰
    $done({});
} else {
    var blob = rawCookie;

    // ① 存到 Loon 持久存储（最稳，跨会话、跨设备都能读）
    //    key: campus_cookie_blob  —— campus-lite 的「从 Loon 导入」就读这个
    try {
        $persistentStore.write(blob, "campus_cookie_blob");
    } catch (e) {
        console.log("persist fail: " + e);
    }

    // ② 弹通知：点通知时 Loon 自动把 cookie 写进剪贴板（attach.clipboard）
    try {
        $notification.post(
            "campus-lite 会话已抓",
            "cookie2=" + cookie2.slice(0, 8) + "…",
            "点这条通知复制 Cookie，去「我的 → 导入登录态」粘贴",
            { clipboard: blob }
        );
    } catch (e) {
        console.log("notify fail: " + e);
    }

    // ③ 日志兜底：复制不了也能从这里抠
    console.log("COOKIE_BLOB_START");
    console.log(blob);
    console.log("COOKIE_BLOB_END");

    $done({});
}
