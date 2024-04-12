import yargs from "yargs";
import { hideBin } from "yargs/helpers";
;
export { listFiles, uploadFile } from "./utils/handler";

yargs(hideBin(process.argv))
    .command("list", "List all files in an S3 Bucket", listFiles)
    .command({
        command: "upload",
        describe: "Upload a local file to a defined location in the bucket", 
        builder: { 
            fileName: { 
                describe: 'Name of Uploaded File', 
                demandOption: true,  // Required 
                type: 'string'     
            }
        },
        handler(argv) {
          uploadFile(argv)  
        }
    })
    .command("filtered", "List an AWS buckets files that match a filter regex", () => {
        console.log("filetr")
    })
    .command("delete", "Delete all files matching a regex from a bucket", deleteFile)
    .parse();
