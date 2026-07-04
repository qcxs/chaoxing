# 备份与恢复

## 引言

做任何事都不要头脑一热，不计后果的做，学习通里有重要的**聊天记录**，如果你安装[资料](https://github.com/qcxs/chaoxing#%E8%B5%84%E6%96%99)中的修改版，系统会提示你*与已安装的应用签名不一致，需要你卸载已安装的版本*，再继续安装。如果你冒然卸载，就会丢失聊天记录，但其实这是可以避免的。

## 教程

### 备份

新版本为了便于向鸿蒙迁移，提供了备份功能，如果不是新版本，请更新版本

![](/images/backup-restore/Pasted%20image%2020260704171338.png)

先点击`计算文件大小`，再点击`开始备份`

![](/images/backup-restore/Pasted%20image%2020260704171520.png)

去 MT 定位文件 `/storage/emulated/0/Download/chaoxing/com.chaoxing.mobile.zip`，这就是你的聊天记录备份文件。然后就可以卸载重装了，重装后登录自己的账号，发现丢失聊天记录。

### 恢复

#### 有 Root

打开备份压缩包，将文件夹 `com.chaoxing.mobile/ce/` 里面的内容解压至 `/data/user/0/com.chaoxing.mobile/`

![](/images/backup-restore/Pasted%20image%2020260704171806.png)

全部覆盖

![](/images/backup-restore/Pasted%20image%2020260704172007.png)

关闭 app，重新打开，即可发现数据成功恢复。

#### 没有 Root

找到资料中的安装包，选择`功能`，`注入文件提供器`，最新版资料我已注入，可跳过此步骤

![](/images/backup-restore/Pasted%20image%2020260704172433.png)

MT 侧边栏，选择`添加本地存储`

![](/images/backup-restore/Pasted%20image%2020260704172557.png)

点击`学习通`

![](/images/backup-restore/Pasted%20image%2020260704172643.png)

`使用此文件夹`，`允许`

![](/images/backup-restore/Pasted%20image%2020260704172904.png)

接下来就可以在 MT 侧栏找到学习通了

![](/images/backup-restore/Pasted%20image%2020260704173035.png)

进入 `data` 文件夹

![](/images/backup-restore/Pasted%20image%2020260704173201.png)

也是一样，直接复制替换即可

![](/images/backup-restore/Pasted%20image%2020260704173132.png)

## 注

推荐同包名、同版本、同账号的*学习通备份文件*恢复，否则出现问题后果自负。
