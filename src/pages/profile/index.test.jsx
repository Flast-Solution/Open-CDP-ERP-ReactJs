import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProfilePage from './index';

const mockUnmount = jest.fn();
jest.mock('./ProfileInfoTab', () => () => <div>Profile content</div>);
jest.mock('./PasswordTab', () => () => <div>Password content</div>);
jest.mock('./LayoutTab', () => () => <div>Layout content</div>);
jest.mock('./OmniTab', () => () => <div>Omni content</div>);
jest.mock('./CustomRoutesTab', () => {
  const { useEffect } = require('react');
  return () => {
    useEffect(() => () => mockUnmount(), []);
    return <div>Routes content</div>;
  };
});

let root;
let container;
beforeEach(() => {
  mockUnmount.mockClear();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  window.history.replaceState(null, '', '/');
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each([
  ['profile', 'Profile content'],
  ['password', 'Password content'],
  ['layout', 'Layout content'],
  ['custom-routes', 'Routes content'],
  ['omni', 'Omni content'],
  ['unknown', 'Profile content'],
  ['constructor', 'Profile content'],
])('initial tab %s selects the expected component', async (tab, content) => {
  window.history.replaceState(null, '', `/profile?tab=${tab}`);
  await act(async () => root.render(<ProfilePage />));
  expect(container.textContent).toContain(content);
  expect(container.querySelectorAll('button')).toHaveLength(5);
});

test('switches only the active tab, unmounts its draft and preserves other URL state', async () => {
  window.history.replaceState(
    { source: 'test' },
    '',
    '/profile?tab=custom-routes&keep=1#section',
  );
  await act(async () => root.render(<ProfilePage />));
  const push = jest.spyOn(window.history, 'pushState');
  try {
    await act(async () =>
      [...container.querySelectorAll('button')]
        .find((b) => b.textContent === 'Mật khẩu')
        .click(),
    );
    expect(container.textContent).toContain('Password content');
    expect(container.textContent).not.toContain('Routes content');
    expect(mockUnmount).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe('?tab=password&keep=1');
    expect(window.location.hash).toBe('#section');
    expect(window.history.state).toEqual({ source: 'test' });
    expect(push).not.toHaveBeenCalled();
  } finally {
    push.mockRestore();
  }
});
