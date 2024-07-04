const yup = require('yup');

const userSchema = {
    register: yup.object({
        body: yup.object({
            name: yup.string(),
            username: yup.string().required(),
            password: yup
                .string()
                .required()
                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
            phone: yup
                .string()
                .required()
                .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
        }),
    }),
    login: yup.object({
        body: yup.object({
            username: yup.string().required(),
            password: yup.string().required(),
        }),
    }),
};

export default userSchema
