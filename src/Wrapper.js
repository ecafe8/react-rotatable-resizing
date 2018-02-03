import React from 'react'
import RotateResize from './RotateResize'
const options = {
  width: 30,
  height: 300,
  top: 20,
  left: 200,
  minWidth: 20,
  minHeight: 20,
  deg: -70
}
export default class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options
    }
  }

  handleEachChange = nextOptions => {
    console.log(nextOptions)
    this.setState({
      options: nextOptions
    })
  }

  render() {
    const { options } = this.state
    return <RotateResize Options={options} onEachStep={this.handleEachChange} />
  }
}
