// 중요! coolsms-node-sdk는 CommonJS 이므로 .default로 import해야 함
import coolsmsModule from "coolsms-node-sdk";
import dotenv from "dotenv";
dotenv.config();
const Coolsms = coolsmsModule.default;

const messageService = new Coolsms(
    process.env.COOLSMS_API_KEY,
    process.env.COOLSMS_API_SECRET
);

// 1:1 전송 시
// const sendSMS = async ({ to, text }) => {
//     try {
//         const result = await messageService.sendOne({
//             to: "01032627029",
//             from: process.env.COOLSMS_FROM,
//             text: "[Auto Viz Dock]새 게시글이 등록되었습니다. 지금 새 게시글을 확인해보세요 👉http://localhost:3000/posts📝",
//         });

//         console.log("문자 전송 성공:", result);
//         return result;
//     } catch (err) {
//         console.error("문자 전송 실패:", err);
//         throw err;
//     }
// };

// export default sendSMS;

// 여러 명에게 문자 보내기
const sendBulkSMS = async ({ recipients, text }) => {
    try {
        // recipients는 문자열 배열 ex) ['01011112222', '01033334444']
        const messages = recipients.map((to) => ({
            to,
            from: process.env.COOLSMS_FROM,
            text,
        }));

        const result = await messageService.sendMany(messages);

        console.log("단체 문자 전송 성공:", result);
        return result;
    } catch (err) {
        console.error("단체 문자 전송 실패:", err);
        throw err;
    }
};

export default sendBulkSMS;




// import dotenv from "dotenv";
// dotenv.config();

// // 중요! coolsms-node-sdk는 CommonJS 이므로 .default로 import해야 함
// import coolsmsModule from "coolsms-node-sdk";
// const Coolsms = coolsmsModule.default;

// const messageService = new Coolsms(
//     process.env.COOLSMS_API_KEY,
//     process.env.COOLSMS_API_SECRET
// );

// // 1:1 전송 시
// const sendSMS = async ({ to, text }) => {
//     try {
//         const result = await messageService.sendOne({
//             to: "01032627029",
//             from: process.env.COOLSMS_FROM,
//             text: "[Auto Viz Dock]새 게시글이 등록되었습니다. 지금 새 게시글을 확인해보세요 👉http://localhost:3000/posts📝",
//         });

//         console.log("문자 전송 성공:", result);
//         return result;
//     } catch (err) {
//         console.error("문자 전송 실패:", err);
//         throw err;
//     }
// };

// export default sendSMS;