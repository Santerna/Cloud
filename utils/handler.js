import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3"; 
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path'

const s3 = new S3Client({
    credentials:{ 
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: 'eu-west-1',
});

export const listFiles = async () => {
    try {
        const command = new ListObjectsV2Command(s3params);
        const response = await s3.send(command);
        return response.Contents;
    } catch(err) {
        console.error(err);
    }
};

export const uploadFile = async (args) => {
    console.log(args.fileName);
    console.log('upload');
    const modulePath = dirname(fileURLToPath(import.meta.url))
    const fileContent = fs.readFileSync(resolve(modulePath, args.fileName));
    console.log(`content ${fileContent}`)
    const params = {
        Bucket: 'developer-task',
        Key: `a-wing/${args.fileName}`,
        Body: fileContent,
    };
    try {
        const command = new PutObjectCommand(params)
      
        const response = await s3.send(command);
    
        console.log(response.VersionId)
    } catch(err) {
        console.error(err);
    }
};

export const deleteFile = () => {
    console.log("delete")
    const params = {
        Bucket: 'developer-task',
        Key: `a-wing/`,
        Delete: {

        }
    };
};

