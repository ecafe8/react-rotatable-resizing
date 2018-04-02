export const getLength = (x, y) => Math.sqrt(x * x + y * y)

export const getAngle = ({ x: x1, y: y1 }, { x: x2, y: y2 } ) => {
  const tan = ((y2 * x1 - y1 * x2) / (x1 * x2 + y1 * y2))
  return Math.atan(tan) * 180 / Math.PI
}

export const degToRadian = (deg) => deg * Math.PI / 180

const cos = (deg) => Math.cos(degToRadian(deg))
const sin = (deg) => Math.sin(degToRadian(deg))

const minWidth = 10
const minHeight = 10

const setWidthAndDeltaW = (width, deltaW) => {
	const expectedWidth = width + deltaW
			if (expectedWidth > minWidth) {
				width = expectedWidth
			} else {
				deltaW = minWidth - width
				width = minWidth
			}
	return { width, deltaW }
}

const setHeightAndDeltaH = (height, deltaH) => {
	const expectedHeight = height + deltaH
			if (expectedHeight > minHeight) {
				height = expectedHeight
			} else {
				deltaH = minHeight - height
				height = minHeight
			}
	return { height, deltaH }
}

export const getNewStyle = (type, rect, deltaW, deltaH) => {
	let { width, height, centerX, centerY, rotateAngle } = rect
	switch (type) {
		case 'r': {
			const widthAndDeltaW = setWidthAndDeltaW(width, deltaW)
			width = widthAndDeltaW.width
			deltaW = widthAndDeltaW.deltaW

			centerX += deltaW / 2 * cos(rotateAngle)
			centerY += deltaW / 2 * sin(rotateAngle)
			break
		}
		case 'tr': {
			deltaH = -deltaH
			const widthAndDeltaW = setWidthAndDeltaW(width, deltaW)
			width = widthAndDeltaW.width
			deltaW = widthAndDeltaW.deltaW
			const heightAndDeltaH = setHeightAndDeltaH(height, deltaH)
			height = heightAndDeltaH.height
			deltaH = heightAndDeltaH.deltaH
			
			centerX += deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
			centerY += deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
			break
		}
		case 'br': {
			const widthAndDeltaW = setWidthAndDeltaW(width, deltaW)
			width = widthAndDeltaW.width
			deltaW = widthAndDeltaW.deltaW
			const heightAndDeltaH = setHeightAndDeltaH(height, deltaH)
			height = heightAndDeltaH.height
			deltaH = heightAndDeltaH.deltaH

			centerX += deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
			centerY += deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
			break
		}
		case 'b': {
			const heightAndDeltaH = setHeightAndDeltaH(height, deltaH)
			height = heightAndDeltaH.height
			deltaH = heightAndDeltaH.deltaH

			centerX -= deltaH / 2 * sin(rotateAngle)
			centerY += deltaH / 2 * cos(rotateAngle)
			break
		}
		case 'bl': {
			deltaW = -deltaW
			const widthAndDeltaW = setWidthAndDeltaW(width, deltaW)
			width = widthAndDeltaW.width
			deltaW = widthAndDeltaW.deltaW
			const heightAndDeltaH = setHeightAndDeltaH(height, deltaH)
			height = heightAndDeltaH.height
			deltaH = heightAndDeltaH.deltaH

			centerX -= deltaW / 2 * cos(rotateAngle) + deltaH / 2 * sin(rotateAngle)
			centerY -= deltaW / 2 * sin(rotateAngle) - deltaH / 2 * cos(rotateAngle)
			break
		}
		case 'l': {
			deltaW = -deltaW
			const widthAndDeltaW = setWidthAndDeltaW(width, deltaW)
			width = widthAndDeltaW.width
			deltaW = widthAndDeltaW.deltaW

			centerX -= deltaW / 2 * cos(rotateAngle)
			centerY -= deltaW / 2 * sin(rotateAngle)
			break
		}
		case 'tl': {
			deltaW = -deltaW
			deltaH = -deltaH
			const widthAndDeltaW = setWidthAndDeltaW(width, deltaW)
			width = widthAndDeltaW.width
			deltaW = widthAndDeltaW.deltaW
			const heightAndDeltaH = setHeightAndDeltaH(height, deltaH)
			height = heightAndDeltaH.height
			deltaH = heightAndDeltaH.deltaH

			centerX -= deltaW / 2 * cos(rotateAngle) - deltaH / 2 * sin(rotateAngle)
			centerY -= deltaW / 2 * sin(rotateAngle) + deltaH / 2 * cos(rotateAngle)
			break
		}
		case 't': {
			deltaH = -deltaH
			const heightAndDeltaH = setHeightAndDeltaH(height, deltaH)
			height = heightAndDeltaH.height
			deltaH = heightAndDeltaH.deltaH
			
			centerX += deltaH / 2 * sin(rotateAngle)
			centerY -= deltaH / 2 * cos(rotateAngle)
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