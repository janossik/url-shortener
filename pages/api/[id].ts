// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "src/services/firebase";
import { checkUrl } from "src/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const clearId = `${req.query.id}`.replace(" ", "");
  switch (method) {
    case "GET":
      const currentDoc = doc(firestore, "urls", clearId);
      const item = (await getDoc(currentDoc)).data();
      if (!item) {
        return res
          .status(404)
          .json({ message: "No item found", item: req.query.id });
      }
      setDoc(currentDoc, { ...item, count: item.count + 1 });
      return res.redirect(item.full);

    case "PUT":
      return res.status(200).json({ method });
    case "DELETE":
      return res.status(200).json({ method });
    default:
      return res.status(200).json({ method });
  }
};

export default handler;
