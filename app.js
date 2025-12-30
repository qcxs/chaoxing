class ToolClass {
    //showTip
    static tipTimeOut
    static TipElement;

    static print(text, callback, title) {
        if (typeof text === 'object') text = JSON.stringify(text)
        // HTML转义函数
        function escapeHtml(unsafe) {
            return unsafe ? unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") : '';
        }

        // 创建遮罩层
        const mask = document.createElement('div');
        mask.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10002';
        mask.onclick = () => mask.remove();

        // 判断是否为输入模式（有回调）
        const isInputMode = typeof callback === 'function';

        // 构建弹窗HTML（动态切换按钮和内容区域）
        mask.innerHTML = `
<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.15);z-index:10000;width:80%;max-height:70%;min-height:200px;box-sizing:border-box;display:flex;flex-direction:column;">
  <span style="position:absolute;top:10px;right:15px;font-size:18px;cursor:pointer;color:#999" onclick="this.closest('div').parentNode.remove()">×</span>
  <label style="display:block;margin:10px 0 8px;font-size:16px;font-weight:bold;color:#333">${title ? title : '查看或复制：'}</label>
  <div id="contentArea" style="overflow-y:auto;min-height:80px;white-space:pre-wrap;word-wrap:break-word;flex:1;${isInputMode ? 'user-modify: read-write; -webkit-user-modify: read-write; outline: none; cursor: text;' : ''}">${escapeHtml(text)}</div>
  <div style="margin-top:10px;text-align:right;">
    <button style="padding:5px 10px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer;margin-right:5px" onclick="this.closest('div').parentNode.parentNode.remove()">取消</button>
    <button id="actionBtn" style="padding:5px 10px;border:1px solid #ccc;border-radius:4px;background:#fff;cursor:pointer">${isInputMode ? '确定' : '复制'}</button>
  </div>
</div>
`;
        document.body.appendChild(mask);

        // 获取核心元素
        const contentArea = mask.querySelector('#contentArea');
        const actionBtn = mask.querySelector('#actionBtn');

        // 阻止弹窗内部点击冒泡
        mask.querySelector('div').addEventListener('click', e => e.stopPropagation());
        actionBtn.addEventListener('click', () => {
            // 绑定按钮事件
            if (isInputMode) {
                // 输入模式：确定按钮
                const result = contentArea.textContent;
                callback(result); // 执行回调并传入内容
            } else {
                ToolClass.copy(text);
            }
            mask.remove();
        });

    }

    static showTip(text) {
        clearTimeout(this.tipTimeOut);
        if (!this.TipElement) {
            this.TipElement = document.createElement('div')
            this.TipElement.style.cssText = 'position:fixed;top:30px;right:20px;color:white;padding:10px;background:#888;border-radius:4px;z-index:10001'

            document.body.appendChild(this.TipElement);
            this.TipElement.addEventListener("click", (e) => {
                e.stopPropagation()
                window.AdvancedWebTool.showItemsMenu();
                this.TipElement.style.display = 'none'
            });
        }

        this.TipElement.textContent = text;
        this.tipTimeOut = setTimeout(() => this.TipElement.style.display = 'none', 2000);
        this.TipElement.style.display = 'block'

    }

    static copy(text) {
        // 创建临时文本框
        const textarea = document.createElement('textarea');

        // 隐藏文本框（不影响页面布局）
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.readOnly = true; // 防止编辑

        // 处理文本（替换非换行空格）
        text = text.replace(/\xA0/g, ' ');
        textarea.value = text;

        // 添加到页面并选中内容
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, text.length); // 兼容移动设备

        try {
            // 执行复制命令
            document.execCommand('copy');
        } catch (e) {
            console.log('无法复制：' + e)
        }
        // 清理临时元素
        document.body.removeChild(textarea);
    }

    static getElementSelectedText(element) {
        // 检查传入的是否为有效的DOM元素
        if (!(element instanceof HTMLElement)) {
            console.error('请传入有效的DOM元素');
            return '';
        }

        // 创建选中文本的范围对象
        const selection = window.getSelection();
        const range = document.createRange();

        // 选中目标元素内的所有内容
        range.selectNodeContents(element);
        selection.removeAllRanges(); // 清除已有选中
        selection.addRange(range);   // 应用新的选中范围

        // 将选中的内容转为字符串
        const selectedText = selection.toString();

        // 取消选中状态
        selection.removeAllRanges();
        return selectedText;
    }

    static recConsoleLog() {
        if (window.console.log.toString().trim() == 'function(){}') {
            // 创建不可见iframe，
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            // 使用iframe原始的console.log
            window.console.log = iframe.contentWindow.console.log
            console.log('恢复log成功')
        }
    }

    static loadScript(src, callback) {
        // 解析并清理URL（去除参数部分）
        function cleanUrl(url) {
            try {
                const parsedUrl = new URL(url);
                parsedUrl.search = ''; // 清除查询参数
                return parsedUrl.toString();
            } catch (e) {
                // 处理相对路径等无法被URL构造函数解析的情况
                const queryIndex = url.indexOf('?');
                return queryIndex > -1 ? url.slice(0, queryIndex) : url;
            }
        }

        const cleanedSrc = cleanUrl(src);

        // 检查页面中是否已存在相同的脚本（忽略参数）
        const existingScripts = document.getElementsByTagName('script');
        for (let i = 0; i < existingScripts.length; i++) {
            const scriptSrc = existingScripts[i].src;
            if (scriptSrc && cleanUrl(scriptSrc) === cleanedSrc) {
                // 脚本已存在，直接返回         
                return;
            }
        }

        // 不存在则创建新脚本标签
        const script = document.createElement('script');
        script.src = src; // 使用原始src（保留参数）
        script.type = 'text/javascript';

        // 加载成功回调
        script.onload = function () {
            if (typeof callback === 'function') {
                callback();
            }
        };

        // 加载失败处理
        script.onerror = function () {
            console.error(`Failed to load script: ${src}`);
        };

        // 添加到页面
        document.head.appendChild(script);
    }

    static loadUrl() {
        this.print(window.location.href, (url) => {
            if (url.trim() && window.location.href !== url) {
                window.location.href = url;
            }
        }, '请输入url：')
    }
}

class ExamProcessor {
    constructor() {
        this.examData = []; // 存储解析后的试卷数据（仅含选择、判断题）
    }

    /**
     * 解析当前页面的选择题和判断题
     * 提取题目ID、题型、题目内容、选项内容、已选选项内容
     */
    parseExam() {
        // 获取所有题目容器
        const questionContainers = document.querySelectorAll('.allAnswerList.questionWrap');
        if (questionContainers.length === 0) {
            console.log('未找到题目容器');
            return [];
        }

        this.examData = []; // 清空原有数据
        // 遍历每个题目容器
        Array.from(questionContainers).forEach(container => {
            // 提取题目唯一ID（data值）
            const questionId = container.getAttribute('data') || 'unknown_id';

            // 提取题型
            const typeInput = container.querySelector('input[name^="typeName"]');
            const questionType = typeInput ? typeInput.value : '未知题型';

            // 只处理选择题和判断题
            if (!['单选题', '多选题', '判断题'].includes(questionType)) {
                return;
            }

            // 提取题目内容
            const titleElem = container.querySelector('.tit');
            let questionContent = '';
            if (titleElem) {
                const contentElem = titleElem.querySelector('p') || titleElem;
                questionContent = contentElem.textContent.replace(/(\d+)\./, '').trim();
            }

            // 初始化题目数据对象
            const question = {
                questionId,
                questionType,
                questionContent,
                options: [], // 选项内容列表（无序号）
                selectedContents: [] // 已选选项内容（无序号）
            };

            // 解析选项和已选状态
            this.parseChoiceQuestion(container, question);
            this.examData.push(question);
        });

        return this.examData;
    }

    /**
     * 解析选择题/判断题的选项和已选内容
     * @param {HTMLElement} container - 题目容器元素
     * @param {Object} question - 题目数据对象
     */
    parseChoiceQuestion(container, question) {
        const optionElems = container.querySelectorAll('.answerList');
        optionElems.forEach(option => {
            // 提取选项内容
            const content = option.querySelector('.answerInfo')?.textContent.trim() || '';
            question.options.push(content);

            // 记录已选选项内容（通过class="on"判断）
            if (option.classList.contains('on')) {
                question.selectedContents.push(content);
            }
        });
    }

