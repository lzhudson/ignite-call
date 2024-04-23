import * as ToastPrimitive from '@radix-ui/react-toast'

const Provider = (props: ToastPrimitive.ToastProviderProps) => (
  <ToastPrimitive.Provider {...props} />
)

const Root = (props: ToastPrimitive.ToastProps) => (
  <ToastPrimitive.Root {...props} />
)

const Title = (props: ToastPrimitive.ToastTitleProps) => (
  <ToastPrimitive.Title {...props} />
)

const Description = (props: ToastPrimitive.ToastDescriptionProps) => (
  <ToastPrimitive.Description {...props} />
)

const Action = (props: ToastPrimitive.ToastActionProps) => (
  <ToastPrimitive.Action {...props} />
)

const Close = (props: ToastPrimitive.ToastCloseProps) => (
  <ToastPrimitive.Close {...props} />
)

const Viewport = (props: ToastPrimitive.ToastViewportProps) => (
  <ToastPrimitive.Viewport {...props} />
)

const Toast = Object.assign(
  {},
  {
    Provider,
    Root,
    Title,
    Description,
    Action,
    Close,
    Viewport,
  },
)

export default Toast
