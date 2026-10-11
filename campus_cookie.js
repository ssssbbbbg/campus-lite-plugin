// campus_cookie.js
// 从 confong 请求头里抠 cookie2（会话本体），把整串 Cookie 复制到剪贴板。
// campus-lite 的「导入登录态」要的就是这个格式（_nk_=..; cookie2=..; ...）。

var headers = $request.headers || {};
var rawCookie = headers["Cookie"] || headers["cookie"] || "";

function pick(blob, name) {
    var m = blob.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
    return m ? m[1] : null;
}

// ---- 复制到剪贴板：Loon / Surge / QuanX 各家的写法不一样，挨个试 ----
function copy(text) {
    try {
        if (typeof $clipboard !== "undefined") {
            if (typeof $clipboard === "object") {
                if (typeof $clipboard.setData === "function") {
                    $clipboard.setData({ "public.utf8-plain-text": text });
                    return true;
                }
                if (typeof $clipboard.set === "function") { $clipboard.set(text); return true; }
                if (typeof $clipboard.write === "function") { $clipboard.write(text); return true; }
            }
            $clipboard = text;   // QuanX 风格
            return true;
        }
    } catch (e) { console.log("copy fail: " + e); }
    return false;
}

// ---- 弹通知 ----
function notify(title, sub, body) {
    try {
        if (typeof $notification !== "undefined" && $notification.post) {
            $notification.post(title, sub, body);
            return;
        }
        if (typeof $notify !== "undefined") { $notify(title, sub, body); return; }
    } catch (e) { console.log("notify fail: " + e); }
    console.log(title + " | " + sub + " | " + body);
}

var cookie2 = pick(rawCookie, "cookie2");

if (!cookie2) {
    $done({});
} else {
    var blob = rawCookie;              // campus-lite 直接要这串
    var copied = copy(blob);

    notify(
        "campus-lite 会话已抓",
        "cookie2=" + cookie2.slice(0, 8) + "…" + (copied ? "" : "（复制失败）"),
        copied ? "已复制到剪贴板，去「我的 → 导入登录态」粘贴"
               : "去 Loon 日志里找这串 cookie，手动复制"
    );
    // 兜底：打日志，复制不了也能从日志里抠出来
    console.log("COOKIE_BLOB_START");
    console.log(blob);
    console.log("COOKIE_BLOB_END");

    $done({});
}
