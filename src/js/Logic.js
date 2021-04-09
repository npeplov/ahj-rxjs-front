/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { of, interval } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export default class Logic {
  constructor(gui) {
    this.gui = gui;
    // this.url = 'http://localhost:7070/api/check-email';
    this.url = 'https://npeplov-ahj-rxjs-back.herokuapp.com/api/check-email';
    this.messages = null;
  }

  init() {
    this.sendAjax();
  }

  sendAjax() {
    const obj$ = ajax({
      url: this.url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'rxjs-custom-header': 'Rxjs',
      },
      body: { email: 'ya@ya.ru' },
    })
      .pipe(
        map((response) => {
          // console.log(response.response.messages);
          if (response) this.messages = response.response.messages;
          this.showMessages();
        }),
        catchError((error) => {
          console.log('error: ', error);
          return of(error);
        }),
      );
    const numbers = interval(4000);
    const takeFourNumbers = numbers.pipe(take(5));
    takeFourNumbers.subscribe(() => obj$.subscribe());
  }

  showMessages() {
    if (this.messages) {
      this.gui.widgetContainer.classList.toggle('animate');
      this.gui.widgetContainer.innerHTML = '';
      for (let i = this.messages.length - 1; i > 0; i -= 1) {
        const mes = this.messages[i];
        this.gui.widgetContainer.innerHTML += this.gui.rowTemplate(
          mes.from, mes.subject, mes.received,
        );
      }
    }
  }

  // getErr() {
  //   console.log(this);
  //   const obs$ = ajax('https://api.github.com/404').pipe(
  //     map((userResponse) => console.log('users: ', userResponse)),
  //     catchError((error) => {
  //       console.log('error: ', error);
  //       return of(error);
  //     }),
  //   );
  //   obs$.subscribe();
  // }
}

// fromEvent(this.gui.widgetInput, 'input')
// .pipe(
//   map((event) => event.target.value.trim()),
//   filter((value) => value !== ''),
//   // map вместо объекта-события вернет value элемента-таргета
// )
// .subscribe((value) => {
//   console.log(value);
// });
