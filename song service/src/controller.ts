import TryCatch from "./TryCatch.js";
import { sql } from "./config/db.js";

export const getAllAlbums = TryCatch(async (req, res) => {
  let albums;
  albums = await sql`SELECT * FROM albums`;
  res.json(albums);
});

export const getAllSongs = TryCatch(async (req, res) => {
  let songs;
  songs = await sql`SELECT * FROM songs`;
  res.json(songs);
});


export const getAllSongsOfAlbum= TryCatch(async(req,res)=>{
    const id=req.params.id; 

    let album,songs;
    album=await sql`SELECT * FROM albums WHERE id=${id}`;

    if(album.length===0){
        res.status(404).json({message:"Album not found with this id"});
        return;
    }
    songs=await sql`SELECT * FROM songs WHERE album_id=${id}`;

    // if(songs.length===0){
    //     res.status(404).json({message:"No songs found for this album"});
    //     return;
    // }
    res.json({songs,album:album[0]});
});


export const getSingleSong=TryCatch(async(req,res)=>{
    const id = req.params.id; 
    const song = await sql`SELECT * FROM songs WHERE id=${id}`;

    res.json(song[0]);
})