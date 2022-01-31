import { NextApiRequest, NextApiResponse } from 'next';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  res.clearPreviewData();
  res.writeHead(307, { Location: '/' });
  return res.end();
};

// const url = require('url');

// export default async function exit(req, res) {
//   // Exit the current user from "Preview Mode". This function accepts no args.
//   res.clearPreviewData();

//   const queryObject = url.parse(req.url, true).query;
//   const redirectUrl =
//     queryObject && queryObject.currentUrl ? queryObject.currentUrl : '/';

//   res.writeHead(307, { Location: redirectUrl });
//   res.end();
// }
