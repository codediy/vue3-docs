## withInstance(instance,f)
- instance  状态管理对象
- f         注册状态信息到instance内部 


## makeHooksSystem => (hooks,config) => {withInstance,hooks}

- hooks     注册的状态管理函数
- config    初始化回调函数与错误提示

- withInstance  返回的可注册状态管理对象接口
- hooks         已注册的hooks，对原始hooks参数的处理结果
