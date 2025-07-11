import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { prismaClient } from "@/db";

interface user {
  name: string;
  email: string;
  role: string;
  managerEmail?: string;
}

type data = user[];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("orgchart-file") as File;

  console.log(`received file ${file}`);

  if (!file) {
    return NextResponse.json(
      { error: "Did not get the file" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const csvString = buffer.toString("utf-8");

  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  console.log("\n\n result of papaparse : \n");
  console.log(result);

  if (result.errors.length > 0) {
    console.log("\n\n parsing error : \n");
    console.log(result.errors);

    return NextResponse.json(
      {
        code: "error",
        message: "Eroro while parsing the csv",
      },
      {
        status: 400,
      }
    );
  }

  const data = result.data as unknown as data;
  console.log("prisma client");
  console.log(prismaClient.$transaction);

  try {
    await prismaClient.$transaction(async (tx) => {
      const needsManager = new Map<string, string>();

      console.log("tx: \n\n");
      console.log(tx);
      // first pass ----------------------------------------

      for (const value of data) {
        const user = await tx.user.create({
          data: {
            name: value.name,
            email: value.email,
            role: value.role,
            // will update manager email on the second pass
          },
        });

        console.log("/n created user : /n/n");
        console.log(user);

        if (value.managerEmail && value.managerEmail.length > 0) {
          needsManager.set(user.id, value.managerEmail);
        }
      }

      // second pass -------------------------------------------------

      console.log("this is the map so far :");
      console.log(needsManager);

      for (const [userId, managerEmail] of needsManager) {
        const manager = await tx.user.findUnique({
          where: {
            email: managerEmail,
          },
          select: {
            id: true,
          },
        });

        if (!manager) {
          throw new Error(`manager with ${managerEmail} email not found`);
        }

        const updatedUser = await tx.user.update({
          where: {
            id: userId,
          },
          data: {
            managerId: manager.id,
            managerEmail: managerEmail,
          },
        });
      }
    });
  } catch (err) {
    return NextResponse.json(
      {
        code: "error",
        message: "issue while adding all the data to the database",
        err: String(err),
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    {
      code: "success",
      message: "successfull parsing we got your data and adden in db",
    },
    {
      status: 200,
    }
  );
}

export async function GET() {

  const users = await prismaClient.user.findMany({

    include: {
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      subordinates: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return NextResponse.json(users, {
    status: 200
  });
}
