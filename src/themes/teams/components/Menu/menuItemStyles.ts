import { pxToRem } from '../../../../lib'
import {
  ComponentPartStyle,
  IComponentPartStylesInput,
  ICSSInJSStyle,
} from '../../../../../types/theme'
import { IMenuVariables } from './menuVariables'
import { IMenuItemProps, IMenuItemState } from '../../../../components/Menu/MenuItem'

type MenuItemProps = IMenuItemProps & IMenuItemState

const underlinedItem = (color: string): ICSSInJSStyle => ({
  paddingBottom: 0,
  borderBottom: `solid ${pxToRem(4)} ${color}`,
  transition: 'color .1s ease',
})

const getActionStyles = ({
  props: { type, underlined, iconOnly, isFromKeyboard },
  variables: v,
  color,
}: {
  props: MenuItemProps
  variables: IMenuVariables
  color: string
}): ICSSInJSStyle =>
  (underlined && !isFromKeyboard) || iconOnly
    ? {
        color,
        background: v.defaultBackgroundColor,
      }
    : type === 'primary'
      ? {
          color: v.typePrimaryActiveColor,
          background: v.typePrimaryActiveBackgroundColor,
        }
      : {
          color,
          background: v.defaultActiveBackgroundColor,
        }

const itemSeparator: ComponentPartStyle<IMenuItemProps, IMenuVariables> = ({
  props,
  variables: v,
}): ICSSInJSStyle => {
  const { iconOnly, pointing, pills, type, underlined, vertical } = props

  return (
    !pills &&
    !underlined &&
    !(pointing && vertical) &&
    !iconOnly && {
      '::before': {
        position: 'absolute',
        content: '""',
        top: 0,
        right: 0,
        ...(vertical ? { width: '100%', height: '1px' } : { width: '1px', height: '100%' }),
        ...(type === 'primary'
          ? { background: v.typePrimaryBorderColor }
          : { background: v.defaultBorderColor }),
      },

      ...(vertical && {
        ':first-child': {
          '::before': {
            display: 'none',
          },
        },
      }),
    }
  )
}

const pointingBeak: ComponentPartStyle<IMenuItemProps, IMenuVariables> = ({
  props,
  variables: v,
}): ICSSInJSStyle => {
  const { pointing, type } = props

  let backgroundColor: string
  let borderColor: string
  let top: string
  let borders: ICSSInJSStyle

  if (type === 'primary') {
    backgroundColor = v.typePrimaryActiveBackgroundColor
    borderColor = v.typePrimaryBorderColor
  } else {
    backgroundColor = v.defaultActiveBackgroundColor
    borderColor = v.defaultBorderColor
  }

  if (pointing === 'start') {
    borders = {
      borderTop: `1px solid ${borderColor}`,
      borderLeft: `1px solid ${borderColor}`,
    }
    top = '-1px' // 1px for the border
  } else {
    borders = {
      borderBottom: `1px solid ${borderColor}`,
      borderRight: `1px solid ${borderColor}`,
    }
    top = '100%'
  }

  return {
    '::after': {
      visibility: 'visible',
      background: backgroundColor,
      position: 'absolute',
      content: '""',
      top,
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
      margin: '.5px 0 0',
      width: pxToRem(10),
      height: pxToRem(10),
      border: 'none',
      ...borders,
      zIndex: 2,
      transition: 'background .1s ease',
    },
  }
}

