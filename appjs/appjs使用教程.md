# 显示菜单

## 高级

当右上角显示“高级”时，可打开菜单
![attachments/Pasted image 20251231112430.png](attachments\Pasted%20image%2020251231112430.png)

## 双击屏幕

或者双击屏幕，点击菜单
![attachments/Pasted image 20251231113111.png](attachments\Pasted%20image%2020251231113111.png)

# 菜单功能

## 导入导出题目

适配PC端作业、手机端随堂练习、~~手机端考试全卷预览~~（废弃），未显示此选项表示不支持的网页。
**致命bug**：在**全卷预览**页面中，使用此方法自动完成题目，由于操作过快，app未能将题目选项上传至服务器，此时页面显示**已选择**，但交卷后教师端显示你**未选择**，严重时导致**低分补考**！故此功能废弃！

### 导入Str

点击后显示题目
![attachments/Pasted image 20251231112746.png](attachments\Pasted%20image%2020251231112746.png)
内含提示词，点击复制并发送给豆包
![attachments/Pasted image 20251231112845.png](attachments\Pasted%20image%2020251231112845.png)
将结果粘贴至输入框
![attachments/Pasted image 20251231112948.png](attachments\Pasted%20image%2020251231112948.png)
点击确定后，自动选择选项。

### 导入json

当朋友点击[appjs使用教程 > 导出题目](appjs%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md#dao-chu-ti-mu)后，并发送给你，输入后确定可直接使用他的答案。
由于选择题乱序，使用json可无视乱序匹配。
如果作业提交后显示正确答案，优先导入正确答案而非选项。

### 导出题目

将你的答案分享给朋友，或者记录下来。

## eruda

点击显示或隐藏eruda面板，具体eruda是什么，请访问[简介 | Eruda](https://eruda.liriliri.io/zh/docs/)
可以用于执行js，管理localStorage等。

## 自动化

为当前网页添加进入时js事件，例如人脸识别可以通过调用exit()退出

## 编辑网页

娱乐功能，开启或编辑网页，你可以修改成绩显示为100。

## 刷新

刷新当前网页，由于app自带缓存功能，脚本可能并未最新版，刷新网页时重置缓存，顺便更新脚本。

## 加载url

在任意页面使用，切换当前打开的页面。

## 个人信息

**危险**！由于可以使用js和app进行交互，其中有一项是获取个人信息，且没有任何权限校验。如果你访问恶意网站，可能恶意网站直接通过此方法获取你的个人信息，至少包含**姓名、学号、学校**。本脚本已开源，欢迎大家监督。

# 高级功能

![attachments/Pasted image 20251231115228.png](attachments\Pasted%20image%2020251231115228.png)

## 修改

仅在随堂练习提交后，想修改时生效。

## 菜单

唤醒[appjs使用教程 > 菜单功能](appjs%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md#cai-dan-gong-neng)

## 浏览器打开

在浏览器打开当前网页，由与一些网页仅在app中使用，强制打开会出现各种bug。

## 网页文字

显示当前网页的文字，可一键复制，偷懒。
![attachments/Pasted image 20251231115541.png](attachments\Pasted%20image%2020251231115541.png)

## 加载url

与[appjs使用教程 > 加载url](appjs%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md#jia-zai-url)相同。

## PC中心

用于跳转至[appjs使用教程 > 导入导出题目](appjs%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md#dao-ru-dao-chu-ti-mu)，因为作业只在PC端提供功能。

## 位置库

在位置签到中使用，可以识别已签到位置，或者未签到时已获取位置，或直接为空由用户输入。
![attachments/Pasted image 20251231120209.png](attachments\Pasted%20image%2020251231120209.png)
添加后下次签到可一键签到，无需打开位置设置
![attachments/Pasted image 20251231120441.png](attachments\Pasted%20image%2020251231120441.png)

# 不可见功能

非用户输入，自动执行，写死在代码中。

## 强兼其他网页

由于显示[appjs使用教程 > 高级](appjs%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md#gao-ji)需要js支持，很多网页并没有这些js，此时许多功能残废。使用以下代码向网页插入所需js，使得适配大多数网页。
![attachments/Pasted image 20251231121311.png](attachments\Pasted%20image%2020251231121311.png)
其中AppUtils依赖jsBridge依赖jQuery。

## 科技改变考试

通过以下代码，可以去除考试需升级客户端检测。
![attachments/Pasted image 20251231121159.png](attachments\Pasted%20image%2020251231121159.png)

## 优化体验

允许切屏、填空题粘贴答案……
![attachments/Pasted image 20251231121409.png](attachments\Pasted%20image%2020251231121409.png)
允许复制题目，隐藏水印
![attachments/Pasted image 20251231121604.png](attachments\Pasted%20image%2020251231121604.png)
![attachments/Pasted image 20251231121716.png](attachments\Pasted%20image%2020251231121716.png)

## 去除签到记录

![attachments/Pasted image 20251231121743.png](attachments\Pasted%20image%2020251231121743.png)
