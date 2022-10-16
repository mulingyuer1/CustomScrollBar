import getScrollbarWidth from "./utils/scrollbar-width";

import "./styles/reset.css";
import { off } from "process";

//滚动条宽度
const scrollbarWidth = getScrollbarWidth();

const scrollWrap: HTMLDivElement = document.querySelector(".scrollbar-wrap")!;
const scrollView: HTMLDivElement = document.querySelector(".scrollbar-view")!;
const verticalBarWrap: HTMLDivElement = document.querySelector(".scrollbar-slide-rail.is-vertical")!;
const horizontalBarWrap: HTMLDivElement = document.querySelector(".scrollbar-slide-rail.is-horizontal")!;
const verticalBar: HTMLDivElement = document.querySelector(".scrollbar-slide-rail.is-vertical .scrollbar-slide-bar")!;
const horizontalBar: HTMLDivElement = document.querySelector(
  ".scrollbar-slide-rail.is-horizontal .scrollbar-slide-bar"
)!;

if (scrollbarWidth > 0) {
  scrollWrap.style.marginRight = `-${scrollbarWidth}px`;
  scrollWrap.style.marginBottom = `-${scrollbarWidth}px`;
  scrollWrap.style.maxHeight = `calc(300px + ${scrollbarWidth}px)`;
}

//监听view的resize变化，重新计算滚动条
//ResizeObserver在observe时会调用一次回调，应该是底层原理导致，加个标志位来过滤
let isResize = false;
const resizeObserver = new ResizeObserver((entries) => {
  if (!isResize) {
    isResize = true;
    return;
  }

  entries.forEach(() => {
    setBarSize();
  });
});
resizeObserver.observe(scrollView);

//滚动滑块的位置
scrollWrap.addEventListener("scroll", () => {
  setBarPosition();
});

/** 计算bar的大小 */
function getBarSize() {
  const widthPercentage = (scrollWrap.clientWidth * 100) / scrollWrap.scrollWidth;
  const heightPercentage = (scrollWrap.clientHeight * 100) / scrollWrap.scrollHeight;

  const sizeWidth = widthPercentage < 100 ? widthPercentage : 0;
  const sizeHeight = heightPercentage < 100 ? heightPercentage : 0;

  return {
    width: sizeWidth,
    height: sizeHeight,
  };
}

/** 设置bar的大小 */
function setBarSize() {
  const size = getBarSize();
  //竖着的bar
  verticalBar.style.height = `${size.height}%`;
  //横着的bar
  horizontalBar.style.width = `${size.width}%`;
}

/** 设置bar的位置 */
function setBarPosition() {
  const moveY = (scrollWrap.scrollTop * 100) / scrollWrap.clientHeight;
  const moveX = (scrollWrap.scrollLeft * 100) / scrollWrap.clientWidth;

  //竖着的bar
  verticalBar.style.transform = `translateY(${moveY}%)`;
  //横着的bar
  horizontalBar.style.transform = `translateX(${moveX}%)`;
}

//初始化
setBarSize();
setBarPosition();

/** 竖着滑道点击事件 */
verticalBarWrap.addEventListener("click", (event) => {
  const target = event.currentTarget! as HTMLDivElement;
  const offset = Math.abs(target.getBoundingClientRect().top - event.clientY);
  const barHalf = verticalBar.offsetHeight / 2;

  //得到移动的距离与整个高度的比例
  const movePercentage = ((offset - barHalf) * 100) / target.offsetHeight;

  //移动滑块
  verticalBar.style.transform = `translateY(${movePercentage}%)`;
  scrollWrap.scrollTop = (movePercentage * scrollWrap.scrollHeight) / 100;
});

/** 横着滑道点击事件 */
horizontalBarWrap.addEventListener("click", (event) => {
  const target = event.currentTarget! as HTMLDivElement;
  const offset = Math.abs(target.getBoundingClientRect().left - event.clientX);
  const barHalf = horizontalBar.offsetWidth / 2;

  //得到移动的距离与整个高度的比例
  const movePercentage = ((offset - barHalf) * 100) / target.offsetWidth;

  //移动滑块
  horizontalBar.style.transform = `translateX(${movePercentage}%)`;
  scrollWrap.scrollLeft = (movePercentage * scrollWrap.scrollWidth) / 100;
});

/** 竖着滑块拖拽 */
let barMoveY: number = 0;
let cursorDown: boolean = false;
verticalBar.addEventListener("mousedown", (event) => {
  if (event.ctrlKey || event.button === 2) {
    return;
  }
  event.stopImmediatePropagation();
  cursorDown = true;

  const target: HTMLDivElement = event.currentTarget! as HTMLDivElement;
  //监听move和up事件
  document.addEventListener("mousemove", verticalBarMove);
  document.addEventListener("mouseup", verticalBarUp);

  //拖拽滚动块时，此时禁止鼠标长按划过文本选中。
  document.onselectstart = () => false;

  barMoveY = target.offsetHeight - (event.clientY - target.getBoundingClientRect().top);
});

/** 竖着滑块的move事件 */
function verticalBarMove(event: MouseEvent) {
  if (!cursorDown) return;
  const prevPage = barMoveY;
  if (!prevPage) return;

  const offset = (verticalBarWrap.getBoundingClientRect().top - event.clientY) * -1;
  const thumbClickPosition = verticalBar.offsetHeight - prevPage;
  const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / verticalBarWrap.offsetHeight;

  scrollWrap.scrollTop = (thumbPositionPercentage * scrollWrap.scrollHeight) / 100;
}

/** 竖着滑块的mouseup事件 */
function verticalBarUp() {
  cursorDown = false;
  document.removeEventListener("mousemove", verticalBarMove);
  document.removeEventListener("mouseup", verticalBarUp);
  document.onselectstart = null;
}

/** 横着滑块拖拽 */
let barMoveX: number = 0;
horizontalBar.addEventListener("mousedown", (event) => {
  if (event.ctrlKey || event.button === 2) {
    return;
  }
  event.stopImmediatePropagation();
  cursorDown = true;

  const target: HTMLDivElement = event.currentTarget! as HTMLDivElement;
  //监听move和up事件
  document.addEventListener("mousemove", horizontalBarMove);
  document.addEventListener("mouseup", horizontalBarUp);

  //拖拽滚动块时，此时禁止鼠标长按划过文本选中。
  document.onselectstart = () => false;

  barMoveX = target.offsetWidth - (event.clientX - target.getBoundingClientRect().left);
});

/** 横着滑块的move事件 */
function horizontalBarMove(event: MouseEvent) {
  if (!cursorDown) return;
  const prevPage = barMoveX;
  if (!prevPage) return;

  const offset = (horizontalBarWrap.getBoundingClientRect().left - event.clientX) * -1;
  const thumbClickPosition = horizontalBar.offsetWidth - prevPage;
  const thumbPositionPercentage = ((offset - thumbClickPosition) * 100) / horizontalBarWrap.offsetWidth;

  scrollWrap.scrollLeft = (thumbPositionPercentage * scrollWrap.scrollWidth) / 100;
}

/** 横着滑块的mouseup事件 */
function horizontalBarUp() {
  cursorDown = false;
  document.removeEventListener("mousemove", horizontalBarMove);
  document.removeEventListener("mouseup", horizontalBarUp);
  document.onselectstart = null;
}
