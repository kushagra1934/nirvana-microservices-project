import TryCatch from "./TryCatch.js";

export const addAlbum=TryCatch(async(req,res)=>{
    res.send("Add Album");
});