export default class DoubleSlider {
  element;
  subElements = {};
  dragging = null;

  constructor({
    min = 0,
    max = 100,
    selected = { from: min, to: max },
    formatValue = value => '$' + value
  } = {}) {
    this.min = min;
    this.max = max;
    this.selected = selected;
    this.formatValue = formatValue;

    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements();
    this.initEventListeners();
  }

  createTemplate() {
    const leftValue = this.formatValue(this.selected.from);
    const rightValue = this.formatValue(this.selected.to);

    const leftPercent = Math.round((this.selected.from - this.min) / (this.max - this.min) * 100);
    const rightPercent = Math.round((this.max - this.selected.to) / (this.max - this.min) * 100);

    return `
      <div class="range-slider">
        <span data-element="from">${leftValue}</span>
        <div class="range-slider__inner" data-element="inner">
          <span class="range-slider__progress" 
                style="left: ${leftPercent}%; right: ${rightPercent}%" 
                data-element="progress"></span>
          <span class="range-slider__thumb-left" 
                style="left: ${leftPercent}%" 
                data-element="thumbLeft"></span>
          <span class="range-slider__thumb-right" 
                style="right: ${rightPercent}%" 
                data-element="thumbRight"></span>
        </div>
        <span data-element="to">${rightValue}</span>
      </div>
    `;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((acc, subElement) => {
      acc[subElement.dataset.element] = subElement;
      return acc;
    }, {});
  }

  initEventListeners() {
    const { thumbLeft, thumbRight } = this.subElements;
    
    thumbLeft.addEventListener('pointerdown', event => this.onPointerDown(event, 'from'));
    thumbRight.addEventListener('pointerdown', event => this.onPointerDown(event, 'to'));
  }

  onPointerDown(event, side) {
    event.preventDefault();
    this.dragging = side;
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  onPointerMove = event => {
    event.preventDefault();
    const { inner } = this.subElements;
    const { left, width } = inner.getBoundingClientRect();
    
    // Рассчитываем позицию с ограничением в пределах [0, 1]
    let position = (event.clientX - left) / width;
    position = Math.max(0, Math.min(1, position));
    
    const value = Math.round(this.min + position * (this.max - this.min));
    
    if (this.dragging === 'from') {
      this.selected.from = Math.min(
        Math.max(value, this.min),
        this.selected.to
      );
    } else {
      this.selected.to = Math.max(
        Math.min(value, this.max),
        this.selected.from
      );
    }
    
    this.updateView();
  };

  // Завершает процесс перетаскивания, очищая глобальные обработчики и уведомляя внешний мир об изменении диапазона через кастомное событие `range-select`.
  onPointerUp = () => {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    
    // создаем кастомное событие и в свойстве `detail` мы передаем актуальные значения диапазона
    // событие будет всплывать, подниматься вверх по DOM-дереву, и его можно будет перехватить на любом из родителей элемента
    // это позволяет другим частям приложения узнать об изменении диапазона. Например, таблица товаров может перезагрузить данные с сервера
    this.element.dispatchEvent(new CustomEvent('range-select', {
      detail: { 
        from: this.selected.from, 
        to: this.selected.to 
      },
      bubbles: true
    }));
  };

  updateView() {
    const { thumbLeft, thumbRight, progress, from, to } = this.subElements;
    
    const leftPercent = Math.round((this.selected.from - this.min) / (this.max - this.min) * 100);
    const rightPercent = Math.round((this.max - this.selected.to) / (this.max - this.min) * 100);
    
    thumbLeft.style.left = `${leftPercent}%`;
    thumbRight.style.right = `${rightPercent}%`;
    progress.style.left = `${leftPercent}%`;
    progress.style.right = `${rightPercent}%`;
    
    from.textContent = this.formatValue(this.selected.from);
    to.textContent = this.formatValue(this.selected.to);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
    this.element = null;
    this.subElements = {};
  }
}