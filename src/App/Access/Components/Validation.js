export function Validation(values) {
    let error = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordPattern = /^.{8,}$/

    if (values.email === "") {
        error.email = "Correo no puede estar vacio"
        error.class_email = "input_error_margin"
    }

    if (values.email !== "" && !emailPattern.test(values.email)) {
        error.email = "Correo no valido"
        error.class_email = "input_error_margin"
    }

    if (values.password === "") {
        error.password = "Contraseña no puede estar vacia"
        error.class_password = "input_error_margin"
    }

    if (values.password !== "" && !passwordPattern.test(values.password)) {
        error.password = "Contraseña debe tener al menos 8 caracteres"
        error.class_password = "input_error_margin"
    }

    if (values.confirm_password != "" && values.confirm_password != values.password) {
        error.confirm_password = "Las contraseñas no coinciden"
        error.class_confirm_password = "input_error_margin"
    }

    return error;
}