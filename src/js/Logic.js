import { interval, of } from 'rxjs';
import {
  map, exhaustMap, catchError, take,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export default class Logic {
  constructor(gui) {
    this.gui = gui;
    // this.url = 'http://localhost:7070/api/check-email';
    this.url = 'https://npeplov-ahj-rxjs-back.herokuapp.com/api/check-email';
    this.last = 0;
  }

  init() {
    this.getMail();
  }

  async getMail() {
    interval(4000).pipe(
      take(3),
      exhaustMap(() => this.sendAjax()), // take раз делаем запрос
      map((response) => response.response.messages, // получаем массив сообщений
        catchError((error) => { // ловим ошибку если есть
          console.log('error: ', error);
          return of(error);
        })),
    )
      .subscribe((messages) => { // подписались на результат pipe
        this.showMessages(messages);
      });
  }

  sendAjax() {
    return ajax({
      url: this.url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'rxjs-custom-header': 'Rxjs',
      },
      body: { email: 'ya@ya.ru' },
    });
  }

  showMessages(messages) {
    if (!this.last) {
      for (let i = this.last; i < messages.length - 1; i += 1) { // не вкл посл эл arr
        const mes = messages[i];
        this.gui.widgetContainer.insertAdjacentHTML('afterbegin', (this.gui.rowTemplate(
          mes.from, mes.subject, mes.received, i,
        )));
      }
    }
    this.last = messages.length - 1;
    this.animate(messages[this.last]); // последний элемент вывод отдельно
  }

  animate(mes) {
    this.gui.widgetContainer.insertAdjacentHTML('afterbegin', this.gui.rowTemplate(
      mes.from, mes.subject, mes.received, this.last,
    ));
    this.gui.widgetContainer.firstElementChild.classList.toggle('animate');
    setTimeout(() => { // без таймаута смена класса не анимируется, почему не понял
      this.gui.widgetContainer.firstElementChild.classList.toggle('animate');
    }, 500);
  }
}
