// worker.js - Cloudflare Workers 代码

// HTML 内容
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>随机小姐姐视频</title>
    <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNNzIgMTQ0SDMyYTggOCAwIDAgMSAwLTE2aDM1LjcybDEzLjYyLTIwLjQ0YTggOCAwIDAgMSAxMy4zMiAwbDI1LjM0IDM4bDkuMzQtMTRhOCA4IDAgMCAxIDYuNjQtMy41Nmg0YTggOCAwIDAgMSAwIDE2aC0xOS43MmwtMTMuNjIgMjAuNDRhOCA4IDAgMCAxLTEzLjMyIDBIODggMTI2LjQybC05LjM0IDE0QTggOCAwIDAgMSA3MiAxNDRNMTc4IDQwYy0yMC42NSAwLTM4LjczIDguODgtNTAgMjMuODlDMTE2LjczIDQ4Ljg4IDk4LjY1IDQwIDc4IDQwYTYyLjA3IDYyLjA3IDAgMCAwLTYyIDYydjIuMjVhOCA4IDAgMCAwIDE2LS41VjEwMmE0Ni4wNiA0Ni4wNiAwIDAgMSA0Ni00NmMxOS40NSAwIDM1Ljc4IDEwLjM2IDQyLjYgMjdhOCA4IDAgMCAwIDE0LjggMGM2LjgyLTE2LjY3IDIzLjE1LTI3IDQyLjYtMjdhNDYuMDYgNDYuMDYgMCAwIDEgNDYgNDZjMCA1My42MS03Ny43NiAxMDIuMTUtOTYgMTEyLjhjLTEwLjgzLTYuMzEtNDIuNjMtMjYtNjYuNjgtNTIuMjFhOCA4IDAgMSAwLTExLjggMTAuODJjMzEuMTcgMzQgNzIuOTMgNTYuNjggNzQuNjkgNTcuNjNhOCA4IDAgMCAwIDcuNTggMEMxMzYuMjEgMjI4LjY2IDI0MCAxNzIgMjQwIDEwMmE2Mi4wNyA2Mi4wNyAwIDAgMC02Mi02MiI+PC9wYXRoPjwvc3ZnPg==" type="image/svg+xml">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f07c82;
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow: hidden;
            touch-action: manipulation;
        }
        
        .player-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 1200px;
            gap: 30px;
            transform: translateY(-15px);
            position: relative;
            z-index: 10;
        }
        
        .video-container {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            background: #000;
            transition: all 0.3s ease;
            width: 518px;
            height: 920px;
        }
        
        .video-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            position: relative;
            cursor: pointer;
        }
        
        video {
            background: #000;
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .hide-controls::-webkit-media-controls {
            display: none !important;
        }
        
        .hide-controls::-webkit-media-controls-panel {
            display: none !important;
        }
        
        .hide-controls::-webkit-media-controls-play-button {
            display: none !important;
        }
        
        .hide-controls::-webkit-media-controls-start-playback-button {
            display: none !important;
        }
        
        .controls-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 15px;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
            z-index: 25;
            display: flex;
            justify-content: center;
            gap: 15px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .controls-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }
        
        .controls {
            display: flex;
            gap: 10px;
        }
        
        button {
            background-color: #d11a2d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 50px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(209, 26, 45, 0.4);
            min-width: 100px;
            position: relative;
            z-index: 20;
            user-select: none;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 18px rgba(209, 26, 45, 0.5);
            background-color: #e62e42;
        }
        
        button:active, button.active-state {
            transform: translateY(1px);
            background-color: #b01525;
            transition: background-color 0.1s ease;
        }
        
        .mute-active {
            background: linear-gradient(to right, #4CAF50, #8BC34A) !important;
        }
        
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 15;
            transition: opacity 0.3s ease;
        }
        
        .spinner {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(209, 26, 45, 0.3);
            border-radius: 50%;
            border-top-color: #d11a2d;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 15px;
        }
        
        .loading-text {
            font-size: 1.2rem;
            color: #fff;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .progress-container {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            height: 5px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            overflow: hidden;
            z-index: 15;
            display: none;
        }
        
        .progress-bar {
            height: 100%;
            width: 0%;
            background: #d11a2d;
            transition: width 0.3s ease;
        }
        
        .cache-status {
            display: none;
        }
        
        .error-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            text-align: center;
            z-index: 30;
            display: none;
        }
        
        .retry-button {
            margin-top: 10px;
            padding: 8px 16px;
            background: #d11a2d;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
        }
        
        @media (min-width: 451px) and (max-width: 1024px) {
            .video-container {
                width: 60vh;
                height: 95vh;
                max-width: 380px;
                max-height: 600px;
            }
            
            .player-container {
                gap: 20px;
            }
            
            .controls {
                gap: 8px;
            }
            
            button {
                padding: 8px 15px;
                font-size: 0.85rem;
                min-width: 90px;
            }
        }
        
        @media (max-width: 450px) {
            .player-container {
                flex-direction: column;
            }
            
            .video-container {
                width: 388px;
                height: 690px;
            }
            
            .controls-overlay {
                padding: 10px;
                gap: 8px;
            }
            
            .controls {
                gap: 6px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            button {
                padding: 8px 12px;
                font-size: 0.8rem;
                min-width: auto;
                width: 100px;
                border-radius: 8px;
            }
        }
        
        @media (max-width: 400px) {
            .video-container {
                width: 376px;
                height: 668px;
            }
            
            .controls-overlay {
                padding: 8px;
            }
            
            .controls {
                gap: 5px;
            }
            
            button {
                padding: 7px 10px;
                font-size: 0.75rem;
                border-radius: 6px;
                width: 90px;
            }
        }
    </style>
</head>
<body>
    <div class="player-container">
        <div class="video-container" id="videoContainer">
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <div class="loading-text">加载中...</div>
            </div>
            <div class="progress-container" id="progressContainer">
                <div class="progress-bar" id="progressBar"></div>
            </div>
            <div class="cache-status" id="cacheStatus"></div>
            <div class="error-message" id="errorMessage">
                <div id="errorText">加载失败，请重试</div>
                <button class="retry-button" id="retryButton">重试</button>
            </div>
            <div class="video-wrapper" id="videoWrapper">
                <video id="videoPlayer" playsinline class="hide-controls"></video>
                
                <div class="controls-overlay" id="controlsOverlay">
                    <div class="controls">
                        <button id="toggleMuteBtn">开启静音</button>
                        <button id="autoPlayBtn">自动连播</button>
                        <button id="reloadBtn">下个视频</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        (function() {
            'use strict';
            
            const elements = {
                videoPlayer: document.getElementById('videoPlayer'),
                videoContainer: document.getElementById('videoContainer'),
                videoWrapper: document.getElementById('videoWrapper'),
                controlsOverlay: document.getElementById('controlsOverlay'),
                reloadBtn: document.getElementById('reloadBtn'),
                toggleMuteBtn: document.getElementById('toggleMuteBtn'),
                autoPlayBtn: document.getElementById('autoPlayBtn'),
                loading: document.getElementById('loading'),
                progressContainer: document.getElementById('progressContainer'),
                progressBar: document.getElementById('progressBar'),
                cacheStatus: document.getElementById('cacheStatus'),
                errorMessage: document.getElementById('errorMessage'),
                errorText: document.getElementById('errorText'),
                retryButton: document.getElementById('retryButton')
            };

            const config = {
                AUTO_PLAY_DEFAULT: false,
                MUTE_DEFAULT: false,
                MAX_RETRIES: 3,
                CACHE_SIZE: 5,
                CACHE_THRESHOLD: 2,
                CONTROLS_HIDE_DELAY: 3000,
                API_URLS: [
                    'http://api.xingchenfu.xyz/API/hssp.php',
                    'http://api.xingchenfu.xyz/API/wmsc.php',
                    'http://api.xingchenfu.xyz/API/tianmei.php',
                    'http://api.xingchenfu.xyz/API/cdxl.php',
                    'http://api.xingchenfu.xyz/API/yzxl.php',
                    'http://api.xingchenfu.xyz/API/rwsp.php',
                    'http://api.xingchenfu.xyz/API/nvda.php',
                    'http://api.xingchenfu.xyz/API/bsxl.php',
                    'http://api.xingchenfu.xyz/API/zzxjj.php',
                    'http://api.xingchenfu.xyz/API/qttj.php',
                    'http://api.xingchenfu.xyz/API/xqtj.php',
                    'http://api.xingchenfu.xyz/API/sktj.php',
                    'http://api.xingchenfu.xyz/API/cossp.php',
                    'http://api.xingchenfu.xyz/API/xiaohulu.php',
                    'http://api.xingchenfu.xyz/API/manhuay.php',
                    'http://api.xingchenfu.xyz/API/bianzhuang.php',
                    'http://api.xingchenfu.xyz/API/jk.php',
                    'https://v2.xxapi.cn/api/meinv?return=302',
                    'https://api.jkyai.top/API/jxhssp.php',
                    'https://api.jkyai.top/API/jxbssp.php',
                    'https://api.jkyai.top/API/rmtmsp/api.php',
                    'https://api.jkyai.top/API/qcndxl.php',
                    'https://www.hhlqilongzhu.cn/api/MP4_xiaojiejie.php',
                    'https://v.api.aa1.cn/api/api-video-qing-chun/index.php',
                    'https://api.yujn.cn/api/zzxjj.php?type=video',
                    'https://api.linhun.pro/api/sjsp',
                    'https://api.lolimi.cn/API/xjj/api.php',
                    'https://api.caonm.net/api/video/m/',
                    'https://api.wqw.red/api/video_m.php',
                    'https://api.jrsg.top/api/video.php',
                    'https://api.btstu.cn/sjbz/api.php?lx=meizi',
                    'https://api.emoao.com/api/sp.php',
                    'https://api.kuwoai.com/api/tiktok.php',
                    'https://api.chahuo.com/api/video/girl.php'
                ]
            };

            const state = {
                autoPlayEnabled: config.AUTO_PLAY_DEFAULT,
                controlsTimeout: null,
                currentApiIndex: -1,
                retryAttempts: 0,
                retryTimer: null,
                videoCache: [],
                isCaching: false,
                controlsVisible: false,
                isOnline: navigator.onLine
            };

            const utils = {
                getTimestampUrl(url) {
                    return \`\${url}\${url.includes('?') ? '&' : '?'}t=\${Date.now()}\`;
                },
                
                debounce(func, wait) {
                    let timeout;
                    return function(...args) {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => func.apply(this, args), wait);
                    };
                },
                
                checkNetworkStatus() {
                    state.isOnline = navigator.onLine;
                    if (!state.isOnline) {
                        this.showErrorMessage('网络连接已断开，请检查网络设置');
                    }
                    return state.isOnline;
                },
                
                showErrorMessage(message) {
                    elements.errorText.textContent = message;
                    elements.errorMessage.style.display = 'block';
                    elements.loading.style.display = 'none';
                },
                
                hideErrorMessage() {
                    elements.errorMessage.style.display = 'none';
                },
                
                logError(error, context) {
                    console.error(\`[VideoPlayer Error] \${context}:\`, error);
                }
            };

            const apiService = {
                getRandomAPI() {
                    if (!utils.checkNetworkStatus()) {
                        throw new Error('网络不可用');
                    }
                    
                    if (config.API_URLS.length === 0) {
                        throw new Error('没有可用的API源');
                    }
                    
                    let newIndex;
                    do {
                        newIndex = Math.floor(Math.random() * config.API_URLS.length);
                    } while (newIndex === state.currentApiIndex && config.API_URLS.length > 1);
                    
                    state.currentApiIndex = newIndex;
                    return utils.getTimestampUrl(config.API_URLS[newIndex]);
                }
            };

            const cacheManager = {
                shouldCacheMore() {
                    return state.videoCache.length <= config.CACHE_THRESHOLD;
                },
                
                createCacheVideoElement() {
                    const video = document.createElement('video');
                    video.style.display = 'none';
                    video.preload = 'metadata';
                    video.muted = true;
                    document.body.appendChild(video);
                    return video;
                },
                
                preloadVideoToCache() {
                    if (state.videoCache.length >= config.CACHE_SIZE || state.isCaching || !this.shouldCacheMore()) {
                        return;
                    }
                    
                    if (!utils.checkNetworkStatus()) {
                        return;
                    }
                    
                    state.isCaching = true;
                    
                    const tryLoadVideo = (attempt = 0) => {
                        if (attempt >= 3) {
                            state.isCaching = false;
                            return;
                        }
                        
                        try {
                            const videoUrl = apiService.getRandomAPI();
                            const videoElement = this.createCacheVideoElement();
                            
                            const cleanup = () => {
                                if (videoElement && videoElement.parentNode) {
                                    document.body.removeChild(videoElement);
                                }
                                state.isCaching = false;
                            };
                            
                            const timeout = setTimeout(() => {
                                cleanup();
                                tryLoadVideo(attempt + 1);
                            }, 10000);
                            
                            const loadedMetadataHandler = () => {
                                clearTimeout(timeout);
                                state.videoCache.push({ url: videoUrl, element: videoElement });
                                state.isCaching = false;
                                
                                if (this.shouldCacheMore()) {
                                    setTimeout(() => this.preloadVideoToCache(), 500);
                                }
                                
                                videoElement.removeEventListener('loadedmetadata', loadedMetadataHandler);
                                videoElement.removeEventListener('error', errorHandler);
                            };
                            
                            const errorHandler = () => {
                                clearTimeout(timeout);
                                cleanup();
                                tryLoadVideo(attempt + 1);
                                videoElement.removeEventListener('loadedmetadata', loadedMetadataHandler);
                                videoElement.removeEventListener('error', errorHandler);
                            };
                            
                            videoElement.addEventListener('loadedmetadata', loadedMetadataHandler);
                            videoElement.addEventListener('error', errorHandler);
                            
                            videoElement.src = videoUrl;
                        } catch (error) {
                            utils.logError(error, '预加载视频失败');
                            state.isCaching = false;
                            tryLoadVideo(attempt + 1);
                        }
                    };
                    
                    tryLoadVideo();
                },
                
                getVideoFromCache() {
                    if (state.videoCache.length === 0) return null;
                    
                    const cachedVideo = state.videoCache.shift();
                    
                    if (this.shouldCacheMore()) {
                        setTimeout(() => this.preloadVideoToCache(), 100);
                    }
                    
                    return cachedVideo;
                },
                
                clearCache() {
                    state.videoCache.forEach(cachedVideo => {
                        if (cachedVideo.element && cachedVideo.element.parentNode) {
                            document.body.removeChild(cachedVideo.element);
                        }
                    });
                    state.videoCache = [];
                }
            };

            const videoController = {
                resizeVideoContainer() {
                    if (!elements.videoPlayer.videoWidth || !elements.videoPlayer.videoHeight) return;
                    
                    const aspectRatio = elements.videoPlayer.videoWidth / elements.videoPlayer.videoHeight;
                    const containerWidth = elements.videoContainer.offsetWidth;
                    const containerHeight = elements.videoContainer.offsetHeight;
                    const containerAspectRatio = containerWidth / containerHeight;
                    
                    let width, height;
                    
                    if (aspectRatio > containerAspectRatio) {
                        width = containerWidth;
                        height = width / aspectRatio;
                    } else {
                        height = containerHeight;
                        width = height * aspectRatio;
                    }
                    
                    elements.videoPlayer.style.width = \`\${width}px\`;
                    elements.videoPlayer.style.height = \`\${height}px\`;
                },
                
                clearRetryTimer() {
                    if (state.retryTimer) {
                        clearTimeout(state.retryTimer);
                        state.retryTimer = null;
                    }
                },
                
                showLoading() {
                    elements.loading.style.display = 'flex';
                    elements.videoPlayer.style.display = 'none';
                    utils.hideErrorMessage();
                },
                
                hideLoading() {
                    elements.loading.style.display = 'none';
                    elements.videoPlayer.style.display = 'block';
                },
                
                hideControls() {
                    elements.videoPlayer.classList.add('hide-controls');
                    elements.controlsOverlay.classList.remove('visible');
                    state.controlsVisible = false;
                },
                
                showControls() {
                    clearTimeout(state.controlsTimeout);
                    elements.videoPlayer.classList.remove('hide-controls');
                    elements.controlsOverlay.classList.add('visible');
                    state.controlsVisible = true;
                    
                    state.controlsTimeout = setTimeout(() => this.hideControls(), config.CONTROLS_HIDE_DELAY);
                },
                
                toggleControls() {
                    if (state.controlsVisible) {
                        this.hideControls();
                    } else {
                        this.showControls();
                    }
                },
                
                cleanupVideoResources() {
                    elements.videoPlayer.pause();
                    elements.videoPlayer.removeAttribute('src');
                    elements.videoPlayer.load();
                },
                
                loadVideoFromCache() {
                    if (!utils.checkNetworkStatus()) {
                        return;
                    }
                    
                    const cachedVideo = cacheManager.getVideoFromCache();
                    
                    if (cachedVideo) {
                        this.cleanupVideoResources();
                        
                        elements.videoPlayer.src = cachedVideo.url;
                        
                        if (cachedVideo.element && cachedVideo.element.parentNode) {
                            document.body.removeChild(cachedVideo.element);
                        }
                        
                        const loadedMetadataHandler = () => {
                            this.resizeVideoContainer();
                            elements.videoPlayer.play().catch(e => {
                                utils.logError(e, '视频播放失败');
                            });
                            elements.videoPlayer.removeEventListener('loadedmetadata', loadedMetadataHandler);
                        };
                        
                        const errorHandler = () => {
                            utils.logError(new Error('缓存视频加载失败'), '视频加载');
                            this.loadVideoDirect();
                            elements.videoPlayer.removeEventListener('error', errorHandler);
                        };
                        
                        elements.videoPlayer.addEventListener('loadedmetadata', loadedMetadataHandler);
                        elements.videoPlayer.addEventListener('error', errorHandler);
                    } else {
                        this.loadVideoDirect();
                    }
                },
                
                loadVideoDirect() {
                    if (!utils.checkNetworkStatus()) {
                        return;
                    }
                    
                    this.clearRetryTimer();
                    this.cleanupVideoResources();
                    this.showLoading();
                    
                    try {
                        const selectedAPI = apiService.getRandomAPI();
                        elements.videoPlayer.src = selectedAPI;
                        elements.videoPlayer.loop = !state.autoPlayEnabled;
                        
                        const loadedMetadataHandler = () => {
                            this.resizeVideoContainer();
                            elements.videoPlayer.play().catch(e => {
                                utils.logError(e, '视频播放失败');
                            });
                            this.hideLoading();
                            elements.videoPlayer.removeEventListener('loadedmetadata', loadedMetadataHandler);
                        };
                        
                        elements.videoPlayer.addEventListener('loadedmetadata', loadedMetadataHandler);
                    } catch (error) {
                        utils.logError(error, '获取视频URL失败');
                        utils.showErrorMessage('获取视频失败，请重试');
                    }
                },
                
                handleVideoError() {
                    state.retryAttempts++;
                    
                    if (state.retryAttempts <= config.MAX_RETRIES) {
                        state.retryTimer = setTimeout(() => {
                            this.loadVideoFromCache();
                        }, 1000);
                    } else {
                        state.retryAttempts = 0;
                        utils.showErrorMessage('视频加载失败，请点击重试');
                    }
                }
            };

            const eventHandlers = {
                addButtonFeedback(button) {
                    button.classList.add('active-state');
                    setTimeout(() => {
                        button.classList.remove('active-state');
                    }, 200);
                },
                
                addTouchListeners() {
                    const buttons = document.querySelectorAll('button');
                    
                    buttons.forEach(button => {
                        button.addEventListener('touchstart', function(e) {
                            e.stopPropagation();
                            this.classList.add('active-state');
                        }, { passive: true });
                        
                        button.addEventListener('touchend', function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                            this.classList.remove('active-state');
                            this.click();
                        }, { passive: false });
                        
                        button.addEventListener('touchcancel', function() {
                            this.classList.remove('active-state');
                        });
                    });
                },
                
                bindEvents() {
                    elements.videoPlayer.addEventListener('loadedmetadata', () => {
                        videoController.resizeVideoContainer();
                        videoController.hideLoading();
                        state.retryAttempts = 0;
                        
                        elements.videoPlayer.play().catch(e => {
                            utils.logError(e, '自动播放失败');
                        });
                    });
                    
                    elements.videoPlayer.addEventListener('play', () => {
                        videoController.hideControls();
                    });
                    
                    elements.videoPlayer.addEventListener('pause', () => {
                        videoController.showControls();
                    });
                    
                    elements.videoPlayer.addEventListener('ended', () => {
                        if (state.autoPlayEnabled) {
                            videoController.loadVideoFromCache();
                        } else {
                            videoController.showControls();
                        }
                    });
                    
                    elements.videoWrapper.addEventListener('click', (e) => {
                        if (e.target.tagName === 'BUTTON') return;
                        
                        if (elements.videoPlayer.paused) {
                            elements.videoPlayer.play().catch(e => {
                                utils.logError(e, '视频播放失败');
                            });
                        } else {
                            elements.videoPlayer.pause();
                        }
                        videoController.showControls();
                    });
                    
                    elements.videoWrapper.addEventListener('mousemove', () => {
                        if (!elements.videoPlayer.paused) {
                            videoController.showControls();
                        }
                    });
                    
                    elements.reloadBtn.addEventListener('click', () => {
                        this.addButtonFeedback(elements.reloadBtn);
                        videoController.loadVideoFromCache();
                    });
                    
                    elements.autoPlayBtn.addEventListener('click', () => {
                        this.addButtonFeedback(elements.autoPlayBtn);
                        state.autoPlayEnabled = !state.autoPlayEnabled;
                        elements.autoPlayBtn.textContent = state.autoPlayEnabled ? '关闭连播' : '自动连播';
                        elements.autoPlayBtn.style.background = state.autoPlayEnabled 
                            ? 'linear-gradient(to right, #4CAF50, #8BC34A)' 
                            : '#d11a2d';
                        
                        elements.videoPlayer.loop = !state.autoPlayEnabled;
                    });
                    
                    elements.toggleMuteBtn.addEventListener('click', () => {
                        this.addButtonFeedback(elements.toggleMuteBtn);
                        elements.videoPlayer.muted = !elements.videoPlayer.muted;
                        elements.toggleMuteBtn.textContent = elements.videoPlayer.muted ? '取消静音' : '开启静音';
                        
                        if (elements.videoPlayer.muted) {
                            elements.toggleMuteBtn.classList.add('mute-active');
                        } else {
                            elements.toggleMuteBtn.classList.remove('mute-active');
                        }
                    });
                    
                    elements.retryButton.addEventListener('click', () => {
                        this.addButtonFeedback(elements.retryButton);
                        state.retryAttempts = 0;
                        videoController.loadVideoFromCache();
                    });
                    
                    elements.videoPlayer.addEventListener('error', () => {
                        videoController.handleVideoError();
                    });
                    
                    window.addEventListener('resize', utils.debounce(() => {
                        videoController.resizeVideoContainer();
                    }, 100));
                    
                    window.addEventListener('online', () => {
                        state.isOnline = true;
                        utils.hideErrorMessage();
                        if (elements.videoPlayer.error) {
                            videoController.loadVideoFromCache();
                        }
                    });
                    
                    window.addEventListener('offline', () => {
                        state.isOnline = false;
                        utils.showErrorMessage('网络连接已断开');
                    });
                    
                    document.addEventListener('visibilitychange', () => {
                        if (document.hidden) {
                            elements.videoPlayer.pause();
                        } else if (state.autoPlayEnabled && elements.videoPlayer.paused) {
                            elements.videoPlayer.play().catch(e => {
                                utils.logError(e, '恢复播放失败');
                            });
                        }
                    });
                    
                    if ('ontouchstart' in window) {
                        const buttons = document.querySelectorAll('button');
                        buttons.forEach(btn => {
                            btn.addEventListener('touchstart', function() {
                                this.style.opacity = '0.8';
                            });
                            
                            btn.addEventListener('touchend', function() {
                                this.style.opacity = '1';
                            });
                        });
                    }
                }
            };

            function init() {
                elements.videoPlayer.controls = false;
                elements.videoPlayer.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');
                
                elements.autoPlayBtn.textContent = state.autoPlayEnabled ? '关闭连播' : '自动连播';
                elements.autoPlayBtn.style.background = state.autoPlayEnabled 
                    ? 'linear-gradient(to right, #4CAF50, #8BC34A)' 
                    : '#d11a2d';
                elements.videoPlayer.muted = config.MUTE_DEFAULT;
                elements.toggleMuteBtn.textContent = elements.videoPlayer.muted ? '取消静音' : '开启静音';
                if (elements.videoPlayer.muted) {
                    elements.toggleMuteBtn.classList.add('mute-active');
                }
                
                videoController.loadVideoFromCache();
                
                for (let i = 0; i < config.CACHE_SIZE; i++) {
                    setTimeout(() => cacheManager.preloadVideoToCache(), i * 300);
                }
                
                eventHandlers.bindEvents();
                
                setTimeout(() => videoController.hideControls(), 100);
                
                const checkCompatibility = () => {
                    const video = document.createElement('video');
                    if (!video.canPlayType) {
                        utils.showErrorMessage('您的浏览器不支持HTML5视频播放');
                        return false;
                    }
                    
                    if (!video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
                        utils.showErrorMessage('您的浏览器不支持H.264视频编码');
                        return false;
                    }
                    
                    return true;
                };
                
                if (!checkCompatibility()) {
                    document.querySelectorAll('button').forEach(btn => {
                        btn.disabled = true;
                    });
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        })();
    </script>
</body>
</html>`;

// Cloudflare Workers 事件处理
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return handleOptions();
  }
  
  // 只处理 GET 请求
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  
  // 返回 HTML 内容
  return new Response(HTML_CONTENT, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  });
}

// 处理 OPTIONS 请求
function handleOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
