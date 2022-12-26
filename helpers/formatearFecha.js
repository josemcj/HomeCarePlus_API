const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

/**
 * Formatea fecha de ISODate a fecha en español con horario local
 * 
 * @param {string} fechaISO Fecha en formato ISODate
 * @returns {string} Fecha con formato
 */
const formatearFecha = fechaISO => {
    const fechaSeparada = fechaISO.toString().split(' ');
    const mes = meses[ fechaISO.getMonth() ];
    const hora = fechaSeparada[4].split(':');
    const fecha = `${fechaSeparada[2]} ${mes.slice(0, 3)} ${fechaSeparada[3]}, ${hora[0]}:${hora[1]} hrs`;

    return fecha;
}

module.exports = formatearFecha