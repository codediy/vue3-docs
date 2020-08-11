## createVNode()
- 在createApp().mount()中触发
- 根据组件初始化VNode实例的参数
- createApp()返回的VNode类型是STATEFUL_COMPONENT
- 在render()中则调用processComponent()进行挂载处理