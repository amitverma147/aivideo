import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try {
        const {email, password}= await request.json();
        if(!email || !password){
            return NextResponse.json(
                {error:"Email and Password Required"},
                {status:400}
            )
        }
        await connectToDatabase();
        const extisingUser = await User.findOne({email})
        if(extisingUser){
            return NextResponse.json(
                {error:"User already Registered"},
                {status:400}
            )
        }

        const registeredUser = await User.create({
            email, password
        })

        return NextResponse.json(
            {message:"User Registred Successfully"},
            {status:200}
        )

    } catch (error) {
        console.error("Registration Error");
        
        return NextResponse.json(
            {error:"Failed to Register user "},
            {status:400}
        )
        
    }
}