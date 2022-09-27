const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const getPrompt = async (details) => {
  //   let query = `I need a ${details.text} for a ${details.type} called ${details.name} that is ${details.description}.`;
  //   let query = `Am nevoie de o ${details.text} pentru un ${details.type} numit ${details.name} cu urmatoarele propietati: ${details.description} si urmatoarele cuvinte cheie:.`;
  //   let query = `I need an ${details.text} for a ${details.type} called ${details.name}. A short description of the products is: ${details.description}. The target audience of the ad is ${details.audience} and the tone of the ad should be ${details.tone}. These are some keywords to take into consideration ${details.keywords}. The minimum length should be 500 characters.`;
  let query = `Write a creative ${details.text} for the following product to run on ${details.platform} aimed at ${details.audience}: Product: ${details.name} is a ${details.description}. Keywords: ${details.keywords}.`;
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: query,
    max_tokens: 700,
    temperature: 0.8,
  });
  let text = completion.data.choices[0].text;
  let tokens = completion.data.usage["total_tokens"];
  const response = { text, tokens };
  console.log(response);
  return response;
};

app.get("/prompt", async (req, res) => {
  let response = await getPrompt(req.body);

  try {
    res.status(200).send(response).end();
  } catch {
    res.status(400).send("failed").end();
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
