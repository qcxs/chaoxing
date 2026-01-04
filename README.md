# chaoxing by qcxs

## 引言

此仓库详细记录了使用[MT管理器](https://mt2.cn/)修改超星[学习通](https://app.chaoxing.com/)6.7.2版本具体流程，在此之前，全网中**只**找到**可以拖动进度条**的4.3.4版本和[【原创教程】学习通(超星泛雅)网络课软件破解](https://bbs.binmt.cc/thread-980-1-1.html)，可见相关资源匮乏。

## 使用教程

直接向下阅读，点击超链接即可。

# 研究成果

## app修改

### 脱壳修复

[脱壳修复](app%E4%BF%AE%E6%94%B9\%E8%84%B1%E5%A3%B3%E4%BF%AE%E5%A4%8D\%E8%84%B1%E5%A3%B3%E4%BF%AE%E5%A4%8D.md)
参考网上大佬对**棒棒加固企业版**的处理过程。

### 章节视频

[章节视频快进、倍速](app%E4%BF%AE%E6%94%B9\%E7%AB%A0%E8%8A%82%E8%A7%86%E9%A2%91\%E7%AB%A0%E8%8A%82%E8%A7%86%E9%A2%91%E5%BF%AB%E8%BF%9B%E3%80%81%E5%80%8D%E9%80%9F.md)
app播放器默认没有快进、倍速限制，只需阻止服务器向app传输命令即可去除。但是请注意，时长不够仍不能判定为完成学习，故更推荐使用电脑插件挂机刷。此处修改只是个人喜好。

### 多端登录

方案一：可以[不理会下线](app%E4%BF%AE%E6%94%B9\%E5%A4%9A%E7%AB%AF%E7%99%BB%E5%BD%95\%E4%B8%8D%E7%90%86%E4%BC%9A%E4%B8%8B%E7%BA%BF.md)，但仍会把其他版本挤下线。
方案二：在一次修改中误打误撞发现，[阻止挤别人下线](app%E4%BF%AE%E6%94%B9\%E5%A4%9A%E7%AB%AF%E7%99%BB%E5%BD%95\%E9%98%BB%E6%AD%A2%E6%8C%A4%E5%88%AB%E4%BA%BA%E4%B8%8B%E7%BA%BF.md)办法，但会造成消息功能不能使用。故推荐共存时修改，但日用时不要修改。

### 开屏广告

[去除开屏广告](app%E4%BF%AE%E6%94%B9\%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A\%E5%8E%BB%E9%99%A4%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A.md)
很简单，activity记录找到开屏类，发现一个的AD类，让其返回为空即可。

### 去除更新

[去除更新](app%E4%BF%AE%E6%94%B9\%E5%8E%BB%E9%99%A4%E6%9B%B4%E6%96%B0\%E5%8E%BB%E9%99%A4%E6%9B%B4%E6%96%B0.md)

### 我学的课

[默认我学的课](app%E4%BF%AE%E6%94%B9\%E6%88%91%E5%AD%A6%E7%9A%84%E8%AF%BE\%E9%BB%98%E8%AE%A4%E6%88%91%E5%AD%A6%E7%9A%84%E8%AF%BE.md)
楼主喜欢在课程列表中查看课程，但是默认进入的是**我教的课**，而不是**我学的课**，图省事写死。

## 全栈修改

偶然间，发现app会执行javascript:js代码，并且作业、章节测验、考试等页面是一个网页，对它们的修改使用js更方便，故[添加自定义js](app%E4%BF%AE%E6%94%B9\%E8%BD%AC%E4%BA%A4%E6%88%98%E5%9C%BA\%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89js.md)，又为了方便调试网页[默认开启网页调试](app%E4%BF%AE%E6%94%B9\%E8%BD%AC%E4%BA%A4%E6%88%98%E5%9C%BA\%E9%BB%98%E8%AE%A4%E5%BC%80%E5%90%AF%E7%BD%91%E9%A1%B5%E8%B0%83%E8%AF%95.md)。

## jsBridge

网页通过jsBridge与app进行交互。
例如：[考试脱控](app%E4%BF%AE%E6%94%B9\%E8%80%83%E8%AF%95%E8%84%B1%E6%8E%A7\%E8%80%83%E8%AF%95%E8%84%B1%E6%8E%A7.md)，考试页面本质上只是一个网页，app默认没有切屏检测，于是可以通过不理会交互达成脱控目的。
在app.js中，化敌为友，通过此特性，将其当做api进行调用，可以添加许多功能，详细请阅读：[appjs使用教程](appjs\appjs%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B.md)。

# 其他教程

## app修改

### 初版教程

[学习通修改教程终版](https://bbs.binmt.cc/thread-145359-1-1.html)

## 网页调试教程

[一个简单的web调试逆向](https://bbs.binmt.cc/thread-150946-1-1.html)
[adb远程调试网页](https://bbs.binmt.cc/thread-160969-1-1.html)

## 位置签到解析

[学习通伪造位置签到](https://bbs.binmt.cc/thread-157986-1-1.html)

## 填空题粘贴

[学习通网页复制文字-粘贴图片-油猴插件代码](https://bbs.binmt.cc/thread-151654-1-1.html)

# 资料

https://www.123684.com/s/o1cqVv-a1hjH

# 友链：

学习通微信版（网页）：https://mooc1.chaoxing.com/course/phone/courselisthead
