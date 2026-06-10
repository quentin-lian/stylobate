---
'@stylobate/monitor': minor
'@stylobate/analytics': minor
---

新增两个包：

- `@stylobate/monitor`：Sentry 错误监控封装，提供统一初始化、captureException/captureMessage/setUser/setTag/addBreadcrumb API，支持模块注入便于测试
- `@stylobate/analytics`：平台无关的埋点 SDK，adapter 模式支持任意平台对接，内置 ConsoleAdapter、事件队列与批量发送
