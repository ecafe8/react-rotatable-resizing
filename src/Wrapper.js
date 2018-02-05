import React from 'react'
import RotateResize from './RotateResize'
export default class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: {
        width: 300,
        height: 300,
        top: 200,
        left: 200,
        minWidth: 20,
        minHeight: 20,
        deg: 0
      }
    }
  }

  handleEachChange = nextOptions => {
    this.setState({
      options: nextOptions
    })
  }

  render() {
    const { options } = this.state
    return <RotateResize Options={options} onEachStep={this.handleEachChange} />
  }
}
