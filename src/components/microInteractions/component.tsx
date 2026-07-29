import React, { useEffect, useRef, useState } from "react";
import "./microInteractions.css";

type RippleProps = { children: React.ReactElement; className?: string };

export const Ripple: React.FC<RippleProps> = ({ children, className = "" }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const nextId = useRef(0);
  const child = React.Children.only(children) as React.ReactElement<any>;
  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    child.props.onPointerDown?.(event);
    if (event.defaultPrevented) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const id = nextId.current++;
    setRipples((items) => [...items, { id, x: event.clientX - bounds.left, y: event.clientY - bounds.top }]);
    window.setTimeout(() => setRipples((items) => items.filter((item) => item.id !== id)), 180);
  };
  return React.cloneElement(child, {
    ...child.props,
    onPointerDown,
    className: `${child.props.className || ""} ripple-target ${className}`.trim(),
    children: <>{child.props.children}{ripples.map((ripple) => <span key={ripple.id} className="ui-ripple" style={{ left: ripple.x, top: ripple.y }} />)}</>,
  });
};

export const CountUp: React.FC<{ value: number; duration?: number; className?: string }> = ({ value, duration = 700, className }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDisplay(value); return; }
    const start = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);
  return <span className={className}>{display.toLocaleString()}</span>;
};

export const ProgressFill: React.FC<{ value: number; className?: string }> = ({ value, className = "" }) => {
  const [updating, setUpdating] = useState(false);
  const previous = useRef(value);
  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    setUpdating(true);
    const timer = window.setTimeout(() => setUpdating(false), 1500);
    return () => window.clearTimeout(timer);
  }, [value]);
  return <span className={`${className} ${updating ? "progress-fill-updating" : ""}`.trim()} style={{ width: `${value}%` }} />;
};
