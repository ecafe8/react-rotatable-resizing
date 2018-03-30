import React, { Component } from 'react'
import Rect from './components/Rect'
import { getNewStyle, degToRadian } from './utils'

class App extends Component {
  constructor() {
    super()
    this.state = {
      position: {
        centerX: 600,
        centerY: 500
      },
      size: {
        width: 500,
        height: 500
      },
      transform: {
        rotateAngle: 0
      }
    }
  }

  handleMove = (deltaX, deltaY) => {
    const { centerX, centerY } = this.state.position
    this.setState({
      position: {
        centerX: centerX + deltaX,
        centerY: centerY + deltaY
      }
    })
  }

  handleRotate = (angle) => {
    const { rotateAngle } = this.state.transform
    this.setState({
      transform: {
        rotateAngle: rotateAngle + angle
      }
    })
  }

  handleResize = (length, alpha, rect, type) => {
    const { rotateAngle } = this.state.transform
    const beta = alpha - degToRadian(rotateAngle)
    const deltaW = length * Math.cos(beta)
    const deltaH = length * Math.sin(beta)
    const style = getNewStyle(type, {...rect, rotateAngle}, deltaW, deltaH)
    this.setState({
      ...style
    })
  }
  

  render() {
    return (
      <div className="App">
        <Rect styles={this.state} onPositionChange={this.handleMove} onAngleChange={this.handleRotate} onResize={this.handleResize} />
      </div>
    )
  }
}

export default App
