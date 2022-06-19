// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  doc,
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  addDoc,
  setDoc,
  documentId,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "src/services/firebase";
import { checkUrl } from "src/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "GET":
      let currentQuery = query(
        collection(firestore, "urls"),
        orderBy("count", "desc"),
        limit(10)
      );
      if (req.headers.lasturl) {
        const docRef = doc(firestore, "urls", `${req.headers.lasturl}`);
        const docSnap = await getDoc(docRef);
        currentQuery = query(currentQuery, startAfter(docSnap));
      }
      const urls = (await getDocs(currentQuery)).docs.map((doc) => {
        return { short: doc.id, ...doc.data() };
      });
      if (urls.length < 0) {
        return res.status(404).json({ message: "No urls found" });
      }
      return res.status(200).json({ urls });
    case "POST":
      console.log(req.body);
      if (await checkUrl(req.body.url)) {
        return res.status(400).json({ message: "Invalid url" });
      }
      addDoc(collection(firestore, "urls"), { full: req.body.url, count: 0 });

      return res.status(200).json({ message: "Url created" });
    default:
      return res.status(400).json({ message: "Invalid method" });
  }
};

export default handler;
