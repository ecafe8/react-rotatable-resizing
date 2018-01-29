import React from 'react'
class RotateResize extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mouseHeldDown: false,
      width: 300,
      height: 300,
      minWidth: 50,
      minHeight: 50,
      maxWidth: 1000,
      maxHeight: 1000,
      top: 200,
      left: 300,
      startAngle: 0,
      deg: 0,
      originalX: 0,
      originalY: 0,
      direction: '',
      rDirection: '',
      step: 1,
      rotation: 0,
      center: {}
    }
  }

  componentDidMount() {
    let _this = this
    document.addEventListener('mousemove', e => {
      if (_this.state.direction !== '' && _this.state.rDirection === '') {
        _this._startResize(e)
      } else if (_this.state.direction === '' && _this.state.rDirection !== '') {
        _this._startRotate(e)
      }
    })
    document.addEventListener('mouseup', e => {
      _this._stopDrag(e)
    })
    document.addEventListener('mouseleave', e => {
      _this._stopDrag(e)
    })
  }

  _startDrag = e => {
    if (e.target.id.length > 2) {
      const R2D = 180 / Math.PI
      const { height, width, left, top } = this.state
      const center = {
        x: left + width / 2,
        y: top + height / 2
      }
      const x = e.clientX - center.x
      const y = e.clientY - center.y
      const startAngle = R2D * Math.atan2(y, x)
      this.setState({
        mouseHeldDown: true,
        originalX: e.clientX,
        originalY: e.clientY,
        rDirection: e.target.id,
        startAngle,
        center
      })
    } else {
      const { height, width, left, top } = this.state
      const center = {
        x: left + width / 2,
        y: top + height / 2
      }
      this.setState({
        mouseHeldDown: true,
        originalX: e.clientX,
        originalY: e.clientY,
        direction: e.target.id,
        center
      })
    }
  }

  _startResize = e => {
    const { mouseHeldDown, direction } = this.state
    let canWidthChange = true
    let canHeightChange = true
    if (mouseHeldDown) {
      switch (direction) {
        case 'e':
          canHeightChange = false
          canWidthChange = true
          this.resizeES(canWidthChange, canHeightChange, e)
          break
        case 's':
          canHeightChange = true
          canWidthChange = false
          this.resizeES(canWidthChange, canHeightChange, e)
          break
        case 'w':
          canHeightChange = false
          canWidthChange = true
          this.resizeWN(canWidthChange, canHeightChange, e)
          break
        case 'n':
          canHeightChange = true
          canWidthChange = false
          this.resizeWN(canWidthChange, canHeightChange, e)
          break
        case 'ne':
          canHeightChange = true
          canWidthChange = true
          this.resizeNE(canWidthChange, canHeightChange, e)
          break
        case 'nw':
          canHeightChange = true
          canWidthChange = true
          this.resizeNW(canWidthChange, canHeightChange, e)
          break
        case 'se':
          canHeightChange = true
          canWidthChange = true
          this.resizeSE(canWidthChange, canHeightChange, e)
          break
        case 'sw':
          canHeightChange = true
          canWidthChange = true
          this.resizeSW(canWidthChange, canHeightChange, e)
          break
        default:
      }
    }
  }

  _stopDrag = e => {
    const { rDirection, deg, rotation } = this.state
    // let degString = document.querySelector(".main").style.transform
    // let degNum = parseFloat(degString.replace(/^[0-9]|[a-z]|(\()|(\))/ig,""))
    if (rDirection !== '') {
      this.setState({
        mouseHeldDown: false,
        rDirection: '',
        direction: '',
        deg: deg + rotation,
        rotation: 0
      })
    } else {
      this.setState({
        mouseHeldDown: false,
        rDirection: '',
        direction: ''
      })
    }
  }

  rotatePoint = (top, left, width, height, rotate, type) => {
    const centerTop = top + height / 2
    const centerLeft = left + width / 2
    var rad = rotate * Math.PI / 180
    // console.log(rotate)
    let deltaTop, deltaLeft
    let newTop, newLeft
    switch (type) {
      case 'bottom-left':
        deltaTop = -height / 2
        deltaLeft = -width / 2
        break
      case 'bottom-right':
        deltaTop = -height / 2
        deltaLeft = width / 2
        break
      case 'top-right':
        deltaTop = height / 2
        deltaLeft = width / 2
        break
      case 'top-left':
        deltaTop = height / 2
        deltaLeft = -width / 2
        break
      default:
    }
    newTop = -deltaLeft * Math.sin(rad) + deltaTop * Math.cos(rad)
    newLeft = deltaLeft * Math.cos(rad) + deltaTop * Math.sin(rad)
    return { top: centerTop - newTop, left: newLeft + centerLeft }
  }

  newPositionAfterResize = (anchorPoint, newWidth, newHeight, rotate, type) => {
    const rad = rotate * Math.PI / 180
    let newTop, newLeft
    switch (type) {
      case 'bottom-left':
        newTop = newWidth / 2 * Math.sin(rad) - newHeight / 2 * Math.cos(rad) - newHeight / 2 + anchorPoint.top
        newLeft = newWidth / 2 * Math.cos(rad) + newHeight / 2 * Math.sin(rad) - newWidth / 2 + anchorPoint.left
        break
      case 'bottom-right':
        newTop = -newWidth / 2 * Math.sin(rad) - newHeight / 2 * Math.cos(rad) - newHeight / 2 + anchorPoint.top
        newLeft = -newWidth / 2 * Math.cos(rad) + newHeight / 2 * Math.sin(rad) - newWidth / 2 + anchorPoint.left
        break
      case 'top-right':
        newTop = -newWidth / 2 * Math.sin(rad) + newHeight / 2 * Math.cos(rad) - newHeight / 2 + anchorPoint.top
        newLeft = -newWidth / 2 * Math.cos(rad) - newHeight / 2 * Math.sin(rad) - newWidth / 2 + anchorPoint.left
        break
      case 'top-left':
        newTop = newWidth / 2 * Math.sin(rad) + newHeight / 2 * Math.cos(rad) - newHeight / 2 + anchorPoint.top
        newLeft = newWidth / 2 * Math.cos(rad) - newHeight / 2 * Math.sin(rad) - newWidth / 2 + anchorPoint.left
        break
      default:
    }
    return { top: newTop, left: newLeft }
  }

  resizeES = (canWidthChange, canHeightChange, e) => {
    const {
      direction,
      top,
      left,
      width,
      height,
      originalX,
      originalY,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    } = this.state
    let { deg } = this.state
    const distanceX = e.clientX - originalX
    const distanceY = e.clientY - originalY
    // const delta = (deg) * Math.PI/180
    // console.log(Math.sin(delta),Math.cos(delta))
    const initialBoxWidth = width
    const initialBoxHeight = height
    let newHeight
    let newWidth
    if (deg > 360) {
      deg = deg - parseInt(deg / 360, 10) * 360
    }
    if (deg < -360) {
      deg = deg + parseInt(Math.abs(deg) / 360, 10) * 360
    }

    if (direction === 's') {
      deg = deg * Math.PI / 180
      let distanceX0 = distanceX * Math.cos(deg) - distanceY * Math.sin(deg)
      let distanceY0 = distanceY * Math.cos(deg) - distanceX * Math.sin(deg)
      newHeight = initialBoxHeight + distanceY0
      newWidth = initialBoxWidth + distanceX0
      if (newWidth <= minWidth || newHeight <= minHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      if (newWidth >= maxWidth || newHeight >= maxHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointTopLeft = this.rotatePoint(top, left, width, height, deg, 'top-left')
      const newPos = this.newPositionAfterResize(rotatedPointTopLeft, newWidth, newHeight, deg, 'top-left')
      // console.log(newPos)
      this.setState({
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY,
        top: newPos.top ? newPos.top : top,
        left: newPos.left ? newPos.left : left
      })
    } else {
      deg = deg * Math.PI / 180
      let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
      let distanceY0 = distanceY * Math.cos(deg) + distanceX * Math.sin(deg)
      newHeight = initialBoxHeight + distanceY0
      newWidth = initialBoxWidth + distanceX0
      if (newWidth <= minWidth || newHeight <= minHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      if (newWidth >= maxWidth || newHeight >= maxHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointBottomLeft = this.rotatePoint(top, left, width, height, deg, 'bottom-left')
      const newPos = this.newPositionAfterResize(rotatedPointBottomLeft, newWidth, newHeight, deg, 'bottom-left')
      this.setState({
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY,
        top: newPos.top ? newPos.top : top,
        left: newPos.left ? newPos.left : left
      })
    }
  }

  resizeWN = (canWidthChange, canHeightChange, e) => {
    const {
      originalX,
      originalY,
      width,
      height,
      top,
      left,
      direction,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    } = this.state
    let { deg } = this.state
    const distanceX = originalX - e.clientX
    const distanceY = originalY - e.clientY
    const initialBoxWidth = width
    const initialBoxHeight = height
    const endTop = canHeightChange ? top - distanceY : top
    const endLeft = canWidthChange ? left - distanceX : left
    let newHeight
    let newWidth
    if (deg > 360) {
      deg = deg - parseInt(deg / 360, 10) * 360
    }
    if (deg < -360) {
      deg = deg + parseInt(Math.abs(deg) / 360, 10) * 360
    }

    if (direction === 'n') {
      deg = deg * Math.PI / 180
      let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
      let distanceY0 = distanceY * Math.cos(deg) - distanceX * Math.sin(deg)
      newHeight = initialBoxHeight + distanceY0
      newWidth = initialBoxWidth + distanceX0
      if (newWidth <= minWidth || newHeight <= minHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      if (newWidth >= maxWidth || newHeight >= maxHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointBottomRight = this.rotatePoint(top, left, width, height, deg, 'bottom-right')
      const newPos = this.newPositionAfterResize(rotatedPointBottomRight, newWidth, newHeight, deg, 'bottom-right')
      // console.log(newPos)
      this.setState({
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY,
        top: newPos.top ? newPos.top : endTop,
        left: newPos.left ? newPos.left : endLeft
      })
    } else {
      deg = deg * Math.PI / 180
      let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
      let distanceY0 = distanceY * Math.cos(deg) + distanceX * Math.sin(deg)
      newHeight = initialBoxHeight + distanceY0
      newWidth = initialBoxWidth + distanceX0
      if (newWidth <= minWidth || newHeight <= minHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      if (newWidth >= maxWidth || newHeight >= maxHeight) {
        canWidthChange = false
        canHeightChange = false
      }
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointTopRight = this.rotatePoint(top, left, width, height, deg, 'top-right')
      const newPos = this.newPositionAfterResize(rotatedPointTopRight, newWidth, newHeight, deg, 'top-right')
      // console.log(newPos)
      this.setState({
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY,
        top: newPos.top ? newPos.top : endTop,
        left: newPos.left ? newPos.left : endLeft
      })
    }
  }

  resizeSW = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, width, height, left, top, minWidth, minHeight, maxWidth, maxHeight } = this.state
    let { deg } = this.state
    if (deg > 360) {
      deg = deg - parseInt(deg / 360, 10) * 360
    }
    if (deg < -360) {
      deg = deg + parseInt(Math.abs(deg) / 360, 10) * 360
    }
    deg = deg * Math.PI / 180
    const distanceX = originalX - e.clientX
    const distanceY = e.clientY - originalY
    let distanceX0 = distanceX * Math.cos(deg) - distanceY * Math.sin(deg)
    let distanceY0 = distanceY * Math.cos(deg) + distanceX * Math.sin(deg)
    const initialBoxWidth = width
    const initialBoxHeight = height
    let newWidth
    let newHeight
    newWidth = initialBoxWidth + distanceX0
    newHeight = initialBoxHeight + distanceY0
    if (newWidth <= minWidth || newHeight <= minHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    if (newWidth >= maxWidth || newHeight >= maxHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI
    const rotatedPointTopRight = this.rotatePoint(top, left, width, height, deg, 'top-right')
    const newPos = this.newPositionAfterResize(rotatedPointTopRight, newWidth, newHeight, deg, 'top-right')
    this.setState({
      top: newPos.top,
      left: newPos.left,
      width: newWidth,
      height: newHeight,
      originalX: e.clientX,
      originalY: e.clientY
    })
  }

  resizeNE = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, width, height, top, left, minWidth, minHeight, maxWidth, maxHeight } = this.state
    let { deg } = this.state
    if (deg > 360) {
      deg = deg - parseInt(deg / 360, 10) * 360
    }
    if (deg < -360) {
      deg = deg + parseInt(Math.abs(deg) / 360, 10) * 360
    }
    deg = deg * Math.PI / 180
    // console.log(deg)
    let distanceX = e.clientX - originalX
    let distanceY = originalY - e.clientY
    let distanceX0 = distanceX * Math.cos(deg) - distanceY * Math.sin(deg)
    let distanceY0 = distanceY * Math.cos(deg) + distanceX * Math.sin(deg)
    const initialBoxWidth = width
    const initialBoxHeight = height
    let newWidth
    let newHeight
    newWidth = initialBoxWidth + distanceX0
    newHeight = initialBoxHeight + distanceY0
    if (newWidth <= minWidth || newHeight <= minHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    if (newWidth >= maxWidth || newHeight >= maxHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI
    const rotatedPointBottomLeft = this.rotatePoint(top, left, width, height, deg, 'bottom-left')
    const newPos = this.newPositionAfterResize(rotatedPointBottomLeft, newWidth, newHeight, deg, 'bottom-left')
    this.setState({
      top: newPos.top,
      left: newPos.left,
      width: newWidth,
      height: newHeight,
      originalX: e.clientX,
      originalY: e.clientY
    })
  }

  resizeNW = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, width, height, top, left, minWidth, minHeight, maxWidth, maxHeight } = this.state
    let { deg } = this.state
    if (deg > 360) {
      deg = deg - parseInt(deg / 360, 10) * 360
    }
    if (deg < -360) {
      deg = deg + parseInt(Math.abs(deg) / 360, 10) * 360
    }
    deg = deg * Math.PI / 180
    const distanceX = originalX - e.clientX
    const distanceY = originalY - e.clientY
    const initialBoxWidth = width
    const initialBoxHeight = height
    let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
    let distanceY0 = distanceY * Math.cos(deg) - distanceX * Math.sin(deg)
    let newWidth
    let newHeight
    newWidth = initialBoxWidth + distanceX0
    newHeight = initialBoxHeight + distanceY0
    if (newWidth <= minWidth || newHeight <= minHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    if (newWidth >= maxWidth || newHeight >= maxHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI
    const rotatedPointBottomRight = this.rotatePoint(top, left, width, height, deg, 'bottom-right')
    const newPos = this.newPositionAfterResize(rotatedPointBottomRight, newWidth, newHeight, deg, 'bottom-right')
    this.setState({
      top: newPos.top,
      left: newPos.left,
      width: newWidth,
      height: newHeight,
      originalX: e.clientX,
      originalY: e.clientY
    })
  }

  resizeSE = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, width, height, top, left, minWidth, minHeight, maxWidth, maxHeight } = this.state
    let { deg } = this.state
    if (deg > 360) {
      deg = deg - parseInt(deg / 360, 10) * 360
    }
    if (deg < -360) {
      deg = deg + parseInt(Math.abs(deg) / 360, 10) * 360
    }
    deg = deg * Math.PI / 180
    const distanceX = e.clientX - originalX
    const distanceY = e.clientY - originalY
    let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
    let distanceY0 = distanceY * Math.cos(deg) - distanceX * Math.sin(deg)
    const initialBoxWidth = width
    const initialBoxHeight = height
    let newWidth
    let newHeight
    newWidth = initialBoxWidth + distanceX0
    newHeight = initialBoxHeight + distanceY0
    if (newWidth <= minWidth || newHeight <= minHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    if (newWidth >= maxWidth || newHeight >= maxHeight) {
      canWidthChange = false
      canHeightChange = false
    }
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI
    const rotatedPointTopLeft = this.rotatePoint(top, left, width, height, deg, 'top-left')
    const newPos = this.newPositionAfterResize(rotatedPointTopLeft, newWidth, newHeight, deg, 'top-left')
    this.setState({
      top: newPos.top,
      left: newPos.left,
      width: newWidth,
      height: newHeight,
      originalX: e.clientX,
      originalY: e.clientY
    })
  }

  _startRotate = e => {
    const { mouseHeldDown, rDirection } = this.state
    if (mouseHeldDown && rDirection !== '') {
      this.rotate(e)
    }
  }

  rotate = e => {
    const { startAngle, center } = this.state
    const R2D = 180 / Math.PI
    const thisX = e.clientX - center.x
    const thisY = e.clientY - center.y
    const degree = R2D * Math.atan2(thisY, thisX)
    const rotation = degree - startAngle
    // console.log(rotation)
    this.setState({
      rotation
    })
  }

  render() {
    const { width, height, top, left, deg, rotation } = this.state
    const styleObject = {
      width: width + 'px',
      height: height + 'px',
      top: top + 'px',
      left: left + 'px',
      transform: `rotate(${deg + rotation}deg)`
    }
    return (
      <div className="main" style={styleObject}>
        {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(direction => {
          return (
            <div
              key={direction}
              id={direction}
              className={'handler ' + direction}
              onMouseDown={this._startDrag}
              ref={direction}
            />
          )
        })}
        {['ne', 'nw', 'se', 'sw'].map(direction => {
          return (
            <div
              key={direction}
              id={'r' + direction}
              className={'rotateHandler r' + direction}
              ref={'r' + direction}
              onMouseDown={this._startDrag}
            />
          )
        })}
      </div>
    )
  }
}
export default RotateResize
