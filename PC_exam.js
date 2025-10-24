// ==UserScript==
// @name         学习通考试作业增强
// @version      2025-06-14
// @description  详见注释
// @author       qcxs
// @match        https://mooc1.chaoxing.com/exam-ans/*
// @match        https://mooc1.chaoxing.com/mooc-ans/mooc2/work/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function () {

    const delayTime = 3000;
    const window = unsafeWindow;
    //电脑端考试
    const PC_exam = '/exam-ans/exam/test/reVersionTestStartNew';
    const PC_exam_preview = '/exam-ans/mooc2/exam/preview';
    //电脑端作业
    const PC_work = '/mooc-ans/mooc2/work/dowork';
    //手机端考试：&isphone=true&
    const android_exam = '/exam-ans/exam/test/reVersionTestStartNew';
    const android_exam_preview = '/exam-ans/exam/phone/preview';

    //填空题
    let Alleditors = getEditorS();
    window.Alleditors = Alleditors;

    function getPageType() {
        const path = window.location.pathname;

        if ((path.startsWith(android_exam) && checkIsphone())) {
            return "android";
        } else if (path.startsWith(android_exam_preview)) {
            return "android_preview";
        } else if (path.startsWith(PC_exam)) {
            return "PC";
        } else if (path.startsWith(PC_exam_preview)) {
            return "PC_preview";
        } else if (path.startsWith(PC_work)) {
            return "PC_work";
        } else {
            return "unknown";
        }

    }

    const pageType = getPageType();
    console.log(pageType)
    if (pageType == 'unknown') {
        console, log('未适配，停止运行！')
        return;
    }

    // 共用代码
    comment()

    if (pageType == 'PC' || pageType == 'PC_preview') {
        // PC代码
        PC_code()
    } else if (pageType == 'android') {
        // 安卓代码
        Android_code()
    } else if (pageType == 'PC_work') {
        // PC作业代码
        //在common()
    }


    function Android_code() {
        //关闭监控：
        window.closeMonitor()

        //允许粘贴：等待editors加载出来，延迟一会
        setTimeout(() => {
            window.editors.forEach(editor => {
                if (editor && editor.ueditor) {
                    editor.ueditor.__allListeners.beforepaste = null;
                    editor.ueditor.options.disablePasteImage = false; // 允许粘贴图片
                }
            });
            showTip('允许粘贴')
        }, delayTime)


    }

    function PC_code() {
        //隐藏其他元素，精简显示
        PC_browse();
        //自适应布局
        PC_adaption()
    }

    function comment() {
        // 这里的代码人畜无害，加了没坏处
        //恢复console.log
        recLog();
        //允许复制：
        GM_addStyle(`
        * {
                -webkit-touch-callout: default !important;
                -webkit-user-select: text !important;
                -khtml-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }`
        );

        //电脑端允许鼠标选择文字
        document.querySelector('body').onselectstart = null
        if (pageType !== 'android') {
            //未适配安卓
            Paste_Mode1()
            // Paste_Mode2()
        }

        AddSwitchExamButton()

    }

    function recLog(number) {
        if (window.console.log.toString().trim() == 'function(){}') {
            // 创建不可见iframe，
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            // 使用iframe原始的console.log
            window.console.log = function log(msg) {
                iframe.contentWindow.console.log(msg);
            }
        } else if (number > 0) {
            setTimeout(() => {
                recLog(number - 1)
            }, 500)
        } else {
            console.log('恢复log超时')
        }
    }

    // 模式一：只针对需要的进行处理
    function Paste_Mode1() {
        if (Alleditors.length <= 0) return;
        Alleditors.forEach((editor) => {
            // 编辑器就绪后执行
            editor.ready(function () {
                const arr = editor.__allListeners.beforepaste
                if (arr) {
                    editor.addListener('focus', () => {
                        // 删除影响粘贴的监听器
                        editor.__allListeners.beforepaste = null;

                        // 过滤掉editorPaste，这样保险，但手机端是匿名函数，无法过滤
                        // editor.__allListeners.beforepaste = editor.__allListeners.beforepaste.filter(
                        //     listener => listener.name !== 'editorPaste'
                        // );

                        // 1. 修改配置参数
                        editor.options.disablePasteImage = false; // 允许粘贴图片

                        // 没用上，保留
                        // 2. 重新注册图片粘贴处理器（关键步骤）
                        // editor.execCommand('registerPasteProcessor', function (root) {
                        //     // 调用 UEditor 内置的图片粘贴处理器
                        //     return UE.plugins['pasteimage'].processor.call(this, root);
                        // });
                        // // 3. 刷新编辑器
                        // editor.setContent(editor.getContent());
                    })
                }
            });
        })
        showTip('粘贴模式1')
    }
    //模式二，不破不立：重写所有编辑器，缺点：需手动恢复保存按钮，退出提示（没写），许多原有属性丢失，弊大于利
    function Paste_Mode2() {
        if (Alleditors.length <= 0) return;
        const NewEditors = [];
        Alleditors.forEach(editorOld => {
            editor.ready(function () {
                const editorId = editorOld.key
                if (editorId) {
                    const toolbars = editorOld.options.toolbars
                    const saveTip = '#save_' + editorId.match(/\d+$/)[0];
                    editorOld.destroy();
                    // 2. 重新创建编辑器，允许图片粘贴
                    const editorNew = UE.getEditor(editorId, {
                        'toolbars': toolbars,
                        'pasteplain': true, // 仍保留纯文本粘贴（但允许图片）
                        'disablePasteImage': false, // 启用图片粘贴
                    });
                    editorNew.addListener('focus', () => {
                        //保存按钮
                        window.$(saveTip).show();
                    })
                    NewEditors.push(editorNew);
                }
            });
        });
        Alleditors = NewEditors;
        showTip('粘贴模式2')
    }

