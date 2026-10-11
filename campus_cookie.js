// campus_cookie.js
// 从 confong 请求头里抠 cookie2（会话本体），把整串 Cookie 复制到剪贴板。
// campus-lite 的「导入登录态」要的就是这个格式（_nk_=..; cookie2=..; ...）。

const headers = $request.headers || {};
const rawCookie = headers["Cookie"] || headers["cookie"] || "";

function pick(blob, name) {
    const m = blob.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
    return m ? m[1] : null;
}

const cookie2 = pick(rawCookie, "cookie2");

if (!cookie2) {
    // 没抓到会话，放行不打扰
    $done({});
} else {
    // confong 域上能看到的所有 cookie 拼串，campus-lite 直接用这个
    const blob = rawCookie;

    // 复制到剪贴板
    $clipboard.set(blob);

    // 弹通知（前缀 8 位方便确认是哪套会话）
    $notification.post(
        "campus-lite 会话已抓",
        "cookie2=" + cookie2.slice(0, 8) + "…",
        "已复制到剪贴板，去「我的 → 导入登录态」粘贴"
    );

    $done({});
}
