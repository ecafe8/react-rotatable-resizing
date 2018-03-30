export const getLength = (x, y) => Math.sqrt(x * x + y * y)

export const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 } ) => {
  const tan = ((y2 * x1 - y1 * x2) / (x1 * x2 + y1 * y2))
  return Math.atan(tan) * 180 / Math.PI
  //return Math.acos(cos) * 180 / Math.PI
}

export const degToRadian = (deg) => {
	return deg * Math.PI / 180
}


export const getNewStyle = (type, rect, deltaW, deltaH) => {
	const { width, height, centerX, centerY, rotateAngle } = rect
	switch (type) {
		case 'r': {
			return {
				position: {
					centerX: centerX + deltaW / 2 * Math.cos(degToRadian(rotateAngle)),
					centerY: centerY + deltaW / 2 * Math.sin(degToRadian(rotateAngle))
				},
				size: {
					height,
					width: width + deltaW
				}
			}
		}
		case 'tr': {
			deltaH = -deltaH
			return {
				position: {
					centerX: centerX + deltaW / 2 * Math.cos(degToRadian(rotateAngle)) + deltaH / 2 * Math.sin(degToRadian(rotateAngle)),
					centerY: centerY + deltaW / 2 * Math.sin(degToRadian(rotateAngle)) - deltaH / 2 * Math.cos(degToRadian(rotateAngle))
				},
				size: {
					height: height + deltaH,
					width: width + deltaW
				}
			}
		}
		case 'br': {
			return {
				position: {
					centerX: centerX + deltaW / 2 * Math.cos(degToRadian(rotateAngle)) - deltaH / 2 * Math.sin(degToRadian(rotateAngle)),
					centerY: centerY + deltaH / 2 * Math.cos(degToRadian(rotateAngle)) + deltaW / 2 * Math.sin(degToRadian(rotateAngle))
				},
				size: {
					height: height + deltaH,
					width: width + deltaW
				}
			}
		}
		case 'b': {
			return {
				position: {
					centerX: centerX - deltaH / 2 * Math.sin(degToRadian(rotateAngle)),
					centerY: centerY + deltaH / 2 * Math.cos(degToRadian(rotateAngle))
				},
				size: {
					height: height + deltaH,
					width
				}
			}
		}
		case 'bl': {
			deltaW = -deltaW
			return {
				position: {
					centerX: centerX - (deltaW / 2 * Math.cos(degToRadian(rotateAngle)) + deltaH / 2 * Math.sin(degToRadian(rotateAngle))),
					centerY: centerY - (deltaW / 2 * Math.sin(degToRadian(rotateAngle)) - deltaH / 2 * Math.cos(degToRadian(rotateAngle)))
				},
				size: {
					height: height + deltaH,
					width: width + deltaW
				}
			}
		}
		case 'l': {
			deltaW = -deltaW
			return {
				position: {
					centerX: centerX - deltaW / 2 * Math.cos(degToRadian(rotateAngle)),
					centerY: centerY - deltaW / 2 * Math.sin(degToRadian(rotateAngle))
				},
				size: {
					height,
					width: width + deltaW
				}
			}
		}
		case 'tl': {
			deltaW = -deltaW
			deltaH = -deltaH
			return {
				position: {
					centerX: centerX - (deltaW / 2 * Math.cos(degToRadian(rotateAngle)) - deltaH / 2 * Math.sin(degToRadian(rotateAngle))),
					centerY: centerY - (deltaH / 2 * Math.cos(degToRadian(rotateAngle)) + deltaW / 2 * Math.sin(degToRadian(rotateAngle)))
				},
				size: {
					height: height + deltaH,
					width: width + deltaW
				}
			}
		}
		case 't': {
			deltaH = -deltaH
			return {
				position: {
					centerX: centerX + deltaH / 2 * Math.sin(degToRadian(rotateAngle)),
					centerY: centerY - deltaH / 2 * Math.cos(degToRadian(rotateAngle))
				},
				size: {
					height: height + deltaH,
					width
				}
			}
		}
	}
}