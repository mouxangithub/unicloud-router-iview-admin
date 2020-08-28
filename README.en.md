<h1> unicloud-router-iview-admin </h1>

[中文文档](README.md) | [English Docs](README.en.md)

A concise background management system template，Background management system based on uniCloud + IView + Uni-Simple-Router

Demo：[unicloud-router-iview-admin](http://mouxangitee.gitee.io/unicloud-router-iview-admin)

<a href='https://gitee.com/mouxangitee/unicloud-router-iview-admin/stargazers'>
  <img src='https://gitee.com/mouxangitee/unicloud-router-iview-admin/badge/star.svg?theme=dark' alt='star'></img>
</a> 
<a href='https://gitee.com/mouxangitee/unicloud-router-iview-admin/members'>
  <img src='https://gitee.com/mouxangitee/unicloud-router-iview-admin/badge/fork.svg?theme=dark' alt='fork'></img>
</a>

## Due to the busy business recently, the update speed may be slow. The author has not given up updating yet. Thank you for your support。
## And because it's a personal study, a lot of times it's less well thought out, So if you have any good ideas you can contact me (QQ：455171924;WX：s455171924),Tell me your precious thoughts。

# Special Thanks

First of all, let me thank developer of [uni-simple-router](http://hhyang.cn/) or developer of [iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/) , Open source templates provided for me to learn, The package I developed and packaged is based on the routing mode of [uni-simple-router](http://hhyang.cn/)，Cooperate with [iView-admin2.0](https://lison16.github.io/iview-admin-doc/#/) encapsulated background template。Note: the packaging method is not my original, I am learning from [iView - admin2.0](https://lison16.github.io/iview-admin-doc/#/) to move the brick。If you have any other questions, please let me know。

# 目录结构
```
├── api                     AJAX Requests
├── assets                  Static Resources
|   ├── icons               Custom icon resources
|   └── images              Static image
├── cloudfunctions-aliyun   Configure the cloud development directory
|   └── api                 Server API cloud functions
|       ├── config          Configuration item
|       ├── common          Common plug-in module
|       ├── controller      Business logic function
|       ├── libs            Set of functions
|       └── index.js        Root folder
├── components              components
├── config                  Configuration item
├── layout                  layout
├── libs                    Set of functions
├── build.js                Node.js runs the script
├── router                  Route configuration
├── store                   Vuex configuration
├── view                    Page layout view
├── App.vue                 Global life cycle and global style configuration
├── manifest.json           Application configuration
├── main.js                 Vue initializes the entry
├── pages.json              Configure page routing (With uni-Smail-Router, you only need to configure one existing page.No frequent configuration in later stage)
└── README.md               README 
```

# Installation procedure

It is recommended to use YARN to replace NPM with the specific installation method

## Plan A:
* Use [uniapp插件市场](https://ext.dcloud.net.cn/plugin?Id =1639) one-click project import
* Select the project, right-click -> to open the directory using the command line window, or use the built-in CMD to enter the project to run yarn(NPM) run build to download the dependency package
* To create or select the cloud service space, go to manifest.json visualization to retrieve the AppID
* Right-click to upload all cloudfunctions-aliyun
* Select /cloudfunctions-aliyun/db_init.json to right-click to initialize the cloud database
* Use HBuilderx to run to the browser

## Plan B:
* Using git tools [unicloud-router-iview-admin](https://gitee.com/mouxangitee/unicloud-router-iview-admin) pull
* Select the project, right-click -> to open the directory using the command line window, or use the built-in CMD to enter the project to run yarn(NPM) run build to download the dependency package
* To create or select the cloud service space, go to manifest.json visualization to retrieve the AppID
* Right-click to upload all cloudfunctions-aliyun
* Select /cloudfunctions-aliyun/db_init.json to right-click to initialize the cloud database
* Use HBuilderx to run to the browser

The above methods are all based on the [HBuilderX](https://uniapp.dcloud.io/quickstart?id=_1-%e9%80%9a%e8%bf%87-hbuilderx-%e5%8f%af%e8%a7%86%e5%8c%96%e7%95%8c%e9%9d%a2) method
If you want to go through [vue-cli build](https://uniapp.dcloud.io/quickstart?id=_2-%e9%80%9a%e8%bf%87vue-cli%e5%91%bd%e4%bb%a4%e8%a1%8c), please refer to the official documentation for debugging
To publish, modify the run base path

# Update log

[releases](https://gitee.com/mouxangitee/unicloud-router-iview-admin/releases) Detailed information changes are documented for each release。

# Issues

You can ask questions as we know in Lssues of git, and I'll take the time to answer them for you, [Issues](https://gitee.com/mouxangitee/unicloud-router-iview-admin/issues/I1HX8E)

# Notice
vue-router was used for this project, So you don't have to write the route in pages.json all the router, The configuration should be under "/router/router"。But pages.json must configure a page where an item exists, otherwise it will report an error

# Statement
This project is an OPEN source MIT protocol project, it can be used commercially, but all the consequences have nothing to do with the author, nothing to do with the open source project, remember!!

f you think this project is ok, please touch your hands and help me to click the star above, thank you

<p align="center">
  <a href='https://gitee.com/mouxangitee/unicloud-router-iview-admin'>
    <img src='https://gitee.com/mouxangitee/unicloud-router-iview-admin/widgets/widget_6.svg' alt='Fork me on Gitee'></img>
  </a>
</p>
