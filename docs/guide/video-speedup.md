# 章节视频快进、倍速

::: warning 温馨提示
此操作只是可以快进、倍速，但是视频播放完成 != 任务完成，后者为服务端校验，只能挂机解决。如果想刷课，请了解 [OCS网课助手](https://docs.ocsjs.com/docs/script)。当然有的人告诉你 3 块钱包过、包考试，不用你做任何事，只需要账号密码，如果你是富家公子，那请便。
:::

## 教程

### 提示词

```
开始分析dex，有的章节视频不能快进、倍速，这是为什么？
```

### 反馈

![](/images/video-speedup/Pasted%20image%2020260704105633.png)

可以看到 AI 完美定位到问题根源

![](/images/video-speedup/Pasted%20image%2020260704105937.png)

## 修改

定位类

```
com.chaoxing.mobile.player.course.CourseVideoPlayer
```

![](/images/video-speedup/Pasted%20image%2020251230151654.png)

清空这两个方法

![](/images/video-speedup/Pasted%20image%2020251230152128.png)

## 最新版新增

### 提示词

```
发现最新版新出现isRollbackStatus，服务器通过它可以将快进的视频回滚，导致无法快进，找出问题
```

### 反馈

仍旧被 AI 拿捏

![](/images/video-speedup/Pasted%20image%2020260704110406.png)

### 修改

```
Lcom/chaoxing/mobile/player/course/model/CourseDotRes;->isRollbackStatus()Z
```

令其返回 false
