export const getLength = (x, y) => Math.sqrt(x * x + y * y)

export const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 } ) => {
  const tan = ((y2 * x1 - y1 * x2) / (x1 * x2 + y1 * y2))
  return Math.atan(tan) * 180 / Math.PI
}

export const degToRadian = (deg) => deg * Math.PI / 180

const cos = (deg) => Math.cos(degToRadian(deg))
const sin = (deg) => Math.sin(degToRadian(deg))


export const getNewStyle = (type, rect, deltaW, deltaH) => {
	let { width, height, centerX, centerY, rotateAngle } = rect
	switch (type) {
		case 'r': {
			centerX += deltaW / 2 * cos(rotateAngle)
			centerY += deltaW / 2 * sin(rotateAngle)
			width += deltaW
			break
		}
		case 'tr': {
			deltaH = -deltaH
			centerX += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
			centerY += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
			height += deltaH
			width += deltaW
			break
		}
		case 'br': {
			centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
			centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
			height += deltaH
			width += deltaW
			break
		}
		case 'b': {
			centerX -= deltaH / 2 * sin(rotateAngle)
			centerY += deltaH / 2 * cos(rotateAngle)
			height +=deltaH
			break
		}
		case 'bl': {
			deltaW = -deltaW
			centerX -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
			centerY -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
			height += deltaH
			width += deltaW
			break
		}
		case 'l': {
			deltaW = -deltaW
			centerX -= deltaW / 2 * cos(rotateAngle)
			centerY -= deltaW / 2 * sin(rotateAngle)
			width += deltaW
			break
		}
		case 'tl': {
			deltaW = -deltaW
			deltaH = -deltaH
			centerX -= deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
			centerY -= deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
			height += deltaH
			width += deltaW
			break
		}
		case 't': {
			deltaH = -deltaH
			centerX += deltaH / 2 * sin(rotateAngle)
			centerY -= deltaH / 2 * cos(rotateAngle)
			height +=deltaH
			break
			}
		}

	return {
		position: {
			centerX,
			centerY
		},
		size: {
			width,
			height
		}
	}
}