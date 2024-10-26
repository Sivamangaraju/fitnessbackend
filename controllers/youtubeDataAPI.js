const express=require('express')
const {google} =require('googleapis')
const {RegisterDetails}=require('../models/register')
const {StatusCodes} =require('http-status-codes')
require('dotenv').config()
const auth= ()=>
{
    return google.youtube({
        version:'v3',
        auth:process.env.GOOGLE_API_KEY
    })
}

const getDataByKeyword= async(req,res)=>
{
    const {keyword}=req.params;
    try
    {
        const youtube= auth()
        const videoData= await youtube.search.list({
            part:'snippet',
            maxResults:10,
            q:`${keyword} Reels`,
            type:'video',
            chart:'mostPopular',
            regionCode:'IN',


        })
       // return res.status(StatusCodes.OK).json({success:true,data:videoData.data.items})

        const videos=videoData.data.items.map(video =>
        ({
            title:video.snippet.title,
            description:video.snippet.description,
            channelTitle:video.snippet.channelTitle,
            publishTime:video.snippet.publishTime,
            thumbnail: video.snippet.thumbnails.high.url,
            videoLink: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            url:`https://www.youtube.com/embed/${video.id.videoId}`

        }));
        const links=videos.map((item)=>(
        {
            url:item.url
        }))

        return res.status(StatusCodes.OK).json({success:true, links})
    }
    catch (error) 
    {
        console.log(error.message)
        return res.status(StatusCodes.BAD_GATEWAY).json({message:error.message,error:error})
    }

}

module.exports={getDataByKeyword}