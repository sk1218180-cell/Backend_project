import MainLayout from "../layouts/MainLayout";
import VideoCard from "../components/VideoCard";

const videos = [
  {
    thumbnail: "https://picsum.photos/400/250?1",
    title: "Learn React in 30 Minutes",
    owner: "Shivam",
    views: "120K"
  },
  {
    thumbnail: "https://picsum.photos/400/250?2",
    title: "Node.js Complete Course",
    owner: "Code Hub",
    views: "86K"
  },
  {
    thumbnail: "https://picsum.photos/400/250?3",
    title: "Tailwind CSS UI Design",
    owner: "Frontend Pro",
    views: "54K"
  }
];

const Home = () => {
  return (
    <MainLayout>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </MainLayout>
  );
};

export default Home;