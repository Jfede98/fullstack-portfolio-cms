import { tv } from "tailwind-variants";

export const planTabStyle = tv({
  slots: {
    section: [
      "mx-auto",
      "w-full",
      "px-4",
      "pt-6",
      "md:mt-4",
      "xl:px-0",
      "max-w-container",
      "overflow-visible",
      "origin-center",
      "transition-transform"
    ],
    titleContainer: [
      "flex",
      "w-full",
      "flex-col",
      "items-center",
      "gap-2",
      "px-4",
      "md:px-0"
    ],
    titleText: ["text-center", "text-primary-900"],
    descriptionText: ["text-center", "text-gray-400"],
    tabsTrigger: [
      "w-full",
      "md:w-fit",
      "md:max-w-none",
      "my-3",
      "lg:my-4"
    ],
    tabsTriggerElementWrapper: [
      "py-2",
      "md:!min-w-max"
    ],
    tabsTriggerLabel: [
      "whitespace-nowrap",
      "overflow-hidden",
      "text-ellipsis",
      "text-center"
    ],
    categoryHeader: [
      "mx-auto",
      "flex",
      "w-full",
      "flex-col",
      "items-center",
      "gap-1",
      "text-center",
      "mb-4",
      "md:mb-6"
    ],
    categoryTitle: ["text-primary-900"],
    categoryDescription: ["text-gray-400"]
  },
  variants: {
    tabMode: {
      two: {
        tabsTrigger: [
          "!overflow-x-hidden",
          "md:!overflow-x-visible",
          "md:!overflow-visible"
        ],
        tabsTriggerElementWrapper: ["basis-1/2", "!min-w-0", "h-11", "px-2"],
        tabsTriggerLabel: ["text-body", "leading-6"]
      },
      three: {
        tabsTrigger: [
          "!overflow-x-hidden",
          "md:!overflow-x-visible",
          "md:!overflow-visible"
        ],
        tabsTriggerElementWrapper: [
          "basis-1/3",
          "!min-w-0",
          "h-[58px]",
          "px-1.5"
        ],
        tabsTriggerLabel: [
          "text-legal",
          "leading-4",
          "md:text-body",
          "md:leading-6"
        ]
      },
      many: {
        tabsTrigger: ["!overflow-x-auto", "snap-x"],
        tabsTriggerElementWrapper: [
          "shrink-0",
          "min-w-[112px]",
          "h-[58px]",
          "px-2",
          "snap-center"
        ],
        tabsTriggerLabel: [
          "text-legal",
          "leading-4",
          "md:text-body",
          "md:leading-6"
        ]
      }
    }
  },
  defaultVariants: {
    tabMode: "two"
  }
});
