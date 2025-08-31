import { PanEndEvent, UsePanStrategy } from "dnd-timeline";
import { useLayoutEffect } from "react";

export const useHorizontalDragScroll: UsePanStrategy = (timelineBag, onPanEnd) => {
  useLayoutEffect(() => {
    const el = timelineBag.timelineRef.current;
    if (!el) return;
    let isDragging = false;
    let lastX = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      lastX = e.clientX;
      el.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;

      const panEvent: PanEndEvent = {
        clientX: e.clientX,
        clientY: e.clientY,
        deltaX: -dx, // Invert so drag direction feels natural
        deltaY: 0,
      };
      onPanEnd(panEvent);
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = "";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onPanEnd, timelineBag.timelineRef]);
};
