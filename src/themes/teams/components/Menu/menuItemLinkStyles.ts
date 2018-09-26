import { IComponentPartStylesInput, ICSSInJSStyle } from '../../../../../types/theme'
import { pxToRem } from '../../../../lib'

const underlinedItem = (color): ICSSInJSStyle => ({
  borderBottom: `solid ${pxToRem(4)} ${color}`,
  transition: 'color .1s ease',
})

const menuItemLinkStyles: IComponentPartStylesInput<any, any> = {
  root: ({ props, variables }): ICSSInJSStyle => {
    const { active, iconOnly, pointing, type, underlined, vertical } = props
    const { iconsMenuItemSize } = variables

    return {
      color: 'inherit',
      display: 'block',
      ...(underlined
        ? { padding: `0 0 ${pxToRem(8)} 0` }
        : pointing && vertical
          ? { padding: `${pxToRem(8)} ${pxToRem(18)}` }
          : { padding: `${pxToRem(14)} ${pxToRem(18)}` }),
      cursor: 'pointer',

      ...(iconOnly && {
        width: iconsMenuItemSize,
        height: iconsMenuItemSize || '100%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),

      ':hover': {
        color: 'inherit',
        ...(underlined && {
          paddingBottom: `${pxToRem(4)}`,
          ...underlinedItem(variables.defaultActiveBackgroundColor),
          ...(type === 'primary' && {
            ...underlinedItem(variables.typePrimaryActiveBorderColor),
          }),
        }),
      },

      ...(active &&
        underlined && {
          color: variables.defaultColor,
          paddingBottom: `${pxToRem(4)}`,
          ':hover': {},
          ...underlinedItem(variables.defaultActiveColor),
          ...(type === 'primary'
            ? {
                color: variables.typePrimaryActiveColor,
                ...underlinedItem(variables.typePrimaryActiveColor),
              }
            : {
                fontWeight: 700,
              }),
        }),
    }
  },
}

export default menuItemLinkStyles
