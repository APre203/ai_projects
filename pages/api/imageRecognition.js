// import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
require("dotenv").config();

export default async function handler(req, res) {

    const { messages } = req.body;

	const client = new OpenAI({
		apiKey: process.env.API_KEY,
	});

    try{
		const response = await client.chat.completions.create({
			model: "gpt-4o",
			messages: messages
		});
		return res.status(200).json({data: response.choices[0].message.content})
    } catch(error){
		throw Error(error)
    }
}