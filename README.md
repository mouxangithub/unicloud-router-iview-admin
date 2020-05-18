# unicloud-router-iview-admin
一个简洁的后台管理系统模板，基于 uniCloud + iview + uni-simple-router 的后台管理系统

[演示地址:http://mouxangitee.gitee.io/unicloud-router-iview-admin](http://mouxangitee.gitee.io/unicloud-router-iview-admin)

## 特别感谢

首先我们先感谢一下[uni-simple-router](http://hhyang.cn/)的作者和[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)提供的开源模板让我学习，本人研发封装的这一套都是基于[uni-simple-router](http://hhyang.cn/)的路由模式，配合[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)封装的后台模板。说明：该封装方法并非我原创，我也是从[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)学习搬砖过来的。如有其他的问题可私信我：QQ：455171924。

## 安装步骤
# 方法一：
* 使用[uniapp插件市场](https://ext.dcloud.net.cn/plugin?id=1639)一键工程导入
* 选择项目，右键->使用命令行窗口打开所在目录，或使用系统自带的CMD进入项目运行 npm install
* 创建或选择云服务空间,进入manifest.json可视化重新获取appid
* 右键上传cloudfunctions-aliyun文件夹下所有云函数
* 选择/cloudfunctions-aliyun/db_init.json右键初始化云数据库
* 运行到浏览器
# 方法二：
* 使用[git工具](https://gitee.com/mouxangitee/unicloud-router-iview-admin)拉取
* 复制源码到新建的项目
* 选择项目，右键->使用命令行窗口打开所在目录，或使用系统自带的CMD进入项目运行 npm install
* 创建或选择云服务空间,进入manifest.json可视化重新获取appid
* 右键上传cloudfunctions-aliyun文件夹下所有云函数
* 选择/cloudfunctions-aliyun/db_init.json右键初始化云数据库
* 运行到浏览器

以上方法都是基于[HBuilderX工具开发](https://uniapp.dcloud.io/quickstart?id=_1-%e9%80%9a%e8%bf%87-hbuilderx-%e5%8f%af%e8%a7%86%e5%8c%96%e7%95%8c%e9%9d%a2)的方法,如是想通过[vue-cli构建](https://uniapp.dcloud.io/quickstart?id=_2-%e9%80%9a%e8%bf%87vue-cli%e5%91%bd%e4%bb%a4%e8%a1%8c)请自行参考官方文档进行调试。

## 变更日志
[发行说明](https://github.com/SilurianYang/uni-simple-router/releases) 中记录了每个发行版的详细信息更改。

## 问题
如有其他的问题可私信我：QQ：455171924

本项目使用了vue-router，所以可以不用一直在pages.json编写路由，应在“/router/router”router。但pages.json必须配置一项存在的页面，不然会报错
