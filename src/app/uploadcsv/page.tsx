"use client"
import {useForm} from "react-hook-form";
import axios from "axios";


function page() {

    const {register, handleSubmit, reset} = useForm();

    const onSubmit = async (data: any) => {

        

        const formData = new FormData();

        

        formData.append("orgchart-file" , data.file[0])


        try{
            const res = await axios.post("/api/backend" , formData) as [];
            
        } catch(err) {
            console.log("\n\n error in hiting the backend \n")
            console.log(err);
        }
    }

  return (
    <div className="bg-amber-300 m-auto w-lg h-32">
        <form  className="mt-5 pt-6" onSubmit = { handleSubmit(onSubmit) } >
            <input type="file" accept=".csv" className="bg-black text-white text-xl px-4 py-2 cursor-pointer rounded-xl mr-1" {...register('file' , {required: true} )} />
            <button type="submit" className="bg-black text-white text-xl px-4 py-2 cursor-pointer rounded-xl"> Upload </button>
        </form>
    </div>
  )
}

export default page