# 去除开屏广告

可能大家都习惯了开屏 5 秒广告，但是作为会逆向的你，不去除一下吗？

## 教程

### 提示词

```
应用有哪些广告？如何去除或禁用？例如开屏广告
```

### 反馈

这里 AI 给出的是另一个方案，但我使用的不是它，逆向本就不是谁对谁错，有效果第一位，大家可以参考。

![](/images/remove-splash-ad/Pasted%20image%2020260704111924.png)

### 我的修改方案

定位类

```
com.chaoxing.mobile.activity.SplashActivity
```

转 java 搜索 ad，全词匹配

![](/images/remove-splash-ad/Pasted%20image%2020251230154628.png)

可以看出直接让 a 方法返回 null 即可

![](/images/remove-splash-ad/Pasted%20image%2020251230154916.png)
