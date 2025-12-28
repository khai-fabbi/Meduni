export default defineAppConfig({
  ui: {
    colors: {
      primary: 'primary',
      secondary: 'brown',
      neutral: 'neutral'
    },
    button: {
      defaultVariants: {
        size: 'lg'
      },
      slots: {
        base: 'font-semibold cursor-pointer'
      }
    },
    input: {
      slots: {
        base: 'h-12 placeholder:text-neutral-400'
      }
    },
    formField: {
      slots: {
        label: 'text-base'
      }
    },
    checkbox: {
      slots: {
        base: 'rounded cursor-pointer',
        indicator: 'rounded'
      }
    },
    breadcrumb: {
      slots: {
        list: 'min-h-15'
      },
      compoundVariants: [
        {
          disabled: false,
          active: false,
          to: true,
          class: {
            link: [
              'text-default hover:text-primary',
              'transition-colors'
            ]
          }
        }
      ]
    },
    separator: {
      defaultVariants: {
        color: 'neutral'
      },
      variants: {
        color: {
          neutral: {
            border: 'border-neutral-200'
          }
        }
      }
    },
    toast: {
      slots: {
        root: 'rounded-sm'
      }
    }
  }
})
