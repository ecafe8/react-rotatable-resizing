import React, { Component } from 'react'
import ResizableRect from './ResizableRect'
class App extends Component {
  render() {

    return (
      <div className="App">
        <ResizableRect left={100} top={100} width={100} height={100} rotateAngle={45} />
      </div>
    )
  }
}

export default App