    /**
     * 导出解析后的选择题和判断题数据为JSON字符串
     * 可直接保存使用
     */
    exportJson() {
        //解析当前页面，确保最新
        this.parseExam();
        return JSON.stringify(this.examData);
    }

    /**
     * 导入JSON数据并恢复选择题和判断题的答案
     * 基于题目ID匹配，并选中
     * @param {string} jsonStr - 导出的JSON字符串
     */
    importJson(jsonStr) {
        try {
            const importedData = JSON.parse(jsonStr);
            if (!Array.isArray(importedData)) {
                console.error('导入数据格式错误，应为数组');
                return;
            }

            // 构建ID到数据的映射，提高匹配效率
            const idToDataMap = new Map();
            importedData.forEach(item => {
                if (item.questionId) {
                    idToDataMap.set(item.questionId, item);
                }
            });

            // 遍历当前页面题目，通过ID匹配恢复答案
            const currentContainers = document.querySelectorAll('.allAnswerList.questionWrap');
            currentContainers.forEach(container => {
                const questionId = container.getAttribute('data');
                if (!questionId) return;

                // 通过ID查找导入的数据
                const matchedItem = idToDataMap.get(questionId);
                if (!matchedItem) return;

                // 只处理选择、判断题
                if (['单选题', '多选题', '判断题'].includes(matchedItem.questionType)) {
                    this.restoreChoiceAnswer(container, matchedItem);
                }
            });

            console.log('选择题/判断题答案恢复完成');
        } catch (e) {
            console.error('导入失败：', e);
        }
    }

    /**
     * 优化：通过字符串导入答案（空格分隔选项，自动跳过非选择/判断题）
     * @param {string} answerStr - 选项字符串，如"A B AB A"（仅用于选择/判断题）
     */
    importAnswersByString(answerStr) {
        // 1. 预处理输入字符串（分割并过滤空值）
        const answerList = answerStr.split(/\s+/).filter(answer => answer.trim() !== '');
        if (answerList.length === 0) {
            console.error('输入字符串格式错误，未找到有效选项');
            return;
        }

        // 2. 获取当前页面所有题目容器（按顺序）
        const allContainers = document.querySelectorAll('.allAnswerList.questionWrap');
        if (allContainers.length === 0) {
            console.error('未找到题目容器');
            return;
        }

        // 3. 遍历所有题目，仅为选择/判断题匹配答案（跳过其他题型）
        let answerIndex = 0; // 跟踪当前待匹配的选项索引（非选择/判断题不消耗索引）
        Array.from(allContainers).forEach((container, containerIndex) => {
            // 提取当前题目题型
            const typeInput = container.querySelector('input[name^="typeName"]');
            const questionType = typeInput ? typeInput.value : '';

            // 跳过非选择/判断题（不消耗选项，继续向后匹配）
            if (!['单选题', '多选题', '判断题'].includes(questionType)) {
                console.log(`第${containerIndex + 1}题（${questionType}）不是选择/判断题，跳过`);
                return;
            }

            // 若选项已用完，停止匹配
            if (answerIndex >= answerList.length) {
                console.log(`选项已用完，剩余题目（从第${containerIndex + 1}题开始）未匹配`);
                return;
            }

            // 为当前选择/判断题匹配答案
            console.log(`为第${containerIndex + 1}题（${questionType}）匹配选项：${answerList[answerIndex]}`);
            const matchedItem = {
                selectedContents: this._parseAnswerToContents(container, answerList[answerIndex])
            };
            this.restoreChoiceAnswer(container, matchedItem);

            // 仅在匹配成功后，才推进选项索引（确保非选择/判断题不占用选项）
            answerIndex++;
        });

        // 最终校验：选项是否全部匹配
        if (answerIndex < answerList.length) {
            console.warn(`尚有${answerList.length - answerIndex}个选项未匹配（可能题目数量不足或类型不匹配）`);
        } else {
            console.log(`已完成所有${answerIndex}个选项的匹配`);
        }
    }

    /**
     * 辅助方法：将选项字符串（如"A"、"AB"）转换为对应的选项内容数组
     * @param {HTMLElement} container - 题目容器
     * @param {string} answerCode - 选项编码（如"A"、"AB"）
     * @returns {string[]} 选项内容数组
     */
    _parseAnswerToContents(container, answerCode) {
        const optionElems = container.querySelectorAll('.answerList');
        const contents = [];

        optionElems.forEach((option, optIndex) => {
            const optionCode = String.fromCharCode(65 + optIndex); // A、B、C...
            if (answerCode.includes(optionCode)) {
                const content = option.querySelector('.answerInfo')?.textContent.trim() || '';
                contents.push(content);
            }
        });

        return contents;
    }

    //    恢复选择题/判断题答案，直接触发tap事件
    restoreChoiceAnswer(container, matchedItem) {
        // 1. 取消所有已选状态：找到已选中的选项，直接触发tap
        container.querySelectorAll('.answerList.on').forEach(option => {
            $(option).trigger('tap'); // 用jQuery触发tap，自动执行原绑定逻辑
        });

        // 2. 选中匹配的选项：遍历选项，匹配内容后触发tap
        container.querySelectorAll('.answerList').forEach(option => {
            const optionContent = option.querySelector('.answerInfo')?.textContent.trim() || '';
            if (matchedItem.selectedContents.includes(optionContent)) {
                $(option).trigger('tap'); // 同样触发tap，无需手动构造触摸事件
            }
        });
    }
}

class InClassExerciseProcessor {
    constructor() {
        this.examData = []; // 存储解析后的数据（仅含选项值相关信息）
    }

    /**
     * 解析当前页面所有题目（适配配合三种场景）
     * 仅关注选项值、我的答案值、正确答案值
     */
    parseExam() {
        this.examData = [];
        // 1. 优先查找答题中场景容器（.answer-item）
        let questionContainers = document.querySelectorAll('.answer-item');

        // 2. 未找到则查找已答题场景容器（.van-swipe__track下的.quiz-item）
        if (questionContainers.length === 0) {
            const swipeTrack = document.querySelector('.van-swipe__track');
            if (swipeTrack) {
                questionContainers = swipeTrack.querySelectorAll('.quiz-item');
            }
        }

        if (questionContainers.length === 0) {
            console.log('未找到题目容器');
            return [];
        }

        // 3. 遍历容器解析题目
        Array.from(questionContainers).forEach((container, index) => {
            const isAnswering = container.classList.contains('answer-item'); // 答题中标识
            const isAnswered = container.classList.contains('quiz-item'); // 已答题标识

            // 提取题型并过滤非选择/判断题
            const questionType = this._getQuestionType(container, isAnswering);
            if (!['单选题', '多选题', '判断题'].includes(questionType)) return;

            // 生成唯一题目ID（基于序号和题型）
            const questionId = `exam_question_${index + 1}_${questionType}`;

            // 初始化题目数据（仅包含选项值、我的答案值、正确答案值）
            const question = {
                questionId,
                questionType,
                questionContent: this._getQuestionContent(container, isAnswering),
                options: this._getOptionValues(container, isAnswering), // 选项值列表（纯内容）
                myAnswerValues: [], // 我的答案值（与选项值完全匹配）
                correctAnswerValues: [] // 正确答案值（与选项值完全匹配）
            };

            // 按场景提取答案值
            if (isAnswering) {
                // 答题中：提取当前选中的选项值
                question.myAnswerValues = this._parseAnsweringValues(container);
            } else if (isAnswered) {
                // 已答题：提取我的答案值和正确答案值
                const { myValues, correctValues } = this._parseAnsweredValues(container, question.options);
                question.myAnswerValues = myValues;
                question.correctAnswerValues = correctValues;
            }

            this.examData.push(question);
        });

        return this.examData;
    }
    /**
         * 改进版：通过字符串导入答案（支持选项名A/B/C或选项值文本，空格分隔）
         * @param {string} answerStr - 答案字符串，如"A BCD 对"（支持混合输入）
         */
    importAnswersByString(answerStr) {
        // 1. 预处理输入：按空格分割并过滤空值
        const answerList = answerStr.split(/\s+/).filter(answer => answer.trim() !== '');
        if (answerList.length === 0) {
            console.error('输入字符串格式错误，未找到有效答案');
            return;
        }

        // 2. 获取当前页面题目容器
        let questionContainers = document.querySelectorAll('.answer-item');
        if (questionContainers.length === 0) {
            const swipeTrack = document.querySelector('.van-swipe__track');
            if (swipeTrack) {
                questionContainers = swipeTrack.querySelectorAll('.quiz-item');
            }
        }

        if (questionContainers.length === 0) {
            console.error('未找到题目容器，无法导入答案');
            return;
        }

        // 3. 遍历题目匹配答案（按顺序，仅处理选择/判断题）
        let answerIndex = 0;
        Array.from(questionContainers).forEach((container, containerIndex) => {
            const isAnswering = container.classList.contains('answer-item');
            const questionType = this._getQuestionType(container, isAnswering);

            // 跳过非选择/判断题
            if (!['单选题', '多选题', '判断题'].includes(questionType)) {
                console.log(`第${containerIndex + 1}题（${questionType}）不是选择/判断题，跳过`);
                return;
            }

            // 答案已用完则停止
            if (answerIndex >= answerList.length) {
                console.log(`答案已用完，剩余题目（从第${containerIndex + 1}题开始）未匹配`);
                return;
            }

            // 4. 提取当前题目选项（含选项名与选项值的映射关系）
            const { options, codeToValueMap } = this._getOptionsWithCodeMap(container, isAnswering);
            if (options.length === 0) {
                console.log(`第${containerIndex + 1}题未找到有效选项，跳过`);
                return;
            }

            // 5. 解析当前答案（支持选项名或选项值）
            const currentAnswer = answerList[answerIndex];
            const targetValues = this._parseAnswerToValues(currentAnswer, options, codeToValueMap, questionType);

            if (targetValues.length > 0) {
                console.log(`为第${containerIndex + 1}题（${questionType}）匹配答案：${currentAnswer}`);
                this._restoreAnswerByValues(container, isAnswering, targetValues);
                answerIndex++; // 匹配成功才推进索引
            } else {
                console.log(`第${containerIndex + 1}题未找到与"${currentAnswer}"匹配的选项，跳过`);
            }
        });

        // 6. 匹配结果校验
        if (answerIndex < answerList.length) {
            console.warn(`尚有${answerList.length - answerIndex}个答案未匹配`);
        } else {
            console.log(`已完成所有${answerIndex}个答案的匹配`);
        }
    }

