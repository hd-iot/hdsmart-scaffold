web<--->router之间通过socket连接，有三种模式：

+ 只发不收:
  > web只send一个消息出去，不需要接收回调通知。
  一般不这样用，除非的确非常弱的功能，如log上报。

+ 只收不发
  > 在web端预先定义好回调函数，无需request_id。当接收到router的push消息时，执行对应回调。

+ 又收又发
  > 大多数场景。  
  类似http里request-response的1对1的模式。在client端定义一个Map，request里面带入一个request_id，
  在回调处理里面，server将其透传回来，只要找到Map里面对应的req id，那么就将回报json去执行其回调函数，然后可以将Map里面对应的项消除。


本地的socket server(NodeJS) 作为一个纯粹的proxy，不做任何的额外的封装处理，纯转发。通信模型如下图：
>
    web   <--->   (proxy server <-> proxy client)   <--->   router

    
请求格式:
```json
{
    "uuid": "111",
    "encry": "false",
    "content": {
        "method": "dm_add_device",
        "timestamp": 1513331550105,
        "req_id": 1001,
        "params": {
            "family_id": 5555,
            "room_id": 1,
            "user_id": 5555,
            "device_category_id": "000e83c6c1",
            "product_id": 1
        }
    }
}
```

回包格式:
```json
{
    "uuid": "00fbfca7bf0000000000000001026666",
    "encry": "false",
    "content": {
        "method": "dm_add_device",
        "timestamp": 1513330431,
        "req_id": 1002,
        "msg": "Timeout",
        "code": -83003,
        "result": {}
    }
}
```

WebSocket 客户端内存中回调数据结构
```$xslt
CallbackMaps:
{
    [method 1] : {
        [req_id 1] : {
            success : /* Function */,
            fail : /* Function */
        },
        ...
    },
    ...
}
```
