import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{

    }).then(() => console.log("DB connection successful"))
    .catch((error) => {
        console.log("Issue in Db Connectio");
        console.log(error);
    }
    )
}

export {dbConnect};

