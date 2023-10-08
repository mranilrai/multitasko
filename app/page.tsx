import { Metadata } from "next";
import YTVideoInfo from "./components/YTVideoInfo";

export const metadata: Metadata = {
  title: "Download Youtube Video",
  description:
    "Download YouTube videos effortlessly by simply entering the video URL on our website. Our online YouTube video downloader supports various formats and resolutions, ensuring you get your favorite content in the quality you desire. Quickly and securely save YouTube videos for offline viewing with our easy-to-use tool.",
};

export default function Home() {
  return (
    <main className="flex items-center justify-center mt-10">
      <YTVideoInfo />
    </main>
  );
}
