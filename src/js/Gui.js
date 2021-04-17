/* eslint-disable class-methods-use-this */
export default class Gui {
  constructor() {
    this.modal = document.querySelector('.modal');
    this.widget = document.querySelector('.widget');
    this.widgetContainer = this.widget.querySelector('.container');
  }

  rowTemplate(addr, title, date, i) {
    return `
    <div class="row">
      <div class="col">#${i} ${addr}</div>
      <div class="col">${title}</div>
      <div class="col">${(new Date(date)).toString().slice(4, 21)}</div>
    </div>
    `;
  }
}
