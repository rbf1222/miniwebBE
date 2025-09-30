// middlewares/validate.js
import { validationResult } from "express-validator";

export function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: "잘못된 입력값이 있습니다.",
            details: errors.array().map(e => ({
                field: e.param,
                msg: e.msg,
            })),
        });
    }
    next();
}
