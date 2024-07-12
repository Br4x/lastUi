

export const isColor = (color: string) => {
  const vsColors = [
    'primary', 'secondary', 'success', 'danger', 'warning', 'dark', 'light', 'warn',
    // social colors
    'facebook',
    'twitter',
    'youtube',
    'pinterest',
    'linkedin',
    'snapchat',
    'whatsapp',
    'tumblr',
    'reddit',
    'spotify',
    'amazon',
    'medium',
    'vimeo',
    'skype',
    'dribbble',
    'slack',
    'yahoo',
    'twitch',
    'discord',
    'telegram',
    'google-plus',
    'messenger'
  ]
  return vsColors.includes(color)
}

export const setVar = (propertyName: string, value: string, el: any) => {
  if (!el) {
    document.documentElement.style.setProperty(`--${propertyName}`, value)
  } else {
    if (el.nodeName !== '#comment') {
      el.style.setProperty(`--${propertyName}`, value)
    }
  }
}

export const setColor = (colorName: string, color: string, el: any, addClass?: boolean) => {
  function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m: any, r: string, g: string, b: string) => {
      return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      // tslint:disable-next-line:object-literal-sort-keys
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const isRGB = /^(rgb|rgba)/.test(color)
  const isRGBNumbers = /^(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)$/.test(color)
  const isHEX = /^(#)/.test(color)
  let newColor

  if (color == 'dark' && el) {
    if (addClass) {
      el.classList.add('component-dark')
    }
  }

  if (isRGB) {
    const arrayColor = color.replace(/[rgba()]/g, '').split(',')
    newColor = `${arrayColor[0]},${arrayColor[1]},${arrayColor[2]}`
    setVar(colorName, newColor, el)
    if (addClass) {
      el.classList.add('change-color')
    }
  } else if (isHEX) {
    const rgb = hexToRgb(color)
    newColor = `${rgb!.r},${rgb!.g},${rgb!.b}`
    setVar(colorName, newColor, el)
    if (addClass) {
      el.classList.add('change-color')
    }
  } else if (isColor(color)) {
    const style = window.getComputedStyle(document.body)
    newColor = style.getPropertyValue('--' + color)
    setVar(colorName, newColor, el)
    if (addClass) {
      el.classList.add('change-color')
    }
  } else if (isRGBNumbers) {
    setVar(colorName, color, el)
    if (addClass) {
      el.classList.add('change-color')
    }
  } else {
    //     consolee.warn({
      //       el,
      //       link: 'https://lusaxweb.github.io/vuesax/',
//       text: `• Component: ${el.__vue__.$vnode.componentOptions.tag}
// • Warn info: El formato de la propiedad color es incorrecto
// • Prop: color
// • value: ${color}
// • Valores Permitidos: (RGB, HEX, RGB Numbers, Vuesax Colors)
// • Example: color="#000" or color="rgb(255,255,255)"`,
//       title: 'VUESAX'
//     })
  }
}

export const getColor = (color: string) => {
  function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m: any, r: string, g: string, b: string) => {
      return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      // tslint:disable-next-line:object-literal-sort-keys
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const isRGB = /^(rgb|rgba)/.test(color)
  const isRGBNumbers = /^(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)$/.test(color)
  const isHEX = /^(#)/.test(color)
  let newColor

  if (isRGB) {
    const arrayColor = color.replace(/[rgba()]/g, '').split(',')
    newColor = `${arrayColor[0]},${arrayColor[1]},${arrayColor[2]}`
  } else if (isHEX) {
    const rgb = hexToRgb(color)
    newColor = `${rgb!.r},${rgb!.g},${rgb!.b}`
  } else if (isColor(color)) {
    const style = window.getComputedStyle(document.body)
    newColor = style.getPropertyValue('--' + color)
  } else if (isRGBNumbers) {
    newColor = color
  }
  return newColor
}


export const removeBody = (element: HTMLElement, parent: any) => {
  const target = parent ? parent : document.body
  target.removeChild(element)
}

export const setCords = (element: any, parent: any) => {
  const cords = parent.getBoundingClientRect()
  const x = cords.x
  const y = cords.y
  const w = cords.width
  const h = cords.height
  const style = element.style
  const scrollTop = window.pageYOffset
  const elTop = element.clientHeight + cords.y + scrollTop
  const rootTop = scrollTop + window.innerHeight

  if ((rootTop - elTop) < 30) {
    // console.log('hola mundo')
    style.top = `${y + scrollTop - element.clientHeight - 4}px`
    style.left = `${x}px`
    style.width = `${w}px`
    element.classList.add('top')
    parent.classList.add('top')
  } else {
    style.top = `${y + scrollTop + h - 4}px`
    style.left = `${x}px`
    style.width = `${w}px`
    element.classList.remove('top')
    parent.classList.remove('top')
  }
}

export const insertBody = (element: HTMLElement, parent: any) => {
  const target = parent ? parent : document.body
  target.insertBefore(element, target.lastChild)
}
export const setCordsPosition = (element: any, parent: any, position: string) => {
  const cords = parent.getBoundingClientRect()
  const x = cords.x
  const y = cords.y
  const w = cords.width
  const h = cords.height
  const style = element.style
  const scrollTop = window.pageYOffset
  const elTop = element.clientHeight + cords.y + scrollTop
  const rootTop = scrollTop + window.innerHeight

  if (x + w + 10 + element.getBoundingClientRect().width > window.innerWidth && position == 'right') {
    position = 'left'
    element.classList.remove('right')
    element.classList.add('left')
  }

  if (x - 10 < element.getBoundingClientRect().width  && position == 'left') {
    position = 'top'
    element.classList.remove('left')
    element.classList.add('top')
  }

  if ((rootTop - elTop) < 30 || position == 'top') {
    // console.log('hola mundo')
    style.top = `${y + scrollTop - element.clientHeight - 8}px`
    const left = x + ((w - element.getBoundingClientRect().width) / 2)

    if (left + element.getBoundingClientRect().width < window.innerWidth) {
      if (left > 0) {
        style.left = `${left}px`
      } else {
        style.left = '10px'
        element.classList.add('notArrow')
      }
    } else {
      style.left = 'auto'
      style.right = '10px'
      element.classList.add('notArrow')
    }
  } else if (position == 'bottom') {
    style.top = `${y + scrollTop + h + 8}px`
    const left = x + ((w - element.getBoundingClientRect().width) / 2)

    if (left + element.getBoundingClientRect().width < window.innerWidth) {
      if (left > 0) {
        style.left = `${left}px`
      } else {
        style.left = '10px'
        element.classList.add('notArrow')
      }
    } else {
      style.left = 'auto'
      style.right = '10px'
      element.classList.add('notArrow')
    }
  } else if (position == 'left') {
    style.top = `${y + scrollTop + ((h - element.getBoundingClientRect().height) / 2)}px`
    style.left = `${x - element.getBoundingClientRect().width - 8}px`
  } else if (position == 'right') {
    style.top = `${y + scrollTop + ((h - element.getBoundingClientRect().height) / 2)}px`
    style.left = `${x + w + 8}px`
  }
}

export const ripple = (evt: any, color: any = '', solid: boolean = false) => {

  const el = evt.currentTarget
  const offset = el.getBoundingClientRect()
  const x = evt.clientX - offset.left
  const y = evt.clientY - offset.top

  let time = 0.6

  if(el.clientWidth > 150) {
    time = 1.2
  }

  const effectContent = document.createElement('div')

  effectContent.className = 'ripple-content'

  const effect = document.createElement('div')
  if (!color) {
    setColor('color', '#fff', effectContent)
  }

  effect.className = 'ripple'
  if (solid) {
    effect.classList.add('ripple--solid')
    // setColor('color', color || 'primary', effectContent)
  }
  effect.style.transition = `all ${time}s ease`

  effect.style.left = `${x}px`
  effect.style.top = `${y}px`

  effectContent.appendChild(effect)

  el.appendChild(effectContent)

  effect.style.width = `${el.clientWidth * 2.5}px`
  effect.style.height = `${el.clientWidth * 2.5}px`
  effect.style.opacity = `1`

  let noTime = false
  setTimeout(() => {
    noTime = true
  }, 300)

  function removeEffect(evt: any) {
    effect.style.transition = `all 0.${time * 600}s ease`
    setTimeout(() => {
      effect.style.opacity = '0'
      setTimeout(() => {
        el.removeChild(effectContent)
      }, time * 300)
    }, (noTime ? 0 : time * 400))

    evt.target.removeEventListener('mouseup', removeEffect)
    evt.target.removeEventListener('mouseleave', removeEffect)
  }

  evt.target.addEventListener('mouseup', removeEffect)
  evt.target.addEventListener('mouseleave', removeEffect)
}

export const rippleReverse = (evt: any) => {
  const el = evt.currentTarget
  const offset = el.getBoundingClientRect()
  const x = evt.clientX - offset.left
  const y = evt.clientY - offset.top

  let time = 0.6

  if(el.clientWidth > 150) {
    time = 1.2
  }

  const effectContent = document.createElement('div')

  effectContent.className = 'ripple-content'

  const effect = document.createElement('div')

  effect.className = 'ripple-invert'
  // effect.style.transition = `all ${time}s ease`

  effect.style.left = `${x}px`
  effect.style.top = `${y}px`
  effect.style.width = `${el.clientWidth * 2.5}px`
  effect.style.height = `${el.clientWidth * 2.5}px`
  effect.style.opacity = '0'

  effectContent.appendChild(effect)

  el.appendChild(effectContent)

  setTimeout(() => {
    effect.style.width = '0px'
    effect.style.height = '0px'
    effect.style.opacity = '0.5'
  }, 1)

  let noTime = false
  setTimeout(() => {
    noTime = true
  }, 300)

  function removeEffect(evt: any) {
    effect.style.transition = `all 0.${time * 600}s ease`
    setTimeout(() => {
      effect.style.opacity = '0'
      setTimeout(() => {
        el.removeChild(effectContent)
      }, time * 300)
    }, (noTime ? 0 : time * 400))

    evt.target.removeEventListener('mouseup', removeEffect)
    evt.target.removeEventListener('mouseleave', removeEffect)
  }

  evt.target.addEventListener('mouseup', removeEffect)
  evt.target.addEventListener('mouseleave', removeEffect)
}

//
export const rippleCut = (evt: any) => {
  const el = evt.currentTarget
  const offset = el.getBoundingClientRect()
  const x = evt.clientX - offset.left
  const y = evt.clientY - offset.top

  let time = 0.6

  if(el.clientWidth > 150) {
    time = 1.2
  }

  const effectContent = document.createElement('div')

  effectContent.className = 'ripple-content'

  const effect = document.createElement('div')
  const effect2 = document.createElement('div')

  effect.className = 'ripple-cut-1'
  effect2.className = 'ripple-cut-2'
  // effect.style.transition = `all ${time}s ease`

  effect.style.left = effect2.style.left = `${x}px`
  effect.style.top = effect2.style.top = `${y}px`
  effect.style.width = effect2.style.width = `${el.clientWidth * 2.5}px`
  effect.style.height = effect2.style.height = `${el.clientWidth * 2.5}px`
  effect.style.opacity = effect2.style.opacity = `1`

  effectContent.appendChild(effect)
  effectContent.appendChild(effect2)

  el.appendChild(effectContent)

  setTimeout(() => {
    effect.style.left = `-${el.clientWidth * 1.3}px`
    effect.style.opacity = '1'

    effect2.style.left = `${el.clientWidth * 1.3}px`
    effect2.style.opacity = '1'
  }, 1)

  let noTime = false
  setTimeout(() => {
    noTime = true
  }, 300)

  function removeEffect(evt: any) {
    effect.style.transition = `all 0.${time * 600}s ease`
    setTimeout(() => {
      effect.style.opacity = '0'
      setTimeout(() => {
        el.removeChild(effectContent)
      }, time * 300)
    }, (noTime ? 0 : time * 400))

    evt.target.removeEventListener('mouseup', removeEffect)
    evt.target.removeEventListener('mouseleave', removeEffect)
  }

  evt.target.addEventListener('mouseup', removeEffect)
  evt.target.addEventListener('mouseleave', removeEffect)
}
