"use client";

import { Children, cloneElement, isValidElement, type ReactElement } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Tiny Radix-style Slot — merges props/className onto the single child element
 * so a <Button asChild><Link href="..."/></Button> renders as a styled <a>
 * without nesting an interactive button inside it.
 */
export function Slot({
  children,
  className,
  ...rest
}: {
  children?: React.ReactNode;
  className?: string;
} & Record<string, unknown>) {
  if (children === undefined || children === null) return null;
  const child = Children.only(children);
  if (!isValidElement(child)) return null;
  const childEl = child as ReactElement<{ className?: string }>;
  return cloneElement(childEl, {
    ...rest,
    className: cn(className, childEl.props.className)
  } as Record<string, unknown>);
}
