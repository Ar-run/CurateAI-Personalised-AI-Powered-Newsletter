import { fetchArticles } from "@/lib/news";
import { inngest } from "../client";

export default inngest.createFunction(
  {id:"newsletter/scheduled"},
  {event: "newsletter/schedule"},
  async({event, step, runId}) => {
    //Fetch articles per category
    const categories = ["technology", "business", "politics"];
    const allArticles = await step.run("fetch-news",async () => {
      return fetchArticles(categories);
    });

    // Generate AI summary
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",   // or another model available on OpenRouter 
        messages: [
        {
          role: "system",
          content: `You are an expert newsletter editor creating a personalized newsletter. 
            Write a concise, engaging summary that:
            - Highlights the most important stories
            - Provides context and insights
            - Uses a friendly, conversational tone
            - Is well-structured with clear sections
            - Keeps the reader informed and engaged
            Format the response as a proper newsletter with a title and organized content.
            Make it email-friendly with clear sections and engaging subject lines.`
        },
        {
          role: "user",
          content: `Create a newsletter summary for these articles from the past week. 
            Categories requested: ${event.data.categories.join(", ")}
          
            Articles:
            ${allArticles
              .map(
                (article: any, index: number) =>
                  `${index + 1}. ${article.title}\n   ${article.description}\n   Source: ${article.url}\n`
              )
              .join("\n")}`
        },
      ],
    }),
  });

  const json = await response.json();
  const newsletterContent = json.choices?.[0]?.message?.content;

  console.log(newsletterContent);


    //const summary = await step.ai.infer("summarize-news", {
      //model: step.ai.models.openai({model: "gpt-4o"}),
      //body: {
        //messages: [
          //{
            //role: "system",
            //content: `You are an expert newsletter editor creating a personalized newsletter. 
              //Write a concise, engaging summary that:
              //- Highlights the most important stories
              //- Provides context and insights
              //- Uses a friendly, conversational tone
              //- Is well-structured with clear sections
              //- Keeps the reader informed and engaged
              //Format the response as a proper newsletter with a title and organized content.
              //Make it email-friendly with clear sections and engaging subject lines.`,
          //},
          //{
            //role: "user",
            //content: `Create a newsletter summary for these articles from the past week. 
              //Categories requested: ${event.data.categories.join(", ")}
              
              //Articles:
              //${allArticles
                //.map(
                  //(article: any, index: number) =>
                    //`${index + 1}. ${article.title}\n   ${
                      //article.description
                    //}\n   Source: ${article.url}\n`
                //)
                //.join("\n")}`,
          //},
        //],
      //},
    //});

    //const newsletterContent = summary.choices[0].message.content;
    //console.log(summary.choices[0].message.content);
  }
)

