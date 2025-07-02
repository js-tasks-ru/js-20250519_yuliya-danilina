import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable)?.id,
      order: 'asc'
    },
    isSortLocally = true
  } = {}) {
    super(headersConfig, data);
    
    this.currentSort = sorted;
    this.isSortLocally = isSortLocally;
    this.arrowElement = this.createArrowElement();

    this.initialize();
    if (sorted.id) {
      this.sort(this.currentSort.id, this.currentSort.order);
    }
  }

  // Переопределяем метод создания ячейки заголовка
  getHeaderCell({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${sortable ? '<span class="sortable-table__sort-arrow"></span>' : ''}
      </div>
    `;
  }

  createArrowElement() {
    const element = document.createElement('div');
    element.innerHTML = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
    return element.firstElementChild;
  }

  initialize() {
    this.removeDefaultArrows();
    this.createListeners();
  }

  removeDefaultArrows() {
    // Удаляем только внутренности стрелок
    const arrows = this.subElements.header.querySelectorAll('.sortable-table__sort-arrow');
    arrows.forEach(arrow => arrow.innerHTML = '');
  }

  sort(fieldId, order) {
    if (this.isSortLocally) {
      this.sortOnClient(fieldId, order);
    } else {
      this.sortOnServer(fieldId, order);
    }
  }

  sortOnClient(fieldId, order) {
    super.sort(fieldId, order);
    this.updateSortUI(fieldId, order);
  }

  updateSortUI(fieldId, order) {
    this.currentSort = { id: fieldId, order };
    
    // Сбрасываем состояние для всех заголовков
    const headers = this.subElements.header.querySelectorAll('[data-sortable="true"]');
    headers.forEach(header => {
      header.dataset.order = '';
      const arrowContainer = header.querySelector('.sortable-table__sort-arrow');
      if (arrowContainer) arrowContainer.innerHTML = '';
    });

    // Устанавливаем состояние для активного заголовка
    const activeHeader = this.subElements.header.querySelector(`[data-id="${fieldId}"]`);
    if (activeHeader) {
      activeHeader.dataset.order = order;
      const arrowContainer = activeHeader.querySelector('.sortable-table__sort-arrow');
      if (arrowContainer) {
        arrowContainer.appendChild(this.arrowElement);
      }
      
      // Поворачиваем стрелку
      const arrowInner = this.arrowElement.querySelector('.sort-arrow');
      if (arrowInner) {
        arrowInner.style.transform = order === 'desc' ? 'rotate(180deg)' : '';
      }
    }
  }

  handleHeaderCellClick = (event) => {
    const cellElement = event.target.closest('[data-sortable="true"]');
    if (!cellElement) return;

    const fieldId = cellElement.dataset.id;
    // Используем текущее состояние, а не DOM
    const currentOrder = this.currentSort.id === fieldId 
        ? this.currentSort.order 
        : 'asc';
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    
    this.sort(fieldId, newOrder);
  };

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
    this.arrowElement = null;
  }
}