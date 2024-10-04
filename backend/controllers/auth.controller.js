export const signUp = async (req, res) => {
    res.json({
        data: "You hit the signUp endpoint",
    });
}

export const logIn = (req, res) => {
    res.json({
        data: "You hit the logIn endpoint",
    });
}

export const logOut = (req, res) => {
    res.json({
        data: "You hit the logOut endpoint",
    });
}
