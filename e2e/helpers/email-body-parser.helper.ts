import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ITransactionalEmailPayload {
  emails: string[];
  subject: string;
  html: string;
  templateId?: string;
  data?: Record<string, string>;
}

interface IGetterProps {
  email: string;
  subject: string;
}

async function get({ email, subject }: IGetterProps) {
  const response = await axios.get<ITransactionalEmailPayload | null>(
    `${process.env.API_URL}/internal/test/sent-emails?email=${email}&subject=${subject}`
  );
  return response.data;
}

async function getLinks(
  emailBody: ITransactionalEmailPayload | null,
  label?: string
) {
  if (!emailBody?.html) {
    return [];
  }

  const links: Array<{ label: string; url: string }> = [];
  const $ = cheerio.load(emailBody.html);
  $(`a`).each((_, el) => {
    links.push({
      label: $(el).text(),
      url: $(el).attr('href') as string,
    });
  });

  if (label) {
    const found = links.find(
      (link) => link.label.toLowerCase().trim() === label.toLowerCase().trim()
    );
    return [found];
  }

  return links;
}

const emailBodyParser = {
  fetch: get,
  getLinks,
};

export default emailBodyParser;
