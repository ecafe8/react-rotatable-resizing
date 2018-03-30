import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { getLength, getAngle } from '../../utils'
import './index.css'

export default class Rect extends PureComponent {
	static propTypes = {
		style: PropTypes.object,
		onPositionChange: PropTypes.func,
		onAngleChange: PropTypes.func,
		onResize: PropTypes.func
	}

	// Drag
	startDrag = (e) => {
		var { clientX: startX, clientY: startY } = e
		const onMove = (e) => {
			const { clientX, clientY } = e
			const deltaX = clientX - startX
			const deltaY = clientY - startY
			this.props.onPositionChange(deltaX, deltaY)
			startX = clientX
			startY = clientY
		}
		document.addEventListener('mousemove', onMove)
		document.addEventListener('mouseup', () => {
			document.removeEventListener('mousemove', onMove)
		})
	}


	// Rotate
	startRotate = (e) => {
		const { clientX, clientY } = e
		const { styles: { position: { centerX, centerY } } } = this.props
		
		var startVector = {
			x: clientX - centerX,
			y: clientY - centerY
		}
		const onMove = (e) => {
			e.stopImmediatePropagation()
			const { clientX, clientY } = e
			const rotateVector = {
				x: clientX - centerX,
				y: clientY - centerY
			}
			const angle = getAngle(startVector, rotateVector)
			this.props.onAngleChange(angle)
			startVector = rotateVector
		}	
		document.addEventListener('mousemove', onMove)
		document.addEventListener('mouseup', () => {
			document.removeEventListener('mousemove', onMove)
		})
	}


	// Resize
	startResize = (e) => {
		const { styles: { position: { centerX, centerY }, size: { width, height }, transform: { rotateAngle } } } = this.props
		const { clientX: startX, clientY: startY } = e
		const rect = { width, height, centerX, centerY, rotateAngle }
		const type = e.target.getAttribute('class').split(' ')[0]
		const onMove = (e) => {
			e.stopImmediatePropagation()
			const { clientX, clientY } = e
			const deltaX = clientX - startX
			const deltaY = clientY - startY
			const alpha = Math.atan2(deltaY, deltaX)
			const deltaL = getLength(deltaX, deltaY)
			this.props.onResize(deltaL, alpha, rect, type)
		}

		document.addEventListener('mousemove', onMove)
		document.addEventListener('mouseup', () => {
			document.removeEventListener('mousemove', onMove)
		})
	}

	render() {
		const { styles: { position: { centerX, centerY }, size: { width, height }, transform: { rotateAngle } } } = this.props
		const style = { width, height, transform: `rotate(${rotateAngle}deg)`, left: centerX - width / 2, top: centerY - height / 2 }
		const direction = ['tl', 't', 'tr', 'l', 'r', 'bl', 'b', 'br']
		return (
			<div
				className="rect" 
				style={style}
				onMouseDown={this.startDrag}
			>
				<div className="rotate" onMouseDown={this.startRotate}></div>
				{direction.map(d => {
					return (
						<div key={d} className={`${d} square`} onMouseDown={this.startResize}></div>
					)
				})}
			</div>
		)
	}
}