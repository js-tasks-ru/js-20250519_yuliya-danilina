export default class SortableTableV1 {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}
      </div>
    `;
  }

  getTableHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(column => this.getHeaderCell(column)).join('')}
      </div>
    `;
  }

  getHeaderCell({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${sortable ? '<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>' : ''}
      </div>
    `;
  }

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
      </div>
    `;
  }

  getTableRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.headerConfig.map(column => this.getTableRowCell(item, column)).join('')}
        </a>
      `;
    }).join('');
  }

  getTableRowCell(item, {id, template}) {
    return template
      ? template(item[id])
      : `<div class="sortable-table__cell">${item[id]}</div>`;
  }

  getSubElements() {
    const result = {};
    // Собираем все элементы с атрибутом data-element
    const elements = this.element.querySelectorAll('[data-element]');
    // создаем объект в формате: {header: HTMLDivElement, body: HTMLDivElement} для быстро обращения к частям таблицы
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  sort(fieldValue, orderValue) {
    const column = this.headerConfig.find(item => item.id === fieldValue);
    
    if (!column || !column.sortable) return;

    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[orderValue];

    this.data.sort((a, b) => {
      switch (column.sortType) {
        case 'number':
          return direction * (a[fieldValue] - b[fieldValue]);
        case 'string':
          return direction * a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en']);
        default:
          return direction * (a[fieldValue] - b[fieldValue]);
      }
    });

    this.updateTable();
  }

  updateTable() {
    // получаем доступ к контейнеру строк и меняем только тело таблицы
    this.subElements.body.innerHTML = this.getTableRows(this.data);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}