import _ from 'lodash';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';
import { getAuth } from '../../utils/getAuth';

export async function doDescArticle(args: { message: string }) {
  const auth = getAuth();

  if (auth.openaiToken) {
    const configuration = new Configuration({
      apiKey: auth.openaiToken,
    });
    const openai = new OpenAIApi(configuration);

    try {
      const { data } = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: `You are to act as the author of a website summarizer. Your mission is to create a clean and comprehensive summary of the content I send. I will send you the output of a 'document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,ul') command', and you will convert it into an JSON object that has 'title', 'desc', and 'tags' attributes. Use the present tense. The 'desc' should be no longer than 40 words, the 'tags' should be all lowercase and in a 'slug' format and there should be no more then 5 tags. The final JSON object should always fit in to this object {"title": "", "desc": "", and "tags": []}. I only want you to respond in JSON that has been stringified (JSON.stringify()). Use en to answer.`,
          },
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: args.message.substring(0, 3450),
          },
        ],
        temperature: 0,
        top_p: 0.1,
        max_tokens: 196,
      });

      console.log(_.get(data, 'choices.0.message.content'));
      console.log(typeof _.get(data, 'choices.0.message.content'));

      const message = JSON.parse(_.get(data, 'choices.0.message.content'));
      return message;
    } catch (error: unknown) {
      console.log(error);
      return await Promise.reject(`status code: there was open AI error`);
    }
  }
}

export default doDescArticle;
