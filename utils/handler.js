import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3"; 
import fs from "fs";
import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const s3 = new S3Client({
    credentials:{ 
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION,
});

export const listFiles = async () => {
    const params = {
        Bucket: "developer-task",
        Delimiter: "/",
        Prefix: "a-wing/"
    }
    const command = new ListObjectsV2Command(params);

    try {
        let isTruncated = true;
        console.log("Your bucket contains the following objects:\n");
        let contents = "";

        while (isTruncated) {
                const { Contents, IsTruncated, NextContinuationToken } =
                    await s3.send(command);
                const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
                contents += contentsList + "\n";
                isTruncated = IsTruncated;
                command.input.ContinuationToken = NextContinuationToken;
        }
        console.log(contents);
        return contents;
    } catch(err) {
        console.error(err);
    }
};

export const uploadFile = async (args) => {
    const modulePath = dirname(fileURLToPath(import.meta.url))
    const fileContent = fs.readFileSync(resolve(modulePath, args.fileName));
    const params = {
        Bucket: "developer-task",
        Key: `a-wing/${args.fileName}`,
        Body: fileContent,
    };
    try {
        const command = new PutObjectCommand(params)
        await s3.send(command);
        console.log("Successful upload")
    } catch(err) {
        console.error(err);
    }
};

export const filteredFileList = async (args) => {
    const params = {
        Bucket: "developer-task",
        Delimiter: "/",
        Prefix: "a-wing/"
    }
    const regex = args.pattern;
    const command = new ListObjectsV2Command(params);

    try {
        let isTruncated = true;
        console.log("Your bucket contains the following objects:\n");
        let contents = "";

        while (isTruncated) {
            const { Contents, IsTruncated, NextContinuationToken } =
                await s3.send(command);
            const contentsList = Contents.map((c) => {
                if (c.Key.match(regex)) {
                    ` • ${c.Key}`
                }
            }).join("\n");
            contents += contentsList + "\n";
            isTruncated = IsTruncated;
            command.input.ContinuationToken = NextContinuationToken;
        }
        console.log(contents);
        return contents;
    } catch(err) {
        console.error(err);
    }
};

export const deleteFile = async (argv) => {
    const fileList = filteredFileList(argv).split('');
    const params = {
        Bucket: "developer-task",
        Delete: {
            Objects: fileList.map((key) => ({ Key: key })),
        }
    };
    try {
        await s3.send(new DeleteObjectsCommand(params));
        console.log("Files deleted successfuly");
    } catch (err) {
        console.error(err)
    }
};
