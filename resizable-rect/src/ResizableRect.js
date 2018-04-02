import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Rect from './components/Rect'
import { getNewStyle, degToRadian } from './utils'

class ResizableRect extends Component {
  static propTypes = {
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rotateAngle: PropTypes.number.isRequired
  }
  constructor(props) {
    super(props)
    const { left, top, width, height, rotateAngle } = props
    this.state = {
      position: {
        centerX: left + width / 2,
        centerY: top + height / 2
      },
      size: {
        width,
        height
      },
      transform: {
        rotateAngle
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
      <div className="ResizableRect">
        <Rect styles={this.state} onPositionChange={this.handleMove} onAngleChange={this.handleRotate} onResize={this.handleResize} />
      </div>
    )
  }
}

export default ResizableRect
