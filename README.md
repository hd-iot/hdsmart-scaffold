# hdsmart-scaffold

---
### 准备清单：
+ 本地需要安装NodeJS 和 npm，请先[安装](https://nodejs.org/en/)。

### 准备步骤：
+ 由于本地运行的是https服务，因此需要先初始化一个https证书:
```text
cmd定位到目录（如 D:/dev/https-csr/ ）
生成客户端私钥
 openssl genrsa -out client-key.pem
 
利用私钥生成CSR
 openssl req -new -key client-key.pem -out client-csr.pem

生成客户端证书
 openssl x509 -req -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial -in client-csr.pem -out client-cert.pem
```
+ 安装全局 客户端工具：
```text
npm install hdsmart-cli -g
```
+ cmd定位到准备开发的目录，如`d:/work/`，运行如下命令，相关参数请参考提示说明
```text
hd-iot init air_condition
```
+ `cd air_condition`
分别按照顺序运行如下命令：
+ 启动本地的socket代理服务器：`npm run proxy`
+ 启动本地开发的https server，并打开浏览器:`npm run dev`, 在自动打开的默认浏览器（如果用户默认浏览器是ie，请将打开的url复制到chrome）上打开


### 说明：
服务模式为：`本地web<---> socket代理服务器 <--->路由器router`。
有三种通讯方式：
+ 只发不收:
  > web只send一个消息出去，不需要接收回调通知。
  一般不这样用，除非的确非常弱的功能，如log上报。

+ 只收不发
  > 在web端预先定义好回调函数，无需request_id。当接收到router的push消息时，执行对应回调。

+ 又收又发
  > 大多数场景。  
  类似http里request-response的1对1的模式。在client端定义一个Map，request里面带入一个request_id，
  在回调处理里面，server将其透传回来，只要找到Map里面对应的req id，那么就将回报json去执行其回调函数，然后可以将Map里面对应的项消除。



