# 考试脱控

::: danger 警告
此步骤只能去除最简单的**切屏检测**和**小窗检测**，如果老师录屏监考，任何修改均无效。本人不推荐任何耍小聪明的行为，造成的一切后果由自己承担，继续阅读则代表你已知晓且同意！
:::

## 核心原理

通过逆向考试网页得知，可以调用以下函数关闭考试监控。默认无监控，阻止 Java 层通信代码即可。

```js
// 关闭监控
function closeMonitor(listenLifeCycle) {
    try {
        jsBridge && jsBridge.postNotification('CLIENT_FACE_COLLECTION', {
            "enable": "0",
            "enableCapture": "0",
            "data": {
                "internalTime": "60000",
                "funconfig": {}
            }
        });
        if (!listenLifeCycle) {
            jsBridge && jsBridge.postNotification('CLIENT_WEB_LIFECYCLE', {
                enabled: 0
            });
        }
        jsBridge.postNotification('CLIENT_EXAM_LIVE_CONTROL', {
            "funConfig": {
                "camera": 0,
                "closeLive": 1
            }
        });
        jsBridge.postNotification('CLIENT_SNAPSHOT', {
            "type": 3,
            "data": {
                "internalTime": 0,
                "enable": 0,
                "funconfig": {}
            }
        });
        jsBridge.postNotification('CLIENT_MONITOR_TOP_VIEW', {
            "enable": "0",
            "timeInternal": "30000"
        });
        jsBridge.postNotification('CLIENT_LIMIT_KEYBOARD', {
            'enable': 0
        });
    } catch (e) { }
}
```

## 关闭小窗检测

搜索 CLIENT_SNAPSHOT

![](/images/exam-control/Pasted%20image%2020251230152728.png)

在当前结果中搜索 enable，选择第二个

![](/images/exam-control/Pasted%20image%2020251230153105.png)

转 Java，可以看出此处设置了 enable

![](/images/exam-control/Pasted%20image%2020251230153215.png)

this.s 的值默认为 0，故只需让上述方法不执行即可，清空代码

![](/images/exam-control/Pasted%20image%2020251230153307.png)

## 关闭退出检测

同理搜索 CLIENT_WEB_LIFECYCLE，并清空

![](/images/exam-control/Pasted%20image%2020251230153531.png)

## 其他

可以通过 [添加自定义 JS](/guide/inject-custom-js) 手动执行 closeMonitor() 关闭监控。
