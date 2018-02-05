import React from 'react'
class RotateResize extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mouseHeldDown: false,
      width: this.props.Options.width,
      height: this.props.Options.height,
      minWidth: this.props.Options.minWidth,
      minHeight: this.props.Options.minHeight,
      top: this.props.Options.top,
      left: this.props.Options.left,
      startAngle: 0,
      deg: this.props.Options.deg,
      originalX: 0,
      originalY: 0,
      direction: '',
      rDirection: '',
      rotation: 0,
      center: {},
      stepChange: {}
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', e => {
      const { direction, rDirection } = this.state
      if (direction !== '' && rDirection === '') {
        this._startResize(e)
      } else if (direction === '' && rDirection !== '') {
        this._startRotate(e)
      }
    })
    document.addEventListener('mouseup', e => {
      this._stopDrag(e)
    })
    document.addEventListener('mouseleave', e => {
      this._stopDrag(e)
    })
  }

  handleEachChange = val => {
    this.props.onEachStep(val)
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
    const { originalX, originalY, top, left, width, height, direction, minWidth, minHeight } = this.state
    let { deg } = this.state
    const distanceX = e.clientX - originalX
    const distanceY = e.clientY - originalY
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
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointTopLeft = this.rotatePoint(top, left, width, height, deg, 'top-left')
      const newPos = this.newPositionAfterResize(rotatedPointTopLeft, newWidth, newHeight, deg, 'top-left')

      const minWidthRotatedPointTopLeft = this.rotatePoint(top, left, minWidth, height, deg, 'top-left')
      const newPosMinWidth = this.newPositionAfterResize(
        minWidthRotatedPointTopLeft,
        minWidth,
        newHeight,
        deg,
        'top-left'
      )

      const minHeightRotatedPointTopLeft = this.rotatePoint(top, left, width, minHeight, deg, 'top-left')
      const newPosMinHeight = this.newPositionAfterResize(
        minHeightRotatedPointTopLeft,
        newWidth,
        minHeight,
        deg,
        'top-left'
      )

      const minWidthMinHeightRotatedPointTopLeft = this.rotatePoint(top, left, minWidth, minHeight, deg, 'top-left')
      const newPosMinWidthMinHeight = this.newPositionAfterResize(
        minWidthMinHeightRotatedPointTopLeft,
        minWidth,
        minHeight,
        deg,
        'top-left'
      )
      if (newWidth > minWidth && newHeight > minHeight) {
        this.setState({
          top: newPos.top,
          left: newPos.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newWidth <= minWidth && newHeight > minHeight) {
        this.setState({
          top: newPosMinWidth.top,
          left: newPosMinWidth.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth > minWidth) {
        this.setState({
          top: newPosMinHeight.top,
          left: newPosMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth <= minWidth) {
        this.setState({
          top: newPosMinWidthMinHeight.top,
          left: newPosMinWidthMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
    } else {
      deg = deg * Math.PI / 180
      let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
      let distanceY0 = distanceY * Math.cos(deg) + distanceX * Math.sin(deg)
      newHeight = initialBoxHeight + distanceY0
      newWidth = initialBoxWidth + distanceX0
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointBottomLeft = this.rotatePoint(top, left, width, height, deg, 'bottom-left')
      const newPos = this.newPositionAfterResize(rotatedPointBottomLeft, newWidth, newHeight, deg, 'bottom-left')

      const minWidthRotatedPointBottomLeft = this.rotatePoint(top, left, minWidth, height, deg, 'bottom-left')
      const newPosMinWidth = this.newPositionAfterResize(
        minWidthRotatedPointBottomLeft,
        minWidth,
        newHeight,
        deg,
        'bottom-left'
      )

      const minHeightRotatedPointBottomLeft = this.rotatePoint(top, left, width, minHeight, deg, 'bottom-left')
      const newPosMinHeight = this.newPositionAfterResize(
        minHeightRotatedPointBottomLeft,
        newWidth,
        minHeight,
        deg,
        'bottom-left'
      )

      const minWidthMinHeightRotatedPointBottomLeft = this.rotatePoint(
        top,
        left,
        minWidth,
        minHeight,
        deg,
        'bottom-left'
      )
      const newPosMinWidthMinHeight = this.newPositionAfterResize(
        minWidthMinHeightRotatedPointBottomLeft,
        minWidth,
        minHeight,
        deg,
        'bottom-left'
      )
      if (newWidth > minWidth && newHeight > minHeight) {
        this.setState({
          top: newPos.top,
          left: newPos.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newWidth <= minWidth && newHeight > minHeight) {
        this.setState({
          top: newPosMinWidth.top,
          left: newPosMinWidth.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth > minWidth) {
        this.setState({
          top: newPosMinHeight.top,
          left: newPosMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth <= minWidth) {
        this.setState({
          top: newPosMinWidthMinHeight.top,
          left: newPosMinWidthMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
    }
    const stepChange = {
      width: this.state.width,
      height: this.state.height,
      deg: this.state.deg + this.state.rotation,
      top: this.state.top,
      left: this.state.left,
      minWidth,
      minHeight
    }
    this.setState(
      {
        stepChange
      },
      () => {
        this.handleEachChange(this.state.stepChange)
      }
    )
  }

  resizeWN = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, top, left, width, height, direction, minWidth, minHeight } = this.state
    let { deg } = this.state
    const distanceX = originalX - e.clientX
    const distanceY = originalY - e.clientY
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

    if (direction === 'n') {
      deg = deg * Math.PI / 180
      let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
      let distanceY0 = distanceY * Math.cos(deg) - distanceX * Math.sin(deg)
      newHeight = initialBoxHeight + distanceY0
      newWidth = initialBoxWidth + distanceX0
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointBottomRight = this.rotatePoint(top, left, width, height, deg, 'bottom-right')
      const newPos = this.newPositionAfterResize(rotatedPointBottomRight, newWidth, newHeight, deg, 'bottom-right')

      const minWidthRotatedPointBottomRight = this.rotatePoint(top, left, minWidth, height, deg, 'bottom-right')
      const newPosMinWidth = this.newPositionAfterResize(
        minWidthRotatedPointBottomRight,
        minWidth,
        newHeight,
        deg,
        'bottom-right'
      )

      const minHeightRotatedPointBottomRight = this.rotatePoint(top, left, width, minHeight, deg, 'bottom-right')
      const newPosMinHeight = this.newPositionAfterResize(
        minHeightRotatedPointBottomRight,
        newWidth,
        minHeight,
        deg,
        'bottom-right'
      )

      const minWidthMinHeightRotatedPointBottomRight = this.rotatePoint(
        top,
        left,
        minWidth,
        minHeight,
        deg,
        'bottom-right'
      )
      const newPosMinWidthMinHeight = this.newPositionAfterResize(
        minWidthMinHeightRotatedPointBottomRight,
        minWidth,
        minHeight,
        deg,
        'bottom-right'
      )
      if (newWidth > minWidth && newHeight > minHeight) {
        this.setState({
          top: newPos.top,
          left: newPos.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newWidth <= minWidth && newHeight > minHeight) {
        this.setState({
          top: newPosMinWidth.top,
          left: newPosMinWidth.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth > minWidth) {
        this.setState({
          top: newPosMinHeight.top,
          left: newPosMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth <= minWidth) {
        this.setState({
          top: newPosMinWidthMinHeight.top,
          left: newPosMinWidthMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
    } else {
      deg = deg * Math.PI / 180
      let distanceX0 = distanceX * Math.cos(deg) + distanceY * Math.sin(deg)
      let distanceY0 = distanceY * Math.cos(deg) + distanceX * Math.sin(deg)
      newHeight = initialBoxHeight + distanceY0
      newWidth = initialBoxWidth + distanceX0
      newHeight = canHeightChange ? newHeight : initialBoxHeight
      newWidth = canWidthChange ? newWidth : initialBoxWidth
      deg = deg * 180 / Math.PI
      const rotatedPointTopRight = this.rotatePoint(top, left, width, height, deg, 'top-right')
      const newPos = this.newPositionAfterResize(rotatedPointTopRight, newWidth, newHeight, deg, 'top-right')

      const minWidthRotatedPointTopRight = this.rotatePoint(top, left, minWidth, height, deg, 'top-right')
      const newPosMinWidth = this.newPositionAfterResize(
        minWidthRotatedPointTopRight,
        minWidth,
        newHeight,
        deg,
        'top-right'
      )

      const minHeightRotatedPointTopRight = this.rotatePoint(top, left, width, minHeight, deg, 'top-right')
      const newPosMinHeight = this.newPositionAfterResize(
        minHeightRotatedPointTopRight,
        newWidth,
        minHeight,
        deg,
        'top-right'
      )

      const minWidthMinHeightRotatedPointTopRight = this.rotatePoint(top, left, minWidth, minHeight, deg, 'top-right')
      const newPosMinWidthMinHeight = this.newPositionAfterResize(
        minWidthMinHeightRotatedPointTopRight,
        minWidth,
        minHeight,
        deg,
        'top-right'
      )
      if (newWidth > minWidth && newHeight > minHeight) {
        this.setState({
          top: newPos.top,
          left: newPos.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newWidth <= minWidth && newHeight > minHeight) {
        this.setState({
          top: newPosMinWidth.top,
          left: newPosMinWidth.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth > minWidth) {
        this.setState({
          top: newPosMinHeight.top,
          left: newPosMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
      if (newHeight <= minHeight && newWidth <= minWidth) {
        this.setState({
          top: newPosMinWidthMinHeight.top,
          left: newPosMinWidthMinHeight.left,
          width: newWidth,
          height: newHeight,
          originalX: e.clientX,
          originalY: e.clientY
        })
      }
    }
    const stepChange = {
      width: this.state.width,
      height: this.state.height,
      deg: this.state.deg + this.state.rotation,
      top: this.state.top,
      left: this.state.left,
      minWidth,
      minHeight
    }
    this.setState(
      {
        stepChange
      },
      () => {
        this.handleEachChange(this.state.stepChange)
      }
    )
  }

  resizeSW = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, top, left, width, height, minWidth, minHeight } = this.state
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
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI

    const rotatedPointTopRight = this.rotatePoint(top, left, width, height, deg, 'top-right')
    const newPos = this.newPositionAfterResize(rotatedPointTopRight, newWidth, newHeight, deg, 'top-right')

    const minWidthRotatedPointTopRight = this.rotatePoint(top, left, minWidth, height, deg, 'top-right')
    const newPosMinWidth = this.newPositionAfterResize(
      minWidthRotatedPointTopRight,
      minWidth,
      newHeight,
      deg,
      'top-right'
    )

    const minHeightRotatedPointTopRight = this.rotatePoint(top, left, width, minHeight, deg, 'top-right')
    const newPosMinHeight = this.newPositionAfterResize(
      minHeightRotatedPointTopRight,
      newWidth,
      minHeight,
      deg,
      'top-right'
    )

    const minWidthMinHeightRotatedPointTopRight = this.rotatePoint(top, left, minWidth, minHeight, deg, 'top-right')
    const newPosMinWidthMinHeight = this.newPositionAfterResize(
      minWidthMinHeightRotatedPointTopRight,
      minWidth,
      minHeight,
      deg,
      'top-right'
    )
    if (newWidth > minWidth && newHeight > minHeight) {
      this.setState({
        top: newPos.top,
        left: newPos.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newWidth <= minWidth && newHeight > minHeight) {
      this.setState({
        top: newPosMinWidth.top,
        left: newPosMinWidth.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth > minWidth) {
      this.setState({
        top: newPosMinHeight.top,
        left: newPosMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth <= minWidth) {
      this.setState({
        top: newPosMinWidthMinHeight.top,
        left: newPosMinWidthMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    const stepChange = {
      width: this.state.width,
      height: this.state.height,
      deg: this.state.deg + this.state.rotation,
      top: this.state.top,
      left: this.state.left,
      minWidth,
      minHeight
    }
    this.setState(
      {
        stepChange
      },
      () => {
        this.handleEachChange(this.state.stepChange)
      }
    )
  }

  resizeNE = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, top, left, width, height, minWidth, minHeight } = this.state
    let { deg } = this.state
    if (deg > 360) {
      deg = deg - parseInt(deg / 360, 10) * 360
    }
    if (deg < -360) {
      deg = deg + parseInt(Math.abs(deg) / 360, 10) * 360
    }
    deg = deg * Math.PI / 180
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
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI
    const rotatedPointBottomLeft = this.rotatePoint(top, left, width, height, deg, 'bottom-left')
    const newPos = this.newPositionAfterResize(rotatedPointBottomLeft, newWidth, newHeight, deg, 'bottom-left')

    const minWidthRotatedPointBottomLeft = this.rotatePoint(top, left, minWidth, height, deg, 'bottom-left')
    const newPosMinWidth = this.newPositionAfterResize(
      minWidthRotatedPointBottomLeft,
      minWidth,
      newHeight,
      deg,
      'bottom-left'
    )

    const minHeightRotatedPointBottomLeft = this.rotatePoint(top, left, width, minHeight, deg, 'bottom-left')
    const newPosMinHeight = this.newPositionAfterResize(
      minHeightRotatedPointBottomLeft,
      newWidth,
      minHeight,
      deg,
      'bottom-left'
    )

    const minWidthMinHeightRotatedPointBottomLeft = this.rotatePoint(top, left, minWidth, minHeight, deg, 'bottom-left')
    const newPosMinWidthMinHeight = this.newPositionAfterResize(
      minWidthMinHeightRotatedPointBottomLeft,
      minWidth,
      minHeight,
      deg,
      'bottom-left'
    )
    if (newWidth > minWidth && newHeight > minHeight) {
      this.setState({
        top: newPos.top,
        left: newPos.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newWidth <= minWidth && newHeight > minHeight) {
      this.setState({
        top: newPosMinWidth.top,
        left: newPosMinWidth.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth > minWidth) {
      this.setState({
        top: newPosMinHeight.top,
        left: newPosMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth <= minWidth) {
      this.setState({
        top: newPosMinWidthMinHeight.top,
        left: newPosMinWidthMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    const stepChange = {
      width: this.state.width,
      height: this.state.height,
      deg: this.state.deg + this.state.rotation,
      top: this.state.top,
      left: this.state.left,
      minWidth,
      minHeight
    }
    this.setState(
      {
        stepChange
      },
      () => {
        this.handleEachChange(this.state.stepChange)
      }
    )
  }

  resizeNW = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, top, left, width, height, minWidth, minHeight } = this.state
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
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI

    const rotatedPointBottomRight = this.rotatePoint(top, left, width, height, deg, 'bottom-right')
    const newPos = this.newPositionAfterResize(rotatedPointBottomRight, newWidth, newHeight, deg, 'bottom-right')

    const minWidthRotatedPointBottomRight = this.rotatePoint(top, left, minWidth, height, deg, 'bottom-right')
    const newPosMinWidth = this.newPositionAfterResize(
      minWidthRotatedPointBottomRight,
      minWidth,
      newHeight,
      deg,
      'bottom-right'
    )

    const minHeightRotatedPointBottomRight = this.rotatePoint(top, left, width, minHeight, deg, 'bottom-right')
    const newPosMinHeight = this.newPositionAfterResize(
      minHeightRotatedPointBottomRight,
      newWidth,
      minHeight,
      deg,
      'bottom-right'
    )

    const minWidthMinHeightRotatedPointBottomRight = this.rotatePoint(
      top,
      left,
      minWidth,
      minHeight,
      deg,
      'bottom-right'
    )
    const newPosMinWidthMinHeight = this.newPositionAfterResize(
      minWidthMinHeightRotatedPointBottomRight,
      minWidth,
      minHeight,
      deg,
      'bottom-right'
    )
    if (newWidth > minWidth && newHeight > minHeight) {
      this.setState({
        top: newPos.top,
        left: newPos.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newWidth <= minWidth && newHeight > minHeight) {
      this.setState({
        top: newPosMinWidth.top,
        left: newPosMinWidth.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth > minWidth) {
      this.setState({
        top: newPosMinHeight.top,
        left: newPosMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth <= minWidth) {
      this.setState({
        top: newPosMinWidthMinHeight.top,
        left: newPosMinWidthMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    const stepChange = {
      width: this.state.width,
      height: this.state.height,
      deg: this.state.deg + this.state.rotation,
      top: this.state.top,
      left: this.state.left,
      minWidth,
      minHeight
    }
    this.setState(
      {
        stepChange
      },
      () => {
        this.handleEachChange(this.state.stepChange)
      }
    )
  }

  resizeSE = (canWidthChange, canHeightChange, e) => {
    const { originalX, originalY, top, left, width, height, minWidth, minHeight } = this.state
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
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    deg = deg * 180 / Math.PI

    const rotatedPointTopLeft = this.rotatePoint(top, left, width, height, deg, 'top-left')
    const newPos = this.newPositionAfterResize(rotatedPointTopLeft, newWidth, newHeight, deg, 'top-left')

    const minWidthRotatedPointTopLeft = this.rotatePoint(top, left, minWidth, height, deg, 'top-left')
    const newPosMinWidth = this.newPositionAfterResize(
      minWidthRotatedPointTopLeft,
      minWidth,
      newHeight,
      deg,
      'top-left'
    )

    const minHeightRotatedPointTopLeft = this.rotatePoint(top, left, width, minHeight, deg, 'top-left')
    const newPosMinHeight = this.newPositionAfterResize(
      minHeightRotatedPointTopLeft,
      newWidth,
      minHeight,
      deg,
      'top-left'
    )

    const minWidthMinHeightRotatedPointTopLeft = this.rotatePoint(top, left, minWidth, minHeight, deg, 'top-left')
    const newPosMinWidthMinHeight = this.newPositionAfterResize(
      minWidthMinHeightRotatedPointTopLeft,
      minWidth,
      minHeight,
      deg,
      'top-left'
    )
    if (newWidth > minWidth && newHeight > minHeight) {
      this.setState({
        top: newPos.top,
        left: newPos.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newWidth <= minWidth && newHeight > minHeight) {
      this.setState({
        top: newPosMinWidth.top,
        left: newPosMinWidth.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth > minWidth) {
      this.setState({
        top: newPosMinHeight.top,
        left: newPosMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    if (newHeight <= minHeight && newWidth <= minWidth) {
      this.setState({
        top: newPosMinWidthMinHeight.top,
        left: newPosMinWidthMinHeight.left,
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY
      })
    }
    const stepChange = {
      width: this.state.width,
      height: this.state.height,
      deg: this.state.deg + this.state.rotation,
      top: this.state.top,
      left: this.state.left,
      minWidth,
      minHeight
    }
    this.setState(
      {
        stepChange
      },
      () => {
        this.handleEachChange(this.state.stepChange)
      }
    )
  }

  _startRotate = e => {
    const { mouseHeldDown, rDirection } = this.state
    if (mouseHeldDown && rDirection !== '') {
      this.rotate(e)
    }
    const stepChange = {
      width: this.state.width,
      height: this.state.height,
      deg: this.state.deg + this.state.rotation,
      top: this.state.top,
      left: this.state.left
    }
    this.setState(
      {
        stepChange
      },
      () => {
        this.handleEachChange(this.state.stepChange)
      }
    )
  }

  rotate = e => {
    const { startAngle, center } = this.state
    const R2D = 180 / Math.PI
    const thisX = e.clientX - center.x
    const thisY = e.clientY - center.y
    const degree = R2D * Math.atan2(thisY, thisX)
    const rotation = degree - startAngle
    this.setState({
      rotation
    })
  }

  render() {
    let { width, height, top, left, minWidth, minHeight } = this.props.Options
    let { deg, rotation } = this.state
    width = width > minWidth ? width : minWidth
    height = height > minHeight ? height : minHeight

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
              style={{ cursor: direction + '-resize' }}
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
