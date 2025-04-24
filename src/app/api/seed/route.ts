import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";

async function GET () {

    const feedBackName = await prisma.feedBack_Name.create({
        data:{
            name:"test",
        }
    })

    const student = await prisma.user.create({
        data:{
            name:"student",
            email: "student@sitpune.edu.in",
            password: bcrypt.hashSync("1234", 10),
            role:"student",
        }
    })

    const coordinator = await prisma.user.create({
        data:{
            name:"cscoordinator",
            email: "cscoordinator@sitpune.edu.in",
            password: bcrypt.hashSync("1234", 10),
            role:"coordinator",
        }
    })

    const faculty = await prisma.user.create({
        data:{
            name:"faculty",
            email: "faculty@sitpune.edu.in",
            password: bcrypt.hashSync("1234", 10),
            role:"faculty",
        }
    })

    const guest = await prisma.user.create({
        data:{
            name:"guest",
            email: "guest@gmail.com",
            password: bcrypt.hashSync("1234", 10),
            role:"guest",
        }
    })

    const admin = await prisma.user.create({
        data:{
            name:"admin",
            email: "systemadmin@sitpune.edu.in",
            password: bcrypt.hashSync("1234", 10),
            role:"admin",
        }
    })


    await prisma.questions.createMany({
        data:[
            {
                question:"test",
                feedback_ID:feedBackName.Feedback_Name_ID,
            },
            {
                question:"test2",
                feedback_ID:feedBackName.Feedback_Name_ID,
            },
            {
                question:"test3",
                feedback_ID:feedBackName.Feedback_Name_ID,
            },
        ]
    })

  return new Response("Seeded database successfully");
}   

export { GET };