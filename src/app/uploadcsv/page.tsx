import {useForm} from "react-hook-form";
import axios from "axios";


function page() {

    const {register, handleSubmit, reset} = useForm();

    const onSubmit = async (data: any) => {

        console.log("\n\n this is data returned by use form \n") ;
        console.log(data);
        console.log("/n this is its type /n");
        console.log(typeof data);

        const formData = new FormData();

        console.log("\n\n this is formData instance of FormData \n");
        console.log(formData);

        formData.append("orgchart-file" , data.file[0])

        try{
            const res = await axios.post("/api/backend" , formData);
            
            console.log("\n\n this the response object got from axios by hitting the backend with post request \n");
            console.log(res)
        } catch(err) {
            console.log("\n\n error in hiting the backend \n")
            console.log(err);
        }
    }

  return (
    <div className="bg-amber-300 m-auto , w-lg , h-32">
        <form onSubmit = { handleSubmit(onSubmit) } >
            <input type="file" accept=".csv" {...register('file' , {required: true} )} />
            <button type="submit" className="bg-black text-white text-xl px-4 py-2 rounded-xl"> Upload </button>
        </form>
    </div>
  )
}

export default page