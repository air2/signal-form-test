import { Component, computed, effect, inject, Injector, linkedSignal, model, OnInit, signal } from '@angular/core';
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
  template: `<br /> {{this.data().Type}} <br />
  Hello: {{this.whenValidated()}}<br/>
  Hello2: {{this.whenValidated2()}}<br />
  Hello3: {{this.whenValidated3()}}<br />
  Hello4: {{this.whenValidated4()}}<br />
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
  readonly whenValidated2 = signal<string>('x')
  readonly whenValidated3 = signal<string>('x')
  readonly whenValidated4 = signal<string>('x')

  readonly inj = inject(Injector)

  readonly formData = form(this.data, (schemaPath) => {
    effect(() => {

      const type = this.typeOrDefault();
      console.log('type', type)
      applyWhen(
        schemaPath,
        (ctx) => ctx.valueOf(schemaPath.Type) === 'Updated',
        (ctx) => {
          console.log('applyWhen', this.type());
          this.whenValidated.set(this.data().Type)
          required(ctx.firstName);
        }
      );
    }, { injector: this.inj});
    applyWhenValue(
      schemaPath,
      (ctx) => ctx.Type === 'Updated',
      (ctx) => {
        console.log('applyWhenValue', this.type());
        this.whenValidated2.set(this.data().Type)
        required(ctx.firstName);
      }
    );

    applyWhen(
      schemaPath.Type,
      (ctx) => ctx.value() === 'Updated',
      (ctx) => {
        console.log('applyWhen 3', this.type());
        this.whenValidated3.set(this.data().Type)
        required(ctx);
      }
    );
    applyWhenValue(
      schemaPath.Type,
      (ctx) => this.type() === 'Updated',
      (ctx) => {
        console.log('applyWhen 4', this.type());
        this.whenValidated4.set('changed' + this.data().Type)
        required(ctx);
      }
    );
  }, {
    injector: this.inj
  });

  ngOnInit() {
  }
  
  onSubmit() {
    
    // this.formData.Type().value.set('Updated');
    this.data.update(v => {const u = {...v}; u.Type = 'Updated'; return u})
  }
}

bootstrapApplication(Playground);
