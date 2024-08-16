/**
 * Formata a data e hora em uma string legível no formato brasileiro.
 * @param {Date} date - A data a ser formatada.
 * @returns {string} - Data e hora formatadas.
 */
export const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('pt-BR', options);
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
};