export const generateUserErrorInfo = (user) => {
  return `
        Uno o más campos están incompletos o no son válidos!
        Lista de campos requeridos:
        first_name: debe ser un campo de tipo String, pero se recibió ${user.first_name},
        last_name: debe ser un campo de tipo String, pero se recibió ${user.last_name},
        age: debe ser un campo de tipo Number, pero se recibió ${user.age},
    `;
};
