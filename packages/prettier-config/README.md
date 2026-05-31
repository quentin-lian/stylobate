# `@stylobate/prettier-config`

Monorepo 共享的 Prettier 配置。统一代码风格 + 统一 import 排序。

## 配置摘要

- 单引号、`semi: true`、`trailingComma: 'all'`
- `printWidth: 100`、`tabWidth: 2`、`endOfLine: 'lf'`
- 内置 [`@ianvs/prettier-plugin-sort-imports`](https://github.com/IanVS/prettier-plugin-sort-imports)，按"内置 / 三方 / `@stylobate/` / 相对路径"分组

## 使用

`package.json` 里加：

```json
{
  "prettier": "@stylobate/prettier-config"
}
```

不要再写 `.prettierrc`，避免歧义。

## 安装

```bash
pnpm add -D prettier @stylobate/prettier-config
```

> Tailwind 项目请改用 [`@stylobate/prettier-config-tailwind`](../prettier-config-tailwind)。

## 覆盖某些规则

要扩展或覆盖单个项目，写一份 `prettier.config.js`：

```js
import base from '@stylobate/prettier-config';

export default {
  ...base,
  printWidth: 120,
};
```
