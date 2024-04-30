const yup = require('yup');

const userSchema = {
    register: yup.object({
        body: yup.object({
            userName: yup.string().required(),
            password: yup
                .string()
                .required()
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
        }),
    }),
    login: yup.object({
        body: yup.object({
            userName: yup.string().required(),
            password: yup.string().required(),
        }),
    }),
};

export default userSchema
