/*
 * @Author: mulingyuer
 * @Date: 2022-10-10 19:44:35
 * @LastEditTime: 2022-10-10 20:20:50
 * @LastEditors: mulingyuer
 * @Description: vite配置
 * @FilePath: \vite-demo\vite.config.ts
 * 怎么可能会有bug！！！
 */
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
