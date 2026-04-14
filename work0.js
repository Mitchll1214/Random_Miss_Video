const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>随机小姐姐视频</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #111; color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; overflow: hidden; }
        .player-container { position: relative; width: 100%; max-width: 420px; display: flex; justify-content: center; }
        .video-container { position: relative; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6); background: #000; aspect-ratio: 9/16; }
        .video-wrapper { width: 100%; height: 100%; position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        video { width: 100%; height: 100%; object-fit: contain; background: #000; }
        
        /* 悬浮控制栏样式 */
        .controls {
            position: absolute;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            padding: 8px 12px;
            background: rgba(20, 20, 20, 0.75);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            z-index: 20;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.25s ease, transform 0.25s ease;
            pointer-events: auto;
        }
        .controls.visible { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
        
        button {
            background: rgba(255,255,255,0.15);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 8px 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.2s;
            white-space: nowrap;
            user-select: none;
        }
        button:hover { background: rgba(255,255,255,0.25); }
        button:active { transform: scale(0.95); }
        .btn-active { background: #4CAF50 !important; border-color: #4CAF50 !important; }
        
        .loading { position: absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:10; transition: opacity 0.3s; }
        .spinner { width:40px; height:40px; border:3px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        /* 移动端适配 */
        @media (max-width: 480px) {
            .player-container { max-width: 100%; }
            .controls { bottom: 12px; gap: 8px; padding: 6px 10px; }
            button { padding: 6px 10px; font-size: 0.8rem; }
        }
    </style>
</head>
<body>
    <div class="player-container">
        <div class="video-container" id="videoContainer">
            <div class="loading" id="loading"><div class="spinner"></div></div>
            <div class="video-wrapper" id="videoWrapper">
                <video id="videoPlayer" playsinline preload="auto"></video>
            </div>
            <div class="controls" id="controls">
                <button id="toggleMuteBtn">🔊 开启静音</button>
                <button id="autoPlayBtn">🔁 自动连播</button>
                <button id="reloadBtn">⏭ 下一个</button>
            </div>
        </div>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const el = {
            video: document.getElementById('videoPlayer'),
            wrapper: document.getElementById('videoWrapper'),
            controls: document.getElementById('controls'),
            loading: document.getElementById('loading'),
            muteBtn: document.getElementById('toggleMuteBtn'),
            autoBtn: document.getElementById('autoPlayBtn'),
            reloadBtn: document.getElementById('reloadBtn')
        };

        const config = {
            AUTO_PLAY: false,
            MUTE_DEFAULT: true,
            API_LIST: [
                'https://v2.xxapi.cn/api/meinv?return=302',
                'https://api.jkyai.top/API/jxhssp.php',
                'https://api.jkyai.top/API/jxbssp.php',
                'https://api.yujn.cn/api/zzxjj.php?type=video'
            ]
        };

        let state = { autoPlay: config.AUTO_PLAY, controlsTimer: null, currentUrl: '', retry: 0 };

        // 工具函数
        const utils = {
            addTimestamp: (url) => url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(),
            randomApi: () => {
                const idx = Math.floor(Math.random() * config.API_LIST.length);
                return utils.addTimestamp(config.API_LIST[idx]);
            },
            safePlay: () => {
                if (!el.video.paused) return Promise.resolve();
                return el.video.play().catch(err => {
                    if (err.name === 'NotAllowedError') {
                        el.video.muted = true;
                        updateMuteBtn();
                        return el.video.play().catch(e => console.error('Play failed:', e));
                    }
                    console.error('Play error:', err);
                });
            },
            showControls: () => {
                el.controls.classList.add('visible');
                clearTimeout(state.controlsTimer);
                state.controlsTimer = setTimeout(() => el.controls.classList.remove('visible'), 3000);
            },
            hideControls: () => {
                el.controls.classList.remove('visible');
                clearTimeout(state.controlsTimer);
            }
        };

        function updateMuteBtn() {
            el.muteBtn.textContent = el.video.muted ? '🔇 取消静音' : '🔊 开启静音';
            el.muteBtn.classList.toggle('btn-active', !el.video.muted);
        }

        function loadVideo() {
            el.loading.style.opacity = '1';
            utils.hideControls();
            el.video.pause();
            el.video.src = '';
            el.video.load();
            state.retry = 0;

            const url = utils.randomApi();
            state.currentUrl = url;
            el.video.src = url;

            const onLoad = () => {
                el.loading.style.opacity = '0';
                utils.safePlay();
                el.video.removeEventListener('loadedmetadata', onLoad);
            };
            el.video.addEventListener('loadedmetadata', onLoad);
            
            el.video.onerror = () => {
                if (state.retry < 3) {
                    state.retry++;
                    setTimeout(loadVideo, 800);
                } else {
                    el.loading.style.opacity = '0';
                }
            };
        }

        // 事件绑定
        el.wrapper.addEventListener('click', (e) => {
            // 如果点击的是控制按钮，不触发播放/暂停切换
            if (e.target.closest('button')) return;
            if (el.video.paused) utils.safePlay(); else el.video.pause();
            utils.showControls();
        });

        el.wrapper.addEventListener('mousemove', utils.showControls);
        el.wrapper.addEventListener('touchstart', utils.showControls, { passive: true });

        el.muteBtn.addEventListener('click', (e) => { e.stopPropagation(); el.video.muted = !el.video.muted; updateMuteBtn(); utils.showControls(); });
        el.autoBtn.addEventListener('click', (e) => { e.stopPropagation(); state.autoPlay = !state.autoPlay; el.autoBtn.textContent = state.autoPlay ? '🔁 关闭连播' : '🔁 自动连播'; el.autoBtn.classList.toggle('btn-active', state.autoPlay); utils.showControls(); });
        el.reloadBtn.addEventListener('click', (e) => { e.stopPropagation(); loadVideo(); utils.showControls(); });

        el.video.addEventListener('ended', () => { if (state.autoPlay) loadVideo(); });
        el.video.addEventListener('play', () => utils.hideControls()); // 播放时默认隐藏，交互时再显示
        el.video.addEventListener('pause', () => utils.showControls()); // 暂停时显示

        // 初始化
        el.video.muted = config.MUTE_DEFAULT;
        updateMuteBtn();
        el.autoBtn.classList.toggle('btn-active', state.autoPlay);
        loadVideo();
    });
    </script>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(HTML_CONTENT, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
};