    /**
     * 辅助方法：提取选项及选项名到选项值的映射（A→选项值，B→选项值等）
     * @param {HTMLElement} container - 题目容器
     * @param {boolean} isAnswering - 是否为答题中场景
     * @returns {Object} { options: 选项值列表, codeToValueMap: 选项名到选项值的映射 }
     */
    _getOptionsWithCodeMap(container, isAnswering) {
        const options = [];
        const codeToValueMap = new Map(); // 存储A→选项值，B→选项值的映射
        const optionElems = container.querySelectorAll('.quiz-options .option-item');

        Array.from(optionElems).forEach((option, index) => {
            // 提取选项值（纯内容）
            let value = '';
            const contentBox = option.querySelector('.html-content-box');
            if (contentBox) {
                value = contentBox.textContent.trim();
            } else {
                const fullText = option.textContent.trim();
                value = fullText.replace(/^[A-Z]\./, '').trim(); // 去除选项名前缀
            }
            if (value) options.push(value);

            // 提取选项名（A/B/C等）并建立映射
            let code = '';
            if (isAnswering) {
                // 答题中场景：从.option-name提取（如<span class="option-name">A</span>）
                const codeElem = option.querySelector('.option-name');
                code = codeElem ? codeElem.textContent.trim() : '';
            } else {
                // 已答题场景：从选项文本开头提取（如"A.创业知识"中的A）
                const fullText = option.textContent.trim();
                const codeMatch = fullText.match(/^([A-Z])\./);
                code = codeMatch ? codeMatch[1] : '';
            }

            // 若未提取到选项名，按顺序自动补全（A、B、C...）
            if (!code && index < 26) {
                code = String.fromCharCode('A'.charCodeAt(0) + index);
            }

            if (code && value) {
                codeToValueMap.set(code, value);
            }
        });

        return { options, codeToValueMap };
    }

    /**
     * 辅助方法：将答案字符串（选项名或选项值）转换为匹配的选项值
     * @param {string} answer - 单个答案（如"A"、"BCD"、"创业精神"、"对"）
     * @param {Array} options - 选项值列表
     * @param {Map} codeToValueMap - 选项名到选项值的映射
     * @param {string} questionType - 题型
     * @returns {Array} 匹配到的选项值列表
     */
    _parseAnswerToValues(answer, options, codeToValueMap, questionType) {
        // 情况1：判断题特殊处理（支持"A"/"对"或"B"/"错"）
        if (questionType === '判断题' && options.length === 2) {
            const [firstOpt, secondOpt] = options;
            // 认为第一个选项是"对"，第二个是"错"（或通过文本匹配）
            const isTrue = firstOpt === '对' || secondOpt === '错' ? firstOpt : options[0];
            const isFalse = firstOpt === '错' || secondOpt === '对' ? firstOpt : options[1];

            if (['A', '对'].includes(answer)) return [isTrue];
            if (['B', '错'].includes(answer)) return [isFalse];
        }

        // 情况2：处理选项名（如"A"、"BCD"）
        const valueFromCode = [];
        for (const char of answer) {
            if (codeToValueMap.has(char)) {
                valueFromCode.push(codeToValueMap.get(char));
            }
        }
        if (valueFromCode.length > 0) return valueFromCode;

        // 情况3：处理选项值文本（直接匹配选项内容）
        // 多选题可能包含多个用空格分隔的选项值
        const answerParts = questionType === '多选题'
            ? answer.split(/\s+/)
            : [answer];
        const valueFromText = answerParts.filter(part => options.includes(part.trim()));
        if (valueFromText.length > 0) return valueFromText;

        // 无匹配结果
        return [];
    }

    /**
     * 提取题型（适配两种容器）
     */
    _getQuestionType(container, isAnswering) {
        const typeSelector = isAnswering
            ? '.answer-title .gray'
            : '.quiz-title .gray';
        const typeElem = container.querySelector(typeSelector);
        return typeElem ? typeElem.textContent.replace(/\[|\]/g, '').trim() : '未知题型';
    }

    /**
     * 提取题目内容（适配两种容器）
     */
    _getQuestionContent(container, isAnswering) {
        const contentSelector = isAnswering
            ? '.answer-title .html-content-box p'
            : '.quiz-title .html-content-box p';
        const contentElem = container.querySelector(contentSelector);
        return contentElem ? contentElem.textContent.trim() : '未知题目';
    }

    /**
     * 提取选项值列表（仅选项内容，完全去除选项名相关逻辑）
     */
    _getOptionValues(container, isAnswering) {
        const options = [];
        const optionElems = container.querySelectorAll('.quiz-options .option-item');

        Array.from(optionElems).forEach(option => {
            let value = '';
            // 查找选项内容元素（优先找.html-content-box，判断题可能直接在文本中）
            const contentBox = option.querySelector('.html-content-box');
            if (contentBox) {
                // 处理含.html-content-box的选项（单选/多选）
                value = contentBox.textContent.trim();
            } else {
                // 处理判断题选项（直接提取文本，去除选项名前缀）
                const fullText = option.textContent.trim();
                value = fullText.replace(/^[A-Z]\./, '').trim(); // 移除"A."/"B."前缀
            }
            if (value) options.push(value);
        });

        return options;
    }

    /**
     * 解析答题中场景的答案值（当前选中的选项内容）
     */
    _parseAnsweringValues(container) {
        const selectedValues = [];
        // 查找所有选中的选项
        const selectedOptions = container.querySelectorAll('.quiz-options .option-item.active');

        Array.from(selectedOptions).forEach(option => {
            const contentBox = option.querySelector('.html-content-box');
            if (contentBox) {
                selectedValues.push(contentBox.textContent.trim());
            } else {
                // 判断题特殊处理
                const fullText = option.textContent.trim();
                selectedValues.push(fullText.replace(/^[A-Z]\./, '').trim());
            }
        });

        return selectedValues;
    }

