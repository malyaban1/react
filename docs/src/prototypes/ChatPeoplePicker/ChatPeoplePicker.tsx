import * as React from 'react'
import Downshift, { DownshiftState, StateChangeOptions } from 'downshift'
import { Label, Input, Button, Image, MenuItem, List } from '@stardust-ui/react'
import * as _ from 'lodash'
import keyboardKey from 'keyboard-key'
import { pxToRem } from 'src/lib'

const peoplePickerStyles: any = {
  containerDiv: {
    display: 'flex',
    flexWrap: 'wrap',
    outline: 0,
    border: 0,
    borderRadius: `0.2143rem`,
    borderBottom: `0.1429rem solid transparent`,
    color: '#252423',
    backgroundColor: '#F3F2F1',
    borderColor: 'transparent',
  },
  personContainerLabel: {
    root: {
      margin: '.4rem 0 0 .4rem',
    },
  },
  containerDivOnFocus: {
    borderColor: '#6264A7',
    borderRadius: '0.2143rem 0.2143rem 0.1429rem 0.1429rem',
  },
  addLabel: {
    root: { backgroundColor: '#f7f7f7' },
  },
  textInput: {
    input: {
      width: '100%',
      ':focus': {
        borderColor: 'transparent',
      },
    },
    root: { flexGrow: 1 },
  },
  menu: {
    position: 'absolute',
    zIndex: '1000',
  },
}

interface IPeoplePickerProps {
  source: (
    inputValue: string,
    selected: any[],
  ) => { name: string; image: string; position: string }[]
  styles?: any
}

interface IPeoplePickerState {
  selected: any[]
  focused: boolean
  inputValue: string
  deleteOnBackspace: boolean
}

export class ChatPeoplePicker extends React.Component<IPeoplePickerProps, IPeoplePickerState> {
  private input: any
  private labelId: string = 'picker-label-id'

  constructor(props) {
    super(props, {})

    this.state = {
      selected: [],
      focused: false,
      inputValue: '',
      deleteOnBackspace: true,
    }

    this.input = React.createRef()
  }

  private handleCloseIconAction(element, event) {
    this.removeFromSelected(element)
    this.input.current.inputRef.focus()
    event.stopPropagation()
  }

  private addToSelected(element, clearInput = true) {
    this.setState(({ selected }) => ({
      selected: [...selected, element],
      inputValue: clearInput ? '' : undefined,
    }))
  }

  private removeFromSelected(element?) {
    let { selected } = this.state
    if (element) {
      selected = selected.filter(currentElement => currentElement !== element)
    } else {
      selected.pop()
    }
    this.setState({ selected })
  }

  public render(): React.ReactNode {
    return (
      <div style={this.props.styles}>
        <Label content="Add people" styles={peoplePickerStyles.addLabel} id={this.labelId} />
        <Downshift
          stateReducer={this.stateReducer}
          onChange={this.onDropdownChange}
          selectedItem={null}
          inputValue={this.state.inputValue}
          itemToString={item => (item ? item.value : '')}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectItemAtIndex,
          }) => {
            const availableItems = this.props.source(inputValue, this.state.selected)
            return (
              <div>
                <div
                  role="presentation"
                  style={{
                    ...peoplePickerStyles.containerDiv,
                    ...(this.state.focused ? peoplePickerStyles.containerDivOnFocus : {}),
                  }}
                  onClick={this.onContainerClick.bind(this, isOpen)}
                >
                  {this.state.selected.length === 0
                    ? null
                    : this.state.selected.map((element, index) => (
                        <Label
                          styles={peoplePickerStyles.personContainerLabel}
                          circular
                          key={`peoplePickerItem-${index}`}
                          content={element.name}
                          image={{
                            src: element.image,
                            avatar: true,
                          }}
                          icon={{
                            name: 'close',
                            onClick: this.onCloseIconClick.bind(this, element),
                            onKeyDown: this.onCloseIconKeyDown.bind(this, element),
                            'aria-label': `Remove ${element.name} from selection.`,
                            'aria-hidden': false,
                            role: 'button',
                          }}
                        />
                      ))}
                  <Input
                    styles={peoplePickerStyles.textInput}
                    ref={this.input}
                    onFocus={this.onInputFocus}
                    onKeyUp={this.onInputKeyUp}
                    role="presentation"
                    input={{
                      placeholder: this.state.selected.length > 0 ? '' : 'Start typing a name',
                      ...getInputProps({
                        onBlur: this.onInputBlur,
                        'aria-labelledby': this.labelId,
                        onKeyDown: this.onInputKeyDown.bind(
                          this,
                          highlightedIndex,
                          selectItemAtIndex,
                        ),
                      }),
                    }}
                  />
                </div>
                <List
                  {...getMenuProps()}
                  styles={{
                    root: { width: this.props.styles.width, ...peoplePickerStyles.menu },
                  }}
                  items={
                    availableItems.length > 0 && isOpen
                      ? availableItems.map((item, index) => {
                          return {
                            key: `peoplePickerItem-${index}`,
                            header: item.name,
                            content: item.position,
                            styles: {
                              header: {
                                color: highlightedIndex === index ? 'white' : 'black',
                              },
                              content: {
                                color: highlightedIndex === index ? 'white' : 'black',
                              },
                            },
                            media: <Image src={item.image} avatar />,
                            ...getItemProps({
                              index,
                              item,
                              style: {
                                backgroundColor: highlightedIndex === index ? '#6264A7' : 'white',
                              },
                            }),
                          }
                        })
                      : null
                  }
                />
              </div>
            )
          }}
        </Downshift>
        <div
          style={{
            marginTop: `${pxToRem(8)}`,
            textAlign: 'right',
          }}
        >
          <Button type="secondary" content="Cancel" style={{ margin: '0' }} />
          <Button type="primary" content="Add" style={{ margin: `0 0 0 ${pxToRem(8)}` }} />
        </div>
      </div>
    )
  }

  stateReducer = (state: DownshiftState<MenuItem>, changes: StateChangeOptions<MenuItem>) => {
    // this prevents the menu from being closed when the user
    // selects an item with a keyboard or mouse
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        this.setState({
          inputValue: changes.inputValue,
          deleteOnBackspace: !(changes.inputValue === '' && state.inputValue.length === 1),
        })
        return changes
      default:
        return changes
    }
  }

  onDropdownChange = element => {
    this.addToSelected(element)
  }

  onInputFocus = () => {
    this.setState({ focused: true })
  }

  onInputBlur = () => {
    this.setState({ focused: false })
  }

  onInputKeyDown = (highlightedIndex, selectItemAtIndex, event) => {
    switch (keyboardKey.getCode(event)) {
      case keyboardKey.Tab:
        if (highlightedIndex && !event.shiftKey) {
          selectItemAtIndex(highlightedIndex)
        }
        return
      default:
        return
    }
  }

  onInputKeyUp = event => {
    switch (keyboardKey.getCode(event)) {
      case keyboardKey.Backspace:
        if (this.state.inputValue === '' && this.state.selected.length > 0) {
          if (!this.state.deleteOnBackspace) {
            this.setState({ deleteOnBackspace: true })
          } else {
            this.removeFromSelected()
          }
          return
        }
      default:
        return
    }
  }

  onContainerClick = isOpen => {
    !isOpen && this.input.current.inputRef.focus()
  }

  onCloseIconClick = (element, event) => this.handleCloseIconAction(element, event)

  onCloseIconKeyDown = (element, event) => {
    if (keyboardKey.getCode(event) === keyboardKey.Enter) {
      this.handleCloseIconAction(element, event)
    }
  }
}

export default ChatPeoplePicker
