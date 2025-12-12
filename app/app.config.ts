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
        indicator: 'rounded',
      }
    }
  }
})
