import TestRenderer, { act } from 'react-test-renderer';

import { Wizard } from "../src";

test('next works', () => {
  const testRenderer = TestRenderer.create(
    <Wizard
      initial='start'
      start={({ next, prev, goto }) => (
        <div id="start-div" onClick={next}>start</div>
      )}
      theNextStep={({ goto }) => (
        <div id="next-div">the next step</div>
      )}
      finish={() => (
        <div>finish</div>
      )}
    />
  );

  expect(testRenderer.root.findByType('div').props.id).toBe('start-div');
  act(() => testRenderer.root.findByType('div').props.onClick());
  expect(testRenderer.root.findByType('div').props.id).toBe('next-div');
  testRenderer.unmount();
});
