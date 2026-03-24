import { useScrollReveal } from "../hooks/useScrollReveal";
import { cn } from "../lib/cn";

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}) {
  const { ref, isVisible } = useScrollReveal();

  const transforms = {
    up: "translate-y-5",
    down: "-translate-y-5",
    left: "translate-x-5",
    right: "-translate-x-5",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-500 ease-out will-change-[opacity,transform]",
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${transforms[direction]} pointer-events-none`,
        className
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
