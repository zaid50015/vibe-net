import { NextApiResponseServerIo } from "@/app/type";
import { Server as NetServer } from "https";
import { NextApiRequest } from "next";
import { Server as SocketIOServer } from "socket.io";
//No need to parse body as we are establishing connecction
export const config = {
    api: {
        bodyParser: false,
    },
};

//   Jab ye API route call hoti hai, Next.js internally req aur res objects ko initialize karta hai jo HTTP request aur response ko represent karte hain. res object mein socket aur server properties Node.js HTTP server aur socket information ko represent karte hain.

// Yahaan res.socket Node.js ke net.Socket object ko represent karta hai, jo connection ke details ko hold karta hai. res.socket.server is HTTP server ko refer karta hai jo connection ko handle kar raha hai. Ye properties Node.js aur Next.js ke internal workings ke through initialize hoti hain jab server pe request aati hai.

// Extended type NextApiResponseServerIo ke through hum ensure karte hain ki res object ke paas socket aur server properties available hon, aur hum unhe WebSocket server ke initialization ke liye use kar sakein.
 const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        console.log('socket.io not connected');
        const path = '/api/socket/io';
        const httpServer: NetServer = res.socket.server as  any
        const io = new SocketIOServer(httpServer, {
            path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
      }
      res.end();
    
  }

//   io ko res me directly store karna galat hoga, kyunki:

//   res ek HTTP response hai, jo har request ke liye alag hota hai.
//   Socket.IO ek server-level entity hai, jo NetServer ke saath bind hoti hai.
//   ✅ io ko res.socket.server.io me rakhna sahi hai, kyunki:
  
//   res.socket.server pehle se Next.js ka HTTP server hai.
//   io ko wahi store karne se WebSocket server poore server level pe persist karega.
//   Har request pe naye io instance create hone se bachega.

export default ioHandler;