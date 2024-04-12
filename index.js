import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { listFiles } from "./utils/handler.js";
export { listFiles, uploadFile, filteredFileList, deleteFile } from "./utils/handler.js";

yargs(hideBin(process.argv))
    .command({
        command: "list",
        describe: "List all files in an S3 Bucket", 
        handler() {
          listFiles()  
        }
    })
    .command({
        command: "upload",
        describe: "Upload a local file to a defined location in the bucket", 
        builder: { 
            fileName: { 
                describe: "Name of Uploaded File", 
                demandOption: true,
                type: "string"    
            }
        },
        handler(argv) {
          uploadFile(argv)  
        }
    })
    .command({
        command: "filter", 
        describe: "Return list of files matching a regex from a bucket", 
        builder: { 
            pattern: { 
                describe: "Pattern for Filter Files", 
                demandOption: true,
                type: "string"    
            }
        },
        handler(argv) {
            filteredFileList(argv)
        }
    })
    .command({
        command: "delete", 
        describe: "Delete all files matching a regex from a bucket", 
        builder: { 
            pattern: { 
                describe: "Pattern for Delete Files", 
                demandOption: true,
                type: "string"   
            }
        },
        handler(argv) {
            deleteFile(argv)
        }
    })
    .parse();