const menuItemStyles: IComponentPartStylesInput<MenuItemProps, IMenuVariables> = {
  root: ({ props, variables: v, theme }): ICSSInJSStyle => {
    const { active, isFromKeyboard, pills, pointing, underlined, vertical } = props

    return {
      color: v.defaultColor,
      background: v.defaultBackgroundColor,
      lineHeight: 1,
      position: 'relative',
      verticalAlign: 'middle',
      display: 'block',

      ...(pills && {
        ...(vertical ? { margin: `0 0 ${pxToRem(5)} 0` } : { margin: `0 ${pxToRem(8)} 0 0` }),
        borderRadius: pxToRem(5),
      }),

      ...(underlined && {
        display: 'flex',
        alignItems: 'center',
        height: pxToRem(29),
        lineHeight: v.lineHeightBase,
        padding: `0 ${pxToRem(4)}`,
        margin: `0 ${pxToRem(4)} 0 0`,
        ':nth-child(n+2)': {
          marginLeft: `${pxToRem(4)}`,
        },
        boxShadow: 'none',
      }),

      ...(pointing &&
        vertical && {
          border: '1px solid transparent',
          borderTopLeftRadius: `${pxToRem(3)}`,
          borderTopRightRadius: `${pxToRem(3)}`,
          ...(pointing === 'end'
            ? { borderRight: `${pxToRem(3)} solid transparent` }
            : { borderLeft: `${pxToRem(3)} solid transparent` }),
          marginBottom: `${pxToRem(12)}`,
        }),

      ...itemSeparator({ props, variables: v, theme }),

      // active styles
      ...(active && {
        ...getActionStyles({ props, variables: v, color: v.defaultColor }),

        ...(pointing &&
          (vertical
            ? pointing === 'end'
              ? { borderRight: `${pxToRem(3)} solid ${v.typePrimaryActiveBorderColor}` }
              : { borderLeft: `${pxToRem(3)} solid ${v.typePrimaryActiveBorderColor}` }
            : pointingBeak({ props, variables: v, theme }))),
      }),

      // focus styles
      ...(isFromKeyboard && getActionStyles({ props, variables: v, color: v.defaultActiveColor })),

      // hover styles
      ':hover': getActionStyles({ props, variables: v, color: v.defaultActiveColor }),
    }
  },

  anchor: ({ props, variables: v }): ICSSInJSStyle => {
    const { active, iconOnly, isFromKeyboard, pointing, type, underlined, vertical } = props

    return {
      color: 'inherit',
      display: 'block',
      cursor: 'pointer',

      ...(underlined
        ? { padding: `${pxToRem(4)} 0` }
        : pointing && vertical
          ? { padding: `${pxToRem(8)} ${pxToRem(18)}` }
          : { padding: `${pxToRem(14)} ${pxToRem(18)}` }),

      ...(iconOnly && {
        width: v.iconsMenuItemSize,
        height: v.iconsMenuItemSize || '100%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),

      // active styles
      ...(active &&
        (type === 'primary'
          ? {
              ...(iconOnly && { color: v.typePrimaryActiveBorderColor }),

              ...(underlined && {
                color: v.typePrimaryActiveBorderColor,
                ...underlinedItem(v.typePrimaryActiveBorderColor),
              }),
            }
          : underlined && {
              fontWeight: 700,
              ...underlinedItem(v.defaultActiveColor),
            })),

      // focus styles
      ...(isFromKeyboard && {
        ...(type === 'primary'
          ? {
              ...(iconOnly && {
                color: v.typePrimaryActiveBorderColor,
                border: `1px solid ${v.typePrimaryActiveBorderColor}`,
                borderRadius: v.circularRadius,
              }),

              ...(underlined && { color: v.typePrimaryActiveColor }),

              ...(underlined && active && underlinedItem(v.typePrimaryActiveColor)),
            }
          : {
              ...(iconOnly && {
                border: `1px solid ${v.defaultActiveColor}`,
                borderRadius: v.circularRadius,
              }),

              ...(underlined && { fontWeight: 700 }),

              ...(underlined && active && underlinedItem(v.defaultActiveColor)),
            }),
      }),

      ':focus': {
        outline: 0,
      },

      // hover styles
      ':hover': {
        color: 'inherit',

        ...(type === 'primary'
          ? {
              ...(iconOnly && { color: v.typePrimaryActiveBorderColor }),
              ...(!active && underlined && underlinedItem(v.typePrimaryHoverBorderColor)),
            }
          : !active && underlined && underlinedItem(v.defaultActiveBackgroundColor)),
      },
    }
  },
}

export default menuItemStyles
