import { tv } from "tailwind-variants";

export const CoverageFormStyle = tv({
  slots: {
    base: [
      "w-full",
      "md:min-w-0",
      "bg-white",
      "my:p-2",
      "flex",
      "flex-col",
      "gap-3",
      "md:gap-4",
      "rounded-2xl"
    ],
    top: ["flex", "gap-3", "md:gap-4", "flex-row", "text-primary-900"],
    title: ["text-lg", "md:text-xl", "font-medium", "block"],
    subTitle: ["text-xs", "md:text-sm", "text-gray-400", "block"],
    formContent: ["flex", "flex-col", "w-full"],
    inputsContainer: ["flex", "flex-col", "w-full"],
    checkboxContainer: ["mt-2", "w-full"],
    buttonContainer: ["mt-4", "w-full"],
    statusWrapper: [
      "flex",
      "flex-col",
      "items-center",
      "text-center",
      "gap-4",
      "py-6",
      "px-4"
    ],
    statusIcon: [
      "flex",
      "h-12",
      "w-12",
      "items-center",
      "justify-center",
      "rounded-full"
    ],
    statusTitle: ["text-base", "font-medium", "text-primary-900"],
    statusDescription: ["text-sm", "text-gray-400"],
    statusButton: ["w-full"]
  },
  variants: {
    showBorderLine: {
      true: {},
      false: {}
    },
    variant: {
      default: {
        base: ["max-w-[496px]"]
      },
      "semiautomatic-flow": {
        base: ["max-w-[313px]", "md:max-w-[543px]"],
        top: ["flex-col", "items-start", "gap-2", "md:gap-4", "md:w-full"],
        title: [
          "text-[#83378F]",
          "font-bold",
          "text-[20px]",
          "leading-6",
          "md:max-w-[533px]",
          "md:text-[40px]",
          "md:leading-[48px]"
        ],
        subTitle: [
          "text-[#2C2C30]",
          "font-normal",
          "text-[16px]",
          "leading-6",
          "md:w-full",
          "md:text-[20px]",
          "md:leading-[28px]"
        ],
        buttonContainer: [
          "mt-0",
          "sticky",
          "bottom-4",
          "z-10",
          "bg-gradient-to-t",
          "from-white",
          "via-white",
          "to-transparent",
          "pt-3"
        ]
      },
      "semiautomatic-data": {
        base: ["max-w-[360px]", "md:max-w-[561px]"],
        top: ["flex-col", "items-start", "gap-2", "md:gap-4", "md:w-full"],
        title: [
          "text-[#83378F]",
          "font-bold",
          "text-[22px]",
          "leading-7",
          "md:max-w-[561px]",
          "md:text-[40px]",
          "md:leading-[48px]"
        ],
        subTitle: [
          "text-[#2C2C30]",
          "font-normal",
          "text-[16px]",
          "leading-6",
          "md:w-full",
          "md:text-[20px]",
          "md:leading-[28px]"
        ],
        formContent: ["gap-4"],
        inputsContainer: ["gap-4"],
        checkboxContainer: ["mt-0"],
        buttonContainer: ["mt-0", "sticky", "bottom-4", "z-10", "bg-gradient-to-t", "from-white", "via-white", "to-transparent", "pt-3"]
      },
      "semiautomatic-error": {
        base: ["max-w-[313px]", "md:max-w-[458px]", "px-0", "py-0", "shadow-none", "rounded-none"],
        top: ["gap-2", "text-left", "md:text-center"],
        title: ["text-primary-500", "text-[22px]", "leading-7", "font-bold", "md:text-[40px]", "md:leading-[48px]"],
        subTitle: ["text-gray-500", "text-[18px]", "leading-6", "font-normal", "md:text-[22px]", "md:leading-7"],
        formContent: ["gap-4"],
        buttonContainer: ["mt-3"]
      },
      modal: {
        base: ["!p-0", "shadow-none", "max-w-full", "rounded-none"]
      },
      horizontal: {
        base: ["max-w-[496px]", "lg:max-w-[860px]", "lg:px-8", "lg:py-6"],
        formContent: [
          "lg:flex-row",
          "lg:flex-wrap",
          "lg:items-end",
          "lg:gap-4"
        ],
        inputsContainer: ["lg:flex-row", "lg:gap-4", "lg:flex-1", "lg:min-w-0"],
        checkboxContainer: ["lg:mt-0", "lg:w-full", "lg:order-3"],
        buttonContainer: [
          "lg:mt-0",
          "lg:w-auto",
          "lg:min-w-[200px]",
          "lg:flex-shrink-0",
          "lg:order-2",
          "lg:h-[56px]",
          "lg:flex",
          "lg:items-center",
          "lg:self-center",
          "lg:pt-2"
        ]
      },
      dsa: {
        base: [
          "max-w-[375px]",
          "px-0",
          "py-0",
          "gap-0",
          "rounded-none",
          "shadow-none",
          "mx-auto",
          "lg:max-w-[813px]",
          "lg:px-0",
          "lg:py-0"
        ],
        top: [
          "flex-col",
          "items-start",
          "gap-1",
          "mb-0",
          "pb-0",
          "text-left",
          "lg:items-center",
          "lg:text-center"
        ],
        title: [
          "text-[28px]",
          "leading-8",
          "font-bold",
          "text-primary-700",
          "lg:text-[32px]",
          "lg:leading-10"
        ],
        subTitle: [
          "text-[16px]",
          "leading-6",
          "text-gray-500",
          "mb-0",
          "lg:text-[16px]",
          "lg:leading-6"
        ],
        formContent: ["mt-0", "pt-0", "gap-3", "lg:gap-3"],
        inputsContainer: [
          "grid",
          "grid-cols-1",
          "mt-0",
          "pt-0",
          "gap-4",
          "w-full",
          "lg:grid-cols-2",
          "lg:gap-4"
        ],
        checkboxContainer: ["mt-0", "w-full", "lg:col-span-2"],
        buttonContainer: [
          "mt-0",
          "w-full",
          "lg:w-full",
          "lg:flex",
          "lg:justify-center"
        ]
      },
      columnLayout: {
        base: ["max-w-[496px]"],
        inputsContainer: [
          "grid",
          "grid-cols-1",
          "lg:grid-cols-2",
          "gap-4",
          "w-full"
        ]
      }
    },
    isBlock: {
      false: {
        base: [
          "py-2",
          "px-3"
        ]
      },
      true: {
        base: [
          "lg:px-8",
          "px-8",
          "py-6",
        ]
      }
    }
  },
  compoundVariants: [
    {
      variant: "semiautomatic-error",
      isBlock: true,
      class: {
        base: ["shadow-none", "px-0", "py-0", "lg:px-0"]
      }
    },
    {
      variant: "semiautomatic-flow",
      isBlock: true,
      class: {
        base: ["px-0", "py-0", "lg:px-0", "lg:py-0"]
      }
    },
    {
      variant: "semiautomatic-data",
      isBlock: true,
      class: {
        base: ["px-0", "py-0", "lg:px-0", "lg:py-0"]
      }
    },
    {
      isBlock: true,
      showBorderLine: true,
      class: {
        base: ["shadow-[inset_0_0_0_4px_theme(colors.gray.200)]"]
      }
    },
    {
      isBlock: true,
      showBorderLine: false,
      class: {
        base: ["shadow-none"]
      }
    }
  ],
  defaultVariants: {
    variant: "default",
    showBorderLine: true
  }
});