    /**
     * 解析已答题场景的答案值（我的答案和正确答案，自动转为选项值）
     * @param {HTMLElement} container - 题目容器
     * @param {Array} options - 该题的选项值列表（用于匹配答案）
     * @returns {Object} 包含我的答案值和正确答案值的对象
     */
    _parseAnsweredValues(container, options) {
        // 1. 解析我的答案（从"我的答案："后提取，并转换为选项值）
        const myAnswerText = this._getAnswerText(container, '.quiz-answer .answer-title span');
        const myValues = this._matchAnswerToValues(myAnswerText, options);

        // 2. 解析正确答案（从"正确答案"后提取，并转换为选项值）
        const correctAnswerText = this._getAnswerText(container, '.correct-answer .answer-title span');
        const correctValues = this._matchAnswerToValues(correctAnswerText, options);

        return { myValues, correctValues };
    }

    /**
     * 提取答案文本（如从"我的答案：D"中提取"D"，或从"正确答案：对"中提取"对"）
     */
    _getAnswerText(container, selector) {
        const answerElem = container.querySelector(selector);
        if (!answerElem) return '';
        // 去除可能的图标或特殊字符，保留纯文本
        return answerElem.textContent.replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, '').trim();
    }

    /**
     * 将答案文本（如"D"或"对"）匹配为对应的选项值
     * @param {string} answerText - 原始答案文本（可能是选项名或选项值）
     * @param {Array} options - 选项值列表
     * @returns {Array} 匹配到的选项值（完全一致匹配）
     */
    _matchAnswerToValues(answerText, options) {
        if (!answerText) return [];

        // 情况1：直接匹配选项值（如"对"直接匹配选项中的"对"）
        const exactMatch = options.filter(option => option === answerText);
        if (exactMatch.length > 0) return exactMatch;

        // 情况2：判断题特殊处理（选项名"A"对应"对"，"B"对应"错"）
        if (options.length === 2 && ['对', '错'].every(v => options.includes(v))) {
            if (answerText === 'A' || answerText === '对') return ['对'];
            if (answerText === 'B' || answerText === '错') return ['错'];
        }

        // 情况3：选项名转选项值（如多选"BCD"拆分为单个选项名，逐个匹配）
        const matchedValues = [];
        for (const char of answerText) {
            // 遍历选项，找到选项名对应的选项值（通过位置匹配：A对应第0个，B对应第1个...）
            const index = char.charCodeAt(0) - 'A'.charCodeAt(0);
            if (index >= 0 && index < options.length) {
                matchedValues.push(options[index]);
            }
        }

        return matchedValues;
    }

    /**
     * 导出解析后的数据为JSON（仅含选项值相关信息）
     */
    exportJson() {
        this.parseExam();
        return JSON.stringify(this.examData);
    }

    /**
     * 导入JSON数据并恢复答案（通过选项值完全一致匹配，触发click）
     */
    importJson(jsonStr) {
        try {
            const importedData = JSON.parse(jsonStr);
            if (!Array.isArray(importedData)) {
                console.error('导入数据格式错误，应为数组');
                return;
            }

            // 构建ID到数据的映射
            const idMap = new Map();
            importedData.forEach(item => {
                if (item.questionId) idMap.set(item.questionId, item);
            });

            // 查找当前页面题目容器
            let questionContainers = document.querySelectorAll('.answer-item');
            if (questionContainers.length === 0) {
                const swipeTrack = document.querySelector('.van-swipe__track');
                if (swipeTrack) {
                    questionContainers = swipeTrack.querySelectorAll('.quiz-item');
                }
            }

            if (questionContainers.length === 0) {
                console.error('未找到题目容器，无法恢复答案');
                return;
            }

            // 遍历容器恢复答案
            Array.from(questionContainers).forEach((container, index) => {
                const isAnswering = container.classList.contains('answer-item');
                const questionType = this._getQuestionType(container, isAnswering);
                const questionId = `exam_question_${index + 1}_${questionType}`;
                const matchedData = idMap.get(questionId);

                if (!matchedData) return;

                // 优先使用正确答案值，若无则用我的答案值
                const targetValues = matchedData.correctAnswerValues.length > 0
                    ? matchedData.correctAnswerValues
                    : matchedData.myAnswerValues;

                if (targetValues.length > 0) {
                    this._restoreAnswerByValues(container, isAnswering, targetValues);
                }
            });

            console.log('答案恢复完成');
        } catch (e) {
            console.error('导入失败：', e);
        }
    }

    /**
     * 通过选项值恢复答案（完全一致匹配，触发click）
     * @param {HTMLElement} container - 题目容器
     * @param {boolean} isAnswering - 是否为答题中场景
     * @param {Array} targetValues - 目标选项值列表
     */
    _restoreAnswerByValues(container, isAnswering, targetValues) {
        const optionElems = container.querySelectorAll('.quiz-options .option-item');

        // 1. 取消所有已选中状态
        Array.from(optionElems).forEach(option => {
            if (option.classList.contains('active')) {
                option.click();
            }
        });

        // 2. 选中目标选项（通过选项值完全一致匹配）
        Array.from(optionElems).forEach(option => {
            // 提取当前选项的选项值
            let optionValue = '';
            const contentBox = option.querySelector('.html-content-box');
            if (contentBox) {
                optionValue = contentBox.textContent.trim();
            } else {
                const fullText = option.textContent.trim();
                optionValue = fullText.replace(/^[A-Z]\./, '').trim();
            }

            // 若选项值在目标值列表中，触发click选中
            if (targetValues.includes(optionValue)) {
                option.click();
            }
        });
    }
}

class HomeworkProcessor {
    constructor() {
        this.homeworkData = []; // 存储解析后的数据（单选/判断/多选题核心信息）
    }

    /**
     * 解析当前页面作业题目（适配答题中、批阅后场景）
     * 仅处理单选题、多选题、判断题
     */
    parseHomework() {
        this.homeworkData = [];
        let questionContainers = [];
        const isAnswering = document.querySelector('.mark_table.padTop20.ans-cc') !== null; // 答题中场景标识
        const isReviewed = document.querySelector('.mark_table.padTop60.ans-cc') !== null; // 批阅后场景标识

        // 1. 区分场景获取题目容器
        if (isAnswering) {
            questionContainers = document.querySelectorAll('.questionLi.singleQuesId');
        } else if (isReviewed) {
            questionContainers = document.querySelectorAll('.questionLi.singleQuesId');
        }

        if (questionContainers.length === 0) {
            console.log('未找到作业题目容器');
            return [];
        }

        // 2. 遍历容器解析题目
        Array.from(questionContainers).forEach((container, index) => {
            // 提取题型并过滤非目标题型
            const questionType = this._getQuestionType(container, isAnswering);
            if (!['单选题', '多选题', '判断题'].includes(questionType)) return;

            // 提取题目唯一ID（页面原生ID）
            const questionId = container.id || `homework_question_${index + 1}_${questionType}`;

            // 初始化题目数据结构
            const question = {
                questionId,
                questionType,
                questionContent: this._getQuestionContent(container, isAnswering),
                options: this._getOptionValues(container, isAnswering), // 选项值列表（如["a","b"]）
                myAnswerValues: [], // 我的答案值（与选项值匹配）
                correctAnswerValues: [] // 正确答案值（与选项值匹配）
            };

            // 按场景提取答案
            if (isAnswering) {
                question.myAnswerValues = this._parseAnsweringValues(container, questionType);
            } else if (isReviewed) {
                const { myValues, correctValues } = this._parseReviewedValues(container, questionType, question.options);
                question.myAnswerValues = myValues;
                question.correctAnswerValues = correctValues;
            }

            this.homeworkData.push(question);
        });

        return this.homeworkData;
    }

