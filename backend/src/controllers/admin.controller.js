import { Song } from '../models/song.model.js'
import { Album } from '../models/album.model.js'
import cloudinary from '../lib/cloudinary.js'

//cloudinary uploader
const uploadCloudinary = async (file) =>{
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath,{
            resource_type: 'auto',
        })

        return result.secure_url
    } catch (error) {
        console.log("Error in uploadCloudinary",error)
        throw new Error("Error uploading to cloudinary");
    }
}

export const createSong = async(req,res,next) =>{
    try {
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message:"Please upload all files"});
        }
        
        const { title,artist, albumId, duration} = req.body

        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadCloudinary(audioFile);
        const imageUrl = await uploadCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            audiuUrl,
            imageUrl,
            duration,
            albumId: albumId || null
        })

        await song.save()

        //album update 
        if (albumId) {
            await Album.findByIdAndUpdate(albumId,{
                $push: { songs: song._id},
            })
        }
        return res.status(201).json(song);

    } catch (error) {
        console.log("Error is createSong", error)
        next(error)
    }
}

export const deleteSong = async(req,res,next) =>{
    try {
        const {id} = req.params

        const song = await Song.findById(id)

        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId,{
                $pull: { songs: song._id}
            })
        }

        await Song.findByIdAndDelete(id)
        res.status(200).json({message:"Song deleted succesfully"})

    } catch (error) {
        console.log("Error in deleteSong controller: ",error)
        next(error);
    }
}

export const createAlbum = async(req,res,next) =>{
    try {
        const {title, artist, releaseYear} = req.body
        const {imageFile} = req.file

        const imageUrl = await uploadCloudinary(imageFile)

        const album = new Album({
            title,
            artist,
            imageUrl,
            releaseYear,
        })

        await album.save()
        res.status(201).json(album)
    } catch (error) {
        console.log("Error in createAlbum controller:", error)
        next(error);
    }
}

export const deleteAlbum = async(req,res,next) =>{
    try {
        const { id } = req.params;
        await Song.deleteMany({albumId: id})
        await Album.findByIdAndDelete(id);
        res.status(200).json({message:"Album deleted succesfully"})
    } catch (error) {
        console.log("Error in deleteAlbum controller:", error)
        next(error);
    }
}

export const checkAdmin = async(neq,res,next) =>{
    res.status(200).json({admin:true})
}