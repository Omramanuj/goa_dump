import BoardClient from "./components/BoardClient";

export default function HomePage() {
  return <BoardClient allowedContactsJson={process.env.ALLOWED_CONTACTS || "[]"} />;
}
