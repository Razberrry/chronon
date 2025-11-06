import { useCallback, useRef, useState } from "react";

type TextDirection = "ltr" | "rtl";

export const useElementRef = () => {
  const elementRef = useRef<HTMLElement | null>(null);
  const observedElementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const lastWidthRef = useRef(0);
  const [widthInPixels, setWidthInPixels] = useState<number | undefined>(
    undefined
  );
  const [textDirection, setTextDirection] = useState<TextDirection>("ltr");

  const setRef = useCallback((element: HTMLElement | null) => {
    const currentElement = observedElementRef.current;

    if (element === currentElement) {
      return;
    }

    if (!element) {
      if (currentElement) {
        observerRef.current?.disconnect();
        observerRef.current = null;
        observedElementRef.current = null;
        elementRef.current = null;
        lastWidthRef.current = 0;
        setWidthInPixels(undefined);
      }
      return;
    }

    if (currentElement && currentElement !== element) {
      return;
    }

    observerRef.current?.disconnect();
    observerRef.current = null;

    elementRef.current = element;
    observedElementRef.current = element;

    const initialWidth = element.getBoundingClientRect().width;
    lastWidthRef.current = initialWidth;
    setWidthInPixels(initialWidth);
    setTextDirection(
      getComputedStyle(element).direction === "rtl" ? "rtl" : "ltr"
    );

    const observer = new ResizeObserver((entries) => {
      const nextWidth =
        entries[0]?.contentRect?.width ?? element.getBoundingClientRect().width;
      if (nextWidth !== lastWidthRef.current) {
        lastWidthRef.current = nextWidth;
        setWidthInPixels(nextWidth);
      }
    });

    observer.observe(element);
    observerRef.current = observer;
  }, []);

  return {
    ref: elementRef,
    setRef,
    width: widthInPixels,
    direction: textDirection,
  };
};
