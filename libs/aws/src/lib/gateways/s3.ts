import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  type ListObjectsV2CommandInput,
  type ObjectIdentifier,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { TEntryFn, TPutObject } from "@aws/interfaces/s3";
import fs from "fs";
import path from "path";
import mime from "mime";
import pLimit from "p-limit";

export class S3Gateway {
  private readonly _s3: S3Client;
  private readonly _bucketName: string;

  constructor(region: string, bucketName: string) {
    this._s3 = new S3Client({
      region,
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED"
    });
    this._bucketName = bucketName;
  }

  async clearPrefix(prefix: string) {
    console.log("S3 | Clearing Prefix");

    const listed = await this._listObjects(prefix);
    if (!listed.Contents?.length) return;

    return this._deleteObject(listed.Contents.map((o) => ({ Key: o.Key! })));
  }

  async uploadDir(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const limit = pLimit(3);

    const promises = entries.map((entry) =>
      limit(() => this._entries({ dir, prefix, entry }))
    );
    await Promise.all(promises);
  }

  private async _entries({ dir, prefix, entry }: TEntryFn) {
    const fullPath = path.join(dir, entry.name);
    const s3Key = `${prefix}${entry.name}`;

    console.log(`S3 | Uploading ${s3Key}`);

    if (!entry.isDirectory()) {
      const contentType = mime.getType(fullPath) || "application/octet-stream";

      return await this._putObject({
        Key: s3Key,
        fullPath,
        ContentType: contentType,
        entry
      });
    }

    return await this.uploadDir(fullPath, `${s3Key}/`);
  }

  private _deleteObject(objects: ObjectIdentifier[]) {
    console.log("S3 | Deleting Objects");

    const command = new DeleteObjectsCommand({
      Bucket: this._bucketName,
      Delete: {
        Objects: objects
      }
    });

    return this._s3.send(command);
  }

  private _listObjects(prefix: string) {
    console.log("S3 | Listing Objects");

    const commandInput: ListObjectsV2CommandInput = {
      Bucket: this._bucketName,
      Prefix: prefix
    };

    const command = new ListObjectsV2Command(commandInput);

    return this._s3.send(command);
  }

  private async _putObject({ Key, fullPath, ContentType, entry }: TPutObject) {
    const CacheControl = entry.name.endsWith(".html")
      ? "no-cache"
      : "public, max-age=31536000, immutable";

    const stats = fs.statSync(fullPath);
    const fileSize = stats.size;

    if (fileSize >= 5 * 1024 * 1024) {
      const fileStream = fs.createReadStream(fullPath);
      const upload = new Upload({
        client: this._s3,
        params: {
          Bucket: this._bucketName,
          Key,
          Body: fileStream,
          ContentType,
          CacheControl,
          ContentLength: fileSize
        },
        queueSize: 4,
        partSize: 5 * 1024 * 1024
      });

      return upload.done();
    }

    const fileBuffer = fs.readFileSync(fullPath);
    return this._s3.send(
      new PutObjectCommand({
        Bucket: this._bucketName,
        Key,
        Body: fileBuffer,
        ContentType,
        CacheControl
      })
    );
  }
}
