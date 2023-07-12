export const createHtmlElement = (
    elementClass: string | string[],
    elementName = 'div',
    elementText = ''
  ): HTMLElement => {
    const element = document.createElement(elementName);
  
    element.className = Array.isArray(elementClass) ? elementClass.join(' ') : elementClass;
  
    if (elementText) {
      element.textContent = elementText;
    }
  
    return element;
};
  