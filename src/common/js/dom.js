//增加类名
export function addClass(el,className){
    if(hasClass(el,className)){
      return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}
// 验证是否含有指定的className
export function hasClass(el,className){
  // (\\s) 空格
    let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
    return reg.test(el.className)
}
// 获取data-*值 或者 设置 data-*
// 如果val有值则设置(好的设计技巧)
export function  getData(el,name,val){
  const prefix = 'data-'
  name = prefix+name
  if(val){
    return el.setAttribute(name,val)
  }else{
    return el.getAttribute(name)
  }
}
