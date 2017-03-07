import {Component} from 'angular2/core';
import 'app/css/style.css!';
import {TestComponent} from './test.compnent';
@Component({
  selector: 'app',
  template: `
  <test></test>
  <p class="hello">message from angularjs</p>
  `,
  directives:[TestComponent]
})
export class AppComponent {
  constructor() { }
}