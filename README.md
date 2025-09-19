# 随机小姐姐视频播放器

一个基于 Cloudflare Workers 的在线视频播放器，提供随机小姐姐视频播放功能，支持自动连播、静音控制和响应式设计。
【html 文件可以直接放本地使用】
## 功能特点

- 🎬 **随机视频播放** - 从多个API源随机获取视频内容
- 🔄 **自动连播** - 可开启自动连续播放下一个视频
- 🔇 **静音控制** - 一键开启/关闭视频声音
- 📱 **响应式设计** - 适配桌面端、平板和移动设备
- 🎯 **悬浮控制** - 播放时自动隐藏，点击屏幕显示控制按钮
- ⚡ **缓存优化** - 预加载视频，提升播放体验
- 🌍 **全球加速** - 基于 Cloudflare Workers 全球网络

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **部署平台**: Cloudflare Workers
- **视频源**: 多个第三方API
- **图标**: SVG内联图标

## 部署说明

### 1. 注册 Cloudflare 账户

如果你还没有 Cloudflare 账户，请先注册 [Cloudflare](https://www.cloudflare.com/)。

### 2. 创建 Workers

1. 登录 Cloudflare 控制台
2. 选择 "Workers & Pages" 菜单
3. 点击 "创建应用程序"
4. 选择 "创建 Worker"
5. 输入 Worker 名称（例如 `video-player`）
6. works.js文件为项目代码
7. 点击 "部署"

### 3. 配置代码

1. 在创建的 Worker 页面，点击 "编辑代码"
2. 删除默认代码
3. 将 `worker.js` 文件中的全部代码复制粘贴到编辑器中
4. 点击 "保存并部署"

### 4. 自定义域名（可选）

如果你想要使用自定义域名：

1. 在 Workers 设置中，点击 "触发器"
2. 点击 "添加自定义域"
3. 选择你的域名和路径
4. 按照提示配置DNS记录

## 使用说明

### 基本操作

- **播放/暂停** - 点击视频区域
- **显示控制** - 点击视频区域或移动鼠标
- **下一个视频** - 点击"下个视频"按钮
- **开启/关闭静音** - 点击"开启静音"按钮
- **开启/关闭自动连播** - 点击"自动连播"按钮

### 移动端操作

- **播放/暂停** - 轻触视频区域
- **显示控制** - 轻触视频区域
- **操作按钮** - 轻触对应按钮
----
## 项目结构
├── README.md              # 项目说明文档  
├── index.html             # html单文件，可以直接本地播放  
└── worker.js              # Cloudflare Workers 代码

## API 源

本项目使用以下API源获取视频内容：

- `https://v2.xxapi.cn/api/meinv?return=302`
- `https://api.jkyai.top/API/jxhssp.php`
- `https://api.jkyai.top/API/jxbssp.php`
- `https://api.jkyai.top/API/rmtmsp/api.php`
- `https://api.jkyai.top/API/qcndxl.php`
- `https://www.hhlqilongzhu.cn/api/MP4_xiaojiejie.php`

## 注意事项

1. **内容合规性** - 请确保使用的内容符合你所在地区的法律法规和Cloudflare的服务条款
2. **API稳定性** - 本项目依赖第三方API，如果API源失效，视频可能无法加载
3. **流量限制** - Cloudflare Workers 有免费额度限制，超出后可能产生费用
4. **缓存策略** - 视频缓存会占用浏览器内存，在低端设备上可能影响性能

## 自定义配置

### 修改API源

在 `worker.js` 文件中，找到 `config.API_URLS` 数组，修改或添加API源：

```javascript
const config = {
  // ...其他配置
  API_URLS: [
    'https://your-api-source.com/video',
    // 添加更多API源
  ]
};

修改界面样式
在 worker.js 文件中的 <style> 标签内修改CSS样式。

修改缓存设置
在 worker.js 文件中，找到以下配置项进行修改：

const config = {
  CACHE_SIZE: 5,        // 缓存视频数量
  CACHE_THRESHOLD: 2,   // 触发预缓存的阈值
  // ...其他配置
};

### 浏览器兼容性
Chrome 60+
Firefox 55+
Safari 11+
Edge 79+

```

### 常见问题
Q: 视频加载失败怎么办？
A: 点击"重试"按钮尝试重新加载，或者检查网络连接是否正常。

Q: 无法播放视频？
A: 确保你的浏览器支持HTML5视频播放和H.264编码。

Q: 移动端播放有问题？
A: 尝试清除浏览器缓存或使用其他浏览器。

Q: 如何添加自己的API源？
A: 在 worker.js 文件中的 config.API_URLS 数组中添加你的API源URL。

### 许可证
本项目仅用于学习目的。请遵守当地法律法规和相关平台的服务条款。

### 免责声明
本项目仅用于技术学习和研究。使用者应当遵守当地法律法规，不得用于任何违法违规用途。项目开发者不对使用者的行为承担任何责任。

