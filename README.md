# chaoxing
针对超星学习通的自用文件

# 如何使用？
根据此教程修改app：

app调试与集成js：https://bbs.binmt.cc/thread-150946-1-1.html

或在此教程评论区下载成品：

使用mt管理器修改app：https://bbs.binmt.cc/thread-145359-1-1.html

# app.js
专门适配app的纯js文件，包含：（部分功能在指定页面才显示）
## 网页加载后代码：
自动调用关闭考试监控、填空题允许粘贴、允许复制题目等

## 加载url：
默认显示当前url，修改并跳转网页

## 开启开发者调试工具eruda：
执行js，检查元素、管理localstorage等等，详见官网：https://eruda.liriliri.io/zh/docs/

## 位置签到：
位置库：提供使用已保存位置签到，仅供学习交流。原理见：https://bbs.binmt.cc/thread-157986-1-1.html
添加位置：可以在定位成功后添加位置，或者已签到导入。

## 导入导出选择判断：
适配作业（仅新版PC作业，新版课程链接：https://mooc2-ans.chaoxing.com/mooc2-ans/visit/interaction）、考试、随堂练习
### 导出json：
包含题目、题目类型、题目id、题目选项（具体内容，非ABCD）、已选选项、答案选项。
### 导入json：
将导出json内容输入，根据题目id进行匹配，避免题目、选项乱序。
### 导入Str：
点击后提示复制题目+ai提示词，当ai回答形如“A BC B”（单选A，多选BC，判断B，以空格分割）后，自动选择。

## 自动化：
网页加载后执行设置的代码。例如：课程进入后的人脸识别可通过调用exit函数绕过。

## 其他不可见功能：
启用jquery（AppUtils需要），jsBridge（app与网页连接桥），AppUtils（使用jsBridge的函数）

双击屏幕显示“菜单”提示，点击显示菜单，防止app自定义菜单调用失败。

## 友链：

使用mt管理器对app的修改：https://bbs.binmt.cc/thread-145359-1-1.html

学习通微信版（网页）：https://mooc1.chaoxing.com/course/phone/courselisthead

## 其他js：
之前随便写的代码，app.js几乎全部集成。
