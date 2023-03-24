import User from "@/models/User";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send({ message: "admin signin required" });
  }

  if (req.method === "DELETE") {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: "Method not allowed" });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const user = await User.findByIdAndDelete(req.query.id);
  if (user) {
    if (user.email === "admin@example.com") {
      return res.status(400).send({ message: "Can't delete admin" });
    }
    await db.disconnect();
    res.send({ message: "User Deleted" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "User not found" });
  }
};

export default handler;
