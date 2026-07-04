# 默认开启网页调试

app 许多页面为网页，例如作业、考试，此时对 app 进行修改无用。需要对网页进行逆向分析，此步骤开启调试网页，方便后续分析。

定位类

```
com.chaoxing.mobile.webapp.ui.WebAppViewerFragment
```

导航切换为字符串，过滤 java

![](/images/custom-js/Pasted%20image%2020251230160910.png)

在此方法开始粘贴

```
const/4 v0, 0x1
invoke-static {v0}, Landroid/webkit/WebView;->setWebContentsDebuggingEnabled(Z)V
```

![](/images/custom-js/Pasted%20image%2020251230161002.png)
