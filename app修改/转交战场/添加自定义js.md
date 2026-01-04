定位类

````
com.chaoxing.mobile.webapp.ui.WebAppViewerFragment
````

可以看到两处js代码
![attachments/Pasted image 20251230162558.png](attachments\Pasted%20image%2020251230162558.png)
将其中任意一处更改为（由于github不一定可以访问，推荐将app.js存放在自己的服务器）

````
(function(){if(window.QCXS)return;window.QCXS=true;const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/qcxs/chaoxing@master/app.js';document.body.appendChild(s);})();
````

推荐在常亮中更改，无需考虑转义符
![attachments/Pasted image 20251230162909.png](attachments\Pasted%20image%2020251230162909.png)
