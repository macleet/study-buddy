import { Router } from "express";
import OpenAI from "openai";

const openai = new OpenAI();

const chatCompletionRouter = Router();

chatCompletionRouter.get('/toc', async (req, res) => {
    try {
        const { tocFullText } = req.query; 
        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "You will extract all sections and subsections in the given table of contents text string and convert them into complete json object, including their page numbers.\
                For example a chapter key should have a subsection key for the subsection title and a page key for corresponding page number. Each subsection key's value should be its corresponding page number,\
                i.e., { chapter: {page: PAGENUM, subsections: { subsection: PAGENUM }}}}."},
                {"role": "assistant", "content": tocFullText}],
            model: "gpt-3.5-turbo-0125",
            temperature: 0,
            response_format: { type: "json_object" },
        });
        res.json(completion.choices[0]);
    } catch (err) { console.error(err) }
    // res.json(completion.choices[0].message.content);
});

// Receives page text and outputs TOC confidence rating
chatCompletionRouter.get('/toc/rating', async (req, res) => {
    try {
        const { pageTextContent } = req.query;
        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "You will give one two-decimal rating from 0.0 to 1.0 \
                ( 0: page is absolutely not a table of contents page. 1.0: page is absolutely a table of contents page), \
                given an input string of the page's text content. For example, you may give a rating of 0.65 for a given string."},
                {"role": "assistant", "content": pageTextContent}],
            model: "gpt-3.5-turbo-0125",
            temperature: 0,
        });
        res.json(completion.choices[0].message.content);
    } catch (err) { console.error(err) }
});

export default chatCompletionRouter;


