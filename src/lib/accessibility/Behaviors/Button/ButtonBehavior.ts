import { Accessibility } from '../../interfaces'

/**
 * @description
 *  Adds role='button' if element type is other than 'button'. This allows the screen readers handle component as button.
 *  Adds attribute 'aria-disabled=true' based on the property 'disabled'.
 */

const ButtonBehavior: Accessibility = (props: any) => ({
  attributes: {
    root: {
      role: props.as === 'button' ? undefined : 'button',
      'aria-disabled': !!props['disabled'],
    },
  },
})

export default ButtonBehavior