    /**
     * 改进版：通过字符串导入答案（支持选项名A/B/C或选项值文本，空格分隔）
     * @param {string} answerStr - 答案字符串，如"A ABC 错"（单选/多选/判断混合）
     */
    importAnswersByString(answerStr) {
        // 1. 预处理输入
        const answerList = answerStr.split(/\s+/).filter(answer => answer.trim() !== '');
        if (answerList.length === 0) {
            console.error('输入字符串格式错误，未找到有效答案');
            return;
        }

        // 2. 确认答题中场景（仅支持答题中导入）
        const isAnswering = document.querySelector('.mark_table.padTop20.ans-cc') !== null;
        if (!isAnswering) {
            console.error('仅支持答题中场景导入答案');
            return;
        }

        // 3. 获取题目容器
        const questionContainers = document.querySelectorAll('.questionLi.singleQuesId');
        if (questionContainers.length === 0) {
            console.error('未找到题目容器，无法导入答案');
            return;
        }

        // 4. 遍历题目匹配答案
        let answerIndex = 0;
        Array.from(questionContainers).forEach((container, containerIndex) => {
            const questionType = this._getQuestionType(container, isAnswering);
            // 跳过非目标题型
            if (!['单选题', '多选题', '判断题'].includes(questionType)) {
                console.log(`第${containerIndex + 1}题（${questionType}）不是单选/多选/判断题，跳过`);
                return;
            }
            // 答案已用完停止
            if (answerIndex >= answerList.length) {
                console.log(`答案已用完，剩余题目（从第${containerIndex + 1}题开始）未匹配`);
                return;
            }

            // 5. 提取选项映射（选项名→选项值）
            const { options, codeToValueMap } = this._getOptionsWithCodeMap(container, isAnswering);
            if (options.length === 0) {
                console.log(`第${containerIndex + 1}题未找到有效选项，跳过`);
                return;
            }

            // 6. 解析当前答案并恢复
            const currentAnswer = answerList[answerIndex];
            const targetValues = this._parseAnswerToValues(currentAnswer, options, codeToValueMap, questionType);
            if (targetValues.length > 0) {
                console.log(`为第${containerIndex + 1}题（${questionType}）匹配答案：${currentAnswer}`);
                this._restoreAnswerByValues(container, questionType, targetValues);
                answerIndex++; // 匹配成功才推进索引
            } else {
                console.log(`第${containerIndex + 1}题未找到与"${currentAnswer}"匹配的选项，跳过`);
            }
        });

        // 7. 校验匹配结果
        if (answerIndex < answerList.length) {
            console.warn(`尚有${answerList.length - answerIndex}个答案未匹配`);
        } else {
            console.log(`已完成所有${answerIndex}个答案的匹配`);
        }
    }

    /**
     * 导出解析后的数据为JSON（仅含单选/多选/判断题核心信息）
     */
    exportJson() {
        this.parseHomework();
        return JSON.stringify(this.homeworkData);
    }

    /**
     * 导入JSON数据并恢复答案（仅支持答题中场景，优先使用正确答案）
     * @param {string} jsonStr - 导出的作业答案JSON字符串
     */
    importJson(jsonStr) {
        try {
            const importedData = JSON.parse(jsonStr);
            if (!Array.isArray(importedData)) {
                console.error('导入数据格式错误，应为数组');
                return;
            }

            // 1. 确认答题中场景
            const isAnswering = document.querySelector('.mark_table.padTop20.ans-cc') !== null;
            if (!isAnswering) {
                console.error('仅支持答题中场景导入JSON答案');
                return;
            }

            // 2. 构建ID映射
            const idMap = new Map();
            importedData.forEach(item => {
                if (item.questionId && ['单选题', '多选题', '判断题'].includes(item.questionType)) {
                    idMap.set(item.questionId, item);
                }
            });

            // 3. 获取题目容器
            const questionContainers = document.querySelectorAll('.questionLi.singleQuesId');
            if (questionContainers.length === 0) {
                console.error('未找到题目容器，无法恢复答案');
                return;
            }

            // 4. 遍历恢复答案
            Array.from(questionContainers).forEach(container => {
                const questionType = this._getQuestionType(container, isAnswering);
                const questionId = container.id || '';
                const matchedData = idMap.get(questionId);

                if (!matchedData || !['单选题', '多选题', '判断题'].includes(questionType)) return;

                // 优先使用正确答案，无则用我的答案
                const targetValues = matchedData.correctAnswerValues.length > 0
                    ? matchedData.correctAnswerValues
                    : matchedData.myAnswerValues;

                if (targetValues.length > 0) {
                    this._restoreAnswerByValues(container, questionType, targetValues);
                }
            });

            console.log('答案恢复完成');
        } catch (e) {
            console.error('导入失败：', e);
        }
    }

    // ======================== 辅助方法 ========================
    /**
     * 提取题型（适配两种场景）
     * @param {HTMLElement} container - 题目容器
     * @param {boolean} isAnswering - 是否为答题中场景
     */
    _getQuestionType(container, isAnswering) {
        if (isAnswering) {
            // 答题中：从typename获取
            return container.getAttribute('typename') || '未知题型';
        } else {
            // 批阅后：从标题<span>提取（如"(单选题)"）
            const typeElem = container.querySelector('.mark_name .colorShallow');
            return typeElem ? typeElem.textContent.replace(/[()]/g, '').trim() : '未知题型';
        }
    }

    /**
     * 提取题目内容（适配两种场景）
     * @param {HTMLElement} container - 题目容器
     * @param {boolean} isAnswering - 是否为答题中场景
     */
    _getQuestionContent(container, isAnswering) {
        if (isAnswering) {
            const contentElem = container.querySelector('.mark_name');
            if (contentElem) {
                // 移除题号和题型，保留纯题目内容
                return contentElem.textContent.replace(/^\d+\./, '').replace(/\(.*?\)/, '').trim();
            }
        } else {
            const contentElem = container.querySelector('.qtContent');
            if (contentElem) {
                return contentElem.textContent.trim();
            }
        }
        return '未知题目';
    }

    /**
     * 提取选项值列表（适配两种场景）
     * @param {HTMLElement} container - 题目容器
     * @param {boolean} isAnswering - 是否为答题中场景
     */
    _getOptionValues(container, isAnswering) {
        const options = [];
        if (isAnswering) {
            // 答题中：从.answer_p提取选项内容
            const optionElems = container.querySelectorAll('.answer_p');
            Array.from(optionElems).forEach(elem => {
                const value = elem.textContent.trim();
                if (value) options.push(value);
            });
        } else {
            // 批阅后：从.qtDetail li提取选项内容
            const optionElems = container.querySelectorAll('.qtDetail li');
            Array.from(optionElems).forEach(elem => {
                // 移除选项名前缀（如"A. "）
                const value = elem.textContent.replace(/^[A-Z]\./, '').trim();
                if (value) options.push(value);
            });
        }
        return options;
    }

    /**
     * 提取选项及选项名映射（A→选项值）
     * @param {HTMLElement} container - 题目容器
     * @param {boolean} isAnswering - 是否为答题中场景
     */
    _getOptionsWithCodeMap(container, isAnswering) {
        const options = [];
        const codeToValueMap = new Map(); // A→选项值，B→选项值
        const optionCodes = ['A', 'B', 'C', 'D', 'E']; // 默认选项名序列

        if (isAnswering) {
            // 答题中：选项名从.num_option提取，内容从.answer_p提取
            const optionElems = container.querySelectorAll('.answerBg');
            Array.from(optionElems).forEach((elem, index) => {
                // 提取选项内容
                const contentElem = elem.querySelector('.answer_p');
                const value = contentElem ? contentElem.textContent.trim() : '';
                if (value) options.push(value);

                // 提取选项名
                const codeElem = elem.querySelector('.num_option, .num_option_dx');
                let code = codeElem ? codeElem.textContent.trim() : '';
                // 无选项名则按顺序补全
                if (!code && index < optionCodes.length) {
                    code = optionCodes[index];
                }

                if (code && value) {
                    codeToValueMap.set(code, value);
                }
            });
        } else {
            // 批阅后：选项名从li文本前缀提取，内容从li文本提取
            const optionElems = container.querySelectorAll('.qtDetail li');
            Array.from(optionElems).forEach((elem, index) => {
                const fullText = elem.textContent.trim();
                // 提取选项名（如"A"）
                const codeMatch = fullText.match(/^([A-Z])\./);
                let code = codeMatch ? codeMatch[1] : '';
                // 无选项名则按顺序补全
                if (!code && index < optionCodes.length) {
                    code = optionCodes[index];
                }

                // 提取选项内容
                const value = fullText.replace(/^[A-Z]\./, '').trim();
                if (value) options.push(value);

                if (code && value) {
                    codeToValueMap.set(code, value);
                }
            });
        }

        return { options, codeToValueMap };
    }

