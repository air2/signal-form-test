import { Component, model, OnInit, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  applyWhen,
  form,
  FormField,
  required,
  validate,
  validateStandardSchema,
} from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  template: `Hello: {{this.type()}}`,
})
export class Playground implements OnInit {
  readonly data = model({
    type: 'Test',
    firstName: 'test',
  });
  readonly type = signal<string | undefined>(undefined);
  readonly formData = form(this.data, (schemaPath) => {
    applyWhen(
      schemaPath,
      () => this.type() !== undefined,
      (ctx) => {
        console.log('applyWhen', this.type());
        required(ctx.firstName);
      }
    );
  });

  ngOnInit() {
    this.type.set('Updated');
  }
}

bootstrapApplication(Playground);
