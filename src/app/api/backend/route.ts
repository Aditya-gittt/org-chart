import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req: NextRequest) {

    console.log("\n\n request got of type nextrequest : \n");
    console.log(req);


    const formData = await req.formData();
    const file = formData.get('orgchart-file') as File ;

    console.log("\n\n file we got: \n");
    console.log(file);

    if(!file)
    {
        return NextResponse.json({error: 'Did not get the file'} , {status:400});
    }


    console.log("\n\n Buffer object of nodejs : \n");
    console.log(Buffer);


    const buffer = Buffer.from( await file.arrayBuffer() );

    console.log('\n\n nodejs buffer of our file : \n');
    console.log(buffer);


    const csvString = buffer.toString('utf-8');

    console.log("\n\n string version of our buffer : \n");
    console.log(csvString);

    const result = Papa.parse( csvString , {
        header: true,
        skipEmptyLines: true
    })

    console.log("\n\n papaparse ka papa : \n");
    console.log(Papa);

    console.log("\n\n result of papaparse : \n");
    console.log(result);

    if(result.errors.length > 0 )
    {
        console.log("\n\n parsing error : \n");
        console.log(result.errors);
        
        return NextResponse.json({
            code: "error",
            message: "Eroro while parsing the csv"
        } , {
            status: 400
        });
    }

    return NextResponse.json({
        code: "success",
        message: "successfule parsing we got your data"
    }, {
        status: 200
    });

}