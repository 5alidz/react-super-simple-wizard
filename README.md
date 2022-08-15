# React Super Simple Wizard

I just get tired copy pasting it around :P

[![GitHub license](https://img.shields.io/github/license/5alidz/react-super-simple-wizard)](https://github.com/5alidz/react-super-simple-wizard/blob/master/LICENSE) ![Minzipped size](https://img.shields.io/bundlephobia/minzip/react-super-simple-wizard.svg)

### Install

```
yarn add react-super-simple-wizard
```

### How it works

The only prop you need is `initial` the other props are completley up to you

```tsx
<Wizard
  {/* `initial` points to a prop key */}
  initial='start'
  {/* This is named start so it will render initially */}
  start={({ next, prev, goto }) => (
    <YourComponent onSuccess={next} />
  )}
  theNextStep={({ goto }) => (
    // now goto(stepKey: 'initial' | 'start' | 'finish') is fully typed and knows about initial, start and finish
    <AlsoYourComponent onSuccess={next} onError={() => goto('initial')}/>
  )}
  finish={() => (
    <Confetti msg='You made it!' />
  )}
/>
```

### And now, an actual useful example

Imagine you have a protected resource or really any other combination of steps

```tsx
import { Wizard, WizardStepProps } from 'react-super-simple-wizard';

type Step = WizardStepProps<'login' | 'register' | 'protected'>;

const Login = ({ goto }: Step) => (
  <LoginForm onSuccess={() => goto('protected')} />
);
const Register = ({ next }: Step) => <RegisterForm onSuccess={next} />;
const Protected = () => <Dashboard />;

function Auth() {
  return (
    <Wizard
      initial="login"
      login={Login}
      register={Register}
      protected={Protected}
    />
  );
}
```
