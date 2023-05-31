export const generateCartErrorParam = (cid) => {
  return `
        el id del cart es incorrecto o debe ser un valor alfanúmerico, pero se recibió ${cid}
    `;
};
