import { Component, computed, linkedSignal, model, OnInit, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  applyWhen,
  applyWhenValue,
  form,
  FormField,
  required,
  validate,
  validateStandardSchema,
} from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  template: `Hello: {{this.whenValidated()}}<br/>
  Hello2: {{this.whenValidated2()}}<br />
  Hello3: {{this.whenValidated3()}}
  <button (click)="onSubmit()" type="button">click</button>`,
})
export class Playground implements OnInit {
  readonly type = signal<string | undefined>(undefined);
  readonly typeOrDefault = computed(()=>this.type() ?? 'Test')
  readonly data = model({
    Type: this.typeOrDefault(),
    firstName: 'test',
  });

  readonly whenValidated = signal<string>('x')
  readonly whenValidated2 = signal<string>('')
  readonly whenValidated3 = signal<string>('')
  readonly formData = form(this.data, (schemaPath) => {
    applyWhen(
      schemaPath,
      (ctx) => ctx.valueOf(schemaPath.Type) === 'Updated',
      (ctx) => {
        console.log('applyWhen', this.type());
        this.whenValidated.set(this.type() ?? '')
        required(ctx.firstName);
      }
    );
    applyWhenValue(
      schemaPath,
      (ctx) => ctx.Type === 'Updated',
      (ctx) => {
        console.log('applyWhenValue', this.type());
        this.whenValidated2.set(this.type() ?? '')
        required(ctx.firstName);
      }
    );

    applyWhen(
      schemaPath.Type,
      (ctx) => ctx.value() === 'Updated',
      (ctx) => {
        console.log('applyWhen 3', this.type());
        this.whenValidated3.set(this.type() ?? '')
        required(ctx);
      }
    );
    applyWhenValue(
      schemaPath.Type,
      (ctx) => ctx === 'Updated',
      (ctx) => {
        console.log('applyWhen 3', this.type());
        this.whenValidated3.set(this.type() ?? '')
        required(ctx);
      }
    );
  });

  ngOnInit() {
  }
  
  onSubmit() {
    
    this.type.set('Updated');
  }
}

bootstrapApplication(Playground);
