# 脱壳修复

## 脱壳

使用 56.al 或 Layout Inspect 进行脱壳，脱壳后寻找原 dex

![](/images/unpack-repair/Pasted%20image%2020251230145423.png)

注：56.al 脱壳结果没有原 dex，需手动解压出来

由于原 dex 中包含库，需保留，长按删除此包，于是它的大小从 87.93M 缩减为 5.17K

![](/images/unpack-repair/Pasted%20image%2020251230145406.png)

全选、批量重命名

![](/images/unpack-repair/Pasted%20image%2020251230145626.png)

单独重命名 classes.dex

![](/images/unpack-repair/Pasted%20image%2020251230145722.png)

将 dex 添加至 apk 中，接下来操作均不勾选"自动签名"

## AndroidManifest.xml

搜索 `<application`，

```
android:name="com.chaoxing.mobile.AppApplication
android:appComponentFactory="androidx.core.app.CoreComponentFactory"
android:debuggable="true"
```

删除结尾处

![](/images/unpack-repair/Pasted%20image%2020251230150958.png)

## 去除加固残留

- 删除 `/assets/meta-data` 文件夹
- 删除 `/lib/arm64-v8a/libDexHelper.so`
- 删除 `/lib/arm64-v8a/libDexHelper-x86.so`

现在已经不显示加固，普通去除签名校验

![](/images/unpack-repair/Pasted%20image%2020251230151310.png)
