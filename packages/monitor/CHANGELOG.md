# @stylobate/monitor

## 0.1.0

### Minor Changes

- [`8bb46f1`](https://github.com/quentin-lian/stylobate/commit/8bb46f1fd0b1f634f35982a6446b01cc94bef4c9) Thanks [@quentin-lian](https://github.com/quentin-lian)! - 新增两个包：
  - `@stylobate/monitor`：Sentry 错误监控封装，提供统一初始化、captureException/captureMessage/setUser/setTag/addBreadcrumb API，支持模块注入便于测试
  - `@stylobate/analytics`：平台无关的埋点 SDK，adapter 模式支持任意平台对接，内置 ConsoleAdapter、事件队列与批量发送
