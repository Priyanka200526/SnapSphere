export const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        return res.status(400).json({
            success: false,
            message: "You are already logged in"
        });
    }

    next();
};