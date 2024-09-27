import Ajv from "ajv";
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import { error } from "utils/log";

/**
 * 校验配置文件
 * @param basename 
 * @param fileData 
 * @param schema 
 * @returns 
 */
export function checkWithSchema(basename:string,fileData:any,schema:any):boolean{
    let ajv = new Ajv({allErrors:true});
    addErrors(ajv);
    addFormats(ajv);
    let validate = ajv.compile(schema);
    let valid = validate(fileData);
    if (!valid) {
        for(var i = 0;i<validate.errors.length;i++){
            let e = validate.errors[i];
            if(e.keyword == "additionalProperties"){
                error(`File '${basename}'${e.instancePath ? " , An error occurred with the '"+e.instancePath+"'" : ""}: ${e.message} '${e.params.additionalProperty}'`)
            }else{
                error(`File '${basename}'${e.instancePath ? " , An error occurred with the '"+e.instancePath+"'" : ""}: ${e.message}`)
            }
        }
        return false;
    }
    return true;
}