import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const {code,language,customInput} = await request.json();


    const formData = {
        language_id:language.id,
        source_code:btoa(code),
        stdin: btoa(customInput),
    }
    const options = {
        method:"POST",
        url:process.env.RAPID_API_URL,
        params:{base64_encoded:"true", fields:"*",wait:"true"},
        headers:{
          "content-type":"application/json",
          "Content-type":"application/json",
          "X-RapidAPI-Host": process.env.X_RapidAPI_Host,
          "X-RapidAPI-Key": process.env.X_RapidAPI_Key,
        },
        data:formData
    };

    const result = await  axios.request(options)
    if(result)
    {
        return NextResponse.json({
            data:result.data
        },{
            status:200
        })
    }else{
        return NextResponse.json({
            error:"Failed to compile"
        },{
            status:400
        })
    }
}