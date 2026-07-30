import {
Home,
History,
ThumbsUp,
User,
Settings
} from "lucide-react";

const Sidebar=()=>{

const menus=[
{icon:<Home/>,name:"Home"},
{icon:<History/>,name:"History"},
{icon:<ThumbsUp/>,name:"Liked"},
{icon:<User/>,name:"Profile"},
{icon:<Settings/>,name:"Settings"},
];

return(

<div className="fixed left-0 top-16 h-screen w-64 bg-zinc-900 border-r border-zinc-800">

<div className="mt-5">

{
menus.map((item)=>(
<div
key={item.name}
className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-800 cursor-pointer duration-200"
>

{item.icon}

<p>{item.name}</p>

</div>
))
}

</div>

</div>

)

}

export default Sidebar;