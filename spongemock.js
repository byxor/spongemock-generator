(() => {

  main = () => {
    const dimensions = {
      "messageHeight": 100,
      "spongebobSize": 500,
      "horizontalTextPadding": 10,
      "verticalTextPadding": 40,
      "horizontalImagePadding": 50
    }
    const font = {
      "style": "",
      "weight": "",
      "size": "26px",
      "family": "Arial",
      "toString": () => {
        return [font.style, font.weight, font.size, font.family].join(" ")
      }
    }
    const viewport = createViewport(dimensions, font)
    configureDomToDraw(viewport, dimensions, font)
    draw(viewport, dimensions, font, fetchMemeText())
  }

  createViewport = (dimensions, font) => {
    const width = dimensions.spongebobSize + 2 * dimensions.horizontalImagePadding
    const height = dimensions.spongebobSize + 2 * dimensions.messageHeight
    const canvas = createCanvas(width, height)
    const context = configureContext(canvas, font)
    return {
      "canvas": canvas,
      "context": context
    }
  }

  createCanvas = (width, height) => {
    const canvas = document.getElementById("canvas")
    canvas.width = width
    canvas.height = height
    return canvas
  }

  configureContext = (canvas, font) => {
    const context = canvas.getContext("2d")
    context.font = font.toString()
    context.fillStyle = "black"
    return context
  }

  configureDomToDraw = (viewport, dimensions, font) => {
    document.getElementById("drawButton").onclick = () => {
      draw(viewport, dimensions, font, fetchMemeText())
    }
  }

  clear = (viewport) => {
    const oldFillStyle = viewport.context.fillStyle
    viewport.context.fillStyle = "#ffffff"
    viewport.context.fillRect(0, 0, canvas.width, canvas.height)
    viewport.context.fillStyle = oldFillStyle
  }

  fetchMemeText = () => {
    const readField = (id) => document.getElementById(id).value
    const speakerName = readField("speakerNameField")
    const speakerMessage = readField("speakerMessageField")
    const mockerName = readField("mockerNameField")
    const createSpeech = (name, message) => name + ": " + message
    const topText = createSpeech(speakerName, speakerMessage)
    const bottomText = createSpeech(mockerName, createMockText(speakerMessage))
    return {
      "top": topText,
      "bottom": bottomText
    }
  }

  createMockText = (text) => {
    const mixCase = (character, index) => {
      const upperCase = index % 2 == 0
      return upperCase ? character.toUpperCase() : character.toLowerCase()
    }
    return text.split("").map(mixCase).join("")
  }

  draw = (viewport, dimensions, font, memeText) => {
    clear(viewport)
    let spongebob = new Image()
    spongebob.src = "https://pbs.twimg.com/media/C_aNOzCXgAICBD4.jpg"
    spongebob.onload = () => {
      drawSpongebob(viewport, dimensions, spongebob)
      drawMemeText(viewport, dimensions, font, memeText)
    }
  }
  
  drawSpongebob = (viewport, dimensions, spongebob) => {
  	viewport.context.drawImage(
        spongebob,
        0,
        0,
        spongebob.width,
        spongebob.height,
        dimensions.horizontalImagePadding,
        dimensions.messageHeight + 1,
        dimensions.spongebobSize,
        dimensions.spongebobSize
      )
  }
  
  drawMemeText = (viewport, dimensions, font, memeText) => {
    const fontSize = parseInt(font.size.substring(0, font.size.length - 2))
    const drawText = (text, yPosition) => {
      wrapText(
        viewport.context,
        text,
        dimensions.horizontalTextPadding,
        yPosition,
        viewport.canvas.width - dimensions.horizontalTextPadding,
        fontSize
      )
    }
    drawText(memeText.top, dimensions.verticalTextPadding)
    drawText(memeText.bottom, dimensions.spongebobSize + dimensions.messageHeight + dimensions.verticalTextPadding)
  }

  wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    let words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = context.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  main()

})()
