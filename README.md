# unicloud-router-iview-admin
一个简洁的后台管理系统模板，基于 uniCloud + iview + uni-simple-router 的后台管理系统

[演示地址:http://mouxangitee.gitee.io/unicloud-router-iview-admin](http://mouxangitee.gitee.io/unicloud-router-iview-admin)

# 感谢

首先我们先感谢一下[uni-simple-router](http://hhyang.cn/)的作者和[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)提供的开源模板让我学习，本人研发封装的这一套都是基于[uni-simple-router](http://hhyang.cn/)的路由模式，配合[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)封装的后台模板。说明：该封装方法并非我原创，我也是从[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)学习搬砖过来的。如有其他的问题可私信我：QQ：455171924。

# 安装步骤
* 新建一个uni-app项目，启用uniCloud
* 复制源码到新建的项目
* npm install
* 创建云服务空间
* 上传所有云函数
* 初始化云数据库
* 运行到浏览器

本项目使用了vue-router，所以可以不用一直在pages.json编写路由，应在“/router/router”router。但pages.json必须配置一项存在的页面，不然会报错
