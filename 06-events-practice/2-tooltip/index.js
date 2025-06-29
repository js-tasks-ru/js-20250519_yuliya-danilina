class Tooltip {
  static instance;
  element;
  activeElement = null;
  offset = 10;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    
    Tooltip.instance = this;
  }

  initialize() {
    this.addEventListeners();
    return this;
  }

  createElement(template) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;
    return wrapper.firstElementChild;
  }

  createTemplate() {
    return `<div class="tooltip"></div>`;
  }

  render(text) {
    if (!this.element) {
      this.element = this.createElement(this.createTemplate());
      document.body.append(this.element);
    }
    
    this.element.textContent = text;
    this.element.style.display = 'block';
  }

  addEventListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  onPointerOver = (event) => {
    const element = event.target.closest('[data-tooltip]');
    
    if (!element) return;
    this.activeElement = element;
    
    this.render(element.dataset.tooltip);
    this.move(event.clientX, event.clientY);
    
    document.addEventListener('pointermove', this.onPointerMove);
  };

  onPointerOut = (event) => {
    // Проверка наличия активного элемента
    if (!this.activeElement) return;
    
    // Получение элемента, на который переместился курсор
    const relatedTarget = event.relatedTarget;
    
    // Проверка, покинул ли курсор активный элемент
    const isLeaving = !this.activeElement.contains(relatedTarget);
    
    // Действие при полном выходе из элемента
    if (isLeaving) {
      this.hide();          // Скрыть подсказку
      this.activeElement = null; // Сбросить ссылку на активный элемент
    }
  };

  onPointerMove = (event) => {
    this.move(event.clientX, event.clientY);
  };

  move(x, y) {
    if (!this.element) return;
    
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const tooltipWidth = this.element.offsetWidth;
    const tooltipHeight = this.element.offsetHeight;
    
    // Рассчитываем позицию с учётом границ экрана
    let left = x + this.offset;
    let top = y + this.offset;
    
    if (left + tooltipWidth > windowWidth) {
      left = windowWidth - tooltipWidth - this.offset;
    }
    
    if (top + tooltipHeight > windowHeight) {
      top = windowHeight - tooltipHeight - this.offset;
    }
    
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  destroy() {
    this.removeEventListeners();
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    this.activeElement = null;
    Tooltip.instance = null;
  }

  removeEventListeners() {
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointermove', this.onPointerMove);
  }
}

export default Tooltip;
