import {
  createRef,
  forwardRef,
  Ref,
  useImperativeHandle,
  useState,
} from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import { Wizard } from '../src';

test('next works', () => {
  const testRenderer = TestRenderer.create(
    <Wizard
      initial="start"
      start={({ next, prev, goto }) => (
        <div id="start-div" onClick={next}>
          start
        </div>
      )}
      theNextStep={({ goto }) => <div id="next-div">the next step</div>}
      finish={() => <div>finish</div>}
    />
  );

  expect(testRenderer.root.findByType('div').props.id).toBe('start-div');
  act(() => testRenderer.root.findByType('div').props.onClick());
  expect(testRenderer.root.findByType('div').props.id).toBe('next-div');
  testRenderer.unmount();
});

test('can update steps', () => {
  const testRenderer = TestRenderer.create(
    <Wizard initial="start" start={() => <span>span text 1</span>} />
  );

  expect(testRenderer.root.findByType('span').props.children).toBe(
    'span text 1'
  );

  testRenderer.update(
    <Wizard initial="start" start={() => <span>span text 2</span>} />
  );

  expect(testRenderer.root.findByType('span').props.children).toBe(
    'span text 2'
  );
  testRenderer.unmount();
});

test('can update steps without losing state', () => {
  interface CWSProps {
    defaultValue: string;
  }

  interface CWSRef {
    setValue(value: string): void;
  }

  const ComponentWithState = forwardRef((props: CWSProps, ref: Ref<CWSRef>) => {
    const [value, setValue] = useState(props.defaultValue);
    useImperativeHandle(
      ref,
      () => ({
        setValue,
      }),
      [setValue]
    );
    return <div id="cws">{value}</div>;
  });

  const cwsRef = createRef<CWSRef>();

  const testRenderer = TestRenderer.create(
    <Wizard
      initial="start"
      start={() => (
        <ComponentWithState ref={cwsRef} defaultValue="initial value" />
      )}
    />
  );

  expect(testRenderer.root.findByType('div').props.children).toBe(
    'initial value'
  );
  act(() => cwsRef.current!.setValue('new value'));
  expect(testRenderer.root.findByType('div').props.children).toBe('new value');

  testRenderer.update(
    <Wizard
      initial="start"
      start={() => (
        <ComponentWithState ref={cwsRef} defaultValue="initial value" />
      )}
    />
  );

  expect(testRenderer.root.findByType('div').props.children).toBe('new value');
  testRenderer.unmount();
});
