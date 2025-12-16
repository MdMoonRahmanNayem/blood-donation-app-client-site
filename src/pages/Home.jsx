export default function Home() {
  console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
  return <h1>Home Page</h1>;
}