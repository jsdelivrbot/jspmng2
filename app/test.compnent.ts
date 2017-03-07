import {Component} from 'angular2/core';

@Component({
    selector:'test',
    template:`
    <h1>Inject me into another component with declare directives</h1>
    `
})


export class TestComponent {
    constructor(){ }
}