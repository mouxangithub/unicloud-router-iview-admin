<h1> unicloud-router-iview-admin </h1>

[中文文档](README.md) | [English Docs](README.en.md)

一个简洁的后台管理系统模板，基于 uniCloud + iview + uni-simple-router 的后台管理系统

示范模板：[unicloud-router-iview-admin](http://mouxangitee.gitee.io/unicloud-router-iview-admin)

<a href='https://gitee.com/mouxangitee/unicloud-router-iview-admin/stargazers'>
  <img src='https://gitee.com/mouxangitee/unicloud-router-iview-admin/badge/star.svg?theme=dark' alt='star'></img>
</a> 
<a href='https://gitee.com/mouxangitee/unicloud-router-iview-admin/members'>
  <img src='https://gitee.com/mouxangitee/unicloud-router-iview-admin/badge/fork.svg?theme=dark' alt='fork'></img>
</a>

## 因最近业务比较忙, 所以更新速度可能会比较慢, 作者暂未放弃更新, 感谢大家支持。
## 因为是个人开发, 很多时候考虑没那么周全, 所以大家如果有什么好的点子可以联系我（QQ：455171924；WX：s455171924）, 告诉我你宝贵的想法.

## 2020.9.4 新增移动端扫码登录后台，移动端示范请前往[unicloud-app](https://gitee.com/mouxangitee/unicloud-app)查看，app扫码登录，众小程序扫码登录（普通码理论上都可以（除了h5不支持uni.scan），具体只测试了app和小程序，微信小程序二维码仅微信小程序可登录）

# 特别感谢

首先我们先感谢一下[uni-simple-router](http://hhyang.cn/)的作者和[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)提供的开源模板让我学习，本人研发封装的这一套都是基于[uni-simple-router](http://hhyang.cn/)的路由模式，配合[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)封装的后台模板。说明：该封装方法并非我原创，我也是从[iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/)学习搬砖过来的。如有其他的问题可私信我。

# 目录结构
```
├── api                     ajax请求
├── assets                  项目静态资源
|   ├── icons               自定义图标资源
|   └── images              图片资源
├── cloudfunctions-aliyun   配置云开发目录
|   └── api                 服务端api云函数
|       ├── config          配置项
|       ├── common          公共插件
|       ├── controller      业务逻辑函数
|       ├── libs            函数集
|       └── index.js        中控
├── components              组件资源
├── config                  项目配置
├── layout                  布局资源
├── libs                    封装的函数方法
├── build                   Node.js运行脚本
├── router                  路由配置
├── store                   Vuex配置
├── view                    页面视图文件
├── App.vue                 全局生命周期和全局样式配置
├── manifest.json           应用配置
├── main.js                 vue初始化入口
├── pages.json              配置页面路由（使用uni-smail-router后可只配置一个存在的页面。后期无需频繁配置）
└── README.md               说明文档 
```

# 安装步骤

推荐使用yarn来替换npm，具体使用安装方法自行百度

## 方法一：
* 使用[uniapp插件市场](https://ext.dcloud.net.cn/plugin?id=1639)一键工程导入
* 选择项目，右键->使用命令行窗口打开所在目录，或使用系统自带的CMD进入项目运行 yarn(npm) run build 进行下载依赖包
* 创建或选择云服务空间,进入manifest.json可视化重新获取appid
* 右键上传cloudfunctions-aliyun文件夹下所有云函数(云函数上传完后请进云开发控制台将函数执行内存改至最大)
* 选择/cloudfunctions-aliyun/db_init.json右键初始化云数据库
* 使用HBuilderx运行到浏览器

## 方法二：
* 使用[git工具](https://gitee.com/mouxangitee/unicloud-router-iview-admin)拉取
* 复制源码到新建的项目
* 选择项目，右键->使用命令行窗口打开所在目录，或使用系统自带的CMD进入项目运行 yarn(npm) run build 进行下载依赖包
* 创建或选择云服务空间,进入manifest.json可视化重新获取appid
* 右键上传cloudfunctions-aliyun文件夹下所有云函数(云函数上传完后请进云开发控制台将函数执行内存改至最大)
* 选择/cloudfunctions-aliyun/db_init.json右键初始化云数据库
* 使用HBuilderx运行到浏览器

以上方法都是基于[HBuilderX工具开发](https://uniapp.dcloud.io/quickstart?id=_1-%e9%80%9a%e8%bf%87-hbuilderx-%e5%8f%af%e8%a7%86%e5%8c%96%e7%95%8c%e9%9d%a2)的方法
如是想通过[vue-cli构建](https://uniapp.dcloud.io/quickstart?id=_2-%e9%80%9a%e8%bf%87vue-cli%e5%91%bd%e4%bb%a4%e8%a1%8c)请自行参考官方文档进行调试。
发布请修改运行基础路径

# 变更日志

[发行说明](https://gitee.com/mouxangitee/unicloud-router-iview-admin/releases) 中记录了每个发行版的详细信息更改。

# 问题

大家有问题可以在GIT的lssues提问，我会抽空帮大家解答：[提问贴](https://gitee.com/mouxangitee/unicloud-router-iview-admin/issues/I1HX8E)

# 注意
本项目使用了vue-router，所以可以不用一直在pages.json编写路由，应在“/router/router”配置。但pages.json必须配置一项存在的页面，不然会报错

# 声明
该项目为MIT协议开源项目，可商用，但出现的一切后果与作者无关，与该开源项目无关，切记！！！

如果觉得这个项目可以的话，麻烦大家动动您的小手帮我点一下上面的star，感谢

<p align="center">
  <a href='https://gitee.com/mouxangitee/unicloud-router-iview-admin'>
    <img src='https://gitee.com/mouxangitee/unicloud-router-iview-admin/widgets/widget_6.svg' alt='Fork me on Gitee'></img>
  </a>
</p>
