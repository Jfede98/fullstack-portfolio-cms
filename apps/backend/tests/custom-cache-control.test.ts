export {};

const loadMiddleware = async () => {
  const mod = await import('../src/middlewares/custom-cache-control');
  return (mod as { default: () => (ctx: unknown, next: () => Promise<void>) => Promise<void> }).default;
};

describe('custom-cache-control middleware', () => {
  it('sets Cache-Control header after next()', async () => {
    const middleware = (await loadMiddleware())();
    const ctx = {
      set: jest.fn(),
    };
    const next = jest.fn().mockResolvedValue(undefined);

    await middleware(ctx as never, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(ctx.set).toHaveBeenCalledWith(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  });
});
