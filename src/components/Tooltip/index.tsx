import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const Provider = (props: TooltipPrimitive.TooltipProviderProps) => (
  <TooltipPrimitive.Provider {...props} />
)

const Root = (props: TooltipPrimitive.TooltipProps) => (
  <TooltipPrimitive.Root {...props} />
)

const Trigger = (props: TooltipPrimitive.TooltipTriggerProps) => (
  <TooltipPrimitive.Trigger {...props} />
)

const Portal = ({ ...props }: TooltipPrimitive.TooltipPortalProps) => (
  <TooltipPrimitive.Portal {...props} />
)

const Content = ({ ...props }: TooltipPrimitive.TooltipContentProps) => (
  <TooltipPrimitive.Content {...props} />
)

const Arrow = (props: TooltipPrimitive.TooltipArrowProps) => (
  <TooltipPrimitive.Arrow {...props} />
)

const Tooltip = Object.assign(
  {},
  {
    Provider,
    Root,
    Trigger,
    Portal,
    Content,
    Arrow,
  },
)

export default Tooltip
