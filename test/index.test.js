/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

const Path = require('path');
const { autoMock, getMockFiles, parseFixtures } = require('../src/index');

const appRootPath = Path.join(__dirname, '..');

describe('@coderich/nodejs-dev', () => {
  test('autoMock', () => {
    expect(() => autoMock(appRootPath)).not.toThrow();
  });

  test('getMockFiles', () => {
    expect(getMockFiles(appRootPath)).toEqual({
      nodeMocks: {
        '@babel/core': `${appRootPath}/__mocks__/@babel/core`,
        fs: `${appRootPath}/__mocks__/fs`,
        path: `${appRootPath}/__mocks__/path`,
      },
      srcMocks: [
        `${appRootPath}/src/index`,
      ],
    });
  });

  test('parseFixtures', () => {
    expect(parseFixtures(`${__dirname}/__fixtures__`)).toMatchObject({
      workspaces: expect.arrayContaining([
        expect.objectContaining({
          _id: expect.anything(),
          name: 'live',
        }),
        expect.objectContaining({
          _id: expect.anything(),
          name: 'draft',
        }),
      ]),
      networks: expect.arrayContaining([
        expect.objectContaining({
          _id: expect.anything(),
          name: 'Piedmont',
        }),
      ]),
    });
  });
});
