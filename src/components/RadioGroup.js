import React, {PropTypes as t} from 'react'
import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'

/**
 * A ButtonGroup whose buttons act like a radio button.
 * Options should be passed as a list of [value, display] tuples.
 * Buttons are set up so you can use e.target.name and e.target.value in your
 * onChange handler like you would with regular form inputs.
 */
let RadioGroup = React.createClass({
  propTypes: {
    name: t.string.isRequired,
    onChange: t.func.isRequired,
    options: t.arrayOf(t.arrayOf(t.string)),
    value: t.string.isRequired,
  },
  render() {
    let {disabled, name, onChange, options, value, ...props} = this.props
    return <ButtonGroup {...props}>
      {options.map(option =>
        <Button
          key={option}
          bsStyle={option === value ? 'primary' : 'default'}
          children={option}
          disabled={disabled}
          name={name}
          onClick={onChange}
          value={option}
        />
     )}
    </ButtonGroup>
  }
})

export default RadioGroup;