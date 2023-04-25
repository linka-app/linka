import { I18nLocals, i18n } from '@/i18n';
import { getConfig } from '@/utils/getConfig';
import _ from 'lodash';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai';

export async function doDescArticle(args: { message: string }) {
  const config = getConfig();
  const translation = i18n[(config?.language as I18nLocals) || 'en'];

  if (config.openaiToken) {
    const configuration = new Configuration({
      apiKey: config.openaiToken,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = [
      `You are to act as the author of a website summarizer.`,
      `Your mission is to create a clean and comprehensive summary of the content I send.`,
      `I will send you the output of a 'document.querySelectorAll('title,meta[name="description"],h1,h2,h3,p,main ul') command'`,
      `you will convert it into an JSON object that has 'title', 'desc', and 'tags' attributes.`,
      `Use the present tense.`,
      `The 'desc' should be no longer than 40 words,`,
      `the 'tags' should be all lowercase and in a 'slug' format and there should be no more then 5 tags.`,
      `Your Response should always be this Populated JSON object:`,
      `{"title": "", "desc": "", and "tags": []}`,
      `Respond with only one JSON Object, so no explnation, and nothing extra.`,
      `Use ${translation.localLanguage} to answer.`,
    ].join('\n');

    try {
      const { data } = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: ChatCompletionRequestMessageRoleEnum.System,
            content: prompt,
          },
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: `Title: di-sukharev/opencommit: GPT CLI to auto-generate impressive commits in 1 second 🤯🔫
Description: GPT CLI to auto-generate impressive commits in 1 second 🤯🔫 - di-sukharev/opencommit: GPT CLI to auto-generate impressive commits in 1 second 🤯🔫
Site Content:
GPT CLI to auto-generate impressive commits in 1 second
Killing lame commits with AI
All the commits in this repo are done with OpenCommit — look into the commits to see how OpenCommit works. Emoji and long commit description text is configurable.
Setup
Install OpenCommit globally to use in any repository:
Get your API key from OpenAI. Make sure you add payment details, so API works.
Set the key to OpenCommit config:
Your api key is stored locally in ~/.opencommit config file.
~/.opencommit
Usage
You can call OpenCommit directly to generate a commit message for your staged changes:
You can also use the oc shortcut:
oc`,
          },
          {
            role: ChatCompletionRequestMessageRoleEnum.Assistant,
            content: JSON.stringify({
              title: translation.promptTags,
              desc: translation.promptDesc,
              tags: translation.promptTags,
            }),
          },
          {
            role: ChatCompletionRequestMessageRoleEnum.User,
            content: args.message.substring(0, 5000 - 1000 - prompt.length),
          },
        ],
        temperature: 0,
        top_p: 0.1,
        max_tokens: 196,
      });

      const message = JSON.parse(_.get(data, 'choices.0.message.content'));
      return message;
    } catch (error: unknown) {
      console.log(error);
      return await Promise.reject(`status code: there was open AI error`);
    }
  }
}

export default doDescArticle;
