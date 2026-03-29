import AddSpotClient from "../components/AddSpotClient";

export default function AddSpotPage() {
  return <AddSpotClient allowedContactsJson={process.env.ALLOWED_CONTACTS || "[]"} />;
}