// UE.instants
    function getEditorS() {
        const textareas = document.querySelectorAll('textarea');
        const editors = [];
        textareas.forEach(e => {
            // 获取已初始化的编辑器实例
            const editor = UE.getEditor(e.id);
            editors.push(editor);
        })
        return editors;
    }

    function PC_browse() {
        // 获取class为completeBtn的a标签（交卷）
        const completeBtns = document.querySelector('a.completeBtn');
        const marking_content = document.querySelector('.marking_content');


        // 创建切换按钮
        const toggleBtn = document.createElement('a');
        toggleBtn.textContent = '只看题目';
        toggleBtn.className = 'toggleBtn';

        // 将切换按钮插入到completeBtn之后
        completeBtns.parentNode.insertBefore(toggleBtn, completeBtns);

        // 为切换按钮添加点击事件
        toggleBtn.addEventListener('click', function () {
            //删除水印
            document.querySelectorAll('.mask_div').forEach(el => el.remove());
            let displayText = 'none'
            if (this.textContent == '只看题目') {
                const styleBrowse = document.createElement('style');
                styleBrowse.className = 'PC_browse'
                styleBrowse.innerHTML = `
                .FullfanyaMarking {
                    min-width: auto !important;
                }
                    
                .marking_content {
                    width: 90% !important;
                    margin: auto !important;
                    margin-left: auto !important;
                }
                `
                document.head.appendChild(styleBrowse)
            } else {
                displayText = ''
                const browse_css = document.querySelector('.PC_browse')
                if (browse_css) {
                    browse_css.remove();
                }
            }
            // 获取所有兄弟元素中的marking_content元素
            const siblings = Array.from(marking_content.parentNode.children);

            // 切换显示状态
            siblings.forEach(el => {
                el.style.display = displayText;
            });

            marking_content.style.display = ''

            // 切换按钮文本
            this.textContent = this.textContent === '只看题目' ? '显示内容' : '只看题目';
        });
    }

    function AddSwitchExamButton() {
        if (pageType.includes('preview')) return;
        let completeBtns = null
        if (pageType == 'android') {
            completeBtns = document.querySelector('.countDown');
        } else {
            // 获取class为completeBtn的a标签（交卷）
            completeBtns = document.querySelector('a.completeBtn');
        }

        // 创建切换按钮
        const toggleBtn = document.createElement('a');
        toggleBtn.textContent = '切换考试端'

        // 在目标元素后插入
        completeBtns.insertAdjacentElement('afterend', toggleBtn);

        // 为切换按钮添加点击事件
        toggleBtn.addEventListener('click', function () {
            const url = new URL(window.location.href);

            if (!checkIsphone()) {
                // 添加或更新isphone参数为true
                url.searchParams.set('isphone', 'true');
            } else {
                // 删除isphone参数（无论值是什么）
                url.searchParams.delete('isphone');
            }

            // 如果URL有变化，则跳转到新URL（触发页面刷新）
            if (url.href !== window.location.href) {
                window.location.href = url.href;
            }
        });
    }

    //success,failure,loading,notice
    function showTip(content, type = 'success') {
        //直接调用学习通已有提示
        if (pageType == 'PC' || pageType == 'PC_work' || pageType == "PC_preview") {
            window.$.toast({ type: type, content: content });
        } else if (pageType == 'android') {
            window.openWindowHint(HINT_TYPE_TIME, '', content, null, 2000);
        }
    }

    function checkIsphone() {
        const params = new URLSearchParams(window.location.search);
        return params.get('isphone') === 'true';
    }


    //自适应
    function PC_adaption() {
        // 创建媒体查询
        const mediaQuery = window.matchMedia('(max-width: 1199px)');

        // 监听媒体查询变化
        mediaQuery.addEventListener('change', handleMediaQueryChange);

        // 初始化检查
        handleMediaQueryChange(mediaQuery);

        function handleMediaQueryChange(event) {
            const browse_css = document.querySelector('.PC_browse')
            const completeBtns = document.querySelector('a.toggleBtn');
            if (event.matches && !browse_css) {
                // 屏幕宽度小于1200px，并且没有被隐藏时执行的代码
                completeBtns.click()
            } else if (!event.matches && browse_css) {
                // 屏幕宽度大于等于1200px，并且已被隐藏时执行的代码
                completeBtns.click()
            }
        }
    }


})();