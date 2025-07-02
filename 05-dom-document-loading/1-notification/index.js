export default class NotificationMessage {
    static activeNotification = null;
    static defaultDuration = 2000;

    constructor(message = '', {
        duration = NotificationMessage.defaultDuration,
        type = 'success'
    } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;
        this.element = this.createElement(this.createTemplate());
    }

    createElement(template) {
        const element = document.createElement('div');
        element.innerHTML = template;
        return element.firstElementChild;
    }

    createTemplate() {
        // Преобразуем миллисекунды в секунды для CSS переменной
        const durationInSeconds = this.duration / 1000;
        return `
        <div class="notification ${this.type}" style="--value:${durationInSeconds}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>
        `;
    }

    show(parent = document.body) {
        // Закрываем предыдущее уведомление, если оно есть
        if (NotificationMessage.activeNotification) {
            NotificationMessage.activeNotification.remove();
        }

        // Сохраняем текущее уведомление как активное
        NotificationMessage.activeNotification = this;

        // Добавляем в DOM
        parent.appendChild(this.element);

        // Устанавливаем таймер на автоматическое закрытие
        this.timerId = setTimeout(() => {
            this.remove();
        }, this.duration);

    }

    remove() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }

        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }

        // Если это уведомление было активным, очищаем ссылку
        if (NotificationMessage.activeNotification === this) {
            NotificationMessage.activeNotification = null;
        }
    }

    destroy() {
        this.remove();
    }

}