    /**
     * 将答案字符串转换为选项值列表
     * @param {string} answer - 单个答案（如"A"、"ABC"、"错"）
     * @param {Array} options - 选项值列表
     * @param {Map} codeToValueMap - 选项名→选项值映射
     * @param {string} questionType - 题型
     */
    _parseAnswerToValues(answer, options, codeToValueMap, questionType) {
        // 1. 判断题特殊处理
        if (questionType === '判断题' && options.length === 2) {
            const [trueOpt, falseOpt] = options;
            if (['A', '对', '正确'].includes(answer)) return [trueOpt];
            if (['B', '错', '错误'].includes(answer)) return [falseOpt];
        }

        // 2. 处理选项名（如"A"、"ABC"）
        const valueFromCode = [];
        for (const char of answer) {
            if (codeToValueMap.has(char)) {
                valueFromCode.push(codeToValueMap.get(char));
            }
        }
        if (valueFromCode.length > 0) return valueFromCode;

        // 3. 处理选项值文本（直接匹配）
        const answerParts = questionType === '多选题' ? answer.split(/\s+/) : [answer];
        const valueFromText = answerParts.filter(part => options.includes(part.trim()));
        if (valueFromText.length > 0) return valueFromText;

        return [];
    }

    /**
     * 解析答题中场景的我的答案值
     * @param {HTMLElement} container - 题目容器
     * @param {string} questionType - 题型
     */
    _parseAnsweringValues(container, questionType) {
        const myValues = [];
        // 答题中：选中状态通过.check_answer/.check_answer_dx标识
        const selectedElems = container.querySelectorAll('.check_answer, .check_answer_dx');

        Array.from(selectedElems).forEach(elem => {
            const answerPElem = elem.closest('.answerBg').querySelector('.answer_p');
            if (answerPElem) {
                const value = answerPElem.textContent.trim();
                if (value) myValues.push(value);
            }
        });

        return myValues;
    }

    /**
     * 解析批阅后场景的答案值（我的答案+正确答案）
     * @param {HTMLElement} container - 题目容器
     * @param {string} questionType - 题型
     * @param {Array} options - 选项值列表
     */
    _parseReviewedValues(container, questionType, options) {
        const result = { myValues: [], correctValues: [] };
        const codeToValueMap = this._getOptionsWithCodeMap(container, false).codeToValueMap;

        // 1. 解析我的答案
        const myAnswerElem = container.querySelector('.stuAnswerContent');
        if (myAnswerElem) {
            const myAnswerText = myAnswerElem.textContent.trim();
            result.myValues = this._parseAnswerToValues(myAnswerText, options, codeToValueMap, questionType);
        }

        // 2. 解析正确答案（可能不显示）
        const correctAnswerElem = container.querySelector('.rightAnswerContent');
        if (correctAnswerElem) {
            const correctAnswerText = correctAnswerElem.textContent.trim();
            result.correctValues = this._parseAnswerToValues(correctAnswerText, options, codeToValueMap, questionType);
        }

        return result;
    }

    /**
     * 通过选项值恢复答案（答题中场景，触发click）
     * @param {HTMLElement} container - 题目容器
     * @param {string} questionType - 题型
     * @param {Array} targetValues - 目标选项值列表
     */
    _restoreAnswerByValues(container, questionType, targetValues) {
        // 1. 取消所有已选中状态
        const selectedElems = container.querySelectorAll('.check_answer, .check_answer_dx');
        Array.from(selectedElems).forEach(elem => {
            const parent = elem.closest('.answerBg');
            if (parent) parent.click();
        });

        // 2. 选中目标选项
        const optionElems = container.querySelectorAll('.answerBg');
        Array.from(optionElems).forEach(elem => {
            const answerPElem = elem.querySelector('.answer_p');
            if (answerPElem) {
                const optionValue = answerPElem.textContent.trim();
                if (targetValues.includes(optionValue)) {
                    elem.click();
                    // 单选/判断选中一个后直接退出（避免重复点击）
                    if (['单选题', '判断题'].includes(questionType)) return false;
                }
            }
        });
    }
}

