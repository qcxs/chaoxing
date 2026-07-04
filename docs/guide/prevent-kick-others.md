# 阻止挤别人下线

::: warning 注意
此方法原理未知，与 so 层有关，使用 IDA Pro 分析发现混淆，仅供参考。
:::

## 教程

定位类

```
com.chaoxing.libencrypt.Encrypt
```

删除 native

![](/images/multi-login/Pasted%20image%2020251230153930.png)

再清空方法

![](/images/multi-login/Pasted%20image%2020251230153955.png)

## 现象

- 去除虚拟机检测，原来无法在虚拟机中打开，现在可以了
- 签名校验，原来如果没有去签，会闪退，但现在不会。不过位置签到 SDK 也会校验签名，不使用一键去除将无法位置签到
- 不会把其他设备挤下线，但是私聊功能无法使用，很神奇
