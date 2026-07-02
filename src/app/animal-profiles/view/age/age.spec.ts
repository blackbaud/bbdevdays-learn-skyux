import { Age } from './age';

describe('Age', () => {
  it('create an instance', () => {
    const pipe = new Age();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(undefined)).toEqual('N/A');
    expect(pipe.transform(new Date())).toEqual('0 months');
    expect(pipe.transform(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30))).toEqual('1 month');
    expect(pipe.transform(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6))).toEqual('6 months');
    expect(pipe.transform(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 17.5))).toEqual(
      '1 year, 5 months',
    );
    expect(pipe.transform(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 30))).toEqual('2 years');
  });
});