class AdvancedWebTool {
    constructor() {
        this.url = new URL(window.location.href).pathname
        console.log(this.url)
        // 类：存储实例和状态
        this.jsManager = {
            // 内置JS管理工具
            getUrlKey() {
                return this.url;
            },
            getStoredJS() {
                const key = this.getUrlKey();
                return localStorage.getItem(key) || '';
            },
            editStoredJS(jsCode) {
                try {
                    const key = this.getUrlKey();
                    localStorage.setItem(key, jsCode || '');
                    return true;
                } catch (error) {
                    console.error('保存JS代码失败:', error);
                    return false;
                }
            },
            executeStoredJS() {
                try {
                    const jsCode = this.getStoredJS();
                    if (jsCode) {
                        eval(jsCode);
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error(`自动化出错:${error}\n请修复或移除js`);
                    return false;
                }
            },
            deleteStoredJS() {
                try {
                    const key = this.getUrlKey();
                    const exists = localStorage.getItem(key) !== null;
                    localStorage.removeItem(key);
                    return exists;
                } catch (error) {
                    console.error('删除JS代码失败:', error);
                    return false;
                }
            }
        };
        this.addressManager = {

            /**
             * 获取 localStorage 中存储记录的键名
             * @returns {string} 存储记录的键名称
             */
            getKey() {
                return 'qcxs_address';
            },

            /**
             * 从 localStorage 中获取所有记录
             * @returns {Array} 记录数组（默认空数组）
             */
            getAllAddress() {
                const stored = localStorage.getItem(this.getKey());
                return stored ? JSON.parse(stored) : [{ remark: '添加位置' }];
            },

            /**
             * 将记录数组保存到 localStorage
             * @param {Array} Address - 要保存的记录数组
             */
            saveAddress(Address) {
                localStorage.setItem(this.getKey(), JSON.stringify(Address));
            },

            /**
             * 添加一条记录
             * @param {Object} record - 要添加的记录对象（需包含 name ）
             * @throws {Error} 如果传入的对象没有 name 则抛出错误
             */
            addAddress(record) {
                if (!record || typeof record !== 'object' || !('name' in record)) {
                    ToolClass.showTip('添加的记录必须是包含 name 的对象');
                }
                const Address = this.getAllAddress();
                Address.unshift(record);
                this.saveAddress(Address);
            },

            /**
             * 根据下标删除记录
             * @param {number} index - 要删除的记录下标
             * @returns {boolean} 删除成功返回 true，失败返回 false
             */
            deleteAddress(index) {
                const Address = this.getAllAddress();
                if (typeof index !== 'number' || index < 0 || index >= Address.length) {
                    console.warn('无效的记录下标');
                    return false;
                }
                Address.splice(index, 1);
                this.saveAddress(Address);
                return true;
            },

            /**
             * 将所有记录转换为 {name, callback} 格式的对象数组
             * callback 执行时会打印对应记录的完整信息
             * @returns {Array<Object>} 转换后的对象数组
             */
            getAddressMenuItems(callback) {
                if (typeof callback !== 'function') {
                    showTip('callback不是函数！')
                }
                const Address = this.getAllAddress();
                return Address.map((record, index) => ({
                    name: this.getshow(record),
                    callback: () => callback(index, record)
                }));
            },
            getshow(record) {
                return (record.remark || '').trim().length > 0 ? record.remark : record.name;
            }
        }
        //导入导出工具
        this.processor = null
        //eruda 显示状态（初始为未加载）null: 未加载, true: 显示, false: 隐藏
        this.erudaVisible = null;
        // 初始化：执行启动逻辑
        this.init();
    }

    // 初始化方法
    init() {
        this.initJS()

        this.menuItems = [{
            name: "eruda", callback: () => {
                // 如果已加载过 eruda，直接切换显示状态
                if (window.eruda) {
                    this.erudaVisible = !this.erudaVisible; // 取反状态
                    this.erudaVisible ? eruda.init() : eruda.destroy(); // 显示/隐藏
                    return;
                }
                // 首次加载 eruda
                ToolClass.loadScript('https://cdn.jsdelivr.net/npm/eruda', () => {
                    eruda.init(); // 初始化
                    this.erudaVisible = true; // 首次加载后为显示状态
                })

            }
        },
        {
            name: "自动化", callback: () => {
                const storedJS = this.jsManager.getStoredJS();
                this.createInputDialog('当前网页启动时自动执行的js，为空删除', (code) => {
                    if (code.trim()) {
                        const success = this.jsManager.editStoredJS(code);
                        ToolClass.showTip(success ? '保存成功' : '保存失败');
                    } else {
                        const success = this.jsManager.deleteStoredJS();
                        ToolClass.showTip(success ? '成功删除记录' : '无记录可删除或删除失败');
                    }
                }, storedJS);
            }
        },
        {
            name: "编辑网页", callback: () => {
                document.body.contentEditable = document.body.isContentEditable ? "false" : "true";
                ToolClass.showTip(document.body.isContentEditable ? '娱乐功能，勿做他用' : '关闭编辑');
            }
        },
        { name: "刷新", callback: () => window.location.reload() },
        {
            name: "加载url", callback: () => ToolClass.loadUrl()
        },

            // { name: "选项1", callback: () => this.bindDblclickEvent() },

        ];

        if (this.url === '/exam-ans/exam/phone/preview') {
            //手机端整卷浏览
            this.processor = new ExamProcessor();
        } else if (this.url === '/pptTestPaperStu/startAnswer' || this.url === '/widget/weixin/vote/stuVoteController/preVote' || this.url === '/pptTestPaperStu/reStartAnswerV2') {
            // 随堂练习，答题中、提交后、重新答题
            this.processor = new InClassExerciseProcessor();
        } else if (this.url === '/mooc-ans/mooc2/work/dowork' || this.url === '/pptTestPaperStu/reStartAnswerV2' || this.url === '/mooc-ans/mooc2/work/view') {
            //作业答题中，提交后
            this.processor = new HomeworkProcessor();
        }

        if (this.processor) {
            this.menuItems.unshift({ name: "导出题目", callback: () => this.outputExamAnswerByMe() })
            this.menuItems.unshift({ name: "导入json", callback: () => this.inputExamAnswerForJson() })
            this.menuItems.unshift({ name: "导入Str", callback: () => this.inputExamAnswerForStr() })
        }
        // 执行延迟任务
        this.executeDelayTask();
        //去除签到记录
        this.deletePptactiveCache()
        // 执行存储的自动化JS
        this.jsManager.executeStoredJS();
        // 入口
        this.launchEvent();
        // 绑定双击事件
        this.bindDblclickEvent();

    }

    initJS() {
        if (!window.jQuery) {
            ToolClass.loadScript('https://mooc1-api.chaoxing.com/mooc-ans/js/set/phone/jquery-1.9.0.min.js', () => {
                console.log('启用jquery')
            })
        }
        if (!window.jsBridge) {
            ToolClass.loadScript('https://mooc1-api.chaoxing.com/mooc-ans/js/phone/protocolChaoXing/CXJSBridge.js', () => {
                //接口
                const iframe = document.createElement('iframe');
                iframe.src = 'jsbridge://NotificationReady';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                console.log('启用JSBridge')
            })
        }
        if (!window.AppUtils) {
            ToolClass.loadScript('https://mooc1-api.chaoxing.com/mooc-ans/js/phone/app.utils.js', () => {
                console.log('启用AppUtils')
            })
        }
    }

    //设置启动方式：菜单 or 双击
    launchEvent() {
        let itemChildren = [{
            menu: '菜单',
            option: 'this.showItemsMenu()'
        }, {
            menu: '浏览器打开',
            option: `
            AppUtils.openUrl({
                loadType: 2, 
                webUrl: window.location.href
            });
        `}, {
            menu: '网页文字',
            option: `ToolClass.print(ToolClass.getElementSelectedText(document.body))`,
        }, {
            menu: '加载url',
            option: `ToolClass.loadUrl()`,
        }, {
            menu: 'PC中心',
            option: `  
            AppUtils.openUrl({
                loadType: 1, 
                webUrl: 'https://mooc2-ans.chaoxing.com/mooc2-ans/visit/interaction'
            });
            `,
        }]


        // 手机或电脑端考试
        if (this.url === '/exam-ans/exam/test/reVersionTestStartNew') {
            itemChildren.push({
                menu: '切换考试端',
                option: `
                const url = new URL(window.location.href);
                const params = new URLSearchParams(window.location.search);
                if (params.get('isphone') !== 'true') {
                    url.searchParams.set('isphone', 'true');
                } else {
                    url.searchParams.delete('isphone');
                }
                window.location.href = url.href;
        `,
            })
        } else if (this.url === '/pptTestPaperStu/startAnswer') {
            itemChildren.unshift({
                menu: '修改',
                option: `openReEdit()`,
            })
        }


        //考试：AppUtils、jsBridge
        let menu = setInterval(() => {
            if (window.AppUtils) {
                this.menuItems.push({
                    name: "个人信息", callback: () => {
                        AppUtils.getUserInfo('cx_fanya', function (userInfo) {
                            ToolClass.print(userInfo)
                        });
                    }
                })
                this.menuItems.push({
                    name: "退出", callback: () => {
                        jsBridge.postNotification('CLIENT_EXIT_LEVEL', { "level": 1 })
                    }
                })

                //位置签到
                if (this.url === '/widget/weixin/sign/stuSignController/preSign' || this.url === '/newsign/preSign') {
                    itemChildren.push({
                        menu: '位置库',
                        option: `this.showAdressList()`,
                    })
                }

                // 用立即执行函数包裹原option字符串，覆盖原值
                itemChildren.forEach(item => {
                    item.option = `(function() { ${item.option} })()`;
                    item.option = item.option.replace(/this/g, "window.AdvancedWebTool");
                });
                //设置菜单
                AppUtils.customMenu({
                    menu: '高级',
                    children: itemChildren
                });
                clearInterval(menu)

                // 去除旧版本更新检测
                AppUtils.isNewVersionNew = () => true
                AppUtils.isNewVersion = () => true

                // 强制通过app检测
                AppUtils.isChaoXingStudy = () => true

                if (window.checkClientSignatureSupport) {
                    // 降级使用旧版本跳转页面，适配旧版本
                    try {
                        checkClientSignatureSupport = () => false
                    } catch (error) {
                        console.log(e)
                    }
                }

            }

        }, 1000)

    }
    showAdressList() {
        //选择位置
        this.createSelectDialog(this.addressManager.getAddressMenuItems((index, address) => {
            if (address.remark === '添加位置') {
                try {
                    const address = {
                        name: $("#paramAddress").val() || $('#address').text() || '地址(教师端显示)',
                        latitude: $("#latitude").val() || '纬度(数字)',
                        longitude: $("#longitude").val() || '经度(数字)',
                        remark: ''
                    }
                    this.createInputDialog('确认添加此位置？', (text) => {
                        this.addressManager.addAddress(JSON.parse(text))
                    }, address)
                } catch (e) {
                    ToolClass.print('发生错误' + e)
                }
                return
            }
            // 对已选择的位置进行操作
            const menu = [{
                name: '签到', callback: () => {
                    try {
                        $("#paramAddress").val(address.name);
                        $("#latitude").val(address.latitude);
                        $("#longitude").val(address.longitude);
                        //$('#address').text('已修改定位，请刷新(取消)或提交(使用记录)');
                        //自动提交
                        window.sign()
                    } catch (e) {
                        ToolClass.print('发生错误：' + e)
                    }
                }
            }, {
                name: '备注', callback: () => {
                    this.createInputDialog('请输入备注', (remark) => {
                        this.addressManager.deleteAddress(index)
                        address.remark = remark
                        this.addressManager.addAddress(address)
                    }, address.remark)
                }
            }, {
                name: '编辑', callback: () => {
                    this.createInputDialog('编辑', (text) => {
                        this.addressManager.deleteAddress(index)
                        this.addressManager.addAddress(JSON.parse(text))
                    }, address)
                },
            }, {
                name: '删除', callback: () => {
                    this.addressManager.deleteAddress(index)
                },
            }]
            this.createSelectDialog(menu, this.addressManager.getshow(address))
        }), '位置库：')
    }

    bindDblclickEvent() {
        document.addEventListener("dblclick", (e) => {
            // 阻止某元素内部双击冒泡
            // if (e.target.closest('form')||e.target.tagName !== 'DIV') return;
            ToolClass.showTip('菜单')
        });
    }
    // 显示功能菜单弹窗
    showItemsMenu() {
        // 显示菜单
        this.createSelectDialog(this.menuItems, "高级功能");
    }

    // 创建输入弹窗
    outputExamAnswerByMe() {
        // 1. 导出数据
        ToolClass.print(this.processor.exportJson());
    }
    inputExamAnswerForJson() {
        // 2. 导入数据（替换为实际导出的JSON字符串）
        // const savedJson = '[{"questionId":"884455056",...}]';
        // processor.importJson(savedJson);
        this.createInputDialog('请输分享的json：', (json) => {
            if (json.trim()) {
                this.processor.importJson(json)
            } else ToolClass.showTip('不能为空')
        });
    }

    inputExamAnswerForStr() {
        // // 假设页面题目顺序：单选 → 简答 → 多选 → 判断 → 论述
        // examProcessor.importAnswersByString("A BC B"); 
        this.createInputDialog('请输ai回答的以空格连接的答案：', (str) => {
            if (str.trim()) {
                this.processor.importAnswersByString(str)
            } else ToolClass.showTip('不能为空')
        });
        ToolClass.print(`${ToolClass.getElementSelectedText(document.body)}
请基于提供的全部题目内容，仅针对其中的选择题（含单选、多选） 和判断题进行作答，完全忽略简答题、论述题等其他题型。具体要求如下：
识别题目类型：准确区分单选（唯一答案）、多选（多个答案）、判断（需明确 “对” 或 “错” 对应的选项，如题目要求判断后选 A/B 对应对 / 错，则返回 A 或 B）。
答案格式：
单选题答案直接返回选项（如 A、B）；
多选题答案用大写字母拼接（如 BC、ACD）；
判断题返回题目指定的 “对” 或 “错” 对应的选项（如题目标注 “对选 A，错选 B” 则返回 A 或 B）。
排序与分隔：按题目在内容中出现的原始顺序排列答案，不同题目答案之间用单个空格分隔，不添加任何额外字符、标点或说明。
请严格遵循上述规则，仅输出整理后的答案字符串。`)

    }

    createInputDialog(title, callback, value = '') {
        ToolClass.print(value, callback, title)
    }

    // 创建选择弹窗 - 修改版：输入为含选项名和回调的数组，移除原独立回调
    createSelectDialog(options, title = "请选择") {
        // 移除现有同层级弹窗
        this.removeExistingDialogs(1234);

        const dialogId = `sd-${Date.now()}`;
        const container = document.createElement('div');

        container.innerHTML = `<div class="mask" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);z-index:1234;" onclick="this.parentElement.remove()">
        <div class="dialog" style="text-align:-webkit-auto;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;border:1px solid #ccc;border-radius:4px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.15);padding:0;display:block;z-index:9996;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid #eee;"><span>${title}</span>
      <button style="background:none;border:none;font-size:16px;cursor:pointer;padding:0;line-height:1;" onclick="this.closest('.dialog').parentElement.remove()">×</button></div><div style="max-height:200px;overflow-y:auto;padding:8px 0;scrollbar-width:thin;"><ul style="list-style:none;margin:0;padding:0;">${options.map((opt, i) => `<li data-i="${i}" style="padding:8px 16px;cursor:pointer;" onclick="this.parentElement.querySelectorAll('li').forEach(li => li.style.background='');this.style.background='#e6f3ff';this.querySelector('input').checked=true;"><input type="radio" name="${dialogId}" id="${dialogId}-${i}" value="${i}" style="margin-right:8px;"><label for="${dialogId}-${i}">${opt.name}</label></li>`).join('')}</ul></div><div style="display:flex;justify-content:flex-end;gap:8px;padding:8px 16px;border-top:1px solid #eee;"><button style="padding:6px 16px;border-radius:4px;cursor:pointer;background:#fff;border:1px solid #ccc;" onclick="this.closest('.dialog').parentElement.remove()">取消</button>
      <button class="okay" style="padding:6px 16px;border-radius:4px;cursor:pointer;background:#409eff;color:#fff;border:none;">确定</button></div></div></div>`;

        document.body.appendChild(container);

        // 默认选中第一个选项
        const firstInput = container.querySelector('input[type="radio"]');
        if (firstInput) {
            firstInput.checked = true;
            firstInput.closest('li').style.background = '#e6f3ff';
        }
        container.querySelector('.dialog').addEventListener('click', (e) => {
            e.stopPropagation()
        })
        // 绑定确定按钮事件：执行选中选项对应的回调
        container.querySelector('.okay').addEventListener('click', () => {
            const selectedIndex = container.querySelector('input:checked')?.value;
            if (selectedIndex !== undefined) {
                // 根据选中的索引，找到对应的选项回调并执行
                const selectedOption = options[selectedIndex];
                if (typeof selectedOption.callback === 'function') {
                    selectedOption.callback();
                }
            }
            container.remove(); // 无论是否执行回调，都关闭弹窗
        });
    }

    // 执行延迟任务（允许复制、隐藏水印等）
    executeDelayTask() {
        setTimeout(() => {
            try {
                // 允许复制、隐藏水印
                this.enableCopyAndHideWatermark();
                // 允许编辑器粘贴
                this.enableEditorPaste();
                //恢复log
                ToolClass.recConsoleLog()
                // 关闭监控（如果有全局方法）
                if (window.closeMonitor && typeof window.closeMonitor === 'function' && this.url !== '/exam-ans/exam/phone/task-exam') {
                    window.closeMonitor();
                    console.log('关闭监控')
                }
            } catch (e) {
                console.error('延迟任务执行失败:', e);
            }

        }, 500);
    }

    // 允许复制、隐藏水印
    enableCopyAndHideWatermark() {
        if (document.querySelector('.qcxsStyle')) return;

        const qcxsStyle = document.createElement('style');
        qcxsStyle.className = 'qcxsStyle';
        qcxsStyle.textContent = `
      * {
        -webkit-touch-callout: default !important;
        -webkit-user-select: text !important;
        -khtml-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      .mask_div { display: none !important; }
    `;
        document.head.appendChild(qcxsStyle);

        // 移除PC端选择限制
        document.body.removeAttribute("onselectstart");
        document.documentElement.style.userSelect = "unset";
    }

    // 允许编辑器粘贴
    enableEditorPaste() {
        // 处理自定义编辑器
        if (window.editors && Array.isArray(window.editors)) {
            window.editors.forEach(editor => {
                if (editor && editor.ueditor) {
                    editor.ueditor.__allListeners.beforepaste = null;
                }
            });
        }
        // 单个填空
        if (window.editor && editor.ueditor) {
            editor.ueditor.__allListeners.beforepaste = null;
        }
        // 处理UE编辑器
        if (window.UE && UE.instants && typeof UE.instants === "object") {
            Object.entries(UE.instants).forEach(([key, instance]) => {
                try {
                    if (instance.options) {
                        instance.options.disablePasteImage = false;
                    }
                    if (instance.removeListener) {
                        instance.removeListener("beforepaste", window.editorPaste);
                    }
                } catch (error) {
                    console.error("编辑器粘贴配置失败：", key, error);
                }
            });
        }
    }

    // 移除现有同层级弹窗（避免弹窗叠加）
    removeExistingDialogs(zIndex) {
        const existingMasks = document.querySelectorAll(`[style*="z-index:${zIndex}"]`);
        existingMasks.forEach(mask => mask.remove());
    }

    //去除签到记录
    deletePptactiveCache() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            // 3. 判断 key 是否以 'pptactive' 开头
            if (key.startsWith('pptactive')) {
                // 4. 删除匹配的缓存
                console.log(`已删除签到记录缓存：`, key, localStorage.getItem(key));
                localStorage.removeItem(key);
            }
        });
    }
}

// 实例化并挂载到window，供全局调用
window.AdvancedWebTool = new AdvancedWebTool();
