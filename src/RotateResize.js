import React from 'react'
class RotateResize extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mouseHeldDown: false,
      width: 300,
      height: 300,
      top: 200,
      left: 300,
      startAngle: 0,
      deg: 0,
      originalX: 0,
      originalY: 0,
      direction:'',
      rDirection:'',
      step: 1,
      rotation:0,
      center:{}
    }
  }

  componentDidMount() {
    let _this = this
    document.addEventListener('mousemove',(e)=>{
      if(_this.state.direction !== '' && _this.state.rDirection === '' ){
        _this._startResize(e)
      }else if (_this.state.direction === '' && _this.state.rDirection !== '' ){
        _this._startRotate(e)
      }
    })
    document.addEventListener('mouseup',(e)=>{
      _this._stopDrag(e)
    })
    document.addEventListener('mouseleave',(e)=>{
      _this._stopDrag(e)
    })
  }

  _startDrag = (e) => {
    if(e.target.id.length > 2){
      const R2D = 180 / Math.PI
      const {height,width,left,top} = this.state
      const center = {
        x: left + width/2,
        y: top + height/2
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
    }else{
      const {height,width,left,top} = this.state
      const center = {
        x: left + width/2,
        y: top + height/2
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

  _startResize = (e) => {
    const { mouseHeldDown, direction , deg} = this.state
    let canWidthChange = true
    let canHeightChange = true
    if ( mouseHeldDown ) {
      switch ( direction ) {
        case 'e':
          canHeightChange = false
          canWidthChange = true
          this.resizeESES(canWidthChange,canHeightChange,e)
          break;
        case 's':
          canHeightChange = true
          canWidthChange = false
          this.resizeESES(canWidthChange,canHeightChange,e)
          break;
        case 'w':
          canHeightChange = false
          canWidthChange = true
          this.resizeWNNW(canWidthChange,canHeightChange,e)
          break;
        case 'n':
          canHeightChange = true
          canWidthChange = false
          this.resizeWNNW(canWidthChange,canHeightChange,e)
          break;
        case 'ne':
          canHeightChange = deg === 0 ? true : false
          canWidthChange = deg === 0 ? true : false
          this.resizeNE(canWidthChange,canHeightChange,e)
          break;
        case 'nw':
          canHeightChange = deg === 0 ? true : false
          canWidthChange = deg === 0 ? true : false
          this.resizeWNNW(canWidthChange,canHeightChange,e)
          break;
        case 'se':
          canHeightChange = deg === 0 ? true : false
          canWidthChange = true
          this.resizeESES(canWidthChange,canHeightChange,e)
          break;
        case 'sw':
          canHeightChange = deg === 0 ? true : false
          canWidthChange = deg === 0 ? true : false
          this.resizeSW(canWidthChange,canHeightChange,e)
          break;
        default:

      }
    }
  }

  _stopDrag = (e) => {
    const {rDirection} = this.state
    // let degString = document.querySelector(".main").style.transform
    // let degNum = parseFloat(degString.replace(/^[0-9]|[a-z]|(\()|(\))/ig,""))
    if (rDirection !== '') {
      const {deg,rotation} = this.state

      this.setState({
        mouseHeldDown:false,
        rDirection:'',
        direction:'',
        deg: deg + rotation,
        rotation: 0
      })
    }else {
      this.setState({
        mouseHeldDown:false,
        rDirection:'',
        direction:''
      })
    }
  }

  rotatePoint = (top, left,width, height, rotate, type)=>{
    const centerTop = top + height / 2
    const centerLeft = left + width / 2
    var rad = rotate * Math.PI / 180
    // console.log(rotate)
    let top0, left0
    let newTop, newLeft
    switch (type) {
      case 'bottom-left':
        top0 = -height/2
        left0 = -width/2
        break;
      case 'bottom-right':
        top0 = -height/2
        left0 = width/2
        break;
      case 'top-right':
        top0 = height/2;
        left0 = width/2;
        break;
      case 'top-left':
        top0 = height/2;
        left0 = -width/2;
        break;
      default:

    }
    newTop = -left0 * Math.sin(rad) + top0 * Math.cos(rad);
    newLeft = left0 * Math.cos(rad) + top0 * Math.sin(rad);
    // console.log(centerTop - newTop)
    return {top: centerTop - newTop, left: newLeft + centerLeft};

  }

  newPositionAfterResize = (anchorPoint, newWidth, newHeight, rotate, type)=>{
    const rad = rotate * Math.PI / 180
    // console.log(rad)
    let newTop, newLeft
    switch (type) {
      case 'bottom-left':
        newTop = newWidth/2 * Math.sin(rad) - newHeight/2 * Math.cos(rad) - newHeight/2 + anchorPoint.top;
        newLeft = newWidth/2 * Math.cos(rad) + newHeight/2 * Math.sin(rad) - newWidth/2 + anchorPoint.left;
        break;
      case 'bottom-right':
        newTop = -newWidth/2 * Math.sin(rad) - newHeight/2 * Math.cos(rad) - newHeight/2 + anchorPoint.top;
        newLeft = -newWidth/2 * Math.cos(rad) + newHeight/2 * Math.sin(rad) - newWidth/2 + anchorPoint.left;
        break;
      case 'top-right':
        newTop = -newWidth/2 * Math.sin(rad) + newHeight/2 * Math.cos(rad) - newHeight/2 + anchorPoint.top;
        newLeft = -newWidth/2 * Math.cos(rad) - newHeight/2 * Math.sin(rad) - newWidth/2 + anchorPoint.left;
        break;
      case 'top-left':
        newTop = newWidth/2 * Math.sin(rad) + newHeight/2 * Math.cos(rad) - newHeight/2 + anchorPoint.top;
        newLeft = newWidth/2 * Math.cos(rad) - newHeight/2 * Math.sin(rad) - newWidth/2 + anchorPoint.left;
        break;
      default:

    }
    return { top: newTop, left: newLeft };
  }

  resizeESES = (canWidthChange,canHeightChange,e) => {
    const {direction,top,left,width,height} = this.state
    let {deg} = this.state
    const distanceX = e.clientX - this.state.originalX
    const distanceY = e.clientY - this.state.originalY
    // const delta = (deg) * Math.PI/180
    // console.log(Math.sin(delta),Math.cos(delta))
    const initialBoxWidth = this.state.width
    const initialBoxHeight = this.state.height
    let newHeight
    let newWidth
    if (deg > 360){
      deg = deg - parseInt(deg / 360) * 360
    }
    if (deg > 270 || ( Math.abs(deg-270) < 30  &&  deg > 0)){
      deg = deg -360
    }
    if ( deg < -270 || ( Math.abs(deg+270) < 30  &&  deg < 0) ) {
      deg = deg + 360
    }
    if (deg >= 90 || (Math.abs(deg - 90) < 30 && deg > 0 ) ){
      if (Math.abs(deg - 90) < 30){
        if (direction === 's') {
          newHeight = initialBoxHeight - distanceX
          newWidth = initialBoxWidth - distanceY
        }else{
          newHeight = initialBoxHeight + distanceX
          newWidth = initialBoxWidth + distanceY
        }

      }else{
        newHeight = initialBoxHeight - distanceY
        newWidth = initialBoxWidth - distanceX
      }
    }else if (deg <= -90 || (Math.abs(deg + 90) < 30 && deg < 0 ) ){
      if (Math.abs(deg + 90) < 30){
        if (direction === 's') {
          newHeight = initialBoxHeight + distanceX
          newWidth = initialBoxWidth + distanceY
        }else{
          newHeight = initialBoxHeight - distanceX
          newWidth = initialBoxWidth - distanceY
        }

      }else{
        newHeight = initialBoxHeight - distanceY
        newWidth = initialBoxWidth - distanceX
      }

    }else {
      newHeight = initialBoxHeight + distanceY
      newWidth = initialBoxWidth + distanceX
    }

    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    if (direction === 's'){
      const rotatedPointTopLeft = this.rotatePoint(top, left,width, height, deg, 'top-left')
      const newPos = this.newPositionAfterResize(
        rotatedPointTopLeft,
        newWidth,
        newHeight,
        deg,
        'top-left'
      )
      // console.log(newPos)
      this.setState({
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY,
        top: newPos.top ? newPos.top : top,
        left: newPos.left ? newPos.left : left
      })
    }else{
      const rotatedPointBottomLeft = this.rotatePoint(top, left,width, height, deg, 'bottom-left')
      const newPos = this.newPositionAfterResize(
        rotatedPointBottomLeft,
        newWidth,
        newHeight,
        deg,
        'bottom-left'
      )
      // console.log(newPos)
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

  resizeWNNW = (canWidthChange,canHeightChange,e) => {
    const distanceX = this.state.originalX - e.clientX
    const distanceY = this.state.originalY - e.clientY
    const initialBoxWidth = this.state.width
    const initialBoxHeight = this.state.height
    const { top, left ,width,height,direction} = this.state
    let {deg} = this.state
    const endTop = canHeightChange ? top - distanceY : top
    const endLeft = canWidthChange ? left - distanceX : left
    let newHeight
    let newWidth
    if (deg > 360){
      deg = deg - parseInt(deg / 360) * 360
    }
    if (deg > 270 || ( Math.abs(deg-270) < 30  &&  deg > 0)){
      deg = deg -360
    }
    if ( deg < -270 || ( Math.abs(deg+270) < 30  &&  deg < 0) ) {
      deg = deg + 360
    }
    if (deg >= 90 || (Math.abs(deg - 90) < 30 && deg > 0 )){
      if (Math.abs(deg - 90) < 30){
        if (direction === 'w'){
          newHeight = initialBoxHeight + distanceX
          newWidth = initialBoxWidth + distanceY
        }else{
          newHeight = initialBoxHeight - distanceX
          newWidth = initialBoxWidth - distanceY
        }

      }else{
        newHeight = initialBoxHeight - distanceY
        newWidth = initialBoxWidth - distanceX
      }
    }else{
      if (Math.abs(deg - 90) < 30){
        newHeight = initialBoxHeight - distanceX
        newWidth = initialBoxWidth - distanceY
      }else if (deg <= -90 || (Math.abs(deg + 90) < 30 && deg < 0 )){
        if (Math.abs(deg + 90) < 30){
          if (direction === 'w') {
            newHeight = initialBoxHeight - distanceX
            newWidth = initialBoxWidth - distanceY
          }else{
            newHeight = initialBoxHeight + distanceX
            newWidth = initialBoxWidth + distanceY
          }

        }else{
          newHeight = initialBoxHeight - distanceY
          newWidth = initialBoxWidth - distanceX
        }
      }else{
        newHeight = initialBoxHeight + distanceY
        newWidth = initialBoxWidth + distanceX
      }

    }
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    if(this.state.direction === 'n'){
      const rotatedPointBottomRight = this.rotatePoint(top, left,width, height, deg, 'bottom-right')
      const newPos = this.newPositionAfterResize(
        rotatedPointBottomRight,
        newWidth,
        newHeight,
        deg,
        'bottom-right'
      )
      // console.log(newPos)
      this.setState({
        width: newWidth,
        height: newHeight,
        originalX: e.clientX,
        originalY: e.clientY,
        top: newPos.top ? newPos.top : endTop,
        left: newPos.left ? newPos.left : endLeft
      })
    }else{
      const rotatedPointTopRight = this.rotatePoint(top, left,width, height, deg, 'top-right')
      const newPos = this.newPositionAfterResize(
        rotatedPointTopRight,
        newWidth,
        newHeight,
        deg,
        'top-right'
      )
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

  resizeSW = (canWidthChange,canHeightChange,e) => {
    const distanceX = this.state.originalX - e.clientX
    const distanceY = e.clientY - this.state.originalY
    const initialBoxWidth = this.state.width
    const initialBoxHeight = this.state.height
    const { left } = this.state
    const endLeft = canWidthChange ? left - distanceX : left
    let newHeight = initialBoxHeight + distanceY
    let newWidth = initialBoxWidth + distanceX
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    this.setState({
      left: endLeft,
      width: newWidth,
      height: newHeight,
      originalX: e.clientX,
      originalY: e.clientY
    })
  }

  resizeNE = (canWidthChange,canHeightChange,e) => {
    const distanceX = e.clientX - this.state.originalX
    const distanceY = this.state.originalY - e.clientY
    const initialBoxWidth = this.state.width
    const initialBoxHeight = this.state.height
    const { top } = this.state
    const endTop = canHeightChange ? top - distanceY : top
    let newHeight = initialBoxHeight + distanceY
    let newWidth = initialBoxWidth + distanceX
    newHeight = canHeightChange ? newHeight : initialBoxHeight
    newWidth = canWidthChange ? newWidth : initialBoxWidth
    this.setState({
      top: endTop,
      width: newWidth,
      height: newHeight,
      originalX: e.clientX,
      originalY: e.clientY
    })
  }

  _startRotate = (e) => {
    const {mouseHeldDown, rDirection} = this.state
    if (mouseHeldDown && rDirection !== '') {
      this.rotate(e)
    }
  }

  rotate = (e) => {
    const {startAngle,center} = this.state
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

  render(){
    const {width,height,top,left,deg,rotation} = this.state
    const nextDeg = deg+rotation
    console.log(nextDeg)
    const styleObject = {
      width: width+'px',
      height: height+'px',
      top: top+'px',
      left: left+'px',
      transform: `rotate(${deg+rotation}deg)`
    }
    return (
      <div
        className="main"
        style={styleObject}
      >
        {
          'n,s,e,w,ne,nw,se,sw'.split(',').map((direction) => {
            return (
              <div
                key={direction}
                id={direction}
                className={'handler ' + direction}
                onMouseDown={this._startDrag}
                ref={direction}
              />
            )
          }
          )
        }
        {
          'ne,nw,se,sw'.split(',').map((direction) => {
            return (
              <div
                key={direction}
                id={'r'+direction}
                className={'rotateHandler '+'r'+direction}
                ref={'r'+direction}
                onMouseDown={this._startDrag}
              />
            )
          }
          )
        }
      </div>
    )
  }
}
export default RotateResize
