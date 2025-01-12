"use client";

import React from "react";
import {usePathname, useRouter} from "next/navigation";
import {
  Listbox,
  ListboxItem,
  ListboxSection,
  Accordion,
  AccordionItem,
  cn,
  type ListboxProps,
  type ListboxSectionProps,
} from "@nextui-org/react";
import {Tooltip} from "@nextui-org/react";

export enum SidebarItemType {
  Nest = "nest",
}

export type SidebarItem = {
  key: string;
  title: string;
  icon?: React.ReactNode;
  href?: string;
  can: string;
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem[];
  className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children"> & {
  items: SidebarItem[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps["classNames"];
  classNames?: ListboxProps["classNames"];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      items,
      isCompact,
      onSelect,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      iconClassName,
      classNames,
      className,
      ...props
    },
    ref,
  ) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleItemClick = React.useCallback(
      (e: React.MouseEvent, href?: string) => {
        e.preventDefault();
        if (href) {
          router.push(href);
        }
      },
      [router],
    );

    const hasActiveChild = (items: SidebarItem[], currentPath: string): boolean => {
      return items.some((item) => {
        if (item.href && currentPath.startsWith(item.href)) {
          return true;
        }
        if (item.items && item.items.length > 0) {
          return hasActiveChild(item.items, currentPath); // Cek secara rekursif
        }
        return false;
      });
    };

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, "w-full", {
        "p-0 max-w-[44px]": isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        "flex flex-col gap-1": isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        hidden: isCompact,
      }),
    };

    const renderNestItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType =
          item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

        const isOpen = hasActiveChild(item.items || [], pathname);

        const modifiedItem = {...item};
        if (isNestType) {
          delete modifiedItem.href;
        }

        return (
          <ListboxItem
            {...modifiedItem}
            key={modifiedItem.key}
            classNames={{
              base: cn(
                {
                  "h-auto p-0": !isCompact && isNestType,
                },
                {
                  "inline-block w-13": isCompact && isNestType,
                },
                "data-[hover=true]:bg-transparent",
              ),
            }}
            endContent={isCompact || isNestType || hideEndContent ? null : item.endContent ?? null}
            startContent={
              isCompact || isNestType ? null : item.icon ? (
                <div
                  className={cn(
                    "text-default-500 ",
                    iconClassName,
                  )}
                >
                  {item.icon}
                </div>
              ) : (
                item.startContent ?? null
              )
            }
            title={isCompact || isNestType ? null : item.title}
          >
            {/* Tooltip khusus jika compact */}
            {isCompact ? (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <div
                      className={cn(
                        "text-default-500 ",
                        iconClassName,
                      )}
                    >
                      {item.icon}
                    </div>
                  ) : (
                    item.startContent ?? null
                  )}
                </div>
              </Tooltip>
            ) : null}

            {/* Jika Nest & tidak compact, render Accordion */}
            {!isCompact && isNestType ? (
              <Accordion className="p-0" defaultExpandedKeys={isOpen ? [item.key] : []}>
                <AccordionItem
                  key={item.key}
                  aria-label={item.title}
                  classNames={{
                    heading: "pr-3",
                    trigger: "p-0",
                    content: "py-0 pl-4",
                  }}
                  title={
                    item.icon ? (
                      <div className="flex h-11 items-center gap-2 px-2 py-1.5">
                        <div
                          className={cn(
                            "text-default-500 ",
                            iconClassName,
                          )}
                        >
                          {item.icon}
                        </div>
                        <span className="text-small font-medium text-default-500 ">
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      item.startContent ?? null
                    )
                  }
                >
                  {/* Render item list nested */}
                  {item.items && item.items?.length > 0 ? (
                    <Listbox
                      className="mt-0.5"
                      classNames={{
                        list: cn("border-l border-default-200 pl-4"),
                      }}
                      itemClasses={{
                        base: cn(
                          "px-2 min-h-11 rounded-xl h-[43px]",
                        ),
                        title: cn(
                          "text-small font-medium text-default-500",
                        ),
                      }}
                      items={item.items}
                      variant="flat"
                    >
                      {item.items.map(renderItem)}
                    </Listbox>
                  ) : (
                    renderItem(item)
                  )}
                </AccordionItem>
              </Accordion>
            ) : null}
          </ListboxItem>
        );
      },
      [isCompact, hideEndContent, iconClassName],
    );

    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        const isActive = pathname.startsWith(item.href ?? "");
        
        const isNestType =
          item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

        if (isNestType) {
          return renderNestItem(item);
        }

        return (
          <ListboxItem
            {...item}
            key={item.key}
            onClick={(e) => handleItemClick(e, item.href)}
            className={cn(
              item.className,
              {
                "bg-default-100": isActive,
              },
            )}
            startContent={
              isCompact
                ? null
                : item.icon
                  ? (
                    <div
                      className={cn(
                        "text-default-500",
                        iconClassName,
                      )}
                    >
                      {item.icon}
                    </div>
                  )
                  : item.startContent ?? null
            }
            endContent={isCompact || hideEndContent ? null : item.endContent ?? null}
            textValue={item.title}
            title={isCompact ? null : `${item.title}`}
          >
            {isCompact ? (
              <Tooltip content={item.title} placement="right">
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <div
                      className={cn(
                        "text-default-500 ",
                        iconClassName,
                      )}
                    >
                      {item.icon}
                    </div>
                  ) : (
                    item.startContent ?? null
                  )}
                </div>
              </Tooltip>
            ) : null}
          </ListboxItem>
        );
      },
      [isCompact, iconClassName, hideEndContent, renderNestItem, handleItemClick],
    );

    return (
      <Listbox
        key={isCompact ? "compact" : "default"}
        ref={ref}
        hideSelectedIcon
        as="nav"
        className={cn("list-none", className)}
        classNames={{
          ...classNames,
          list: cn("items-center", classNames?.list),
        }}
        color="default"
        itemClasses={{
          base: cn(
            "px-2 min-h-11 rounded-xl h-[43px]",
          ),
          title: cn(
            "text-small font-medium text-default-500",
          ),
        }}
        items={items}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0];
          onSelect?.(key as string);
        }}
        selectionMode="single"
        variant="flat"
        {...props}
      >
        {(item) => {
          if (item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest) {
            return renderNestItem(item);
          } else if (item.items && item.items?.length > 0) {
            return (
              <ListboxSection
                key={item.key}
                classNames={sectionClasses}
                showDivider={isCompact}
                title={item.title}
              >
                {item.items.map(renderItem)}
              </ListboxSection>
            );
          } else {
            return renderItem(item);
          }
        }}
      </Listbox>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;