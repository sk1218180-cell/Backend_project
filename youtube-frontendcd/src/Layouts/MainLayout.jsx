import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout=({children})=>{

return(

<div className="bg-black text-white min-h-screen">

<Navbar/>

<Sidebar/>

<div className="ml-64 mt-16 p-8">

{children}

</div>

</div>

)

}

export default MainLayout;