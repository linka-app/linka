import { Configuration, OpenAIApi } from 'openai';

export async function doAuth(args: { token: string }) {
  const configuration = new Configuration({
    apiKey: args.token,
  });
  const openai = new OpenAIApi(configuration);
  const res = await openai.listEngines();

  console.log(res);
  if (res.status) {
    return true;
  }
  return await Promise.reject(`status code: ${res.statusText}`);
}

export default doAuth;
