import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3"; 
import config from "../config/index.js";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

// ----------------- Multer storage config -----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}`;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage });

// Single / multi upload configs
const uploadProfileImage = upload.single("profileImage");
const groupImage = upload.single("groupImage");
const chatImage = upload.single("chatImage");

const postImage = upload.fields([
  { name: "postImage", maxCount: 10 },
])

const uploadSignatureImage = upload.single("signature");
const uploadMultipleImage = upload.fields([
  { name: "productImage", maxCount: 10 },
  { name: "variantImages", maxCount: 100 },
]);
const uploadFile = upload.single("file");


// export const s3Client = new S3Client({
//   region: config.S3.space_bucket_region, 
//   endpoint: config.S3.space_endpoint,
//   credentials: {
//     accessKeyId: config.S3.space_accesskey || "",
//     secretAccessKey: config.S3.space_secret_key || "",
//   },
// });
export const s3Client = new S3Client({
  region: config.S3.space_bucket_region as string,
  endpoint: config.S3.space_endpoint as string,
  credentials: {
    accessKeyId: config.S3.space_accesskey || "",
    secretAccessKey: config.S3.space_secret_key || "",
  },
});


const uploadToDigitalOcean = async (
  file: Express.Multer.File
): Promise<{ Location: string; Bucket: string; Key: string }> => {
  if (!file) throw new Error("File is required for uploading.");

  const Bucket = config.S3.space_bucket || "";
  const Key = `uploads/${Date.now()}_${file.originalname}`;

  const { UploadId } = await s3Client.send(
    new CreateMultipartUploadCommand({
      Bucket,
      Key,
      ContentType: file.mimetype,
      // ACL: "public-read" as ObjectCannedACL,
    })
  );

  if (!UploadId) throw new Error("Failed to initiate multipart upload");

  try {
    const fileStream = fs.createReadStream(file.path, {
      highWaterMark: CHUNK_SIZE,
    });
    let partNumber = 1;
    // const uploadedParts: { PartNumber: number; ETag?: string }[] = [];
    const uploadedParts: { PartNumber: number; ETag?: string | undefined }[] = [];

    for await (const chunk of fileStream) {
      const { ETag } = await s3Client.send(
        new UploadPartCommand({
          Bucket,
          Key,
          UploadId,
          PartNumber: partNumber,
          Body: chunk,
          ContentLength: chunk.length,
        })
      );
      uploadedParts.push({ PartNumber: partNumber, ETag });
      partNumber++;
    }

    await s3Client.send(
      new CompleteMultipartUploadCommand({
        Bucket,
        Key,
        UploadId,
        MultipartUpload: { Parts: uploadedParts },
      })
    );

    await fs.promises.unlink(file.path);

    return {
      Location: `${config.S3.space_origin_endpoint}/${Key}`,
      Bucket,
      Key,
    };
  } catch (error) {
    console.error("Error in multipart upload:", error);
    await s3Client.send(
      new AbortMultipartUploadCommand({ Bucket, Key, UploadId })
    );
    throw error;
  }
};


export const fileUploader = {
  upload,
  uploadToDigitalOcean,
  uploadProfileImage,
  uploadMultipleImage,
  uploadSignatureImage,
  uploadFile,
  chatImage,
  groupImage,
  postImage
};
