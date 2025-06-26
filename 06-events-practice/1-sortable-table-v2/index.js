import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTableV1 {
  arrowElement;
  currentSort = {};

  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = true
  } = {}) {
    super(headersConfig, data);
    
    this.currentSort = sorted;
    this.isSortLocally = isSortLocally;
    this.arrowElement = this.createArrowElement();

    this.initialize();
    this.sort(this.currentSort.id, this.currentSort.order);
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
    const arrows = this.subElements.header.querySelectorAll('.sortable-table__sort-arrow');
    arrows.forEach(arrow => arrow.remove());
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
      header.querySelector('.sortable-table__sort-arrow')?.remove();
    });

    // Устанавливаем состояние для активного заголовка
    const activeHeader = this.subElements.header.querySelector(`[data-id="${fieldId}"]`);
    if (activeHeader) {
      activeHeader.dataset.order = order;
      activeHeader.append(this.arrowElement);
      
      // Поворачиваем стрелку для направления "desc"
      const arrowInner = this.arrowElement.querySelector('.sort-arrow');
      if (arrowInner) {
        arrowInner.style.transform = order === 'desc' ? 'rotate(180deg)' : '';
      }
    }
  }

  handleHeaderCellClick = (event) => {
    const cellElement = event.target.closest('.sortable-table__cell[data-sortable="true"]');
    if (!cellElement) return;

    const fieldId = cellElement.dataset.id;
    const currentOrder = cellElement.dataset.order || 'asc';
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