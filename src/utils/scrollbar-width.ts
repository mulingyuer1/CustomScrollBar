/*
 * @Author: mulingyuer
 * @Date: 2022-10-15 21:18:02
 * @LastEditTime: 2022-10-15 22:04:59
 * @LastEditors: mulingyuer
 * @Description: 获取滚动条宽度
 * @FilePath: \vite-demo\src\utils\scrollbar-width.ts
 * 怎么可能会有bug！！！
 */

let scrollbarWidth: number;

export default function getScrollbarWidth(): number {
  if (typeof scrollbarWidth === "number") return scrollbarWidth;

  //创建容器元素
  const scrollBox = document.createElement("div");
  scrollBox.style.position = "absolute";
  scrollBox.style.top = "-9999px";
  scrollBox.style.visibility = "hidden";
  scrollBox.style.width = "100px";
  document.body.appendChild(scrollBox);

  //计算没有滚动条时的宽度
  const noScrollWidth = scrollBox.offsetWidth;
  //设置滚动条
  scrollBox.style.overflow = "scroll";

  //插入内容容器
  const innerBox = document.createElement("div");
  innerBox.style.width = "100%";
  scrollBox.appendChild(innerBox);

  //计算此时内容容器的宽度
  const innerBoxWidth = innerBox.offsetWidth;

  //销毁
  scrollBox.parentNode?.removeChild(scrollBox);

  //计算滚动条宽度
  scrollbarWidth = noScrollWidth - innerBoxWidth;

  return scrollbarWidth;
}