export const AddressFieldStyle = tv({
  slots: {
    wrapper: "relative",
    labelText: "text-[14px] leading-[20px] text-primary-900 font-normal block mb-2",
    inputWrapper: "relative w-full",
    input: [
      "w-full border rounded-lg px-3 py-[16px]",
      "text-gray-500 leading-6 font-normal text-[16px]",
      "placeholder:text-gray-300",
      "focus:outline-none focus:border-primary-500"
    ],
    spinnerWrapper: "absolute right-3 top-1/2 -translate-y-1/2",
    errorText: "text-red-400 text-[12px] leading-[16px] font-normal block mt-1 pl-1",
    hintText: "text-gray-400 text-[12px] leading-[16px] font-normal block mt-1 pl-1",
    dropdown: [
      "absolute z-50 w-full  bg-white border border-gray-200",
      "rounded-lg shadow-lg max-h-80 overflow-hidden"
    ],
    dropdownInner: "max-h-60 overflow-y-auto",
    locationBtn: [
      "w-full text-center px-4 py-3 text-[14px] transition-colors border-b border-gray-100",
      "flex items-center justify-center gap-2 font-medium"
    ],
    mapPinBtn: [
      "w-full text-center px-4 py-2.5 text-[14px] transition-colors border-b border-gray-100",
      "font-medium"
    ],
    loadingRow: "px-4 py-6 text-center text-gray-400 text-[14px]",
    loadingRowInner: "flex items-center justify-center gap-2",
    emptyRow: "px-4 py-6 text-center text-gray-400 text-[14px]",
    hintRow: "px-4 py-4 text-center text-gray-300 text-[13px]",
    option: [
      "w-full text-left px-4 py-2.5 text-[14px] transition-colors",
      "hover:bg-primary-50 hover:text-primary-700 cursor-pointer"
    ]
  },
  variants: {
    disabled: {
      true: {
        input: "bg-gray-100 text-gray-300 cursor-not-allowed"
      }
    },
    hasError: {
      true: {
        input: "border-red-500"
      },
      false: {
        input: "border-gray-100"
      }
    },
    locationLoading: {
      true: {
        locationBtn: "text-gray-400 cursor-not-allowed"
      },
      false: {
        locationBtn: "text-primary-600 hover:bg-primary-50 cursor-pointer"
      }
    },
    pinMode: {
      true: {
        mapPinBtn: "text-primary-700 bg-primary-50 cursor-pointer"
      },
      false: {
        mapPinBtn: "text-primary-600 hover:bg-primary-50 cursor-pointer"
      }
    },
    selected: {
      true: {
        option: "bg-primary-100 text-primary-700 font-medium"
      },
      false: {
        option: "text-gray-700"
      }
    }
  }
});
