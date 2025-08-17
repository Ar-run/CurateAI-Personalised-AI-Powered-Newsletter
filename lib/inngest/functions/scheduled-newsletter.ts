import { fetchArticles } from "@/lib/news";
import { inngest } from "../client";

export default inngest.createFunction(
  {id:"newsletter/scheduled"},
  {event: "newsletter/schedule"},
  async({event,step,runId}) => {
    //Fetch articles per category
    const allArticles = await step.run("fetch-news",async () => {
      const categories = ["technology", "business", "politics"];
      
      return fetchArticles(categories);
    });

    // Generate AI summary
  }
)