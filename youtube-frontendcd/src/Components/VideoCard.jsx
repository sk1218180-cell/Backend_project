import { Eye } from "lucide-react";

const VideoCard = ({ video }) => {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 hover:scale-105 duration-300 cursor-pointer">

      <img
        src={video.thumbnail}
        className="w-full h-48 object-cover"
      />

      <div className="p-3">

        <h2 className="font-semibold text-white">
          {video.title}
        </h2>

        <p className="text-zinc-400">
          {video.owner}
        </p>

        <div className="flex items-center gap-2 text-zinc-500 mt-2">
          <Eye size={15}/>
          {video.views}
        </div>

      </div>

    </div>
  );
};

export default VideoCard;