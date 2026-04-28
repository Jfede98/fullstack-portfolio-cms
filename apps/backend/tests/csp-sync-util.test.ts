import { syncCspToStaticStorage } from "../src/utils/csp-sync";

type UploadFile = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  buffer: Buffer;
  stream: NodeJS.ReadableStream;
  url?: string;
};

const makeStrapi = (uploadImpl?: (file: UploadFile) => Promise<void>) => {
  const upload = jest.fn(
    async (file: UploadFile, options?: Record<string, string>) => {
      if (uploadImpl) {
        await uploadImpl(file);
        return;
      }
      file.url = "https://statics.test/assets-admin-xtrim/csp.json";
      void options;
    }
  );

  return {
    plugin: jest.fn().mockReturnValue({
      provider: {
        upload
      }
    }),
    log: {
      warn: jest.fn(),
      info: jest.fn()
    },
    __upload: upload
  };
};

describe("syncCspToStaticStorage", () => {
  it("skips invalid CSP payloads", async () => {
    const strapi = makeStrapi();
    await syncCspToStaticStorage(strapi as unknown as never, "bad-csp");

    expect(strapi.log.warn).toHaveBeenCalledWith(
      "[csp-sync] CSP inválido, se omite sincronización"
    );
    expect(strapi.__upload).not.toHaveBeenCalled();
  });

  it("skips when upload provider is unavailable", async () => {
    const strapi = {
      plugin: jest.fn().mockReturnValue({}),
      log: {
        warn: jest.fn(),
        info: jest.fn()
      }
    };

    await syncCspToStaticStorage(strapi as unknown as never, {
      "default-src": ["'self'"]
    });

    expect(strapi.log.warn).toHaveBeenCalledWith(
      "[csp-sync] Upload provider no disponible"
    );
  });

  it("skips when upload plugin returns null provider", async () => {
    const strapi = {
      plugin: jest.fn().mockReturnValue(null),
      log: {
        warn: jest.fn(),
        info: jest.fn()
      }
    };

    await syncCspToStaticStorage(strapi as unknown as never, {
      "default-src": ["'self'"]
    });

    expect(strapi.log.warn).toHaveBeenCalledWith(
      "[csp-sync] Upload provider no disponible"
    );
  });

  it("uploads csp.json with expected metadata and cache headers", async () => {
    const strapi = makeStrapi();
    const csp = {
      "default-src": ["'self'"],
      "script-src": ["'self'", "{nonce}"]
    };

    await syncCspToStaticStorage(strapi as unknown as never, csp);

    expect(strapi.__upload).toHaveBeenCalledTimes(1);
    const [file, options] = strapi.__upload.mock.calls[0] as [
      UploadFile,
      Record<string, string>
    ];

    expect(file.name).toBe("csp.json");
    expect(file.hash).toBe("csp");
    expect(file.ext).toBe(".json");
    expect(file.mime).toBe("application/json");
    expect(file.size).toBeGreaterThan(0);
    expect(file.buffer.toString("utf8")).toContain('"default-src"');
    expect(options).toEqual({
      ContentType: "application/json"
    });
    expect(strapi.log.info).toHaveBeenCalledWith(
      "[csp-sync] CSP sincronizado en https://statics.test/assets-admin-xtrim/csp.json"
    );
  });
});
