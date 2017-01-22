H5动画秀
============
提供 `动画秀` 场景构建


采用技术
----------
前端：Zepto
<br/>
服务端：nodejs+express+log4js+ejs

开发规范
--------
所有模块开发controller均在controllers目录下创建，提供公共api服务：common/api，以及系统配置项：config/config-*.js
<br/>
日志采用log4js、全局对象LOG、支持trace、debug、info、warn、error、fatal

应用打包
--------
使用nodejs gulp编译源文件，archiver打包zip，打包后的文件格式 {projectName}-{version}-{date}.zip
##### step.1 编译源文件
```
gulp build
```

##### step.2  执行打包
```
node archive.js
```

应用发布（上传ftp）
-----------------------------
将打包的zip文件上传到指定的ftp地址
##### step.1 设置上传ftp目录
```
set FTP_DIR=online
```

##### step.2 执行上传ftp
```
node uploadFtp.js
```

应用打包&发布
-----------------------------
直接执行发布对应环境的批处理文件deploy-ftp-{dev}.bat


应用部署
----------
requirement `node.js`
```
yum install nodejs npm
```

##### step.1
```
npm install -g forever
```

##### step.2
```
unzip *.zip
```

##### step.3
```
cd /{path}/config  编辑对应环境配置文件配置
```

应用启动
----------
#### start service
```
nodeshell start
```

#### check service status
```
nodeshell status
```

#### restart service
```
nodeshell restart
```

#### stop service
```
nodeshell stop
```

版本迭代
--------
> ### 2016-12-30 version 1.0.3
>> #### 爬虫授权成功参数base64编码
>>> * 爬虫授权成功重定向参数进行base64编码处理

> ### 2016-12-12 version 1.0.2
>> #### 优化自研京东交互
>>> * 优化自研京东交互逻辑

> ### 2016-12-07 version 1.0.1
>> #### 解决bug
>>> * 修改爬虫授权交互，异步ajax请求导致页面显示错乱以及逻辑问题

> ### 2016-09-14 version 1.0.0
>> #### 系统构建
>>> * 实现nodejs系统框架构建，以及系统功能实现